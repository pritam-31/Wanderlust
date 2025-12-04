const { types } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// reviewSchema -->
const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now() //current 
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",  //User model
    }
});

//creating "Review" Model ==>
module.exports = mongoose.model("Review", reviewSchema);