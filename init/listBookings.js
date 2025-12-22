require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const User = require('../models/user');

const dbUrl = process.env.ATLASDB_URL;

async function main(){
  await mongoose.connect(dbUrl);
  const bookings = await Booking.find({}).populate('listing user').limit(10).sort({bookedDate:-1});
  console.log('Bookings:', bookings.map(b=>({id:b.bookingId, user: b.user?.username||b.user?.email, listing: b.listing?.title, status: b.status})));
  mongoose.connection.close();
}

main().catch(e=>{console.error(e); process.exit(1);});
