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



// Review
// Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync( async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));


// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAutor, wrapAsync( async (req, res) => {
    let { id, reviewId } = req.params;

    // " $pull " used to remove (Remove reviewId from Listing model)
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;