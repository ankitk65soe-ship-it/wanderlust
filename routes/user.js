// User Routes
// Handles all routes related to user authentication (signup, login, logout)

const express=require("express");
const router=express.Router({mergeParams:true});  // Allows access to parent route params
const User=require("../models/user.js");
const wrapasync=require("../utils/wrapasync.js");  // Wraps async functions to catch errors
const passport=require("passport");  // Authentication middleware
const { saveRedirectUrl } = require("../middleware.js"); // Save URL to redirect after login

const usercontroller=require("../controllers/user.js");  // Import controller functions

// GET /signup - Display signup form
// POST /signup - Register new user
router.route("/signup")
.get(usercontroller.signupRenderForm)
.post(wrapasync(usercontroller.signup));

// GET /login - Display login form
// POST /login - Authenticate user using Passport local strategy
router.route("/login")
.get(usercontroller.loginRenderForm)
.post(saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",  // Redirect here if login fails
        failureFlash:true,           // Show error message on failure
    }),
    usercontroller.login
);

// GET /logout - Logout user and destroy session
router.get("/logout",usercontroller.logout);

module.exports=router;