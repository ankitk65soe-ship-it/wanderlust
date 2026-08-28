// Mapbox Map Display
// This script displays an interactive map using Mapbox GL JS
// Shows the location of a listing with a marker and popup

// Set Mapbox access token for authentication
mapboxgl.accessToken = maptoken;  

// Create and initialize the map
const map = new mapboxgl.Map({
    container: 'map',                          // HTML element ID where map will be displayed
    center: listing.geometry.coordinates,      // Center map at listing coordinates [lng, lat]
    zoom: 10                                    // Initial zoom level
});

// Add a red marker to the map at the listing location
// The coordinates array contains [longitude, latitude] from the listing object
const marker1 = new mapboxgl.Marker({color:'red'})
    .setLngLat(listing.geometry.coordinates)  // Set marker position using listing coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3> ${listing.location} </h3><p> Exact Location provided after booking </p>`)) // Popup shows location info
    .addTo(map);                                // Add marker to the map