import { prismaClient } from "../../prisma";

interface createItemDTO {
  title: string;
  description: string;
  status: string;
  image_url: string;
  userId: number;
  categoryId: number;
}

export const getAllItemService = async () => {
  const allItem = await prismaClient.item.findMany();
  return allItem;
};

export const createItemService = async (data: createItemDTO) => {
  const { title, description, status, image_url, userId, categoryId } = data;

  // convert req.body id to number
  const parsedUserId = parseInt(userId.toString());
  const parsedCategoryId = parseInt(categoryId.toString());

  if (!title) {
    throw new Error("Title harus diisi.");
  }
  if (!description) {
    throw new Error("Deskripsi harus diisi.");
  }
  if (!status) {
    throw new Error("Status harus diisi.");
  }
  if (!image_url) {
    throw new Error("URL gambar harus diisi.");
  }
  if (isNaN(parsedUserId)) {
    throw new Error("User ID harus berupa angka.");
  }
  if (isNaN(parsedCategoryId)) {
    throw new Error("Category ID harus berupa angka.");
  }

  // check user id
  const userExists = await prismaClient.user.findUnique({
    where: { id: parsedUserId }, // id is now an integer
  });
  if (!userExists) {
    throw new Error(`User id: ${parsedUserId} tidak ditemukan.`);
  }

  // check kategori
  const categoryExists = await prismaClient.category.findUnique({
    where: { id: parsedCategoryId }, // id is now an integer
  });
  if (!categoryExists) {
    throw new Error(`Kategori id: ${parsedCategoryId} tidak ditemukan.`);
  }

  // query item baru
  const newItem = await prismaClient.item.create({
    data: {
      title,
      description,
      status,
      image_url,
      User: { connect: { id: parsedUserId } },
      category: { connect: { id: parsedCategoryId } },
    },
  });

  return newItem;
};
