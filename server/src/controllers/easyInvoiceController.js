"use strict";

import { StatusCodes } from "http-status-codes";
import * as easyInvoiceService from "../services/easyInvoiceService.js";
import BusinessOwner from "../models/BusinessOwner.js";
import ApiError from "../utils/ApiError.js";
import { getBusinessOwnerByUserId } from "../services/businessOwnerService.js";

/**
 * Create draft invoice (Tạo hóa đơn bản nháp)
 */
export const createDraftInvoiceController = async (req, res, next) => {
	try {
		const { xmlData, pattern, serial } = req.body;

		if (!xmlData) {
			throw new ApiError(StatusCodes.BAD_REQUEST, "XmlData is required");
		}

		// Get business owner to retrieve tax code
		const userId = req.user.userId;
		const businessOwner = await getBusinessOwnerByUserId(userId);
		if (!businessOwner) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Business owner profile not found" });
		}

		if (!businessOwner.taxCode) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Tax code not found for this business"
			);
		}

		const result = await easyInvoiceService.createDraftInvoice(
			xmlData,
			pattern,
			serial,
			businessOwner.taxCode
		);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "Draft invoice created successfully",
			data: {
				pattern: result.Data.Pattern,
				serial: result.Data.Serial,
				ikeys: result.Data.Ikeys,
				invoices: result.Data.Invoices,
			},
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Import invoice to EasyInvoice
 */
export const importInvoiceController = async (req, res, next) => {
	try {
		const { businessOwnerId, invoiceData } = req.body;

		// Get business owner to retrieve tax code
		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		if (!businessOwner.taxCode) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Tax code not found for this business"
			);
		}

		const result = await easyInvoiceService.importInvoice(
			invoiceData,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Invoice imported successfully",
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Get invoice by key
 */
export const getInvoiceByKeyController = async (req, res, next) => {
	try {
		const { businessOwnerId, invoiceKey } = req.query;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		const result = await easyInvoiceService.getInvoiceByKey(
			invoiceKey,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Get invoice list
 */
export const getInvoiceListController = async (req, res, next) => {
	try {
		const { businessOwnerId, fromDate, toDate, status } = req.query;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		const params = {
			fromDate,
			toDate,
			status,
		};

		const result = await easyInvoiceService.getInvoiceList(
			params,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Cancel invoice
 */
export const cancelInvoiceController = async (req, res, next) => {
	try {
		const { businessOwnerId, invoiceKey, reason } = req.body;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		if (!reason) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				"Cancellation reason is required"
			);
		}

		const result = await easyInvoiceService.cancelInvoice(
			invoiceKey,
			reason,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Invoice cancelled successfully",
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Replace invoice
 */
export const replaceInvoiceController = async (req, res, next) => {
	try {
		const { businessOwnerId, originalInvoiceKey, newInvoiceData } = req.body;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		const result = await easyInvoiceService.replaceInvoice(
			originalInvoiceKey,
			newInvoiceData,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Invoice replaced successfully",
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Adjust invoice
 */
export const adjustInvoiceController = async (req, res, next) => {
	try {
		const { businessOwnerId, originalInvoiceKey, adjustmentData } = req.body;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		const result = await easyInvoiceService.adjustInvoice(
			originalInvoiceKey,
			adjustmentData,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Invoice adjusted successfully",
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Get invoice PDF
 */
export const getInvoicePdfController = async (req, res, next) => {
	try {
		const { businessOwnerId, invoiceKey } = req.query;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		const result = await easyInvoiceService.getInvoicePdf(
			invoiceKey,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Sync invoice with tax authority
 */
export const syncInvoiceController = async (req, res, next) => {
	try {
		const { businessOwnerId, invoiceKey } = req.body;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		const result = await easyInvoiceService.syncInvoiceWithTax(
			invoiceKey,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Invoice synced successfully",
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};

/**
 * Check invoice status
 */
export const checkInvoiceStatusController = async (req, res, next) => {
	try {
		const { businessOwnerId, invoiceKey } = req.query;

		const businessOwner = await BusinessOwner.findById(businessOwnerId);
		if (!businessOwner) {
			throw new ApiError(StatusCodes.NOT_FOUND, "Business owner not found");
		}

		const result = await easyInvoiceService.checkInvoiceStatus(
			invoiceKey,
			businessOwner.taxCode
		);

		res.status(StatusCodes.OK).json({
			success: true,
			data: result.Data,
		});
	} catch (error) {
		next(error);
	}
};
