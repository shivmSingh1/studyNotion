const User = require("../models/User");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


exports.resetPasswordToken = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(404).json({
				success: false,
				message: "all feilds required"
			})
		}

		//check user exist
		const existingUser = await User.findOne({ email })
		if (!existingUser) {
			return res.status(404).json({
				success: false,
				message: "user does not exist"
			})
		}
		//gen token
		const token = await crypto.randomUUID();
		if (!token) {
			return res.status(404).json({
				success: false,
				message: "token not found"
			})
		}

		//save token in user
		const updatedUser = await User.findOneAndUpdate({ email }, {
			token: token,
			resetPasswordToken: new Date(Date.now() + 5 * 60 * 1000)
		}, { new: true })

		//sendmail
		const resetUrl = `http://localhost:3000/update-password/${token}`
		const response = await mailSender(email, "reset password", resetUrl);

		//send res

		return res.status(200).json({
			success: true,
			message: "email sent successfully"
		})

	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}

exports.resetPassword = async (req, res) => {
	try {
		const { password, confirmPassword, token } = req.body;
		if (!password || !confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "all fields required"
			})
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "password and confirm password doesnot matched"
			})
		}

		//user details using token
		const userDetails = await User.findOne({ token });

		if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: "invalid token"
			})
		}

		if (userDetails.resetPasswordToken < Date.now()) {
			return res.status(400).json({
				success: false,
				message: "token is expired"
			})
		}

		//hash password
		const hashPassword = await bcrypt.hash(password, 10);

		const updatedUser = await User.findOneAndUpdate({ token }, { password: hashPassword }, { new: true })

		res.status(200).json({
			success: true,
			message: 'password updated successfully',
			user: updatedUser
		})

	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}