const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js"); //differ code
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//Reviews
//Post Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Show edit form
router.get("/:reviewId/edit", async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id);
  const review = await Review.findById(reviewId);
  res.render("reviews/edit", { listing, review });
});


// edit Review form submit
router.put("/:reviewId",isReviewAuthor, async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndUpdate(reviewId, req.body.review);
  res.redirect(`/listings/${id}`);
});

//Delete Review Route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;