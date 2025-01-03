import { Request, Response, NextFunction } from "express";
import {
  getAllUserService,
  loginUserService,
  registerUserService,
  getUserByIdService,
} from "../services/userService";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const newUser = await registerUserService(username, password);
    res.status(201).json(newUser);
  } catch (e: any) {
    if (e.message.includes("Coba username lain")) {
      res.status(400).json({ error: e.message });
    }
    next(e);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const userLoginToken = await loginUserService(username, password);
    res.status(200).json({
      data: {
        token: userLoginToken.token,
        username: userLoginToken.userInfo,
        userId: userLoginToken.userId,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getAllUser = async (_: any, res: Response, next: NextFunction) => {
  try {
    const data = await getAllUserService();
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { id } = request.params;
    const data = await getUserByIdService(Number(id));
    response.status(200).json(data);
  } catch (error) {
    response.sendStatus(400);
    next(error);
  }
};
