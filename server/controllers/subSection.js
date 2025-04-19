const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
	try {
		const { sectionId, timeDuration, title, description } = req.body;
		const { videoFile } = req.files.videoFile
		if (!videoFile, !sectionId, !timeDuration, !title, !description) {
			return res.status(404).json({
				success: false,
				message: "all fields required"
			})
		}

		const video = await uploadToCloudinary(videoFile, process.env.FOLDER)

		if (!video?.secure_url) {
			return res.status(404).json({
				success: false,
				message: "something went wrong while uploading video"
			})
		}

		const newSubSection = await SubSection.create({
			title,
			description,
			timeDuration,
			videoUrl: video.secure_url
		})

		const updateSection = await Section.findByIdAndUpdate({ _id: sectionId },
			{
				$push: {
					SubSection: newSubSection._id
				}
			}, { new: true }
		).populate("subSection").exec();

		res.status(200).json({
			success: true,
			updateSection,
			message: "sub section created successfully"
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


//visit again for video update
exports.updateSubSection = async (req, res) => {
	try {
		const { subSectionId, timeDuration, title, description } = req.body;
		const { videoFile } = req.files.videoFile
		if (!subSectionId, !videoFile, !timeDuration, !title, !description) {
			return res.status(404).json({
				success: false,
				message: "all fields required"
			})
		}

		const updatedSubSection = await SubSection.findByIdAndUpdate({ _id: subSectionId }, {
			videoFile,
			timeDuration,
			title,
			timeDuration
		}, { new: true });

		res.status(200).json({
			success: true,
			updatedSubSection,
			message: "subsection updated successfully"
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

//getAllSubSection

exports.getAllSubSection = async (req, res) => {
	try {

		const AllSubSections = await SubSection.find({});

		if (!AllSubSections) {
			return res.status(404).json({
				success: false,
				message: "not any sub section found"
			})
		}

		res.status(200).json({
			success: true,
			AllSubSections,
			message: "all subsection fetched successfully"
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

// /revisit

exports.deleteSubSection = async (req, res) => {
	try {

		const { subSectionId } = req.params;
		if (!subSectionId) {
			return res.status(404).json({
				success: false,
				message: "sub section id not found"
			})
		}

		const deletedSubSection = await SubSection.findByIdAndDeleted({ _id: subSectionId });
		// const updateSection= await Section.findByIdAndUpdate

		res.stauts(200).json({
			success: true,
			deletedSubSection,
			messgae: "sub section deleted successfully"
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