const express = require("express");
const {
	register,
	login,
	getMe,
	updateProfile,
	changePassword,
	logout,
	refreshToken,
	logoutAll,
} = require("../controllers/authController");
const { auth } = require("../middlewares/auth");
const {
	validate,
	registerSchema,
	loginSchema,
	updateProfileSchema,
	changePasswordSchema,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", auth, getMe);
router.put("/me", auth, validate(updateProfileSchema), updateProfile);
router.put(
	"/change-password",
	auth,
	validate(changePasswordSchema),
	changePassword
);
router.post("/logout", auth, logout);
router.post("/logout-all", auth, logoutAll);
router.post("/refresh", refreshToken);

module.exports = router;
