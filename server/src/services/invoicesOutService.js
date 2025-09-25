import InvoicesOut from "../models/InvoicesOut.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const createInvoice = async (data) => {
	const existed = await InvoicesOut.findOne({
		ownerId: data.ownerId,
		mhdon: data.mhdon,
	});
	if (existed)
		throw new ApiError(
			StatusCodes.BAD_REQUEST,
			"Invoice code (mhdon) already exists for this business owner"
		);
	const invoice = new InvoicesOut(data);
	return await invoice.save();
};

const getInvoices = async (filter = {}) => {
	return await InvoicesOut.find(filter);
};

const getInvoiceById = async (id) => {
	return await InvoicesOut.findById(id);
};

const updateInvoice = async (id, data) => {
	return await InvoicesOut.findByIdAndUpdate(id, data, { new: true });
};

const deleteInvoice = async (id) => {
	return await InvoicesOut.findByIdAndDelete(id);
};

export default {
	createInvoice,
	getInvoices,
	getInvoiceById,
	updateInvoice,
	deleteInvoice,
};
