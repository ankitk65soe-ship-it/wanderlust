// Listing Model
// Defines the schema for property listings in the application

const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

// Listing schema definition
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,              // Property title is mandatory
    },
    description:String,             // Detailed description of the property
    image:{
        url:String,                 // URL of the property image from Cloudinary
        filename:String,            // Cloudinary filename for deletion purposes
    },
    price:Number,                   // Price per night in currency
    location:String,                // Address/location of the property
    country:String,                 // Country where property is located
    review:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",            // Array of review references
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",                 // Reference to the user who listed this property
    },
    geometry:{
        // GeoJSON format for storing location coordinates (used for mapping)
        type:{
            type:String,
            enum:["Point"],          // Always 'Point' for single location
            required:true,
        },
        coordinates:{
            type:[Number],           // [longitude, latitude]
            required:true,
        }
    }
});

// Post-delete middleware: When a listing is deleted, also delete all associated reviews
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        // Delete all reviews where ID is in the listing's review array
        await Review.deleteMany({_id:{$in:listing.review}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;