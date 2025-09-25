// "use strict";

import userRoute from "./userRoute.js";
import authRoute from "./authRoute.js";
import businessOwnerRoute from "./businessOwnerRoute.js";
import accountantRoute from "./accountantRoute.js";
import productRoute from "./productRoute.js";
import customerRoute from "./customerRoute.js";

import inputInvoiceRoute from "./inputInvoiceRoute.js";
import outputInvoiceRoute from "./outputInvoiceRoute.js";
import expenseVoucherRoute from "./expenseVoucherRoute.js";
import storageItemRoute from "./storageItemRoute.js";
import invoicesOutRoute from "./invoicesOutRoute.js";
import { errorHandlingMiddleware } from "./../middlewares/errorHandlingMiddleware.js";
import authenticate from "../middlewares/jwtMiddlewares.js";

export default (app) => {
	// Basic GET route for API status check
	app.get("/", (req, res) => {
		res.status(200).json({ status: "ok", message: "API is running" });
	});

	app.use("/api/auth", authRoute);
	app.use("/api/user", authenticate, userRoute);
	app.use("/api/business-owner", businessOwnerRoute);
	app.use("/api/accountant", accountantRoute);

	app.use("/api/product", productRoute);
	app.use("/api/customer", customerRoute);

	app.use("/api/input-invoice", inputInvoiceRoute);
	app.use("/api/output-invoice", outputInvoiceRoute);
	app.use("/api/expense-voucher", expenseVoucherRoute);
	app.use("/api/storage-item", storageItemRoute);
	app.use("/api/invoices-out", invoicesOutRoute);

	app.use(errorHandlingMiddleware);
};
