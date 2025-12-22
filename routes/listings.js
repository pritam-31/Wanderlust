// routes/listings.js - yeh confirm karo ki yeh file exist karti hai

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listings.js");

// SEARCH & FILTER ROUTES
router.get("/search", wrapAsync(listingController.searchListings));
router.get("/filter/:category", wrapAsync(listingController.filterListings));
router.get("/filter/price/:range", wrapAsync(listingController.priceFilter));

// CRUD ROUTES
router.get("/", wrapAsync(listingController.index));
router.get("/new", listingController.RenderNewForm);
router.post("/", wrapAsync(listingController.createListing));
router.get("/:id", wrapAsync(listingController.showListing));
router.get("/:id/edit", wrapAsync(listingController.renderEditForm));
router.put("/:id", wrapAsync(listingController.updateListing));
router.delete("/:id", wrapAsync(listingController.destroyListing));

module.exports = router;
