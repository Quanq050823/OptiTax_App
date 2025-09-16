"use strict";

import InputInvoice from "../models/InputInvoice.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const getInputInvoiceById = async (id) => {
	const invoice = await InputInvoice.findById(id);
	if (!invoice)
		throw new ApiError(StatusCodes.NOT_FOUND, "Input invoice not found");
	return invoice;
};

const listInputInvoices = async (filter = {}, options = {}) => {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = -1,
	} = options;
	const skip = (page - 1) * limit;
	const query = InputInvoice.find(filter)
		.sort({ [sortBy]: sortOrder })
		.skip(skip)
		.limit(limit);
	const [results, total] = await Promise.all([
		query.exec(),
		InputInvoice.countDocuments(filter),
	]);
	return {
		data: results,
		pagination: {
			page,
			limit,
			total,
			pages: Math.ceil(total / limit),
		},
	};
};

const createInputInvoice = async (invoiceData) => {
	const invoice = new InputInvoice(invoiceData);
	await invoice.save();
	return invoice;
};

export { getInputInvoiceById, listInputInvoices, createInputInvoice };
