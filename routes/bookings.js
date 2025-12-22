const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const bookingsController = require('../controllers/bookings');
const { isLoggedIn } = require('../middleware');

router.post('/', isLoggedIn, wrapAsync(bookingsController.createBooking));
router.post('/:id/cancel', isLoggedIn, wrapAsync(bookingsController.cancelBooking));
// dev seed (requires logged-in user)
router.get('/seed/sample', isLoggedIn, wrapAsync(bookingsController.seedBookings));
router.get('/me', isLoggedIn, wrapAsync(bookingsController.getUserBookings));

module.exports = router;
