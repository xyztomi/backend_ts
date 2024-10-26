import { prismaClient } from "../../prisma";

interface createItemDTO {
  title: string;
  description: string;
  status: string;
  image_url: string;
  userId: number;
  categoryId: number;
}

interface UpdateItemDTO {
  id: number;
  title?: string;
  description?: string;
  status?: string;
  image_url?: string;
  categoryId?: number;
  userId?: number;
}

// CREATE
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

// READ
export const getAllItemService = async () => {
  const allItem = await prismaClient.item.findMany();
  return allItem;
};

export const getItemByIdService = async (id: number) => {
  const item = await prismaClient.item.findUnique({
    where: { id },
  });
  return item;
};

// UPDATE
export const updateItemService = async (data: UpdateItemDTO) => {
  const { id, title, description, status, image_url, categoryId, userId } =
    data;

  // Check if item exists
  const itemExists = await prismaClient.item.findUnique({
    where: { id },
  });

  if (!itemExists) {
    throw new Error(`Item dengan id: ${id} tidak ditemukan.`);
  }

  if (itemExists.userId !== userId) {
    throw new Error(`User tidak memiliki akses untuk mengedit item ini.`);
  }

  // Update item
  const updatedItem = await prismaClient.item.update({
    where: { id },
    data: {
      title: title || itemExists.title, // If title not provided, keep the old value
      description: description || itemExists.description,
      status: status || itemExists.status,
      image_url: image_url || itemExists.image_url,
      category: categoryId ? { connect: { id: categoryId } } : undefined, // Only update if categoryId is provided
    },
  });

  return updatedItem;
};

// DELETE
export const deleteItemService = async (id: number, userId: number) => {
  const item = await prismaClient.item.findUnique({
    where: { id },
  });

  if (!item) {
    throw new Error(`Item dengan id: ${id} tidak ditemukan.`);
  }

  if (item.userId !== userId) {
    throw new Error(`User tidak memiliki akses untuk menghapus item ini.`);
  }

  const deletedItem = await prismaClient.item.delete({
    where: { id },
  });

  return deletedItem;
};
