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
import { checkInvalidQuotes } from "../utils";

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
  .post(
    "/",
    [basicAuth, upload.single("collection")],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          throw new ApiError("File is required.", 400);
        }

        const { name, colors, quotes } = JSON.parse(req.file.buffer.toString());

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
        } else if (!quotes || !Array.isArray(quotes)) {
          throw new ApiError(
            'Collection files must contain "quotes" key with an array of quotes.',
            400,
          );
        }

        checkInvalidQuotes(quotes);

        const collection = await addCollection(name, colors, quotes);

        res.json(collection);
      } catch (err) {
        next(err);
      }
    },
  )
  // Update a collection
  .put(
    "/:id",
    basicAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { name, colors } = req.body;

      try {
        if (!id) {
          throw new ApiError("Collection id is required.", 400);
        } else if (!name && !colors) {
          throw new ApiError("At least 'name' or 'colors' is required.", 400);
        }

        const collection = await updateCollection(Number(id), { name, colors });

        res.json(collection);
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
