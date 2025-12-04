const Listing = require("../models/listing");
const Review = require("../models/review");



//Reviews---->>>
//"POST-Review Routes" ka callback function
module.exports
.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    // sanitize incoming review data: if rating is empty string, remove it so mongoose doesn't try to cast
    const reviewData = { ...req.body.review } || {};
    if (reviewData.rating === "") delete reviewData.rating;
    let newReview = new Review(reviewData);
    if (req.user && req.user._id) newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

//"Delete-Reviews" Route ka callback function---->>>
module.exports.destroyReview = async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
};
