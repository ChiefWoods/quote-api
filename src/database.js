import dns from "dns";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export let client;
let database;

try {
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  database = client.db(process.env.MONGODB_DB_NAME);
  console.log("Connected to database");
} catch (err) {
  console.error(err);
  process.exit(0);
}

// Collections

async function doesCollectionExist(name) {
  try {
    const collections = await database.listCollections().toArray();

    return collections.some((collection) => collection.name === name);
  } catch (err) {
    console.error(err);
  }
}

export async function getCollection(name) {
  try {
    if (!(await doesCollectionExist(name))) {
      return { error: `Collection '${name}' does not exist.` };
    }

    const quotes = await database.collection(name).find().toArray();
    const metadata = await getMetadata(name);

    return { fullName: metadata.fullName, quotes, colors: metadata.colors };
  } catch (err) {
    console.error(err);
  }
}

export async function getAllCollectionNames() {
  try {
    const collections = await database.collection("metadata").find().toArray();

    const names = collections.map(({ collection, fullName }) => {
      return { name: collection, fullName };
    });

    return names;
  } catch (err) {
    console.error(err);
  }
}

export async function updateCollection(name, data) {
  try {
    const collection = database.collection(name);

    if (await doesCollectionExist(name)) {
      await collection.drop();
      console.log(`Collection ${name} dropped`);
    }

    const insertResult = await collection.insertMany(
      data.quotes || data.metadata,
      {
        ordered: true,
      },
    );

    console.log(`${insertResult.insertedCount} documents inserted`);
  } catch (err) {
    console.error(err);
  }
}

// Quotes

export async function getRandomQuote(name) {
  try {
    if (!(await doesCollectionExist(name))) {
      return { error: `Collection '${name}' does not exist.` };
    }

    const collection = database.collection(name);
    const quote = await collection.aggregate([{ $sample: { size: 1 } }]).next();

    return quote;
  } catch (err) {
    console.error(err);
  }
}

export async function getQuoteByIndex(name, index) {
  try {
    if (!(await doesCollectionExist(name))) {
      return { error: `Collection '${name}' does not exist.` };
    }

    const collection = database.collection(name);
    const count = await collection.countDocuments();

    if (isNaN(index) || index < 1 || index > count) {
      return { error: `Id must be between 1 and ${count}.` };
    }

    const quote = await collection.findOne({ _id: Number(index) });

    return quote;
  } catch (err) {
    console.error(err);
  }
}

export async function getQuotes(name) {
  try {
    if (!(await doesCollectionExist(name))) {
      return { error: `Collection '${name}' does not exist.` };
    }

    const quotes = await database.collection(name).find().toArray();

    return quotes;
  } catch (err) {
    console.error(err);
  }
}

// Metadata

export async function getMetadata(name) {
  try {
    const collection = await database.collection("metadata").find().toArray();

    let metadata;

    for (const col of collection) {
      if (col.collection === name) {
        metadata = col;
        break;
      }
    }

    if (!metadata) {
      return { error: `Collection '${name}' does not exist.` };
    }

    return metadata;
  } catch (err) {
    console.error(err);
  }
}
