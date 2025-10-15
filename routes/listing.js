const express = require("express");
const router = express.Router();
// Require wrapAsync
const wrapAsync = require("../utils/wrapAsyc.js");
// Require ExpressError
const ExpressError = require("../utils/ExpressError.js");
// Require listingSchema & reviewSchema for server side validation
const {listingSchema} = require("../schema.js");
// Require Listing model
const Listing = require("../models/listing.js");


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

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
}));


// New Route should placed before Show Route ,because it consider "new" as ":id"
// New Route
router.get("/new", (req, res) => {
    res.render("./listings/new");
});


// Show Route (Read)
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs", {listing});
    }
    
}));

// Create Route
router.post("/",validateListing, wrapAsync(async(req, res, next) => {
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
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    
}));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
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
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    // " ... " Deconstrut the req.body.listing object into individual value
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;