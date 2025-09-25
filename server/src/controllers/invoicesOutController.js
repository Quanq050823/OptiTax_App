import InvoicesOut from "../models/InvoicesOut.js";
import invoicesOutService from "../services/invoicesOutService.js";
import BusinessOwner from "../models/BusinessOwner.js";
import axios from "axios";
export const syncInvoicesFromThirdParty = async (req, res) => {
	const token = "3J/EhtxvsAO74hsLC6PtTdSKM0VleDskquWltIl8SlM=";
	try {
		const { datefrom, dateto, username, password } = req.body;
		if (!datefrom || !dateto || !username || !password) {
			return res.status(400).json({ error: "Missing required parameters" });
		}

		const loginRes = await axios.post(
			"https://vuat-api.vitax.one/api/partner/Invoices/login_tct_client",
			{ username, password },
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		console.log("loginRes:", loginRes.data);
		console.log(req.body);
		if (!token) {
			return res.status(401).json({ error: "Login to third party API failed" });
		}
		const userId = req.user.userId;
		const owner = await BusinessOwner.findOne({ userId });
		if (!owner)
			return res.status(404).json({ message: "BusinessOwner not found" });
		const taxCode = owner.taxCode;
		console.log("taxCode:", taxCode);

		const invoicesRes = await axios.get(
			"https://vuat-api.vitax.one/api/partner/Invoices/get-list-invoice",
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				params: { datefrom, dateto, mst: taxCode },
			}
		);
		let invoices = [];
		if (Array.isArray(invoicesRes.data)) {
			invoices = invoicesRes.data;
		} else if (Array.isArray(invoicesRes.data.result)) {
			invoices = invoicesRes.data.result;
		} else if (Array.isArray(invoicesRes.data.invoices)) {
			invoices = invoicesRes.data.invoices;
		}
		if (!Array.isArray(invoices) || invoices.length === 0) {
			return res
				.status(404)
				.json({ error: "No invoices found from third party API" });
		}

		let saved = 0,
			failed = 0;
		for (const invoice of invoices) {
			try {
				const userId = req.user.userId;
				const owner = await BusinessOwner.findOne({ userId });
				if (!owner)
					return res.status(404).json({ message: "BusinessOwner not found" });
				const data = { ...invoice, ownerId: owner._id };
				console.log("data:", data);
				await invoicesOutService.createInvoice(data);
				saved++;
			} catch (err) {
				failed++;
				console.error("Failed to save invoice:", err);
			}
		}
		res
			.status(200)
			.json({ message: `Synced invoices: ${saved}, failed: ${failed}` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const createInvoice = async (req, res) => {
	try {
		const userId = req.user.userId;
		const owner = await BusinessOwner.findOne({ userId });
		if (!owner)
			return res.status(404).json({ message: "BusinessOwner not found" });
		const data = { ...req.body, ownerId: owner._id };
		console.log("data:", data);
		const invoice = await invoicesOutService.createInvoice(data);
		res.status(201).json(invoice);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getInvoices = async (req, res) => {
	try {
		const invoices = await invoicesOutService.getInvoices(req.query);
		res.status(200).json(invoices);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getInvoiceById = async (req, res) => {
	try {
		const invoice = await invoicesOutService.getInvoiceById(req.params.id);
		if (!invoice) return res.status(404).json({ error: "Invoice not found" });
		res.status(200).json(invoice);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateInvoice = async (req, res) => {
	try {
		const invoice = await invoicesOutService.updateInvoice(
			req.params.id,
			req.body
		);
		if (!invoice) return res.status(404).json({ error: "Invoice not found" });
		res.status(200).json(invoice);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteInvoice = async (req, res) => {
	try {
		const result = await invoicesOutService.deleteInvoice(req.params.id);
		if (!result) return res.status(404).json({ error: "Invoice not found" });
		res.status(200).json({ message: "Invoice deleted" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
