import InvoicesIn from "../models/InvoicesIn.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const createInvoice = async (data) => {
	const existed = await InvoicesIn.findOne({
		ownerId: data.ownerId,
		mhdon: data.mhdon,
	});
	if (existed)
		throw new ApiError(
			StatusCodes.BAD_REQUEST,
			"Invoice code (mhdon) already exists for this business owner"
		);
	const invoice = new InvoicesIn(data);
	return await invoice.save();
};

const getInvoices = async (filter = {}) => {
	return await InvoicesIn.find(filter);
};

const getInvoiceById = async (id) => {
	return await InvoicesIn.findById(id);
};

const updateInvoice = async (id, data) => {
	return await InvoicesIn.findByIdAndUpdate(id, data, { new: true });
};

const deleteInvoice = async (id) => {
	return await InvoicesIn.findByIdAndDelete(id);
};

export default {
	createInvoice,
	getInvoices,
	getInvoiceById,
	updateInvoice,
	deleteInvoice,
};
