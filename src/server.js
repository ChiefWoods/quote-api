import express from "express";
import cors from "cors";
import { client } from "./database.js";
import collectionRouter from "./routes/collections.js";
import quoteRouter from "./routes/quotes.js";

const port = 8000;

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/collections", collectionRouter);
app.use("/api/quotes", quoteRouter);

app.listen(port, () => console.log(`Listening on port ${port}`));

process.on("SIGINT", async () => {
  await client.close();
  console.log("Disconnected from database");
  process.exit(0);
});
