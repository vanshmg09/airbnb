if(process.env.NODE_ENV != "production") {
    // To Require ".env"
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// Require Listing model
// const Listing = require("./models/listing.js");
// To override the PUT and POST method of form
const methodOverride = require("method-override");
// Require ejs-mate
const ejsMate = require("ejs-mate");
// Require wrapAsync(now not needed ; Express Router)
// const wrapAsync = require("./utils/wrapAsyc.js");
// Require ExpressError
const ExpressError = require("./utils/ExpressError.js");
// Require listingSchema & reviewSchema for server side validation(now not needed ; Express Router)
// const {listingSchema, reviewSchema} = require("./schema.js")
// Require Review Model
const Review = require("./models/review.js");
// To Require express-session
const session = require("express-session");
// To Require connect-flash
const flash = require("connect-flash");
// To require passport
const passport = require("passport");
// To require passport-local
const LocalStrategy = require("passport-local");
// To require user model
const User = require("./models/user.js");

// To require Listing Route
const listingRouter = require("./routes/listing.js");
// To require Review Route
const reviewRouter = require("./routes/review.js");
// To require User Route
const userRouter = require("./routes/user.js");

const path = require("path");
const { readdir } = require("fs");
const { clear } = require("console");
const { kMaxLength } = require("buffer");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname,"views"));

// To use "req.params" ; To parse the data that are arive in request
app.use(express.urlencoded({extended: true}));
// To override the PUT and POST method of form
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// To use static file (public)
app.use(express.static(path.join(__dirname,"/public")));

// Session Option
const sessionOptions = {
    secret: "mysupersecretecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 27 * 60 * 60 * 1000,
        maxAge: 7 * 27 * 60 * 60 * 1000,
        httpOnly: true 
    }
};

// To use session
app.use(session(sessionOptions));
//  To use flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.use("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title : "My new Villa",
//         description : "By the Beach",
//         price : 1200,
//         location : "Calangute,Goa",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfully testing");
// });



// To use Listing Route
app.use("/listings", listingRouter);
// To use Review Route
app.use("/listings/:id/reviews", reviewRouter);
// To use User Route
app.use("/", userRouter);



// If request are not map with above route then it map with this route (Any reqest map with this route)
app.all(/.*/,(req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// Middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message);
})


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

