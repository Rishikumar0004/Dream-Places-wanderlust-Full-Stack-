const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be looged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("owner"); //  populate owner so we get email

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    //  compare email instead of _id
    if (!listing.owner || listing.owner.email !== res.locals.currUser.email) {
        req.flash("error", "You are not the Owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
};



module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  // populate author (User ka ref)
  const review = await Review.findById(reviewId).populate("author");

  if (!review) {
    req.flash("error", "⚠️ Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author || review.author.email !== res.locals.currUser.email) {
    req.flash(
      "error",
      "🚫 Access denied! You are not the author of this review 😅"
    );
    return res.redirect(`/listings/${id}`);
  }

  next();
};
