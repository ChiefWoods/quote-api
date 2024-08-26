import express from "express";
import cors from "cors";
import multer from "multer";
import {
  client,
  updateCollection,
  getRandomQuote,
  getQuoteByIndex,
  getAllQuotes,
  getAllCollections,
} from "./database.js";

const port = 8000;

const app = express();
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// Retrieves all collections
app.get("/api/collections/", async (req, res) => {
  try {
    const collections = await getAllCollections();

    res.json(collections);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve collections." });
  }
});

// Updates a collection entirely, creates a new collection if it doesn't exist
app.put("/api/collections/", upload.single("collection"), async (req, res) => {
  try {
    const { name } = req.body;
    const authHeader = req.headers.authorization;

    if (!name) {
      return res.status(400).json({ error: "Collection name is required." });
    } else if (!req.file) {
      return res.status(400).json({ error: "File is required." });
    } else if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Authorization header is missing." });
    }

    const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

    if (
      !username ||
      !password ||
      username !== process.env.AUTH_USERNAME ||
      password !== process.env.AUTH_PASSWORD
    ) {
      return res.status(401).json({ error: "Unauthorized access." });
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

// Retrieve all quotes from a collection
app.get("/api/quotes/:collection", async (req, res) => {
  try {
    const { collection } = req.params;

    if (collection === ":collection") {
      return res.status(400).json({ error: "Collection name is required." });
    }

    const quotes = await getAllQuotes(collection);

    if (quotes) {
      console.log(`Retrieved ${quotes.length} quotes`);
    }

    res.json(quotes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve quotes." });
  }
});

// Retrieve a random quote from a collection
app.get("/api/quotes/:collection/random", async (req, res) => {
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
});

// Retrieve a quote by id from a collection
app.get("/api/quotes/:collection/:id", async (req, res) => {
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

app.listen(port, () => console.log(`Listening on port ${port}`));

process.on("SIGINT", async () => {
  await client.close();
  console.log("Disconnected from database");
  process.exit(0);
});
