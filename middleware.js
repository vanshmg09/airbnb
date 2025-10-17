// To require listing model
const Listing = require("./models/listing");
// Require ExpressError
const ExpressError = require("./utils/ExpressError.js");
// Require listingSchema & reviewSchema for server side validation
const { listingSchema } = require("./schema.js");
const {reviewSchema} = require("./schema.js");
// Require Review Model
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    // redirectUrl save
    req.session.redirectUrl = req.originalUrl;
    // console.log(req.path ,"..", req.originalUrl );
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Joi Validation as function (as Middelware)
module.exports.validateListing = (req,res,next) => {
    //Server side validation using "Joi" 
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


// Joi Validation as function (as Middelware)
module.exports.validateReview = (req,res,next) => {
    //Server side validation using "Joi" 
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAutor = async (req, res, next) => {
    let {reviewId, id} = req.params;
    let review = await Review.findById(reviewId);
    if(! review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}