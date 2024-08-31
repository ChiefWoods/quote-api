import { Router } from "express";
import { getQuotes, getQuoteByIndex, getRandomQuote } from "../database.js";

const quoteRouter = Router();

quoteRouter
  // Get a random quote from a collection
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
  // Get a quote by id from a collection
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
  })
  // Get all quotes from a collection
  .get("/:collection", async (req, res) => {
    try {
      const { collection } = req.params;

      if (collection === ":collection") {
        return res.status(400).json({ error: "Collection name is required." });
      }

      const quotes = await getQuotes(collection);

      console.log(`Retrieved collection: ${collection}`);

      res.json(quotes);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to retrieve quote." });
    }
  });

export default quoteRouter;
