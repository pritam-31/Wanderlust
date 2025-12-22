const Booking = require('../models/booking');
const Listing = require('../models/listing');
const { v4: uuidv4 } = require('uuid');

module.exports.createBooking = async (req, res, next) => {
  try {
    const { listingId, startDate, endDate, totalPrice } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    const booking = new Booking({
      user: req.user._id,
      listing: listing._id,
      bookingId: uuidv4().split('-')[0],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice: totalPrice || 0,
      status: 'upcoming'
    });

    await booking.save();
    req.flash('success', 'Booking created');
    res.redirect('/trips');
  } catch (err) {
    next(err);
  }
};

module.exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      req.flash('error', 'Booking not found');
      return res.redirect('/trips');
    }
    // Only owner of booking can cancel
    if (!booking.user.equals(req.user._id)) {
      req.flash('error', "You're not authorized to cancel this booking");
      return res.redirect('/trips');
    }
    booking.status = 'cancelled';
    await booking.save();
    req.flash('success', 'Booking cancelled');
    res.redirect('/trips');
  } catch (err) {
    next(err);
  }
};

module.exports.getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate('listing').sort({ startDate: 1 });
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
};

// For dev: quick seed route to create sample bookings for the first user/listings
module.exports.seedBookings = async (req, res, next) => {
  try {
    // DO NOT expose in production
    const listings = await Listing.find({}).limit(2);
    if (!listings.length) return res.send('No listings to seed');
    const user = req.user;
    if (!user) return res.send('No logged-in user');

    // upcoming booking
    const upcoming = new Booking({
      user: user._id,
      listing: listings[0]._id,
      bookingId: uuidv4().split('-')[0],
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      totalPrice: 1200,
      status: 'upcoming'
    });

    // completed booking
    const completed = new Booking({
      user: user._id,
      listing: listings[1]._id,
      bookingId: uuidv4().split('-')[0],
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      totalPrice: 1800,
      status: 'completed'
    });

    await Promise.all([upcoming.save(), completed.save()]);

    res.send('Seeded sample bookings');
  } catch (err) {
    next(err);
  }
};
