const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Categories");
const { uploadToCloudinary } = require("../utils/imageUploader");

exports.createCourse = async (req, res) => {
	try {
		const { courseName, courseDescription, price, whatYouWillLearn, category } = req.body;
		const thumbnail = req.files.thumbnail;

		if (!courseName || !courseDescription || !price || !whatYouWillLearn || !category || !thumbnail) {
			return res.status(404).json({
				success: false,
				message: "all fields required"
			})
		}

		const userId = req.user._id;

		const InstructorDetails = await User.findById({ userId });

		if (!InstructorDetails) {
			return res.status(404).json({
				success: false,
				message: "instructor details not found"
			})
		}

		const categoryDetails = await Category.findById({ category });

		if (!categoryDetails) {
			return res.status(404).json({
				success: false,
				message: "Category details not found"
			})
		}

		const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER);

		if (!thumbnailImage) {
			if (!tagDetails) {
				return res.status(404).json({
					success: false,
					message: "something went wrong while uploading thumbnail"
				})
			}
		}

		const newCourse = await Course.create({
			courseName,
			courseDescription,
			price,
			whatYouWillLearn,
			thumbnail: thumbnailImage.secure_url,
			Instructor: InstructorDetails._id,
			category: categoryDetails._id,
		})

		//add the new course to the user schema of instructor

		await User.findByIdAndUpdate({ _id: InstructorDetails._id },
			{
				$push: {
					courses: newCourse._id
				}
			},
			{ new: true }
		)

		await Category.findByIdAndUpdate({ category },
			{
				$push: {
					course: newCourse._id
				}
			}
		)

		res.status(200).json({
			success: true,
			data: newCourse,
			message: "course created successfully"
		})

	} catch (error) {
		console.log("error");
		res.status(500).json({
			success: false,
			error: error.message,
			message: "something went wrong"
		})
	}
}


exports.getAllCourses = async (req, res) => {
	try {
		const allCourses = await Course.find({});
		if (!allCourses) {
			return res.status(404).json({
				success: false,
				message: "can not find any course"
			})
		}
		res.status(404).json({
			success: true,
			message: "all courses fetched successfully",
			data: allCourses
		})
	} catch (error) {
		console.log("error");
		res.status(500).json({
			success: false,
			error: error.message,
			message: "something went wrong"
		})
	}
}

exports.getAllCourseDetails = async (req, res) => {
	try {
		const { courseId } = req.body;

		if (!courseId) {
			res.status(400).json({
				success: false,
				message: "Course id is missing"
			})
		}

		const courseDetails = await Course.findById({ _id: courseId }).populate(
			{
				path: "instructor",
				populate: {
					path: "additionalDetails"
				}
			}
		).populate("Category")
			.populate("RatingAndReviews")
			.populate(
				{
					path: "CourseContent",
					populate: {
						path: "subSection"
					}
				}
			).exec();

		if (!courseDetails) {
			return res.status(400).json({
				success: false,
				message: "course details not found using this id"
			})
		}

		res.status(200).json({
			success: true,
			message: "course details fetched successfully",
			data: courseDetails
		})

	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: error.message
		})
	}
}