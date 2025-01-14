import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import {
  addCollection,
  deleteCollection,
  getAllCollectionNames,
  getCollection,
  updateCollection,
} from "../database";
import { ApiError } from "../errors";
import { basicAuth } from "../middleware";

const collectionRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

export default collectionRouter
  // Get a collection and all quotes in it
  .get("/:id", async (req, res, next) => {
    const { id } = req.params;

    try {
      const collection = await getCollection(Number(id));

      res.json(collection);
    } catch (err) {
      next(err);
    }
  })
  // Get all collection names
  .get("/", async (_req, res, next) => {
    try {
      const collectionNames = await getAllCollectionNames();

      res.json(collectionNames);
    } catch (err) {
      next(err);
    }
  })
  // Add a new collection
  .post("/", basicAuth, async (req, res, next) => {
    const { name, colors } = req.body;

    try {
      if (!name) {
        throw new ApiError("Collection name is required.", 400);
      } else if (
        !colors ||
        !Array.isArray(colors) ||
        colors.some((c) => typeof c !== "string")
      ) {
        throw new ApiError(
          "Collection colors must be an array of strings.",
          400,
        );
      }

      const collection = await addCollection(name, colors);

      res.json(collection);
    } catch (err) {
      next(err);
    }
  })
  // Add new quotes to a collection
  .put(
    "/",
    [basicAuth, upload.single("quotes")],
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.body;

      try {
        if (!req.file) {
          throw new ApiError("File is required.", 400);
        } else if (!id) {
          throw new ApiError("Collection id is required.", 400);
        }

        const { quotes } = JSON.parse(req.file.buffer.toString());

        if (!quotes || !Array.isArray(quotes)) {
          throw new ApiError(
            'Collection files must contain "quotes" key with an array of quotes.',
            400,
          );
        }

        const invalidQuotes = quotes.filter(
          (quote) =>
            !quote.main ||
            typeof quote.main !== "string" ||
            (quote.sub !== undefined && typeof quote.sub !== "string"),
        );

        if (invalidQuotes.length) {
          throw new ApiError(
            'Each quote must have a "main" field as string and optional "sub" field as string.',
            400,
          );
        }

        await updateCollection(id, quotes);

        res.json(`Collection '${id}' updated.`);
      } catch (err) {
        next(err);
      }
    },
  )
  // Delete a collection
  .delete("/:id", basicAuth, async (req, res, next) => {
    const { id } = req.params;

    try {
      await deleteCollection(Number(id));

      res.json(`Collection '${id}' deleted.`);
    } catch (err) {
      next(err);
    }
  });
