const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	FirstName: {
		type: String,
		trim: true,
		required: true
	},
	LastName: {
		type: String,
		trim: true,
		required: true
	},
	Email: {
		type: String,
		trim: true,
		required: true
	},
	Password: {
		type: String,
		trim: true,
		required: true
	},
	AccountType: {
		type: String,
		enum: ["Student", "Instructor", "Admin"]
	},
	Courses: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Course"
	}],
	Profile: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "profile"
	},
	token: {
		type: String
	},
	resetPasswordExpires: {
		type: String
	},
	CourseProgress: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "CourseProgress"
	},
	image: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model("User", userSchema);