import { Router } from "express";
import { registerUser } from "../controllers/userController";

export const userRouter: Router = Router();

userRouter.post("/api/user/register", registerUser);
