"use strict";

import StorageItem from "../models/StorageItem.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const createStorageItem = async (data, businessOwnerId) => {
	const item = new StorageItem({ ...data, businessOwnerId });
	await item.save();
	return item;
};

const getStorageItemById = async (id, businessOwnerId) => {
	const item = await StorageItem.findOne({ _id: id, businessOwnerId });
	if (!item)
		throw new ApiError(StatusCodes.NOT_FOUND, "Storage item not found");
	return item;
};

const listStorageItems = async (filter = {}, options = {}, businessOwnerId) => {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = -1,
	} = options;
	const skip = (page - 1) * limit;
	filter.businessOwnerId = businessOwnerId;
	const query = StorageItem.find(filter)
		.sort({ [sortBy]: sortOrder })
		.skip(skip)
		.limit(limit);
	const [results, total] = await Promise.all([
		query.exec(),
		StorageItem.countDocuments(filter),
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

const updateStorageItem = async (id, data, businessOwnerId) => {
	const item = await StorageItem.findOneAndUpdate(
		{ _id: id, businessOwnerId },
		data,
		{ new: true }
	);
	if (!item)
		throw new ApiError(StatusCodes.NOT_FOUND, "Storage item not found");
	return item;
};

const deleteStorageItem = async (id, businessOwnerId) => {
	const item = await StorageItem.findOneAndDelete({ _id: id, businessOwnerId });
	if (!item)
		throw new ApiError(StatusCodes.NOT_FOUND, "Storage item not found");
	return item;
};

export {
	createStorageItem,
	getStorageItemById,
	listStorageItems,
	updateStorageItem,
	deleteStorageItem,
};
