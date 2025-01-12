import { Router } from "express";
import collectionRouter from "./collections";
import quoteRouter from "./quotes";
import { initializeDatabase } from "../database";
import { basicAuth } from "../middleware";

export default Router()
  .use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  })
  .use("/collections", collectionRouter)
  .use("/quotes", quoteRouter)
  .post("/init", basicAuth, async (req, res) => {
    await initializeDatabase();

    res.json("Database initialized.");
  });
