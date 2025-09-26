import express from "express";
import {
	syncInvoicesFromThirdParty,
	createInvoice,
	getInvoices,
	getInvoiceById,
	updateInvoice,
	deleteInvoice,
} from "../controllers/invoicesInController.js";
import authorization from "../middlewares/authorizationMiddleware.js";
import authenticate from "../middlewares/jwtMiddlewares.js";

const router = express.Router();

router.post("/", authenticate, authorization(["user", "admin"]), createInvoice);
router.get("/", authenticate, authorization(["user", "admin"]), getInvoices);
router.get(
	"/:id",
	authenticate,
	authorization(["user", "admin"]),
	getInvoiceById
);
// Route test Postman đồng bộ hóa đơn từ API bên thứ 3
router.post(
	"/sync-from-third-party",
	authenticate,
	authorization(["user", "admin"]),
	syncInvoicesFromThirdParty
);
router.put(
	"/:id",
	authenticate,
	authorization(["user", "admin"]),
	updateInvoice
);
router.delete(
	"/:id",
	authenticate,
	authorization(["user", "admin"]),
	deleteInvoice
);

export default router;
