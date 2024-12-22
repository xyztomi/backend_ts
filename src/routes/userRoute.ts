import { Router } from "express";
import {
  getAllUser,
  loginUser,
  registerUser,
  getUserById,
} from "../controllers/userController";

export const userRouter: Router = Router();

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register user baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Bad request
 */
userRouter.post("/api/user/register", registerUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login
 *     description: Auth menggunakan JWT bearer token 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User successfully logged in and token returned
 *       400:
 *         description: Invalid credentials
 */
userRouter.post("/api/user/login", loginUser);
userRouter.get("/api/user/", getAllUser);

userRouter.get("/api/user/:id", getUserById);

