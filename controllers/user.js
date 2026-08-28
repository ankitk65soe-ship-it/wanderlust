// User Controller
// Handles user authentication operations (signup, login, logout)

const Review=require("../models/review");
const User=require("../models/user.js");

// Sign up a new user
module.exports.signup=async(req,res)=>{
    try{
        let {username, email, password}=req.body;
        // Create new user object with email and username
        const newuser=new User({email,username});
        // Register user with password (passport-local-mongoose handles hashing)
        const registereduser=await User.register(newuser,password);
        req.flash("success","welcome to wanderlust");
        res.redirect("/listing");
    }
    catch(err){
        // Show error if registration fails (e.g., username already exists)
        req.flash("error",err.message);
        res.redirect("/listing");  
    }
};

// Display signup form page
module.exports.signupRenderForm=(req,res)=>{
    res.render("user/signup.ejs");
};

// Display login form page
module.exports.loginRenderForm=(req,res)=>{
    res.render("user/login.ejs");
};

// Handle user login (authentication is handled by passport middleware)
module.exports.login=async (req, res) => {
        req.flash("success", "Welcome back to Wanderlustravels");
        // Redirect to the page user was trying to access before login, or homepage
        let redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
};

// Handle user logout
module.exports.logout=(req,res,next)=>{
    // Passport's logOut method clears the session
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out successfully!");
        res.redirect("/login");
    })
};