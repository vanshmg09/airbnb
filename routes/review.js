const express = require("express");
const router = express.Router({mergeParams: true});

// Require wrapAsync
const wrapAsync = require("../utils/wrapAsyc.js");
// Require ExpressError
const ExpressError = require("../utils/ExpressError.js");

// Require Review Model
const Review = require("../models/review.js");
// Require Listing model
const Listing = require("../models/listing.js");
// To require isLoggedIn,isOwner function (As Middelware)
const { validateReview, isLoggedIn, isReviewAutor } = require("../middleware.js");

// To Require reviewController
const reviewController = require("../controllers/reviews.js");



// Review
// Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview ));


// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAutor, wrapAsync( reviewController.destroyReview));

module.exports = router;