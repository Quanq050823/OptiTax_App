import express from "express";
import {
	getCaptchaImage,
	loginWithCredentials,
} from "../controllers/invoiceSyncController.js";

const router = express.Router();

router.post("/captcha", getCaptchaImage);

router.post("/login", loginWithCredentials);

export default router;
