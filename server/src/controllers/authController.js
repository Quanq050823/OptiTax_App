const User = require("../models/User");
const {
	sendTokenResponse,
	asyncHandler,
	verifyToken,
	generateAccessToken,
} = require("../utils/auth");

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

	sendTokenResponse(user, 201, res, req);
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

	sendTokenResponse(user, 200, res, req);
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
	// Safely get refresh token from cookies or body
	const refreshToken =
		(req.cookies && req.cookies.refreshToken) || req.body.refreshToken;

	// Always clear cookies regardless
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	// If refresh token exists and user is authenticated, remove it from database
	if (refreshToken && req.user) {
		try {
			const user = await User.findById(req.user.id);
			if (user && user.refreshTokens) {
				// Remove the specific refresh token
				user.refreshTokens = user.refreshTokens.filter(
					(tokenObj) => tokenObj.token !== refreshToken
				);
				await user.save({ validateBeforeSave: false });
			}
		} catch (error) {
			// Log error but don't fail the logout
			console.log("Error removing refresh token:", error.message);
		}
	}

	res.status(200).json({
		success: true,
		message: "User logged out successfully",
	});
});

const refreshToken = asyncHandler(async (req, res, next) => {
	const refreshToken =
		(req.cookies && req.cookies.refreshToken) || req.body.refreshToken;

	if (!refreshToken) {
		return res.status(401).json({
			success: false,
			message: "Refresh token not provided",
		});
	}

	const user = await User.findOne({
		"refreshTokens.token": refreshToken,
	});

	if (!user) {
		return res.status(401).json({
			success: false,
			message: "Invalid refresh token",
		});
	}

	const tokenObj = user.refreshTokens.find(
		(token) => token.token === refreshToken
	);
	if (
		!tokenObj ||
		new Date() >
			new Date(tokenObj.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
	) {
		// Remove expired token
		user.refreshTokens = user.refreshTokens.filter(
			(token) => token.token !== refreshToken
		);
		await user.save({ validateBeforeSave: false });

		return res.status(401).json({
			success: false,
			message: "Refresh token expired",
		});
	}

	const newAccessToken = generateAccessToken(user._id);

	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
	};

	res.status(200).cookie("accessToken", newAccessToken, cookieOptions).json({
		success: true,
		message: "Token refreshed successfully",
		accessToken: newAccessToken,
		expiresIn: "15m",
	});
});

const logoutAll = asyncHandler(async (req, res, next) => {
	// Clear cookies first
	res.clearCookie("accessToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	// Remove all refresh tokens from database
	if (req.user) {
		try {
			const user = await User.findById(req.user.id);
			if (user) {
				user.refreshTokens = [];
				await user.save({ validateBeforeSave: false });
			}
		} catch (error) {
			console.log("Error clearing refresh tokens:", error.message);
		}
	}

	res.status(200).json({
		success: true,
		message: "Logged out from all devices successfully",
	});
});

module.exports = {
	register,
	login,
	getMe,
	updateProfile,
	changePassword,
	logout,
	refreshToken,
	logoutAll,
};
