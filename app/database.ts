import { Pool } from "pg";
import { Collection, Quote } from "./types.js";
import { ApiError } from "./errors.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    DROP TABLE IF EXISTS quotes;
    DROP TABLE IF EXISTS collections;

    CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      colors TEXT[] NOT NULL DEFAULT '{}'
    );
    
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      main TEXT NOT NULL,
      sub TEXT,
      collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE
    );
  `);
}

export async function addCollection(
  name: string,
  colors: string[],
  quotes: Pick<Quote, "main" | "sub">[],
): Promise<Collection> {
  const collectionResult = await pool.query(
    "INSERT INTO collections (name, colors) VALUES ($1, $2) RETURNING *",
    [name, colors],
  );

  const quoteResult = await pool.query(
    "INSERT INTO quotes (main, sub, collection_id) SELECT unnest($1::text[]), unnest($2::text[]), $3 RETURNING *",
    [
      quotes.map((q) => q.main),
      quotes.map((q) => q.sub || null),
      collectionResult.rows[0].id,
    ],
  );

  return {
    ...collectionResult.rows[0],
    quotes: quoteResult.rows,
  };
}

export async function getAllCollectionNames(): Promise<
  Pick<Collection, "id" | "name">[]
  > {
  const result = await pool.query(
    "SELECT id, name FROM collections ORDER BY name",
  );

  return result.rows
    .map(({ id, name }) => ({
      id,
      name,
    }))
    .sort((a, b) => a.id - b.id);
}

export async function getCollection(id: number): Promise<Collection> {
  const collectionResult = await pool.query(
    "SELECT * FROM collections WHERE id = $1",
    [id],
  );

  if (!collectionResult.rows.length) {
    throw new ApiError(`Collection '${id}' does not exist.`, 404);
  }

  const quotesResult = await pool.query(
    "SELECT * FROM quotes WHERE collection_id = $1",
    [id],
  );

  return {
    ...collectionResult.rows[0],
    quotes: quotesResult.rows,
  };
}

export async function updateCollection(
  collectionId: number,
  quotes: Omit<Quote, "id" | "collection_id">[],
): Promise<Quote[]> {
  if (!quotes.length) {
    throw new ApiError("At least one quote is required.", 400);
  }

  const mains = quotes.map((q) => q.main);
  const subs = quotes.map((q) => q.sub || null);
  const collectionIds = Array(quotes.length).fill(collectionId);

  const result = await pool.query(
    "INSERT INTO quotes (main, sub, collection_id) SELECT unnest($1::text[]), unnest($2::text[]), unnest($3::int[]) RETURNING *",
    [mains, subs, collectionIds],
  );

  return result.rows[0];
}

export async function deleteCollection(id: number): Promise<void> {
  await pool.query("DELETE FROM collections WHERE id = $1", [id]);
}

export async function getQuote(id: number): Promise<Quote> {
  const result = await pool.query("SELECT * FROM quotes WHERE id = $1", [id]);

  return result.rows[0];
}

export async function deleteQuote(id: number): Promise<void> {
  await pool.query("DELETE FROM quotes WHERE id = $1 RETURNING id", [id]);
}
