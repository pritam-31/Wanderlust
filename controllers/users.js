const User = require("../models/user.js");
const Listing = require("../models/listing");
const Review = require("../models/review");
const Wishlist = require("../models/wishlist");


// "renderSignup" ka callback function--->>>
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};


//"signup Route" ka callback function--->>>
module.exports.signup = async(req, res, next) => {
try {
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    //newUser ko register karbane k liye DB k under-->>
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });
} 
catch(e) {
    req.flash("error", e.message);
    res.redirect("/signup");
} 
};


//renderLogin ka callback function---->>>
module.exports.renderLoginForm = (req, res ) => {
    res.render("users/login.ejs");
};

//"login Route" ka callback function------>>>
module.exports.login = async(req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = 
            res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl); //redirectUrl
};


//"logout Route" ka callback Function---->>
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {  //logout() <<-- callback
    if(err) {
        return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
    });
};

// Profile page: show user's listings, reviews, wishlist count and stats
module.exports.profile = async (req, res, next) => {
    try {
        const user = req.user;
        const userListings = await Listing.find({ owner: user._id }).populate('reviews');
        const reviews = await Review.find({ author: user._id }).sort({ createdAt: -1 });

        // Attach listing reference for each review where possible
        const userReviews = [];
        for (let review of reviews) {
            const listing = await Listing.findOne({ reviews: review._id });
            userReviews.push({
                ...review.toObject(),
                listing: listing ? { _id: listing._id, title: listing.title } : null
            });
        }

        const wishlistCount = await Wishlist.countDocuments({ user: user._id });

        const userStats = {
            totalListings: userListings.length,
            totalReviews: reviews.length,
            totalEarnings: 0,
            tripsCount: wishlistCount
        };

        res.render('users/profile.ejs', { currentUser: user, userListings, userReviews, userStats });
    } catch (err) {
        next(err);
    }
};

// Trips page: return bookings (upcoming/completed) and wishlist
module.exports.trips = async (req, res, next) => {
    try {
        const Booking = require('../models/booking');
        const today = new Date();

        const allBookings = await Booking.find({ user: req.user._id }).populate('listing').sort({ startDate: 1 });

        const upcoming = [];
        const completed = [];

        allBookings.forEach(b => {
            const obj = {
                _id: b._id,
                bookingId: b.bookingId,
                listing: b.listing,
                totalPrice: b.totalPrice,
                bookedDate: b.bookedDate,
                startDate: b.startDate,
                endDate: b.endDate,
                status: b.status
            };
            if (b.status === 'cancelled') return; // skip cancelled
            if (b.status === 'completed' || b.endDate < today) {
                completed.push(obj);
            } else {
                upcoming.push(obj);
            }
        });

        const wishlist = await Wishlist.find({ user: req.user._id }).populate('listing');

        res.render('users/trips.ejs', { trips: { upcoming, completed }, wishlist });
    } catch (err) {
        next(err);
    }
};

