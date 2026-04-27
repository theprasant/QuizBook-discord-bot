import { MongoClient, type Collection, type Db } from "mongodb";

import {
  mongoChunksCollectionName,
  mongoConversationsCollectionName,
  mongoDbName,
  mongoUri,
} from "../config/env.js";
import type { ConversationDocument, DocumentChunk } from "../types/rag.js";

const client = new MongoClient(mongoUri);

let db: Db | undefined;

export async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db(mongoDbName);
  }

  return db;
}

export async function getChunksCollection(): Promise<Collection<DocumentChunk>> {
  return (await getDb()).collection<DocumentChunk>(mongoChunksCollectionName);
}

export async function getConversationsCollection(): Promise<Collection<ConversationDocument>> {
  return (await getDb()).collection<ConversationDocument>(mongoConversationsCollectionName);
}

export async function closeMongo(): Promise<void> {
  await client.close();
  db = undefined;
}
