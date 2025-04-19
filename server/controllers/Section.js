const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
	try {
		const { courseId, sectionName } = req.body;
		if (!sectionName) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: "section name is required"
			})
		}

		if (!courseId) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: "course id is missing"
			})
		}

		const sectionDetails = await Section.create({ sectionName })

		const updateCourse = await Course.findByIdAndUpdate({ _id: courseId },
			{
				$push: {
					CourseContent: sectionDetails._id
				}
			},
			{ new: true }
		)

		res.status(200).json({
			success: true,
			sectionDetails,
			message: "section created successfully"
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

exports.updateSection = async (req, res) => {
	try {
		const { name } = req.body;
		const { sectionId } = req.body;
		if (!sectionId) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: "section id is missing"
			})
		}
		if (!name) {
			return res.status(404).json({
				success: false,
				error: error.message,
				message: "section name is missing"
			})
		}

		const updateSection = await Section.findByIdAndUpdate({ _id: sectionId },
			{ sectionName: name }, { new: true }
		)

		res.stauts(200).json({
			success: true,
			updateSection,
			message: "section updated successfully"
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

exports.getAllSection = async (req, res) => {
	try {
		const { sectionId } = req.params;
		if (!sectionId) {
			return res.status(404).json({
				success: false,
				message: "section id is missing"
			})
		}
		const sectionDetails = await Section.findById({ _id: sectionId })
		if (!sectionDetails) {
			return res.status(404).json({
				success: false,
				message: "no section found"
			})
		}

		res.stauts(200).json({
			success: true,
			sectionDetails,
			message: "all section fetched successfully"
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

// revisit

exports.deleteSection = async (req, res) => {
	try {
		const { sectionId } = req.params;
		if (!sectionId) {
			return res.status(404).json({
				success: false,
				message: "section id is missing"
			})
		}

		const deletedSection = await Section.findByIdAndDelete({ _id: sectionId });

		// const updateCourse = await Course.findByIdAndUpdate

		res.stauts(200).json({
			success: true,
			deletedSection,
			messgae: "section deleted successfully"
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