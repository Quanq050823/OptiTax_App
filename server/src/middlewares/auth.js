const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
	try {
		let token;

		// Check for token in Authorization header
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ")[1];
		}
		// Check for token in cookies
		else if (req.cookies.accessToken) {
			token = req.cookies.accessToken;
		}

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "Access token required",
				code: "NO_TOKEN",
			});
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			const user = await User.findById(decoded.id);

			if (!user) {
				return res.status(401).json({
					success: false,
					message: "User not found",
					code: "USER_NOT_FOUND",
				});
			}

			if (!user.isActive) {
				return res.status(401).json({
					success: false,
					message: "User account is deactivated",
					code: "ACCOUNT_DEACTIVATED",
				});
			}

			req.user = user;
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({
					success: false,
					message: "Access token expired",
					code: "TOKEN_EXPIRED",
				});
			}

			return res.status(401).json({
				success: false,
				message: "Invalid access token",
				code: "INVALID_TOKEN",
			});
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: `User role ${req.user.role} is not authorized to access this route`,
			});
		}
		next();
	};
};

module.exports = { auth, authorize };
