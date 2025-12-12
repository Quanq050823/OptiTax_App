"use strict";

import crypto from "crypto";

/**
 * Generate authentication token for EasyInvoice API (New version from 01/01/2026)
 * @param {string} httpMethod - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} username - EasyInvoice username
 * @param {string} password - EasyInvoice password
 * @param {string} taxCode - Company tax code (MST)
 * @returns {string} Authentication token in format: signature:nonce:timestamp:username:password:taxCode
 */
export const generateAuthToken = (httpMethod, username, password, taxCode) => {
	// Get timestamp in seconds since epoch (UTC)
	const epochStart = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));
	const now = new Date();
	const timestamp = Math.floor((now - epochStart) / 1000).toString();

	// Generate random nonce (alphanumeric only)
	const nonce = crypto.randomBytes(16).toString("hex").toLowerCase();

	// Create signature raw data: HTTPMethod + timestamp + nonce
	const signatureRawData = `${httpMethod.toUpperCase()}${timestamp}${nonce}`;

	// Calculate MD5 hash and convert to base64
	const md5Hash = crypto
		.createHash("md5")
		.update(signatureRawData, "utf8")
		.digest();
	const signature = Buffer.from(md5Hash).toString("base64");

	// Return authentication token
	return `${signature}:${nonce}:${timestamp}:${username}:${password}:${taxCode}`;
};

/**
 * Generate authentication token (Old version before 01/01/2026)
 * @param {string} httpMethod - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} username - EasyInvoice username
 * @param {string} password - EasyInvoice password
 * @returns {string} Authentication token in format: signature:nonce:timestamp:username:password
 */
export const generateAuthTokenOld = (httpMethod, username, password) => {
	const epochStart = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, 0));
	const now = new Date();
	const timestamp = Math.floor((now - epochStart) / 1000).toString();

	const nonce = crypto.randomBytes(16).toString("hex").toLowerCase();

	const signatureRawData = `${httpMethod.toUpperCase()}${timestamp}${nonce}`;

	const md5Hash = crypto
		.createHash("md5")
		.update(signatureRawData, "utf8")
		.digest();
	const signature = Buffer.from(md5Hash).toString("base64");

	return `${signature}:${nonce}:${timestamp}:${username}:${password}`;
};

/**
 * Get authentication headers for EasyInvoice API request
 * @param {string} httpMethod - HTTP method
 * @param {string} username - EasyInvoice username
 * @param {string} password - EasyInvoice password
 * @param {string} taxCode - Company tax code
 * @returns {Object} Headers object with Authentication header
 */
export const getAuthHeaders = (httpMethod, username, password, taxCode) => {
	const authToken = generateAuthToken(httpMethod, username, password, taxCode);
	return {
		Authentication: authToken,
		"Content-Type": "application/json",
	};
};
