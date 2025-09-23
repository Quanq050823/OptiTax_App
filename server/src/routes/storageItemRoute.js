import express from "express";
import * as storageItemController from "../controllers/storageItemController.js";
import authorization from "../middlewares/authorizationMiddleware.js";
import authenticate from "../middlewares/jwtMiddlewares.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorization(["user", "admin"]),
  storageItemController.create
);
router.get(
  "/",
  authenticate,
  authorization(["user", "admin"]),
  storageItemController.list
);
router.get(
  "/names-units",
  authenticate,
  authorization(["user", "admin"]),
  storageItemController.namesAndUnits
);
router.get(
  "/:id",
  authenticate,
  authorization(["user", "admin"]),
  storageItemController.getById
);
router.put(
  "/:id",
  authenticate,
  authorization(["user", "admin"]),
  storageItemController.update
);
router.delete(
  "/:id",
  authenticate,
  authorization(["user", "admin"]),
  storageItemController.remove
);

export default router;
