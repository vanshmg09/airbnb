// To Require User model
const { model } = require("mongoose");
const User = require("../models/user.js");


// renderSignupForm Callback
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// signup Callback
module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            } else{
                req.flash("success", "Welcome to Wanderlust!");
                res.redirect("/listings");
            }
        });

    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

// renderLoginForm Callback
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

// login Callback (login functionality is automate by passport "This callback is functionality after login")
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl ||  "/listings" ;
    res.redirect(redirectUrl);
}

// logout Callback
module.exports.logout = (req, res, next) => {
    req.logOut( (err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}