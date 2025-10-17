const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// To Require userController
const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsyc(userController.signup));

router.get("/login", userController.renderLoginForm);

// passport.authenticate() is Middleware
router.post("/login",saveRedirectUrl, passport.authenticate("local",{ failureRedirect: '/login' , failureFlash: true}), userController.login);

router.get("/logout", userController.logout);

module.exports = router;