// Review Controller
// Handles creation and deletion of reviews/ratings on listings

const Review=require("../models/review");
const Listing = require("../models/listing");

// Create a new review for a listing
module.exports.createReview=async (req,res)=>{
    // Find the listing that is being reviewed
    let listing=await Listing.findById(req.params.id);
    // Create new review object from request body
    let newreview=new Review(req.body.review);
    console.log(newreview);
    // Set the review author to the logged-in user
    newreview.author=req.user._id;
    // Add the review to the listing's review array
    listing.review.push(newreview);
    // Save both the review and listing to database
    await newreview.save();
    await listing.save();
    req.flash("success","New Review added successfuly");
    // Redirect back to the listing detail page
    res.redirect(`/listing/${listing._id}`);
}

// Delete a review from a listing
module.exports.destroyReview=async (req, res) => {
    const { id , reviewId} = req.params;
    // Remove review ID from the listing's review array
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfuly");
    // Redirect back to the listing detail page
    res.redirect(`/listing/${id}`);    
}