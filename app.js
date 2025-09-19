const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Require Listing model
const Listing = require("./models/listing.js");
// To override the PUT and POST method of form
const methodOverride = require("method-override");

const path = require("path");
const { readdir } = require("fs");

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
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
});


// New Route should placed before Show Route ,because it consider "new" as ":id"
// New Route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new");
});


// Show Route (Read)
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", {listing});
});

// Create Route
app.post("/listings", async(req, res) => {
    // let {title, description, image, price, location, country} = req.body ;
    // Another way ,Using object (Short way)
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
});

// Update Route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    // " ... " Deconstrut the req.body.listing object into individual value
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

