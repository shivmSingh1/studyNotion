const jwt = require("jsonwebtoken")

exports.auth = async (req, res, next) => {
	try {
		const token = req.body || req.cookie || req.header("Authorization").replace("Bearer ", "");

		if (!token) {
			return res.status(404).json({
				success: false,
				message: "token is missing"
			})
		}

		try {
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			req.user = decode;
		} catch (error) {
			res.status(404).json({
				success: false,
				message: "something went wrong while verfying the token"
			})
		}

		next()

	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}

//isStudent

exports.isStudent = async (req, res, next) => {
	try {
		if (req.user.accountType !== "Student") {
			res.status(404).json({
				success: false,
				message: "this is protected route for student"
			})
		}
		next();
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}

//isInstructor

exports.isInstructor = async (req, res, next) => {
	try {
		if (req.user.accountType !== "Instructor") {
			res.status(404).json({
				success: false,
				message: "this is protected route for instructor"
			})
		}
		next();
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}

//isAdmin

exports.isAdmin = async (req, res, next) => {
	try {
		if (req.user.accountType !== "Admin") {
			res.status(404).json({
				success: false,
				message: "this is protected route for Admin"
			})
		}
		next();
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: "something went wrong"
		})
	}
}