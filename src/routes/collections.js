import { Router } from "express";
import multer from "multer";
import {
  getAllCollectionNames,
  getCollection,
  updateCollection,
} from "../database";

const collectionRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

collectionRouter
  // Retrieves a collection
  .get("/:name", async (req, res) => {
    try {
      const { name } = req.params;

      if (name === ":name") {
        return res.status(400).json({ error: "Collection name is required." });
      }

      const collection = await getCollection(name);

      console.log(`Retrieved collection: ${name}`);

      res.json(collection);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to retrieve collection." });
    }
  })
  // Retrieves all collection names
  .get("/", async (req, res) => {
    try {
      const collections = await getAllCollectionNames();

      console.log(`Retrieved ${collections.length} collection names`);

      res.json(collections);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to retrieve collection names." });
    }
  })
  // Updates a collection entirely, creates a new collection if it doesn't exist
  .put("/", upload.single("collection"), async (req, res) => {
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

      const [username, password] = Buffer.from(
        authHeader.split(" ")[1],
        "base64",
      )
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

      console.log(`Updated collection: ${name}`);

      await updateCollection(name, data);
      res.json({ success: `Collection '${name}' updated.` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to update collection." });
    }
  });

export default collectionRouter;
