const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema({
	sectionName: {
		type: String,
		required: true
	},
	subSection: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "SubSection"
	}]
})

module.exports = mongoose.model("Section", sectionSchema);