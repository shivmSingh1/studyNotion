const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema = mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	otp: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now(),
		expires: 5 * 60,
	}
})

const sendVarificationMail = async (email, otp) => {
	try {
		const mailResponse = await mailSender(email, "varification email", otp);
		console.log("mail send successfully", mailResponse)
	} catch (error) {
		console.log(error.message);
		throw error;
	}
}

OtpSchema.pre("save", async (next) => {
	await sendVarificationMail(this.email, this.otp);
	next();
})


module.exports = mongoose.model("OTP", OtpSchema);