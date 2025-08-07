"use strict";

import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
	{
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BusinessOwner",
			required: true,
			index: true,
		},
		name: { type: String, required: true },
		code: { type: String, required: true, unique: true },
		category: { type: String },
		unit: { type: String },
		price: { type: Number, required: true },
		description: { type: String },
		imageUrl: { type: String },
		stock: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
		attributes: [
			{
				key: String,
				value: String,
			},
		],
	},
	{ timestamps: true }
);

ProductSchema.index({ ownerId: 1, code: 1 }, { unique: true });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
