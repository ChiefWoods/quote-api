import { Router } from "express";
import { getQuoteByIndex, getRandomQuote } from "../database";

const quoteRouter = Router();

quoteRouter
  // Retrieves a random quote from a collection
  .get("/:collection/random", async (req, res) => {
    try {
      const { collection } = req.params;

      if (collection === ":collection") {
        return res.status(400).json({ error: "Collection name is required." });
      }

      const quote = await getRandomQuote(collection);

      if (quote.error) {
        return res.status(404).json(quote);
      }

      console.log(`Retrieved quote: ${quote._id}`);

      res.json(quote);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to retrieve quote." });
    }
  })
  // Retrieves a quote by id from a collection
  .get("/:collection/:id", async (req, res) => {
    try {
      const { collection, id } = req.params;

      if (collection === ":collection") {
        return res.status(400).json({ error: "Collection name is required." });
      } else if (id === ":id") {
        return res.status(400).json({ error: "Quote id is required." });
      }

      const quote = await getQuoteByIndex(collection, id);

      if (quote.error) {
        return res.status(404).json(quote);
      }

      console.log(`Retrieved quote: ${quote._id}`);

      res.json(quote);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to retrieve quote." });
    }
  });

export default quoteRouter;
