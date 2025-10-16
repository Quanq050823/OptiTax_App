"use strict";

import mongoose from "mongoose";
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

const listStorageItems = async (businessOwnerId, filter = {}, options = {}) => {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = -1,
	} = options;
	const skip = (page - 1) * limit;
	const query = StorageItem.find({ businessOwnerId, ...filter })
		.sort({ [sortBy]: sortOrder })
		.skip(skip)
		.limit(limit);
	const [results, total] = await Promise.all([
		query.exec(),
		StorageItem.countDocuments({ businessOwnerId, ...filter }),
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
		data
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

const generateTypeItems = async (id, data, businessOwnerId) => {
	const item = await StorageItem.findOneAndUpdate(
		{ _id: id, businessOwnerId },
		{ category: data.category, syncStatus: true },
		{ new: true }
	);
	if (!item)
		throw new ApiError(StatusCodes.NOT_FOUND, "Storage item not found");
	return item;
};

const updateUnitConversion = async (id, conversionData, businessOwnerId) => {
	const updateData = {
		conversionUnit: {
			...conversionData,
			isActive: true,
		},
	};

	const item = await StorageItem.findOneAndUpdate(
		{ _id: id, businessOwnerId },
		updateData,
		{ new: true }
	);

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
	generateTypeItems,
	updateUnitConversion,
};
