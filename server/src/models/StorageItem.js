"use strict";

import mongoose from "mongoose";

const StorageItemSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		unit: { type: String, required: true },
		stock: { type: Number, required: true, default: 0 },
		imageURL: { type: String },
		businessOwnerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BusinessOwner",
		},
	},
	{ timestamps: true }
);

const StorageItem = mongoose.model("StorageItems", StorageItemSchema);
export default StorageItem;
