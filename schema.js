// Joi Validation Schemas
// These schemas define the structure and validation rules for listing and review data
// Used in middleware to validate incoming request data before processing

const Joi = require('joi');

// Listing validation schema - defines required fields and their types for a listing
module.exports.listingSchema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),              // Listing title (required)
        description:Joi.string().required(),        // Listing description (required)
        location:Joi.string().required(),           // Location/address (required)
        country:Joi.string().required(),            // Country name (required)
        price:Joi.number().required().min(0),      // Price per night, must be positive (required)
        image:Joi.string().allow("",null),         // Image URL (optional - can be empty or null)
    }).required()
});

// Review validation schema - defines required fields for a review
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rate:Joi.number().required().min(1).max(5),  // Rating from 1-5 stars (required)
        comment:Joi.string().required(),             // Review comment text (required)
    }).required()
});