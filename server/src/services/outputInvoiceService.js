"use strict";

import OutputInvoice from "../models/OutputInvoice.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const getOutputInvoiceById = async (id) => {
	const invoice = await OutputInvoice.findById(id);
	if (!invoice)
		throw new ApiError(StatusCodes.NOT_FOUND, "Output invoice not found");
	return invoice;
};

const listOutputInvoices = async (filter = {}, options = {}) => {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = -1,
	} = options;
	const skip = (page - 1) * limit;
	const query = OutputInvoice.find(filter)
		.sort({ [sortBy]: sortOrder })
		.skip(skip)
		.limit(limit);
	const [results, total] = await Promise.all([
		query.exec(),
		OutputInvoice.countDocuments(filter),
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

export { getOutputInvoiceById, listOutputInvoices };
