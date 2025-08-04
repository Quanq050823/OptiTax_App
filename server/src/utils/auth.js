const jwt = require("jsonwebtoken");

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

const sendTokenResponse = (user, statusCode, res) => {
	const token = generateToken(user._id);

	user.lastLogin = new Date();
	user.save({ validateBeforeSave: false });

	const options = {
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res
		.status(statusCode)
		.cookie("token", token, options)
		.json({
			success: true,
			message: "Authentication successful",
			token,
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
	generateToken,
	sendTokenResponse,
	asyncHandler,
};
