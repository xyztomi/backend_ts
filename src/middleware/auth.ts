import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const SECRET_KEY: Secret = "rahasia";
