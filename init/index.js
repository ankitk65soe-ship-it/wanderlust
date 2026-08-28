// Database Initialization Script
// This script populates the database with sample listing data
// Run this file once to seed the database with initial listings

const mongoose=require("mongoose");
const initdata=require("./data.js");  // Sample listing data
const Listing=require("../models/listing.js");

// Connect to MongoDB
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then((res)=>{
        console.log("sucessfully connected");
    })
  .catch((err)=>{
        console.log(err);
    });

// Initialize database with sample data
const initdb= async ()=>{
    // Delete all existing listings to start fresh
    await Listing.deleteMany({});
    // Insert all sample listings from data.js
    await Listing.insertMany(initdata.data);
    console.log("init done");
}

// Execute the database initialization
initdb();