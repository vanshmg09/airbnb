// To Require Review model
const Review = require("../models/review");
// Require Listing model
const Listing = require("../models/listing.js");


// Post Review Route Callback
module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}


// Delete Review Route Callback
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // " $pull " used to remove (Remove reviewId from Listing model)
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}