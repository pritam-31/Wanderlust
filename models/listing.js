const mongoose = require("mongoose");
//const { ref } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { ref, string } = require("joi");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        },
        filename: {
            type: String,
            default: ""
        }
    },
    price: {
        type: Number,
        required: true, 
    },
    location: {
        type: String,
    },
    country: {
        type: String, 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",  //Review model
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //User model
        required: true,
    },
    // Add coordinates field for geocoding
    coordinates: {
        latitude: Number,
        longitude: Number
    },
});


//POST-mongo middleware---->>
listingSchema.post("findOneAndDelete", 
    async (listing) => {
        if (listing) {
           // remove all reviews that belong to the deleted listing
           await Review.deleteMany({ _id: { $in: listing.reviews } });
        }     
});


// Creating "Listing" model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;