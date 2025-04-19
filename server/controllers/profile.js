const User = require("../models/User");
const Profile = require("../models/Profile");

exports.updateProfile = async (req, res) => {
	try {
		const { userId } = req.user.id;
		const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
		if (!contactNumber, !gender, !userId) {
			return res.status(404).json({
				success: false,
				message: "all fields required"
			})
		}
		const userDetails = await User.findById({ _id: userId });
		const profileId = userDetails.additionalDetails;
		const profileDetails = await Profile.findById({ _id: profileId });
		profileDetails.dateOfBirth = dateOfBirth;
		profileDetails.gender = gender;
		profileDetails.about = about;
		profileDetails.ContactNumber = contactNumber;

		await profileDetails.save();

		res.stauts(200).json({
			success: true,
			message: "profile details updated successfully",
			profileDetails
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
			message: "something went wrong"
		})
	}
}

//delete Account
//revisit for unenroll student from all enroll courses
exports.deleteAccount = async (req, res) => {
	try {
		const userId = req.user.id;
		const userDetails = await User.findById({ _id: userId });

		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "user not found"
			})
		}

		const deletedProfile = await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

		const deletedUser = await User.findByIdAndDelete({ _id: userId });

		res.status(200).json({
			success: true,
			deletedUser,
			message: "user deleted successfully"
		})

	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
			message: "something went wrong"
		})
	}
}

exports.getAllUserDetails = async (req, res) => {
	try {
		const { userId } = req.user.id;
		if (!userId) {
			return res.status(404).json({
				success: false,
				message: "user id not found"
			})
		}

		const allUsers = await User.find({}).populate('additionalDetails').exec();

		if (!allUsers) {
			return res.status(404).json({
				success: false,
				message: "no any user found"
			})
		}

		res.status(200).json({
			success: true,
			allUsers,
			message: "all users fetched successfully"
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			error: error.message,
			message: "something went wrong"
		})
	}
}