/* eslint-disable no-undef */
import dns from "dns";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

let client;
let database;

export async function connectDatabase() {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    database = client.db(process.env.MONGODB_DB_NAME);
    console.log("Connected to database");

    return client;
  } catch (err) {
    console.error(err);
  }
}

async function doesCollectionExist(name) {
  try {
    const collections = await database.listCollections().toArray();
    return collections.some((collection) => collection.name === name);
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

    const insertResult = await collection.insertMany(data.quotes, {
      ordered: true,
    });
    console.log(`${insertResult.insertedCount} documents inserted`);
  } catch (err) {
    console.error(err);
  }
}

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

    const quote = await collection.findOne({ id: Number(index) });

    return quote;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllQuotes(name) {
  try {
    if (!(await doesCollectionExist(name))) {
      return { error: `Collection '${name}' does not exist.` };
    }

    const collection = database.collection(name);
    const quotes = await collection.find().sort({ id: 1 }).toArray();

    return quotes;
  } catch (err) {
    console.error(err);
  }
}
