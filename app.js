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


const path = require("path");
const { readdir } = require("fs");
const { clear } = require("console");

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
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
}));

// Create Route
app.post("/listings", wrapAsync(async(req, res, next) => {
    // let {title, description, image, price, location, country} = req.body ;
    // Another way ,Using object (Short way)
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing");
        }
        let listing = req.body.listing;
        let newListing = new Listing(listing);
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
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
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

