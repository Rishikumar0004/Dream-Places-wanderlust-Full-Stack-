const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



// combining Routes of same path (using router.route)
router.route("/")
    .get(wrapAsync(listingController.index))//Index Route
    .post( isLoggedIn, 
        validateListing, 
        upload.single("listing[image]"), 
        wrapAsync(listingController.createListing));//Create Route


//New Route                                 
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get( wrapAsync(listingController.showListing))//Show Route
    .put( validateListing,
        isLoggedIn,
        isOwner,upload.single("listing[image]"), 
        validateListing, 
        wrapAsync(listingController.updateListing))//PUT/Update Route
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); //DELETE Route


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;