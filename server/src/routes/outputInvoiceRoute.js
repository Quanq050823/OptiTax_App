"use strict";

import express from "express";
import * as outputInvoiceController from "../controllers/outputInvoiceController.js";
import authorization from "../middlewares/authorizationMiddleware.js";
import authenticate from "../middlewares/jwtMiddlewares.js";

const router = express.Router();

router.get(
	"/",
	authenticate,
	authorization(["user", "admin"]),
	outputInvoiceController.list
);

router.get(
	"/:id",
	authenticate,
	authorization(["user", "admin"]),
	outputInvoiceController.getById
);

export default router;
