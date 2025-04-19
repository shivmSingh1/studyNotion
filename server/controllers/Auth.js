const Otp = require("../models/OTP")
const User = require("../models/User")
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const Profile = require("../models/Profile")
const jwt = require("jsonwebtoken")

exports.sendOtp = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'email is required'
			})
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'user is already exist'
			})
		}

		//genrate opt

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false
		});

		let result = await Otp.findOne({ otp })

		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false
			});
			result = await Otp.findOne({ otp })
		}

		//entry save in db

		const otpBody = await Otp.create({ email, otp });

		res.status(200).json({
			success: true,
			data: otpBody,
			message: "otp sent successfully"
		})


	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
			message: 'something went wrong'
		})
	}
}

exports.signUp = async (req, res) => {
	try {
		const { firstname, lastname, email, contactNumber, password, confirmPassword, accountType, otp } = req.body;

		if (!firstname || !lastname || !email || !password || !confirmPassword || !otp) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'fill all fields before submitting'
			})
		}

		if (password !== confirmPassword) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'password and confirm password does not matched'
			})
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'user is already exist'
			})
		}

		// find recent otp

		const recentOTP = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)

		//validate otp
		if (recentOTP.length === 0) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'otp not found'
			})
		} else if (recentOTP !== otp) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'otp does not matched'
			})
		}

		//hashed password
		const hashPassword = await bcrypt.hash(password, 10);
		console.log("hash password is: ", hashPassword);

		//entry in db

		const profileDetails = await Profile.create({
			gender: null,
			dateOfBirth: null,
			about: null,
			contactNumber: null
		})

		const newUser = await User.create(
			{
				firstname,
				lastname,
				email,
				password: hashPassword,
				contactNumber,
				accountType,
				additionalDetails: profileDetails._id,
				image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`
			}
		)

		res.status(200).json({
			success: true,
			user: newUser,
			message: "user register successfully"
		})

	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
			message: 'something went wrong'
		})
	}
}

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'all fields required'
			})
		}

		const user = await User.findOne({ email })

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "user not found"
			})
		}

		if (await bcrypt.compare(password, user.password)) {

			const payload = {
				email: user.email,
				accountType: user.accountType,
				id: user._id
			}

			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: "2h"
			})

			user.token = token;
			user.password = undefined;

			const options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true
			}

			return res.cookie("token", token, options).status(200).json({
				success: true,
				user: user,
				message: "login successfull",
				token: token
			})

		} else {
			return res.status(500).json({
				success: false,
				error: error.message,
				message: 'wrong password'
			})
		}

	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
			message: 'something went wrong'
		})
	}
}

exports.changePassword = async (req, res) => {
	try {
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		if (!oldPassword || !newPassword || !confirmNewPassword) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'all fields required'
			})
		}

		if (newPassword !== confirmNewPassword) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: 'new password and confirm new password does not matched'
			})
		}



	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
			message: 'something went wrong'
		})
	}
}