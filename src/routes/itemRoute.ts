import { Router } from "express";
import {
  getAllItem,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/itemController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../middleware/upload";

export const itemRouter: Router = Router();

/**
 * @swagger
 * /api/item/post:
 *   post:
 *     summary: Buat item baru
 *     security:
 *       - BearerAuth: []  # Ensure security scheme is defined in your Swagger spec
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               image_url:
 *                 type: string
 *                 format: binary  # Correct for file upload
 *               userId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *             required:
 *               - title
 *               - description
 *               - status
 *               - image_url
 *               - userId
 *               - categoryId
 *     responses:
 *       201:
 *         description: Item successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request, validation failed
 *       401:
 *         description: Unauthorized, no valid JWT token
 *       500:
 *         description: Internal server error
 */


itemRouter.post(
  "/api/item/post",
  authenticateToken,
  upload.single("image_url"),
  createItem
);

/**
 * @swagger
 * /api/item:
 *   get:
 *     summary: Get semua barang
 *     responses:
 *       200:
 *         description: List dari items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   userId:
 *                     type: integer
 *                   categoryId:
 *                     type: integer
 *                   User:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *       500:
 *         description: Server error
 */
itemRouter.get("/api/item", getAllItem);

/**
 * @swagger
 * /api/item/{id}:
 *   get:
 *     summary: Cari item berdasarkan ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 userId:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *                 User:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *       404:
 *         description: Item not found
 */
itemRouter.get("/api/item/:id", getItemById);

/**
 * @swagger
 * /api/item/{id}:
 *   put:
 *     summary: Update atau edit item
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id item yang akan di update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               image_url:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *               - description
 *               - status
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Item not found
 */
itemRouter.put(
  "/api/item/:id",
  authenticateToken,
  upload.single("image_url"),
  updateItem
);

/**
 * @swagger
 * /api/item/{id}:
 *   delete:
 *     summary: Hapus item berdasarkan ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id yang mau dihapus
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
itemRouter.delete("/api/item/:id", authenticateToken, deleteItem);
