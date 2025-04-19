const mongoose = require("mongoose");

const RatingAndReviewsSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	review: {
		type: String,
	}
})

module.exports = mongoose.model("RatingAndReview", RatingAndReviewsSchema);