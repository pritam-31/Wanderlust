// Run with: node init/testBookingFlow.js
// This script will:
// 1) create a test user via /signup and capture session cookie
// 2) pick the first available listing from DB
// 3) POST to /bookings to create a booking with that session cookie
// 4) GET /bookings/me to verify the booking exists

require('dotenv').config();
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Listing = require('../models/listing');

const base = 'http://localhost:8080';

async function register(username, email, password) {
  const res = await fetch(`${base}/signup`, {
    method: 'POST',
    body: new URLSearchParams({ username, email, password }),
    redirect: 'manual'
  });
  const setCookie = res.headers.raw()['set-cookie'] || [];
  const cookieHeader = setCookie.map(c => c.split(';')[0]).join('; ');
  return cookieHeader;
}

async function createBooking(cookie, listingId, startDate, endDate, totalPrice) {
  const res = await fetch(`${base}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    },
    body: new URLSearchParams({ listingId, startDate, endDate, totalPrice }),
    redirect: 'manual'
  });
  return res.status;
}

async function getMyBookings(cookie) {
  const res = await fetch(`${base}/bookings/me`, {
    method: 'GET',
    headers: { 'Cookie': cookie }
  });
  return res.json();
}

async function main() {
  // ensure DB available and find a listing
  await mongoose.connect(process.env.ATLASDB_URL);
  const listing = await Listing.findOne();
  if(!listing) {
    console.error('No listing found; create one first.');
    process.exit(1);
  }

  const timestamp = Date.now();
  const username = `testuser_${timestamp}`;
  const email = `${username}@example.com`;
  const password = 'Password123!';

  console.log('Registering user:', username);
  const cookie = await register(username, email, password);
  if(!cookie) {
    console.error('Failed to capture session cookie. Ensure server is running at', base);
    process.exit(1);
  }
  console.log('Got cookie:', cookie.split(';')[0]);

  // booking dates: tomorrow for 2 nights
  const start = new Date(Date.now() + 24*60*60*1000).toISOString().slice(0,10);
  const end = new Date(Date.now() + 3*24*60*60*1000).toISOString().slice(0,10);
  const price = 500;

  console.log('Creating booking for listing', listing._id.toString());
  const status = await createBooking(cookie, listing._id.toString(), start, end, price);
  console.log('Booking POST status:', status);

  console.log('Fetching my bookings (JSON)');
  const json = await getMyBookings(cookie);
  console.log('My bookings:', json);

  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});