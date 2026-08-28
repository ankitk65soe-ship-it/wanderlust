// Listing Controller
// Handles CRUD operations for property listings and integrates with Mapbox for geolocation

const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

// Fetch and display all listings
module.exports.index=async (req,res)=>{
    const lists=await Listing.find({});
    res.render("listings/index.ejs",{lists});
};

// Display form for creating a new listing
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

// Fetch and display a single listing with its reviews
module.exports.showListing=async (req,res)=>{
    const id=req.params.id;
    // Populate retrieves the full review objects instead of just IDs
    const place=await Listing.findById(id).populate("review");
    if(!place){
        req.flash("error","the listing you requested not found");
        return  res.redirect("/listings")
    }
    res.render("listings/show.ejs",{place});
};

// Create a new listing
module.exports.createListing=async (req, res) => {
    // Convert location string to coordinates using Mapbox Geocoding API
    let response=await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send()
      // console.log(response);   //this response is an object which contains the data we need to extract the coordinates from it
    //   console.log(response.body.features[0].geometry);  //this is the geometry object which contains the coordinates
    
    // Get image details from uploaded file
    let url=req.file.path;
    let filename=req.file.filename;
    
    // Create new listing from request body
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;                           // Set current user as owner
    listing.image={url,filename};                           // Store image URL and filename
    listing.geometry = response.body.features[0].geometry;  // Store geolocation data
    console.log(url);
    console.log(filename);
    await listing.save();
    req.flash("success", "New listing added successfully");
    res.redirect("/listing");
};

// Display form for editing a listing
module.exports.renderEditForm=async (req,res)=>{
    const id=req.params.id;
    const place=await Listing.findById(id);
    if(!place){
        req.flash("error","the listing you requested not found");
        res.redirect("/listings")
    }
    // Apply blur effect to original image URL for thumbnail
    let originalImageUrl=place.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_300/e_blur:300");
    res.render("listings/edit.ejs",{place,originalImageUrl});
};

// Update a listing with new information
module.exports.updateListing=async (req,res)=>{
    const id=req.params.id;
    const place=req.body.listing;
    // Find and update the listing
    let listing=await Listing.findOneAndUpdate({_id:id},{...place});
    // If new image was uploaded, update it
    if(req.file && req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","listing edited successfuly");
    res.redirect("/listing");
};

// Delete a listing
module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    // Delete the listing (post-delete middleware will handle review deletion)
    await Listing.findOneAndDelete({_id:id});
    req.flash("success","listing deleted successfuly");
    res.redirect("/listing");
};