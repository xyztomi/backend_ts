import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const SECRET_KEY: Secret = "rahasia";
export interface RequestUser extends Request {
  user?: { userId: number };
}

export const authenticateToken = (
  req: RequestUser,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.sendStatus(401); // unauthorized code
    return;
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(403).json({ msg: "Invalid token" });
      return;
    }
    if (decoded && typeof decoded !== "string") {
      req.user = { userId: decoded.userId as number }; // Assign userId to req.user
    }
    next();
  });
};
