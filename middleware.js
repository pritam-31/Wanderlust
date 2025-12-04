const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");


//isLoggedIn middleware----->>>
module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()) {
        //(redirectUrl save)
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

//"saveRedirectUrl" middleware--->>>
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//isOwner middleware----->>>
//(agar Owner login hai toh sabkuch access kar sakta hai)...
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    // ensure listing and owner exist
    if (!listing || !listing.owner) {
        req.flash("error", "Listing not found or has no owner.");
        return res.redirect(`/listings/${id}`);
    }
    // prefer req.user (set by passport) for current user
    if (!req.user || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You're not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//validation_listing middleware---->>>>
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg );
    } else {
        next();
    }
};


//validation_reviews middleware----->>>>
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg );
    } else {
        next();
    }
};

//isLoggedIn middleware----->>>
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review || !review.author) {
        req.flash("error", "Review not found or has no author.");
        return res.redirect(`/listings/${id}`);
    }
    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You're not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};