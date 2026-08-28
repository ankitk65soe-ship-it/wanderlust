// Load environment variables from .env file
require("dotenv").config(); 

// ============================================
// DEPENDENCIES
// ============================================
const express=require("express");
const app=express();
const mongoose=require("mongoose");                  // MongoDB object modeling
const Listing=require("./models/listing.js");
const path=require("path");                           // Path utilities
const ejsmate=require("ejs-mate");                   // EJS template engine
const methodOverride=require("method-override");     // Allow PUT/DELETE in HTML forms
const wrapasync=require("./utils/wrapasync.js");     // Async error handler wrapper
const Expresserror=require("./utils/Expresserror.js"); // Custom error class
const {listingSchema}=require("./schema.js");        // Joi validation schema
const {reviewSchema}=require("./schema.js");         // Joi validation schema
const Review=require("./models/review.js");
const User=require("./models/user.js");
const passport=require("passport");                  // Authentication middleware
const Localstrategy=require("passport-local");      // Local authentication strategy

const session=require("express-session");           // Session management
const flash = require('connect-flash');             // Flash messages

const MongoStore = require("connect-mongo").default; // MongoDB session store

// Import route files
const reviewsrouter=require("./routes/review.js");
const listingrouter=require("./routes/listing.js");
const userrouter=require("./routes/user.js");

// ============================================
// EXPRESS CONFIGURATION
// ============================================
app.use(methodOverride("_method"));                           // Allow method override via _method query param
app.set("views",path.join(__dirname,"views"));              // Set views directory
app.set("view engine","ejs");                               // Use EJS as templating engine
app.use(express.urlencoded({ extended: true }));            // Parse URL-encoded request bodies
app.use(express.json());                                     // Parse JSON request bodies
app.use(express.static(path.join(__dirname,"/public")));    // Serve static files
app.engine("ejs",ejsmate);                                   // Use ejs-mate for advanced EJS features

// ============================================
// SESSION STORE CONFIGURATION
// ============================================
// Configure MongoDB to store user sessions (keeps users logged in)
const store=MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
         secret:process.env.SECRET_KEY,  // Use secret key from environment variables for encryption
    },
    touchAfter: 24 * 3600,  // Update session only once every 24 hours
});

// Error handler for session store
store.on("error",()=>{
    console.log("the error in the mongo store is",err);
})

// ============================================
// SESSION OPTIONS
// ============================================
// Configure session settings
const sessionOptions=({
    store:store,                                    // Use MongoDB to store sessions
    secret:process.env.SECRET_KEY,                  // Secret key for signing session ID
    resave:false,                                  // Don't save if session not modified
    saveUninitialized:true,                        // Save uninitialized session
    cookie:{
        expiers:Date.now()+7*24*60*60*1000,        // Cookie expires in 7 days
        maxAge:7*24*60*60*1000,                    // Session max age in milliseconds
        httpOnly:true,                             // Cookie only accessible via HTTP, not JavaScript
    }
});

// ============================================
// DATABASE CONNECTION
// ============================================
const dbUrl=process.env.ATLASDB_URL;  // MongoDB Atlas connection string from env

// Connect to MongoDB
async function main(){
    await mongoose.connect(dbUrl);
}

main()
  .then((res)=>{
        console.log("sucessfully connected");
    })
  .catch((err)=>{
        console.log(err);
    });

// ============================================
// SESSION & AUTHENTICATION MIDDLEWARE
// ============================================
app.use(session(sessionOptions));
app.use(flash());  // Enable flash messaging for user feedback

// Initialize Passport authentication
app.use(passport.initialize());
app.use(passport.session());
// Configure local authentication strategy
passport.use(new Localstrategy(User.authenticate()));

// Serialize and deserialize user for session management
passport.serializeUser(User.serializeUser());      // Save user info to session
passport.deserializeUser(User.deserializeUser());  // Retrieve user info from session

// ============================================
// GLOBAL MIDDLEWARE
// ============================================
// Make flash messages and current user available in all views
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");  // Success messages
    res.locals.error=req.flash("error");      // Error messages
    res.locals.currUser = req.user;            // Current logged-in user
    next();
});

// ============================================
// DEMO ROUTE (for testing)
// ============================================
app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"student@gamil.com",
        username:"Ankit-kumar",
    });
    let result=await User.register(fakeuser,"helloankit");
    console.log(result);
    res.send(result.email);
});

// ============================================
// ROUTE DEFINITIONS
// ============================================
// Mount routers for different features
app.use("/listing",listingrouter);             // Listing routes
app.use("/listing/:id/review",reviewsrouter);  // Review routes (nested under listing)
app.use("/",userrouter);                       // User routes (signup, login, logout)

// ============================================
// ERROR HANDLING
// ============================================
// Handle 404 - page not found
app.all("/{*splat}",(req,res,next)=>{
    next(new Expresserror(404,"page not found"));
});

// Global error handler - catches all errors thrown in routes
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.render("listings/error.ejs",{message});
});

// ============================================
// SERVER START
// ============================================
app.listen(8080,()=>{
    console.log(`app is listening on 8080`);
});
