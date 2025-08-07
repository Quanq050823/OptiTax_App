"use strict";

import BusinessOwner from "../models/BusinessOwner.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const createBusinessOwner = async (userId, data) => {
	// Kiểm tra đã có profile chưa
	const existed = await BusinessOwner.findOne({ userId });
	if (existed)
		throw new ApiError(StatusCodes.BAD_REQUEST, "Profile already exists");
	const businessOwner = new BusinessOwner({ userId, ...data });
	await businessOwner.save();
	return businessOwner;
};

const getBusinessOwnerByUserId = async (userId) => {
	const profile = await BusinessOwner.findOne({ userId });
	if (!profile) throw new ApiError(StatusCodes.NOT_FOUND, "Profile not found");
	return profile;
};

const updateBusinessOwner = async (userId, data) => {
	const updated = await BusinessOwner.findOneAndUpdate(
		{ userId },
		{ $set: data },
		{ new: true, runValidators: true }
	);
	if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, "Profile not found");
	return updated;
};

const deleteBusinessOwner = async (userId) => {
	const deleted = await BusinessOwner.findOneAndDelete({ userId });
	if (!deleted) throw new ApiError(StatusCodes.NOT_FOUND, "Profile not found");
	return { message: "Profile deleted" };
};

const listBusinessOwners = async (filter = {}, options = {}) => {
	const {
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		sortOrder = -1,
	} = options;
	const skip = (page - 1) * limit;
	const query = BusinessOwner.find(filter)
		.sort({ [sortBy]: sortOrder })
		.skip(skip)
		.limit(limit);
	const [results, total] = await Promise.all([
		query.exec(),
		BusinessOwner.countDocuments(filter),
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

export {
	createBusinessOwner,
	getBusinessOwnerByUserId,
	updateBusinessOwner,
	deleteBusinessOwner,
	listBusinessOwners,
};
