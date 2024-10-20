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

const app: Express = express();
const port = 3005;

app.use(cors());
app.use(json());
app.use(
  "/public/images",
  express.static(path.join(__dirname, "public", "images")),
);

// routes
app.use(userRouter);
app.use(itemRouter);

app.get("/", (_, res: Response) => {
  res.send({ msg: "hai" });
});

(() => {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(err.status || 500).json({ message: err.message });
  });
  app.listen(port, () => {
    console.log(`app running at http://localhost:${port}/`);
  });
})();
