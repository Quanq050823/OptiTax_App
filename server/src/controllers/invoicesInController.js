import axios from "axios";
import BusinessOwner from "../models/BusinessOwner.js";
import InvoicesInService from "../services/invoicesInService.js";

export const syncInvoicesFromThirdParty = async (req, res) => {
	const token = "3J/EhtxvsAO74hsLC6PtTdSKM0VleDskquWltIl8SlM=";
	try {
		const { datefrom, dateto } = req.body;
		if (!datefrom || !dateto) {
			return res.status(400).json({ error: "Missing required parameters" });
		}
		if (!token) {
			return res.status(401).json({ error: "Login to third party API failed" });
		}
		const userId = req.user.userId;
		const owner = await BusinessOwner.findOne({ userId });
		if (!owner)
			return res.status(404).json({ message: "BusinessOwner not found" });
		const taxCode = owner.taxCode;
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

		let sync = 0,
			skip = 0,
			fail = 0;
		for (const invoice of invoices) {
			try {
				const userId = req.user.userId;
				const owner = await BusinessOwner.findOne({ userId });
				if (!owner)
					return res.status(404).json({ message: "BusinessOwner not found" });
				const data = { ...invoice, ownerId: owner._id };
				try {
					await InvoicesInService.createInvoice(data);
					sync++;
				} catch (err) {
					if (err?.message?.includes("already exists")) {
						skip++;
					} else {
						fail++;
					}
				}
			} catch (err) {
				fail++;
			}
		}
		res.status(200).json({ sync, skip, fail });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
export const syncListInvoicesDetailsFromThirdParty = async (req, res) => {
	const token = "3J/EhtxvsAO74hsLC6PtTdSKM0VleDskquWltIl8SlM=";
	try {
		const { datefrom, dateto } = req.body;
		if (!datefrom || !dateto) {
			return res.status(400).json({ error: "Missing required parameters" });
		}
		if (!token) {
			return res.status(401).json({ error: "Login to third party API failed" });
		}
		const userId = req.user.userId;
		const owner = await BusinessOwner.findOne({ userId });
		if (!owner)
			return res.status(404).json({ message: "BusinessOwner not found" });
		const taxCode = owner.taxCode;

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

		let sync = 0,
			skip = 0,
			fail = 0;

		const invoiceDetailsList = [];

		for (const invoice of invoices) {
			invoiceDetailsList.push({
				nbmst: invoice.nbmst,
				khhdon: invoice.khhdon,
				shdon: invoice.shdon,
				khmshdon: invoice.khmshdon,
			});

			try {
				const detailRes = await axios.get(
					"https://vuat-api.vitax.one/api/partner/Invoices/invoice-detail",
					{
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						params: {
							nbmst: invoice.nbmst,
							khhdon: invoice.khhdon,
							shdon: invoice.shdon,
							khmshdon: invoice.khmshdon,
							mst: taxCode,
						},
					}
				);
				const invoiceDetailArr = detailRes.data?.result;
				if (!Array.isArray(invoiceDetailArr) || invoiceDetailArr.length === 0) {
					fail++;
					continue;
				}
				const invoiceDetail = invoiceDetailArr[0];

				const userId = req.user.userId;
				const owner = await BusinessOwner.findOne({ userId });
				if (!owner)
					return res.status(404).json({ message: "BusinessOwner not found" });

				const data = { ...invoiceDetail, ownerId: owner._id };
				try {
					await InvoicesInService.createInvoice(data);
					sync++;
				} catch (err) {
					if (err?.message?.includes("already exists")) {
						skip++;
					} else {
						fail++;
					}
				}
			} catch (err) {
				fail++;
			}
		}
		res.status(200).json({ sync, skip, fail, invoiceDetailsList });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getInvoiceDetailFromThirdParty = async (req, res) => {
	const token = "3J/EhtxvsAO74hsLC6PtTdSKM0VleDskquWltIl8SlM=";
	try {
		const { nbmst, khhdon, shdon, khmshdon } = req.body;
		if (!nbmst || !khhdon || !shdon || !khmshdon) {
			return res.status(400).json({
				error: "Missing required parameters",
				nbmst,
				khhdon,
				shdon,
				khmshdon,
			});
		}
		const userId = req.user.userId;
		const owner = await BusinessOwner.findOne({ userId });
		if (!owner)
			return res.status(404).json({ message: "BusinessOwner not found" });
		const mst = owner.taxCode;
		const response = await axios.get(
			"https://vuat-api.vitax.one/api/partner/Invoices/invoice-detail",
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				params: { nbmst, khhdon, shdon, khmshdon, mst },
			}
		);
		res.status(200).json(response.data);
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
		const invoice = await InvoicesInService.createInvoice(data);
		res.status(201).json(invoice);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getInvoices = async (req, res) => {
	try {
		const invoices = await InvoicesInService.getInvoices(req.query);
		res.status(200).json(invoices);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getInvoiceById = async (req, res) => {
	try {
		const invoice = await InvoicesInService.getInvoiceById(req.params.id);
		if (!invoice) return res.status(404).json({ error: "Invoice not found" });
		res.status(200).json(invoice);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateInvoice = async (req, res) => {
	try {
		const invoice = await InvoicesInService.updateInvoice(
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
		const result = await InvoicesInService.deleteInvoice(req.params.id);
		if (!result) return res.status(404).json({ error: "Invoice not found" });
		res.status(200).json({ message: "Invoice deleted" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
