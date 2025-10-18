const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Require Review model
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image : {
        url: String,
        filename: String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// To delete all reviews that are containing in listing (When delete the Listing)
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;