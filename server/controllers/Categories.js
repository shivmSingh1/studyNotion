const Category = require("../models/Categories");

exports.createCategroies
	= async (req, res) => {
		try {
			const { name, description } = req.body;
			if (!name || !description) {
				return res.status(404).json({
					success: false,
					message: "all fields required"
				})
			}
			const CategoryDetails = await Category.create({ name, description });
			res.status(200).json({
				success: true,
				tag: CategoryDetails,
				message: "Categories created successfully"
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

exports.getAllCategroies
	= async (req, res) => {
		try {
			const AllCategory = await Category.find({}, { name: true, description: true })
			res.status(200).json({
				success: true,
				data: AllCategory,
				message: "all categories fetched successfully"
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