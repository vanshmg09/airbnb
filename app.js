const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Require Listing model
const Listing = require("./models/listing.js");
// To override the PUT and POST method of form
const methodOverride = require("method-override");
// Require ejs-mate
const ejsMate = require("ejs-mate");
// Require wrapAsync
const wrapAsync = require("./utils/wrapAsyc.js");
// Require ExpressError
const ExpressError = require("./utils/ExpressError.js");
// Require listingSchema & reviewSchema for server side validation
const {listingSchema, reviewSchema} = require("./schema.js")
// Require Review Model
const Review = require("./models/review.js");

// To require Listing Route
const listings = require("./routes/listing.js");

const path = require("path");
const { readdir } = require("fs");
const { clear } = require("console");
const { kMaxLength } = require("buffer");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname,"views"));

// To use "req.params" ; To parse the data that are arive in request
app.use(express.urlencoded({extended: true}));
// To override the PUT and POST method of form
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// To use static file (public)
app.use(express.static(path.join(__dirname,"/public")));


app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the Beach",
//         price : 1200,
//         location : "Calangute,Goa",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfully testing");
// });



const validateReview = (req,res,next) => {
    //Server side validation using "Joi" 
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// To use Listing Route
app.use("/listings", listings)

// Review
// Post Review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync( async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));


// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync( async (req, res) => {
    let { id, reviewId } = req.params;

    // " $pull " used to remove (Remove reviewId from Listing model)
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

// If request are not map with above route then it map with this route (Any reqest map with this route)
app.all(/.*/,(req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message);
})


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

