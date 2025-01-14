import { Router } from "express";
import { ApiError } from "../errors";
import { deleteQuote, getQuote } from "../database";
import { basicAuth } from "../middleware";

const quotesRouter = Router();

export default quotesRouter
  // Get a quote
  .get("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
      if (!id) {
        throw new ApiError("Quote id is required.", 400);
      }

      const quote = await getQuote(Number(id));

      res.json(quote);
    } catch (err) {
      next(err);
    }
  })
  // Delete a quote
  .delete("/:id", basicAuth, async (req, res, next) => {
    const { id } = req.params;

    try {
      if (!id) {
        throw new ApiError("Quote id is required.", 400);
      }

      await deleteQuote(Number(id));

      res.json(`Quote '${id}' deleted.`);
    } catch (err) {
      next(err);
    }
  });
