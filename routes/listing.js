// Listing Routes
// Handles all routes related to property listings (CRUD operations)

const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");  // Wraps async functions to catch errors
const { isLoggedIn } = require("../middleware.js"); // Check if user is logged in
const { isOwner, validateSchema } = require("../middleware.js"); // Check ownership and validate data

const {storage}=require("../cloudConfi.js");  // Cloudinary storage configuration

const multer=require("multer");  // File upload middleware
const upload=multer({storage});  // Configure multer with Cloudinary storage

const listingcontroller=require("../controllers/listing.js");  // Import controller functions

// GET /listing/new - Display form to create new listing (requires login)
// POST /listing/new - Create new listing with image upload and validation
router.route("/new")
.get(isLoggedIn,listingcontroller.renderNewForm)
.post(isLoggedIn,upload.single("listing[image]"),validateSchema, wrapasync(listingcontroller.createListing));

// GET /listing/:id - Display specific listing details (requires login)
// DELETE /listing/:id - Delete listing (requires login and ownership)
router.route("/:id")
.get(isLoggedIn,wrapasync(listingcontroller.showListing))
.delete(isLoggedIn, isOwner, wrapasync(listingcontroller.destroyListing));

// GET /listing - Display all listings
router.get("/",wrapasync(listingcontroller.index));

// GET /listing/:id/edit - Display form to edit listing (requires login and ownership)
// PUT /listing/:id/edit - Update listing with image upload and validation (requires login and ownership)
router.route("/:id/edit")
.get(isLoggedIn,isOwner,wrapasync(listingcontroller.renderEditForm))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateSchema,wrapasync(listingcontroller.updateListing)); 

module.exports = router;