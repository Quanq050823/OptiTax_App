"use strict";

import mongoose from "mongoose";

const ttkhacSchema = new mongoose.Schema(
	{
		ttruong: String,
		kdlieu: String,
		dlieu: String,
	},
	{ _id: false }
);

const hdhhdvuSchema = new mongoose.Schema(
	{
		idhdon: String,
		id: String,
		dgia: String,
		dvtinh: String,
		ltsuat: { type: mongoose.Schema.Types.Mixed, default: null },
		sluong: String,
		stbchu: { type: mongoose.Schema.Types.Mixed, default: null },
		stckhau: { type: mongoose.Schema.Types.Mixed, default: null },
		stt: String,
		tchat: String,
		ten: String,
		thtcthue: { type: mongoose.Schema.Types.Mixed, default: null },
		thtien: String,
		tlckhau: { type: mongoose.Schema.Types.Mixed, default: null },
		tsuat: { type: mongoose.Schema.Types.Mixed, default: null },
		tthue: { type: mongoose.Schema.Types.Mixed, default: null },
		sxep: String,
		ttkhac: [ttkhacSchema],
	},
	{ _id: false }
);

const InputInvoiceSchema = new mongoose.Schema(
	{
		nbmst: String,
		khmshdon: String,
		khhdon: String,
		shdon: String,
		ncnhat: Date,
		mhdon: String,
		nbten: String,
		nbdchi: String,
		nbsdthoai: String,
		nmten: String,
		nmtnmua: String,
		nmmst: String,
		nmdchi: String,
		thtttoan: String,
		dvtte: String,
		hdhhdvu: [hdhhdvuSchema],
		businessOwnerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "BusinessOwner",
			required: true,
		},
	},
	{ timestamps: true }
);

const InputInvoice = mongoose.model("InputInvoice", InputInvoiceSchema);
export default InputInvoice;
