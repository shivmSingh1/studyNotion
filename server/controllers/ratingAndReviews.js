const Course = require("../models/Course")
const RatingAndReview = require("../models/RatingAndReviews")

exports.createRating = async (req, res) => {
	try {
		//userid
		const userId = req.user.id;
		//reqbody
		const { review, rating, courseId } = req.body;
		//fetch course and user enroll or not
		const courseDetails = await Course.findOne(
			{
				_id: courseId,
				studentEnrolled: { $elemMatch: { $eq: userId } }
			}
		)

		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: "user is not enrolled in the course"
			})
		}

		//check if user already rated the course
		const alreadyRated = await RatingAndReview.findOne(
			{ user: userId, course: courseId }
		)

		if (alreadyRated) {
			return res.status(404).json({
				success: false,
				message: "user is already rated the course"
			})
		} else {
			const ratingReview = await RatingAndReview.create({
				user: userId,
				course: courseId,
				review: ratingReview
			})

			if (ratingReview) {
				await Course.findByIdAndUpdate(
					{ _id: courseId },
					{ $push: { RatingAndReviews: ratingReview._id } },
					{ new: true }
				)
				return res.status(200).json({
					success: true,
					message: "user rated the course",
					data: ratingReview
				})
			} else {
				return res.status(404).json({
					success: false,
					message: "something went wrong while create the rating and review"
				})
			}
		}

		//push in course
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: 'something went wrong'
		})
	}
}



//average rating

const getAverageRating = async (req, res) => {
	try {
		const courseId = req.body.courseId;

	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: 'something went wrong'
		})
	}
}