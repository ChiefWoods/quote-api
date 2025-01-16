import { Router } from "express";
import { ApiError } from "../errors";
import { addQuotes, deleteQuote, getQuote } from "../database";
import { basicAuth } from "../middleware";
import { checkInvalidQuotes } from "../utils";

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
  // Add new quotes
  .post("/", basicAuth, async (req, res, next) => {
    const { collectionId, quotes } = req.body;

    try {
      if (!collectionId) {
        throw new ApiError("Collection id is required.", 400);
      } else if (!quotes) {
        throw new ApiError("Quotes are required.", 400);
      } else if (!Array.isArray(quotes)) {
        throw new ApiError("Quotes must be an array.", 400);
      }

      checkInvalidQuotes(quotes);

      const newQuotes = await addQuotes(Number(collectionId), quotes);

      res.json(newQuotes);
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
