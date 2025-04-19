const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
	CourseName: {
		type: String,
		required: true
	},
	CourseDescription: {
		type: String,
		trim: true,
		maxLength: 100,
	},
	Instructor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	WhatYouWillLearn: {
		type: String,
	},
	CourseContent: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Section"
	}],
	RatingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview"
		}
	],
	price: {
		type: Number,
		required: true
	},
	thumbnail: {
		type: String
	},
	Category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category"
	},
	tag: [{
		type: String
	}],
	studentEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	]
})

module.exports = mongoose.model("Course", courseSchema);