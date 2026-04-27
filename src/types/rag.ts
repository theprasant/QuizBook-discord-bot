import type { ObjectId } from "mongodb";

export interface DocumentChunk {
  _id?: ObjectId;
  chunkId: string;
  sourceId: string;
  sourceType: "google_doc";
  sourceName: string;
  chunkIndex: number;
  text: string;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RetrievedChunk {
  chunkId: string;
  sourceId: string;
  sourceName: string;
  chunkIndex: number;
  text: string;
  score: number;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ConversationDocument {
  _id?: ObjectId;
  userId: string;
  messages: ConversationMessage[];
  createdAt: Date;
  updatedAt: Date;
}
