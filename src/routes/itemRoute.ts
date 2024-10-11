import { Router } from "express";

export const itemRouter: Router = Router();

itemRouter.get("/api/item");
itemRouter.get("/api/item/:id");

itemRouter.post("/api/item/post");
itemRouter.patch("/api/item/:id");
itemRouter.delete("/api/item/:id");
