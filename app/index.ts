import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import apiRouter from "./routes/api.js";
import { ApiError } from "./errors.js";

const port = 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use(
  (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.error(err);

    if (err instanceof ApiError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  },
);
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
