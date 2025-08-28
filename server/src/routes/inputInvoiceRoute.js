"use strict";

import express from "express";
import * as inputInvoiceController from "../controllers/InputInvoiceController.js";
import authorization from "../middlewares/authorizationMiddleware.js";
import authenticate from "../middlewares/jwtMiddlewares.js";

const router = express.Router();

router.get(
	"/",
	authenticate,
	authorization(["user", "admin"]),
	inputInvoiceController.list
);

router.get(
	"/:id",
	authenticate,
	authorization(["user", "admin"]),
	inputInvoiceController.getById
);

export default router;
