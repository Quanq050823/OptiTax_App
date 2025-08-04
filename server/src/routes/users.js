const express = require("express");
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
	toggleUserStatus,
} = require("../controllers/userController");
const { auth, authorize } = require("../middlewares/auth");
const { validate, registerSchema } = require("../middlewares/validation");

const router = express.Router();

router.use(auth);
router.use(authorize("admin"));

router.route("/").get(getUsers).post(validate(registerSchema), createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.put("/:id/toggle-status", toggleUserStatus);

module.exports = router;
