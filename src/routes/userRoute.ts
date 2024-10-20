import { Router } from "express";
import {
  getAllUser,
  loginUser,
  registerUser,
} from "../controllers/userController";
import { authenticateToken } from "../middleware/auth";

export const userRouter: Router = Router();

userRouter.post("/api/user/register", registerUser);
userRouter.post("/api/user/login", loginUser);
userRouter.get("/api/user/", getAllUser);
