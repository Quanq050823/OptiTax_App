"use strict";

import OutputInvoice from "../models/OutputInvoice.js";
import BusinessOwner from "../models/BusinessOwner.js";
import StorageItem from "../models/StorageItem.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const generateInvoiceNumber = async (businessOwnerId) => {
	const currentYear = new Date().getFullYear();
	const yearSuffix = currentYear.toString().slice(-2); // Lấy 2 số cuối năm
	// Đếm số hóa đơn đã tạo trong năm
	const startOfYear = new Date(currentYear, 0, 1);
	const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

	const count = await OutputInvoice.countDocuments({
		businessOwnerId,
		createdAt: { $gte: startOfYear, $lte: endOfYear },
	});

	const nextNumber = (count + 1).toString().padStart(7, "0");

	return {
		khmshdon: `1C${yearSuffix}TAA`,
		khhdon: `AA/${yearSuffix}E`,
		shdon: nextNumber,
		mhdon: `01GTKT0/${nextNumber}`,
	};
};

const createOutputInvoice = async (data, userId) => {
	const owner = await BusinessOwner.findOne({ userId });
	if (!owner) {
		throw new ApiError(StatusCodes.NOT_FOUND, "BusinessOwner not found");
	}
	const invoiceCodes = await generateInvoiceNumber(owner._id);

	const existed = await OutputInvoice.findOne({
		businessOwnerId: owner._id,
		mhdon: invoiceCodes.mhdon,
	});
	if (existed)
		throw new ApiError(
			StatusCodes.BAD_REQUEST,
			"Invoice code (mhdon) already exists for this business owner"
		);

	const fullAddress = `${owner.address.street}, ${owner.address.ward}, ${owner.address.district}, ${owner.address.city}`;
	if (data.hdhhdvu && Array.isArray(data.hdhhdvu)) {
		data.hdhhdvu = data.hdhhdvu.map((item) => {
			const thtien = parseFloat(item.thtien) || 0;
			const tchat = parseInt(item.tchat);

			let gtgt = 0;
			let tncn = 0;

			if (tchat === 1) {
				gtgt = thtien * 0.01;
				tncn = thtien * 0.005;
			} else if (tchat === 2) {
				gtgt = thtien * 0.05;
				tncn = thtien * 0.02;
			}

			return {
				...item,
				gtgt: Math.round(gtgt),
				tncn: Math.round(tncn),
			};
		});

		for (const item of data.hdhhdvu) {
			if (item.ten) {
				const storageItem = await StorageItem.findOne({
					name: item.ten,
					businessOwnerId: owner._id,
				});

				if (storageItem) {
					const quantityToDeduct = parseFloat(item.sluong) || 0;

					if (storageItem.stock < quantityToDeduct) {
						throw new ApiError(
							StatusCodes.BAD_REQUEST,
							`Không đủ số lượng tồn kho cho sản phẩm "${storageItem.name}". Tồn kho: ${storageItem.stock}`
						);
					}

					storageItem.stock -= quantityToDeduct;
					await storageItem.save();

					console.log(
						`Đã khấu trừ ${quantityToDeduct} ${storageItem.unit} từ kho cho sản phẩm "${storageItem.name}". Tồn kho còn: ${storageItem.stock}`
					);
				} else {
					console.warn(
						`Không tìm thấy sản phẩm trong kho với tên: ${item.ten}`
					);
				}
			}
		}
	}

	const invoiceData = {
		...data,
		businessOwnerId: owner._id,
		nbmst: owner.taxCode,
		nbten: owner.businessName,
		nbdchi: fullAddress,
		...invoiceCodes,
		ncnhat: new Date(),
	};

	const invoice = new OutputInvoice(invoiceData);
	return await invoice.save();
};

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

const updateOutputInvoice = async (id, data) => {
	const invoice = await OutputInvoice.findByIdAndUpdate(id, data, {
		new: true,
	});
	if (!invoice)
		throw new ApiError(StatusCodes.NOT_FOUND, "Output invoice not found");
	return invoice;
};

const deleteOutputInvoice = async (id) => {
	const invoice = await OutputInvoice.findByIdAndDelete(id);
	if (!invoice)
		throw new ApiError(StatusCodes.NOT_FOUND, "Output invoice not found");
	return invoice;
};

export {
	createOutputInvoice,
	getOutputInvoiceById,
	listOutputInvoices,
	updateOutputInvoice,
	deleteOutputInvoice,
};
