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
// To Require multer(upload image)
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

// "router.route" compact way of writting route
router.route("/")
    // Index Route
    .get( wrapAsync(listingController.index))
    // Create Route
    // .post( isLoggedIn, validateListing, wrapAsync(listingController.createListing));
    .post(upload.single('listing[image]') ,(req, res) => {
            res.send(req.file);
            console.log(req.file);
    });


// New Route should placed before Show Route ,because it consider "new" as ":id"
// New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    // Show Route (Read)
    .get( wrapAsync(listingController.showListing))
    // Update Route
    .put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
    // Delete Route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;