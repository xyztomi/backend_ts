import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../../prisma";

const SALT_ROUNDS: number = 10;
const SECRET_KEY = "rahasia";

interface RegisterUserResponse {
  id: number;
  username: string;
}

export const registerUserService = async (
  username: string,
  password: string,
): Promise<RegisterUserResponse> => {
  const existingUser = await prismaClient.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error(
      `Username "${username}" sudah terdaftar. Coba username lain.`,
    );
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await prismaClient.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  return { id: newUser.id, username: newUser.username };
};

export const loginUserService = async (username: string, password: string) => {
  const user = await prismaClient.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw new Error("Username tidak ditemukan.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  // console.log(isPasswordValid);
  if (!isPasswordValid) {
    throw new Error("Password salah.");
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1d" });
  const userInfo = user.username;
  return { token, userInfo };
};

export const getAllUserService = async () => {
  const allUser = await prismaClient.user.findMany();
  return allUser;
};
