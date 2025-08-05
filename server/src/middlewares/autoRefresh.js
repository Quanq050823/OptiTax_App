const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateAccessToken } = require("../utils/auth");

const autoRefresh = async (req, res, next) => {
	try {
		let accessToken;
		let refreshToken;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			accessToken = req.headers.authorization.split(" ")[1];
		} else if (req.cookies.accessToken) {
			accessToken = req.cookies.accessToken;
		}

		refreshToken = req.cookies.refreshToken || req.body.refreshToken;

		if (!accessToken) {
			return next();
		}

		try {
			jwt.verify(accessToken, process.env.JWT_SECRET);
			return next();
		} catch (error) {
			if (error.name === "TokenExpiredError" && refreshToken) {
				try {
					const user = await User.findOne({
						"refreshTokens.token": refreshToken,
					});

					if (!user) {
						return next();
					}

					const tokenObj = user.refreshTokens.find(
						(token) => token.token === refreshToken
					);
					if (
						!tokenObj ||
						new Date() >
							new Date(tokenObj.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)
					) {
						user.refreshTokens = user.refreshTokens.filter(
							(token) => token.token !== refreshToken
						);
						await user.save({ validateBeforeSave: false });
						return next();
					}

					const newAccessToken = generateAccessToken(user._id);

					const cookieOptions = {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "strict",
						expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
					};

					res.cookie("accessToken", newAccessToken, cookieOptions);

					req.headers.authorization = `Bearer ${newAccessToken}`;
					req.cookies.accessToken = newAccessToken;

					req.tokenRefreshed = true;
					req.newAccessToken = newAccessToken;

					return next();
				} catch (refreshError) {
					console.error("Auto refresh error:", refreshError);
					return next();
				}
			} else {
				return next();
			}
		}
	} catch (error) {
		console.error("Auto refresh middleware error:", error);
		return next();
	}
};

module.exports = { autoRefresh };
