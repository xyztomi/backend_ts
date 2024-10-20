import { Router } from "express";
import { getAllItem, createItem } from "../controllers/itemController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const itemRouter: Router = Router();

itemRouter.get("/api/item", authenticateToken, getAllItem);
itemRouter.get("/api/item/:id");

itemRouter.post(
  "/api/item/post",
  authenticateToken,
  upload.single("image_url"),
  createItem,
);
itemRouter.patch("/api/item/:id");
itemRouter.delete("/api/item/:id");
// todo: make get and post
