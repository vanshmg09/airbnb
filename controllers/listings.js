// To require Listing model
const Listing = require("../models/listing");

// Index Route Callback
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", {allListing});
}

// New Route Callback
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new");
}

// Show Route Callback
module.exports.showListing = async (req, res) => {
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
    
}

// Create Route Callback
module.exports.createListing = async(req, res, next) => {

    // Check req.boby.listing is empty or not
    if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing");
    }

    let url = req.file.path;
    let filename = req.file.filename;
    // let {title, description, image, price, location, country} = req.body ;
    // Another way ,Using object (Short way)
        let listing = req.body.listing;
        let newListing = new Listing(listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};

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
    
}

// Edit Route Callback
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }else{
        res.render("./listings/edit.ejs", {listing});
    }
    
}

// Update Route Callback
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    // " ... " Deconstrut the req.body.listing object into individual value
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

// Delete Route Callback
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}