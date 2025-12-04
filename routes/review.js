const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js"); it moved middleware.js
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { 
    validateReview, 
    isLoggedIn, 
    isReviewAuthor 
} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");




//validation_reviews----->>>>
//## it moved to middleware.js

//Reviews---->>>
//POST-Review Routes
router.post(
    "/", 
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewController.createReview));

//Delete-Reviews Route---->>>
router.delete(
    "/:reviewId",
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router;