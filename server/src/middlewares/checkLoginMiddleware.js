import config from "../config/environment.js";

const checkLogin = () => {
	return async (req, res, next) => {
		try {
			if (req?.cookies?.accessToken || req?.cookies?.refreshToken) {
				console.log(req?.cookies);
				return res.redirect(`${config.feRedirectUri}`);
			}
			next();
		} catch (err) {
			next(err);
		}
	};
};

export default checkLogin;
