const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js"); it on middleware.js
// const { listingSchema, reviewSchema } = require("../schema.js"); it on middleware.js 
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

 
//validation_listing middleware---->>>>
//## it moved to middleware.js


//index & create Route---->>
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post( 
        isLoggedIn, 
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );
    

//New & Create Route (for a Form):
//New Route ------>
router.get('/new',
            isLoggedIn, 
            listingController.RenderNewForm);

//show, Update & Delete Route---->>>>
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'), 
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing));

//Update: Edit & Upadate Route (for a Form)----->
//Edit Route ---->
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;