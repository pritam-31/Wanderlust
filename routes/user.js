const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userController = require("../controllers/users.js");


// renderSignup & signup Route--->>>
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

//renderLogin & using this type of "passport" middleware--->>
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { 
            failureRedirect: "/login", 
            failureFlash: true, 
        }),
        userController.login);


// User profile & trips
router.get("/profile", isLoggedIn, wrapAsync(userController.profile));
router.get("/trips", isLoggedIn, wrapAsync(userController.trips));


//logout---->>>
router.get("/logout", userController.logout);

module.exports = router;