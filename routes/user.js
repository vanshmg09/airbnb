const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// To Require userController
const userController = require("../controllers/users.js");


router.route("/signup")
    .get( userController.renderSignupForm)
    .post( wrapAsyc(userController.signup));


router.route("/login")
    .get( userController.renderLoginForm)
    // passport.authenticate() is Middleware
    .post(saveRedirectUrl, passport.authenticate("local",{ failureRedirect: '/login' , failureFlash: true}), userController.login);


router.get("/logout", userController.logout);

module.exports = router;