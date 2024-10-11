import bcrypt from "bcrypt";
import { prismaClient } from "../../prisma";

const SALT_ROUNDS = 10;

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
