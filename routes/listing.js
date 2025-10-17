const express = require("express");
const router = express.Router();
// Require wrapAsync
const wrapAsync = require("../utils/wrapAsyc.js");
// Require ExpressError
const ExpressError = require("../utils/ExpressError.js");
// Require listingSchema & reviewSchema for server side validation
const { listingSchema } = require("../schema.js");
// Require Listing model
const Listing = require("../models/listing.js");
// To require isLoggedIn,isOwner function (As Middelware)
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
}));


// New Route should placed before Show Route ,because it consider "new" as ":id"
// New Route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("./listings/new");
});


// Show Route (Read)
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    // Nested populate (listing -> review -> author)
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        console.log(listing);
        res.render("./listings/show.ejs", {listing});
    }
    
}));

// Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync(async(req, res, next) => {
    // Check req.boby.listing is empty or not
    if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing");
    }
    // let {title, description, image, price, location, country} = req.body ;
    // Another way ,Using object (Short way)
        let listing = req.body.listing;
        let newListing = new Listing(listing);
        newListing.owner = req.user._id;

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
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    
}));

// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        res.render("./listings/edit.ejs", {listing});
    }
    
}));

// Update Route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    // " ... " Deconstrut the req.body.listing object into individual value
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;