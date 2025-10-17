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

// To Require listingController
const listingController = require("../controllers/listings.js");


// Index Route
router.get("/", wrapAsync(listingController.index));


// New Route should placed before Show Route ,because it consider "new" as ":id"
// New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);


// Show Route (Read)
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;