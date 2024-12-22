import express, {
  Response,
  Request,
  Express,
  json,
  NextFunction,
} from "express";
import { userRouter } from "./src/routes/userRoute";
import { itemRouter } from "./src/routes/itemRoute";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app: Express = express();
const port = 3005;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lost In Campus API Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Point to your route files for JSDoc annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(json());
app.use(
  "/public/images",
  express.static(path.join(__dirname, "public", "images")),
);

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use(userRouter);
app.use(itemRouter);

app.get("/", (_, res: Response) => {
  res.send({ msg: "hai" });
});

(() => {
  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(err.status || 500).json({ message: err.message });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`App running at http://localhost:${port}/`);
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
  });
})();
