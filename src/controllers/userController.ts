import { Request, Response, NextFunction } from "express";
import { registerUserService } from "../services/userService";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { username, password } = req.body;
    const newUser = await registerUserService(username, password);
    return res.status(201).json(newUser);
  } catch (e: any) {
    if (e.message.includes("Coba username lain")) {
      return res.status(400).json({ error: e.message });
    }
    next(e);
  }
};
