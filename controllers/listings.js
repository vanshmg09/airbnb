// To require Listing model
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
}