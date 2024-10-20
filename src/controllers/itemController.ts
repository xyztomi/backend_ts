import { Request, Response, NextFunction } from "express";
import { createItemService, getAllItemService } from "../services/itemService";

export const getAllItem = async (_: any, res: Response, next: NextFunction) => {
  try {
    const data = await getAllItemService();
    res.status(200).json(data);
  } catch (e) {
    res.sendStatus(400);
    next(e);
  }
};

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {
    // extract image_url dari multer req.file
    const image_url = req.file ? `/images/${req.file.filename}` : undefined;
    const data = { ...req.body, image_url };

    const newItem = await createItemService(data);
    console.log(newItem);
    res.status(201).json({ msg: "Item berhasil dibuat.", data });
  } catch (e) {
    next(e);
  }
};
