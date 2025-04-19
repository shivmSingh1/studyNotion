const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
	gender: {
		type: String,
		enum: ["Male", "Female", "Other"]
	},
	dateOfbirth: {
		type: String,
	},
	about: {
		type: String,
		maxLength: 50,
	},
	ContactNumber: {
		type: Number,
	},
})

module.exports = mongoose.model("Profile", profileSchema);