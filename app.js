const express = require("express");
const app = express();
const mkongoose = require("mongoose");
// Require Listing model
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mkongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title : "My new Villa",
        description : "By the Beach",
        price : 1200,
        location : "Calangute,Goa",
        country : "India"
    });

    await sampleListing.save();
    console.log("sample was saved");
    res.send("successfully testing");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

