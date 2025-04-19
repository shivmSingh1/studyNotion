const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender");

// capture the payment and initiate the order
exports.capturePayment = async (req, res) => {
	try {
		const { courseId } = req.body;
		let userId = req.user.id;

		if (!courseId) {
			return res.status(404).json({
				status: false,
				error: error.message,
				message: "missing course id"
			})
		}

		const course = await Course.findById(courseId);

		if (!course) {
			return res.status(404).json({
				status: false,
				error: error.message,
				message: "no course found using this id"
			})
		}

		const uid = mongoose.Types.ObjectId(userId)

		if (course.studentEnrolled.include(uid)) {
			return res.status(200).json({
				success: false,
				message: "student is alredy enrolled"
			})
		}

		const amount = course.price * 100;
		const currency = "INR"

		const options = {
			amount,
			currency,
			recipt: Math.random(Date.now()).toString(),
			notes: {
				courseId: course._id,
				userId
			}
		}

		try {
			const paymentResponse = await instance.orders.create(options)
			console.log(paymentResponse)

			res.status(200).json({
				success: true,
				courseName: course.CourseName,
				courseDescription: course.CourseDescription,
				orderId: paymentResponse.id,
				thumbnail: course.thumbnail,
				currency: paymentResponse.currency,
				amount: paymentResponse.amount
			})
		} catch (error) {
			console.log(error.message)
			res.json({
				success: false,
				message: "could not initiate order"
			})
		}

	} catch (error) {
		console.log(error.message)
		res.stauts(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}


exports.verifySignature = async (req, res) => {
	try {
		const webHookeSecret = "123456";
		const signature = req.headers["x-razorpay-signature"];

		const shasum = Crypto.createHmac("sha256", webHookeSecret);
		shasum.update(JSON.stringify(req.body));
		const digest = shasum.digest("hex")

		if (signature === digest) {
			const { courseId, userId } = req.body.payload.payment.entity.notes;

			const enrolledCourse = await Course.findByIdAndUpdate(
				{ _id: courseId },
				{ $push: { studentEnrolled: userId } },
				{ new: truew }
			)

			if (!enrolledCourse) {
				return res.stauts(500).json({
					success: false,
					message: "Course not found"
				})
			}

			console.log(enrolledCourse)

			const enrolledStudent = await User.findByIdAndUpdate(
				{ _id: userId },
				{ $push: { Courses: courseId } },
				{ new: true }
			)

			console.log(enrolledStudent)

			//mailsend

			const mailResponse = await mailSender(
				enrolledStudent.email,
				"Congrats from studtNotion",
				"Congratulation you have enrolled in new course"
			)

			console.log(mailResponse)

			return res.status(200).json({
				success: true,
				message: "signature verifide and course added"
			})
		} else {
			return res.status(400).json({
				success: false,
				message: "Invalid response"
			})
		}
	} catch (error) {
		console.log(error.message)
		res.status(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}