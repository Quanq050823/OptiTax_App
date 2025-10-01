"use strict";

import * as storageItemService from "../services/storageItemService.js";
import InvoicesInService from "../services/invoicesInService.js";
import { StatusCodes } from "http-status-codes";

import { getBusinessOwnerByUserId } from "../services/businessOwnerService.js";

const create = async (req, res, next) => {
	try {
		// Assume req.user._id is set by auth middleware
		const userId = req.user.userId;
		console.log("User ID:", userId); // Debugging line
		const owner = await getBusinessOwnerByUserId(userId);
		if (!owner) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Business owner profile not found" });
		}
		const result = await storageItemService.createStorageItem(
			req.body,
			owner._id
		);
		res.status(StatusCodes.CREATED).json(result);
	} catch (err) {
		next(err);
	}
};

const getById = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const owner = await getBusinessOwnerByUserId(userId);
		if (!owner) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Business owner profile not found" });
		}
		const result = await storageItemService.getStorageItemById(
			req.params.id,
			owner._id
		);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const list = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const owner = await getBusinessOwnerByUserId(userId);
		if (!owner) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Business owner profile not found" });
		}
		const { page, limit, sortBy, sortOrder, ...filter } = req.query;
		const options = {
			page: parseInt(page) || 1,
			limit: parseInt(limit) || 10,
			sortBy: sortBy || "createdAt",
			sortOrder: parseInt(sortOrder) || -1,
		};
		const result = await storageItemService.listStorageItems(
			filter,
			options,
			owner._id
		);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const update = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const owner = await getBusinessOwnerByUserId(userId);
		if (!owner) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Business owner profile not found" });
		}
		const result = await storageItemService.updateStorageItem(
			req.params.id,
			req.body,
			owner._id
		);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const remove = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		const owner = await getBusinessOwnerByUserId(userId);
		if (!owner) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Business owner profile not found" });
		}
		const result = await storageItemService.deleteStorageItem(
			req.params.id,
			owner._id
		);
		res.status(StatusCodes.OK).json(result);
	} catch (err) {
		next(err);
	}
};

const namesAndUnits = async (req, res, next) => {
	try {
		const userId = req.user.userId;
		console.log("User ID:", userId);
		const owner = await getBusinessOwnerByUserId(userId);
		console.log("Business Owner:", owner);
		if (!owner) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ message: "Business owner profile not found" });
		}
		const items = await storageItemService.listStorageItems(
			{},
			{ limit: 1000 },
			owner._id
		);
		console.log("Owner ID:", owner._id);
		const names = items.data.map((item) => item.name);
		const units = items.data.map((item) => item.unit);
		res.status(StatusCodes.OK).json({ names, units });
	} catch (err) {
		next(err);
	}
};

const syncStorageItems = async (req, res, next) => {
	try {
		const businessOwnerId = req.user.id;
		const invoices = await InvoicesInService.getInvoices({
			isStorageSynced: false,
		});

		let successCount = 0;
		let failCount = 0;

		for (const invoice of invoices) {
			if (Array.isArray(invoice.hdhhdvu)) {
				for (const item of invoice.hdhhdvu) {
					const data = {
						name: item.ten,
						stock: item.sluong,
						unit: item.dvtinh,
					};
					console.log("Syncing item:", data);

					try {
						const existingItems = await storageItemService.listStorageItems(
							{ name: data.name },
							{ limit: 1 },
							businessOwnerId
						);

						if (existingItems.data.length > 0) {
							const existingItem = existingItems.data[0];
							await storageItemService.updateStorageItem(
								existingItem._id,
								{ stock: existingItem.stock + data.stock },
								businessOwnerId
							);
						} else {
							await storageItemService.createStorageItem(data, businessOwnerId);
						}
						successCount++;
					} catch (err) {
						failCount++;
						console.error("Sync failed for item:", data, err);
					}
				}
			}
			try {
				await InvoicesInService.updateInvoice(invoice._id, {
					isStorageSynced: true,
				});
			} catch (err) {
				console.error(
					"Không thể cập nhật trạng thái đồng bộ cho hóa đơn:",
					invoice._id,
					err
				);
			}
		}

		res.status(200).json({
			message: "Storage items synced successfully",
			successCount,
			failCount,
		});
	} catch (error) {
		next(error);
	}
};

// const namesAndUnits = async (req, res, next) => {
//   try {
//     const userId = req.user.userId;
//     console.log("User ID:", userId); // Debugging line
//     const owner = await getBusinessOwnerByUserId(userId);
//     console.log("Business Owner:", owner); // Debugging line
//     if (!owner) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "Business owner profile not found" });
//     }
//     const keyword = req.query.q || ""; // lấy từ query string ?q=...
//     const regex = new RegExp(keyword, "i"); // không phân biệt hoa thường
//     const items = await listStorageItems(
//       {
//         businessOwnerId: owner._id,
//         $or: [{ name: regex }, { category: regex }],
//       },
//       { limit: 1000 },
//       owner._id
//     );

//     res.status(200).json(items);
//     console.log("Owner ID:", owner._id); // Debugging line
//     const names = items.data.map((item) => item.name);
//     const units = items.data.map((item) => item.unit);
//     res.status(StatusCodes.OK).json({ names, units });
//   } catch (err) {
//     next(err);
//   }
// };

export {
	create,
	getById,
	list,
	update,
	remove,
	namesAndUnits,
	syncStorageItems,
};
