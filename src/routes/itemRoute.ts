import { Router } from "express";
import {
  getAllItem,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const itemRouter: Router = Router();

// CREATE
itemRouter.post(
  "/api/item/post",
  authenticateToken,
  upload.single("image_url"),
  createItem,
);

// READ
itemRouter.get("/api/item", getAllItem);
itemRouter.get("/api/item/:id", getItemById);

// UPDATE
itemRouter.patch(
  "/api/item/:id",
  authenticateToken,
  upload.single("image_url"),
  updateItem,
);

// DELETE
itemRouter.delete("/api/item/:id", authenticateToken, deleteItem);
