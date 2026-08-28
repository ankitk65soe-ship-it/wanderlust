// Review Model
// Defines the schema for reviews/ratings on listings

const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// Review schema definition
let reviewSchema=new Schema({
    comment:String,                          // Text content of the review
    rate:{
        type:Number,
        min:1,                              // Minimum rating is 1 star
        max:5                               // Maximum rating is 5 stars
    },
    created_at:{
        type:Date,
        default:Date.now,                   // Automatically set current date/time when created
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",                         // Reference to the user who wrote the review
    }
});

module.exports= mongoose.model("Review",reviewSchema);
