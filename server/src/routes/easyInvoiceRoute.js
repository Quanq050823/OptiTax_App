"use strict";

import express from "express";
import * as easyInvoiceController from "../controllers/easyInvoiceController.js";
import authenticate from "../middlewares/jwtMiddlewares.js";
import authorization from "../middlewares/authorizationMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/easyinvoice/draft
 * @desc Create draft invoice (Tạo hóa đơn bản nháp, chưa ký số)
 * @access Private
 */
router.post(
	"/draft",
	authenticate,
	authorization(["user", "admin"]),
	easyInvoiceController.createDraftInvoiceController
);

/**
 * @route POST /api/easyinvoice/import
 * @desc Import invoice to EasyInvoice
 * @access Private
 */
router.post(
	"/import",
	authenticate,
	easyInvoiceController.importInvoiceController
);

/**
 * @route GET /api/easyinvoice/invoice/:invoiceKey
 * @desc Get invoice by key
 * @access Private
 */
router.get(
	"/invoice",
	authenticate,
	easyInvoiceController.getInvoiceByKeyController
);

/**
 * @route GET /api/easyinvoice/invoices
 * @desc Get invoice list
 * @access Private
 */
router.get(
	"/invoices",
	authenticate,
	easyInvoiceController.getInvoiceListController
);

/**
 * @route POST /api/easyinvoice/cancel
 * @desc Cancel invoice
 * @access Private
 */
router.post(
	"/cancel",
	authenticate,
	easyInvoiceController.cancelInvoiceController
);

/**
 * @route POST /api/easyinvoice/replace
 * @desc Replace invoice
 * @access Private
 */
router.post(
	"/replace",
	authenticate,
	easyInvoiceController.replaceInvoiceController
);

/**
 * @route POST /api/easyinvoice/adjust
 * @desc Adjust invoice
 * @access Private
 */
router.post(
	"/adjust",
	authenticate,
	easyInvoiceController.adjustInvoiceController
);

/**
 * @route GET /api/easyinvoice/pdf
 * @desc Get invoice PDF
 * @access Private
 */
router.get("/pdf", authenticate, easyInvoiceController.getInvoicePdfController);

/**
 * @route POST /api/easyinvoice/sync
 * @desc Sync invoice with tax authority
 * @access Private
 */
router.post("/sync", authenticate, easyInvoiceController.syncInvoiceController);

/**
 * @route GET /api/easyinvoice/status
 * @desc Check invoice status
 * @access Private
 */
router.get(
	"/status",
	authenticate,
	easyInvoiceController.checkInvoiceStatusController
);

export default router;
