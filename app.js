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


// Joi Validation as function (as Middelware)
const validateListing = (req,res,next) => {
    //Server side validation using "Joi" 
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

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

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
}));


// New Route should placed before Show Route ,because it consider "new" as ":id"
// New Route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new");
});


// Show Route (Read)
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", {listing});
}));

// Create Route
app.post("/listings",validateListing, wrapAsync(async(req, res, next) => {
    // Check req.boby.listing is empty or not
    if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing");
    }
    // let {title, description, image, price, location, country} = req.body ;
    // Another way ,Using object (Short way)
        let listing = req.body.listing;
        let newListing = new Listing(listing);

// One by one check for server side validation
    // if(!newListing.title){
    //         throw new ExpressError(400, "Title is missing");
    // }
    // if(!newListing.description){
    //         throw new ExpressError(400, "Decription is missing");
    // }
    // if(!newListing.price){
    //         throw new ExpressError(400, "Price is missing");
    // }
    // if(!newListing.country){
    //         throw new ExpressError(400, "Country is missing");
    // }
    // if(!newListing.location){
    //         throw new ExpressError(400, "Location is missing");
    // }
    
        await newListing.save();
        res.redirect("/listings");
    
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
}));

// Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    // " ... " Deconstrut the req.body.listing object into individual value
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

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

