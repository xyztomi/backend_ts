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

export const createItemService = async (data: createItemDTO) => {
  const { title, description, status, image_url, userId, categoryId } = data;

  // Ensure all required fields are provided
  if (!title || !description || !status || !image_url || !userId || !categoryId) {
    throw new Error("All fields (title, description, status, image_url, userId, categoryId) must be provided.");
  }

  const parsedUserId = parseInt(userId.toString());
  const parsedCategoryId = parseInt(categoryId.toString());

  // Check for valid User ID and Category ID
  if (isNaN(parsedUserId)) {
    throw new Error("User ID must be a number.");
  }

  if (isNaN(parsedCategoryId)) {
    throw new Error("Category ID must be a number.");
  }

  // Check if the user exists
  const userExists = await prismaClient.user.findUnique({
    where: { id: parsedUserId },
  });
  if (!userExists) {
    throw new Error(`User with ID: ${parsedUserId} not found.`);
  }

  // Check if the category exists
  const categoryExists = await prismaClient.category.findUnique({
    where: { id: parsedCategoryId },
  });
  if (!categoryExists) {
    throw new Error(`Category with ID: ${parsedCategoryId} not found.`);
  }

  // Create the new item
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
export const getAllItemService = async (status: any) => {
  const whereClause = status && status !== "all" ? { status } : {};
  const allItems = await prismaClient.item.findMany({
    where: whereClause,
    include: {
      User: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return allItems;
};

export const getItemByIdService = async (id: number) => {
  const item = await prismaClient.item.findUnique({
    where: { id },
    include: {
      User: {
        select: {
          username: true,
        },
      },
    },
  });
  return item;
};

// UPDATE
export const updateItemService = async (data: UpdateItemDTO) => {
  const { id, title, description, status, image_url, categoryId, userId } =
    data;

  const itemExists = await prismaClient.item.findUnique({
    where: { id },
  });

  if (!itemExists) {
    throw new Error(`Item dengan id: ${id} tidak ditemukan.`);
  }

  if (itemExists.userId !== userId) {
    throw new Error(`User tidak memiliki akses untuk mengedit item ini.`);
  }

  const updatedItem = await prismaClient.item.update({
    where: { id },
    data: {
      title: title || itemExists.title,
      description: description || itemExists.description,
      status: status || itemExists.status,
      image_url: image_url || itemExists.image_url,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
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
