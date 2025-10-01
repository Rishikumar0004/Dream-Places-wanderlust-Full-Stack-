const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title : {
        type : String,
        require : true,
    } ,
    description : String,
    image : {
        url: String,
        filename: String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ['Point'], // GeoJSON type
    //         // required: true,
    //         default: 'Point'
    //     },
    //     coordinates: {
    //         type: [Number], // [longitude, latitude]
    //         // required: true,
    //         default: [0, 0]
    //     }
    // }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 