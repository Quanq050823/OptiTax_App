const User = require("../models/User");
const { sendTokenResponse, asyncHandler } = require("../utils/auth");

const register = asyncHandler(async (req, res, next) => {
	const { username, email, password, firstName, lastName, phone } = req.body;
	const user = await User.create({
		username,
		email,
		password,
		firstName,
		lastName,
		phone,
	});

	sendTokenResponse(user, 201, res);
});
const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return res.status(401).json({
			success: false,
			message: "Invalid credentials",
		});
	}
	const isMatch = await user.comparePassword(password);

	if (!isMatch) {
		return res.status(401).json({
			success: false,
			message: "Invalid credentials",
		});
	}
	if (!user.isActive) {
		return res.status(401).json({
			success: false,
			message: "Account is deactivated",
		});
	}

	sendTokenResponse(user, 200, res);
});
const getMe = asyncHandler(async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: {
			user: req.user,
		},
	});
});
const updateProfile = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		phone: req.body.phone,
	};
	Object.keys(fieldsToUpdate).forEach(
		(key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
	);

	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		message: "Profile updated successfully",
		data: {
			user,
		},
	});
});
const changePassword = asyncHandler(async (req, res, next) => {
	const { currentPassword, newPassword } = req.body;
	const user = await User.findById(req.user.id).select("+password");
	const isMatch = await user.comparePassword(currentPassword);

	if (!isMatch) {
		return res.status(400).json({
			success: false,
			message: "Current password is incorrect",
		});
	}
	user.password = newPassword;
	await user.save();

	res.status(200).json({
		success: true,
		message: "Password changed successfully",
	});
});
const logout = asyncHandler(async (req, res, next) => {
	res.cookie("token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		message: "User logged out successfully",
	});
});

module.exports = {
	register,
	login,
	getMe,
	updateProfile,
	changePassword,
	logout,
};
