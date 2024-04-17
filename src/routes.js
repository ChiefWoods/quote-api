/* eslint-disable no-undef */
import express from "express";
import cors from "cors";
import multer from "multer";
import {
  connectDatabase,
  updateCollection,
  getRandomQuote,
  getQuoteByIndex,
  getAllQuotes,
} from "./database.js";

const port = 8000;

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

const client = await connectDatabase();

// Updates a collection entirely, creates a new collection if it doesn't exist
app.put("/api/quotes/", upload.single("collection"), async (req, res) => {
  try {
    const name = req.body.name;

    if (!name) {
      return res.status(400).json({ error: "Collection name is required." });
    } else if (!req.file) {
      return res.status(400).json({ error: "File is required." });
    }

    const data = JSON.parse(req.file.buffer.toString());

    if (!data.quotes) {
      return res.status(400).json({
        error: "File must contain 'quotes' key with an array of quotes.",
      });
    }

    await updateCollection(name, data);
    res.json({ success: `Collection '${name}' updated.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update collection." });
  }
});

// Retrieve a random quote from a collection
app.get("/api/quotes/:name/random", async (req, res) => {
  try {
    const { name } = req.params;

    if (name === ":name") {
      return res.status(400).json({ error: "Collection name is required." });
    }

    const quote = await getRandomQuote(name);

    if (quote.error) {
      return res.status(404).json(quote);
    }

    console.log(`Retrieved quote: ${quote._id}`);
    delete quote._id;

    res.json(quote);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve quote." });
  }
});

// Retrieve a quote by id from a collection
app.get("/api/quotes/:name/:id", async (req, res) => {
  try {
    const { name, id } = req.params;

    if (name === ":name") {
      return res.status(400).json({ error: "Collection name is required." });
    }

    if (id === ":id") {
      return res.status(400).json({ error: "Quote id is required." });
    }

    const quote = await getQuoteByIndex(name, id);

    if (quote.error) {
      return res.status(404).json(quote);
    }

    console.log(`Retrieved quote: ${quote._id}`);
    delete quote._id;

    res.json(quote);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve quote." });
  }
});

// Retrieve all quotes from a collection
app.get("/api/quotes/:name", async (req, res) => {
  try {
    const { name } = req.params;

    if (name === ":name") {
      return res.status(400).json({ error: "Collection name is required." });
    }

    const quotes = await getAllQuotes(name);

    if (quotes) {
      console.log(`Retrieved ${quotes.length} quotes`);
    }

    quotes.filter((quote) => delete quote._id);

    res.json(quotes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve quotes." });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));

process.on("SIGINT", async () => {
  await client.close();
  console.log("Disconnected from database");
  process.exit(0);
});
