"use strict";

import axios from "axios";
import config from "../config/environment.js";
import { getAuthHeaders } from "../utils/easyInvoiceAuth.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

/**
 * EasyInvoice API Service
 * Handles all communication with EasyInvoice API
 */

/**
 * Make API request to EasyInvoice
 * @param {string} endpoint - API endpoint (e.g., "api/publish/importInvoice")
 * @param {Object} data - Request payload
 * @param {string} taxCode - Company tax code
 * @param {string} method - HTTP method (default: POST)
 * @returns {Promise<Object>} API response
 */
const makeApiRequest = async (endpoint, data, taxCode, method = "POST") => {
	try {
		const url = `${config.easyInvoice.apiUrl}/${endpoint}`;
		const headers = getAuthHeaders(
			method,
			config.easyInvoice.username,
			config.easyInvoice.password,
			taxCode
		);

		const response = await axios({
			method: method,
			url: url,
			headers: headers,
			data: data,
		});

		// Check response status
		if (response.data.Status !== 2) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				response.data.Message || "EasyInvoice API error",
				{
					errorCode: response.data.ErrorCode,
					details: response.data.Data,
				}
			);
		}

		return response.data;
	} catch (error) {
		if (error.response) {
			// API returned error response
			throw new ApiError(
				error.response.status,
				error.response.data?.Message || "EasyInvoice API error",
				{
					errorCode: error.response.data?.ErrorCode,
					details: error.response.data?.Data,
				}
			);
		}
		throw error;
	}
};

/**
 * Create draft invoice (Tạo hóa đơn bản nháp, chưa ký số, chưa có số hóa đơn)
 * @param {string} xmlData - XML string of invoice data
 * @param {string} pattern - Invoice pattern (Ký hiệu hóa đơn) - optional if using multiple patterns
 * @param {string} serial - Invoice serial (Ký hiệu mẫu số hóa đơn) - optional if using multiple patterns
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Created invoice result with Ikeys and invoice details
 */
export const createDraftInvoice = async (xmlData, pattern, serial, taxCode) => {
	const requestData = {
		XmlData: xmlData,
	};

	if (pattern) requestData.Pattern = pattern;
	if (serial) requestData.Serial = serial;

	return await makeApiRequest(
		"api/publish/importInvoice",
		requestData,
		taxCode,
		"POST"
	);
};

/**
 * Import invoice to EasyInvoice (alias for createDraftInvoice)
 * @param {Object} invoiceData - Invoice data with XmlData, Pattern, Serial
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Import result
 */
export const importInvoice = async (invoiceData, taxCode) => {
	return await makeApiRequest(
		"api/publish/importInvoice",
		invoiceData,
		taxCode,
		"POST"
	);
};

/**
 * Get invoice by key
 * @param {string} invoiceKey - Invoice key (ikey)
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Invoice details
 */
export const getInvoiceByKey = async (invoiceKey, taxCode) => {
	return await makeApiRequest(
		"api/publish/getInvoiceByKey",
		{ ikey: invoiceKey },
		taxCode,
		"POST"
	);
};

/**
 * Get invoice list
 * @param {Object} params - Query parameters (from date, to date, etc.)
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} List of invoices
 */
export const getInvoiceList = async (params, taxCode) => {
	return await makeApiRequest(
		"api/publish/getInvoiceList",
		params,
		taxCode,
		"POST"
	);
};

/**
 * Cancel invoice
 * @param {string} invoiceKey - Invoice key to cancel
 * @param {string} reason - Cancellation reason
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelInvoice = async (invoiceKey, reason, taxCode) => {
	return await makeApiRequest(
		"api/publish/cancelInvoice",
		{ ikey: invoiceKey, reason: reason },
		taxCode,
		"POST"
	);
};

/**
 * Replace invoice
 * @param {string} originalInvoiceKey - Original invoice key
 * @param {Object} newInvoiceData - New invoice data
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Replace result
 */
export const replaceInvoice = async (
	originalInvoiceKey,
	newInvoiceData,
	taxCode
) => {
	return await makeApiRequest(
		"api/publish/replaceInvoice",
		{ originalIkey: originalInvoiceKey, ...newInvoiceData },
		taxCode,
		"POST"
	);
};

/**
 * Adjust invoice
 * @param {string} originalInvoiceKey - Original invoice key
 * @param {Object} adjustmentData - Adjustment data
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Adjustment result
 */
export const adjustInvoice = async (
	originalInvoiceKey,
	adjustmentData,
	taxCode
) => {
	return await makeApiRequest(
		"api/publish/adjustInvoice",
		{ originalIkey: originalInvoiceKey, ...adjustmentData },
		taxCode,
		"POST"
	);
};

/**
 * Get invoice PDF
 * @param {string} invoiceKey - Invoice key
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} PDF data
 */
export const getInvoicePdf = async (invoiceKey, taxCode) => {
	return await makeApiRequest(
		"api/publish/getInvoicePdf",
		{ ikey: invoiceKey },
		taxCode,
		"POST"
	);
};

/**
 * Sync invoice with tax authority
 * @param {string} invoiceKey - Invoice key
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Sync result
 */
export const syncInvoiceWithTax = async (invoiceKey, taxCode) => {
	return await makeApiRequest(
		"api/publish/syncInvoice",
		{ ikey: invoiceKey },
		taxCode,
		"POST"
	);
};

/**
 * Check invoice status
 * @param {string} invoiceKey - Invoice key
 * @param {string} taxCode - Company tax code
 * @returns {Promise<Object>} Invoice status
 */
export const checkInvoiceStatus = async (invoiceKey, taxCode) => {
	return await makeApiRequest(
		"api/publish/checkInvoiceStatus",
		{ ikey: invoiceKey },
		taxCode,
		"POST"
	);
};
