const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate wishlist items
wishlistSchema.index(
    { 
        user: 1, 
        listing: 1 
    }, 
    { 
        unique: true 
    }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);