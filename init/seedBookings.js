// Run this script with: node init/seedBookings.js
// It will create sample bookings for the first user in the DB (dev only)

require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log('connected to DB');

  const user = await User.findOne();
  if (!user) {
    console.log('No user found. Create a user via signup first.');
    process.exit(1);
  }

  const listings = await Listing.find().limit(2);
  if (listings.length < 1) {
    console.log('No listings found. Create listings first.');
    process.exit(1);
  }

  const upcoming = new Booking({
    user: user._id,
    listing: listings[0]._id,
    bookingId: uuidv4().split('-')[0],
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    totalPrice: 1200,
    status: 'upcoming'
  });

  const completed = new Booking({
    user: user._id,
    listing: listings[Math.min(1, listings.length -1)]._id,
    bookingId: uuidv4().split('-')[0],
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalPrice: 1800,
    status: 'completed'
  });

  await Promise.all([upcoming.save(), completed.save()]);
  console.log('Seeded bookings for user:', user.username || user.email);
  mongoose.connection.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});