"use strict";

import mongoose from "mongoose";

const StorageItemSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		unit: { type: String, required: true },
		stock: { type: Number, required: true, default: 0 },
		imageURL: { type: String },
		description: { type: String },
		syncStatus: { type: Boolean, default: false },
		category: { type: Number, default: 0 }, // 0: chưa set, 1: nguyên liệu,2: hàng hóa
		businessOwnerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BusinessOwner",
		},
	},
	{ timestamps: true }
);

const StorageItem = mongoose.model("StorageItems", StorageItemSchema);
export default StorageItem;
