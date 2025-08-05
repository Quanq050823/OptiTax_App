const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate access token (short-lived)
const generateAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE || "15m",
	});
};

// Generate refresh token (long-lived)
const generateRefreshToken = () => {
	return crypto.randomBytes(40).toString("hex");
};

// Verify JWT token
const verifyToken = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET);
};

const sendTokenResponse = async (user, statusCode, res, req) => {
	const accessToken = generateAccessToken(user._id);
	const refreshToken = generateRefreshToken();

	// Get device info and IP address
	const deviceInfo = req.get("User-Agent") || "Unknown Device";
	const ipAddress = req.ip || req.connection.remoteAddress || "Unknown IP";

	// Remove old refresh tokens for the same device (optional: limit to 5 tokens per user)
	user.refreshTokens = user.refreshTokens.filter(
		(tokenObj) => tokenObj.deviceInfo !== deviceInfo
	);

	// Add new refresh token
	user.refreshTokens.push({
		token: refreshToken,
		deviceInfo,
		ipAddress,
		createdAt: new Date(),
	});

	// Keep only last 5 refresh tokens
	if (user.refreshTokens.length > 5) {
		user.refreshTokens = user.refreshTokens.slice(-5);
	}

	user.lastLogin = new Date();
	await user.save({ validateBeforeSave: false });

	const cookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	};

	// Set access token cookie (15 minutes)
	const accessTokenOptions = {
		...cookieOptions,
		expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
	};

	// Set refresh token cookie (7 days)
	const refreshTokenOptions = {
		...cookieOptions,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
	};

	res
		.status(statusCode)
		.cookie("accessToken", accessToken, accessTokenOptions)
		.cookie("refreshToken", refreshToken, refreshTokenOptions)
		.json({
			success: true,
			message: "Authentication successful",
			accessToken,
			refreshToken,
			expiresIn: "15m",
			data: {
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					fullName: user.fullName,
					phone: user.phone,
					role: user.role,
					lastLogin: user.lastLogin,
				},
			},
		});
};

const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	verifyToken,
	sendTokenResponse,
	asyncHandler,
};
