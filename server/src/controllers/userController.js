const User = require("../models/User");
const { asyncHandler } = require("../utils/auth");

const getUsers = asyncHandler(async (req, res, next) => {
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const startIndex = (page - 1) * limit;

	let query = {};
	if (req.query.search) {
		query = {
			$or: [
				{ username: { $regex: req.query.search, $options: "i" } },
				{ email: { $regex: req.query.search, $options: "i" } },
				{ firstName: { $regex: req.query.search, $options: "i" } },
				{ lastName: { $regex: req.query.search, $options: "i" } },
			],
		};
	}
	if (req.query.role) {
		query.role = req.query.role;
	}
	if (req.query.isActive !== undefined) {
		query.isActive = req.query.isActive === "true";
	}

	const total = await User.countDocuments(query);
	const users = await User.find(query)
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(startIndex);
	const pagination = {};

	if (startIndex + limit < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	res.status(200).json({
		success: true,
		count: users.length,
		total,
		pagination,
		data: {
			users,
		},
	});
});
const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	res.status(200).json({
		success: true,
		data: {
			user,
		},
	});
});
const createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(201).json({
		success: true,
		message: "User created successfully",
		data: {
			user,
		},
	});
});
const updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	res.status(200).json({
		success: true,
		message: "User updated successfully",
		data: {
			user,
		},
	});
});
const deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	await user.deleteOne();

	res.status(200).json({
		success: true,
		message: "User deleted successfully",
	});
});

const toggleUserStatus = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	user.isActive = !user.isActive;
	await user.save();

	res.status(200).json({
		success: true,
		message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
		data: {
			user,
		},
	});
});

module.exports = {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
	toggleUserStatus,
};
