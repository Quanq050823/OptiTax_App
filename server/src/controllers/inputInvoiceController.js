"use strict";

import * as inputInvoiceService from "../services/inputInvoiceService.js";
import { StatusCodes } from "http-status-codes";

const getById = async (req, res, next) => {
	try {
		const id = req.params.id;
		const result = await inputInvoiceService.getInputInvoiceById(id);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const list = async (req, res, next) => {
	try {
		const { page, limit, sortBy, sortOrder, ...filter } = req.query;
		const options = {
			page: parseInt(page) || 1,
			limit: parseInt(limit) || 10,
			sortBy: sortBy || "createdAt",
			sortOrder: parseInt(sortOrder) || -1,
		};
		const result = await inputInvoiceService.listInputInvoices(filter, options);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const create = async (req, res, next) => {
	try {
		const invoiceData = req.body;
		const result = await inputInvoiceService.createInputInvoice(invoiceData);
		res.status(StatusCodes.CREATED).json(result);
	} catch (err) {
		next(err);
	}
};

export { getById, list, create };
