import { Router } from "express";
import multer from "multer";
import {
  getAllCollectionNames,
  getCollection,
  updateCollection,
} from "../database.js";
import { logRequest } from "../utils.js";

const collectionRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

collectionRouter
  // Get a collection
  .get("/:name", async (req, res) => {
    try {
      const { name } = req.params;

      if (name === ":name") {
        return res.status(400).json({ error: "Collection name is required." });
      }

      const collection = await getCollection(name);

      if (collection.error) {
        return res.status(404).json(collection);
      }

      if (collection.quotes) {
        collection.quotes.sort((a, b) => a._id - b._id);
      } else if (collection.metadata) {
        collection.metadata.sort((a, b) => a._id - b._id);
      }
      
      logRequest(req.method, req.originalUrl);

      res.json(collection);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to retrieve collection." });
    }
  })
  // Get all collection names
  .get("/", async (req, res) => {
    try {
      const collections = await getAllCollectionNames();

      logRequest(req.method, req.originalUrl);

      res.json(collections);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to retrieve collection names." });
    }
  })
  // Updates a collection or metadata file entirely, creates a new collection if it doesn't exist
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

      if (
        (data.name !== "metadata" && !data.quotes) ||
        (data.name === "metadata" && !data.metadata)
      ) {
        return res.status(400).json({
          error:
            "Collection files must contain 'quotes' key with an array of quotes; metadata files must contain 'metadata' key with an array of metadata.",
        });
      }

      await updateCollection(name, data);
      logRequest(req.method, req.originalUrl);

      if (name !== "metadata") {
        res.json({ success: `Collection '${name}' updated.` });
      } else {
        res.json({ success: "Metadata updated." });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to update collection." });
    }
  });

export default collectionRouter;
