// Review Routes
// Handles all routes related to reviews on listings (create and delete reviews)
// These are nested routes under /listing/:id/review

const express=require("express");
const router=express.Router({mergeParams:true});  // Allows access to parent route params like :id
const {reviewSchema}=require("../schema.js");  // Joi validation schema
const wrapasync=require("../utils/wrapasync.js");  // Wraps async functions to catch errors
const Expresserror=require("../utils/Expresserror.js");  // Custom error class
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isReviewAuthor} = require("../middleware.js"); // Validate review data and check author
const {isLoggedIn} = require("../middleware.js"); // Check if user is logged in

const reviewcontroller=require("../controllers/review.js");  // Import controller functions

// POST /listing/:id/review - Create new review for a listing (requires login)
router.post("/",isLoggedIn,validateReview,wrapasync(reviewcontroller.createReview));

// DELETE /listing/:id/review/:reviewId - Delete review (requires login and review authorship)
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(reviewcontroller.destroyReview));

module.exports = router;