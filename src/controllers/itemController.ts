import { Request, Response, NextFunction } from "express";
import {
  createItemService,
  getAllItemService,
  getItemByIdService,
  updateItemService,
  deleteItemService,
} from "../services/itemService";
import { RequestUser } from "../middleware/auth";

// CREATE
export const createItem = async (
  req: RequestUser,
  res: Response,
  next: NextFunction,
) => {
  console.log("Body:", req.body);
  console.log("File:", req.file);

  try {
    // extract image_url from multer req.file
    const image_url = req.file ? `/images/${req.file.filename}` : undefined;

    // Use userId from authenticated user
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ msg: "User not authenticated." });
    }

    const data = { ...req.body, image_url, userId }; // Include userId here

    const newItem = await createItemService(data);
    console.log(newItem);
    res.status(201).json({ msg: "Item berhasil dibuat.", data });
  } catch (e) {
    next(e);
  }
};

// READ
export const getAllItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = req.query.status;
    const data = await getAllItemService(status);
    res.status(200).json(data);
  } catch (e) {
    res.sendStatus(400);
    next(e);
  }
};

export const getItemById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = await getItemByIdService(Number(id));
    res.status(200).json(data);
  } catch (e) {
    res.sendStatus(400);
    next(e);
  }
};

// UPDATE
export const updateItem = async (
  req: RequestUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description, status, categoryId } = req.body;
    const userId = req.user?.userId;
    const image_url = req.file ? `/images/${req.file.filename}` : undefined;

    const updatedItem = await updateItemService({
      id: Number(id),
      title,
      description,
      status,
      image_url,
      categoryId: Number(categoryId),
      userId,
    });

    res.status(200).json({ msg: "Item berhasil diedit.", updatedItem });
  } catch (e) {
    next(e);
  }
};

// DELETE
export const deleteItem = async (
  req: RequestUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const deletedItem = await deleteItemService(Number(id), Number(userId));
    res.status(200).json({ msg: "Item berhasil dihapus.", deletedItem });
  } catch (e) {
    next(e);
  }
};
