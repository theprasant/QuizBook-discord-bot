import type { Document } from "mongodb";

import { mongoVectorIndexName, ragTopK } from "../config/env.js";
import { getChunksCollection } from "../db/mongo.js";
import type { DocumentChunk, RetrievedChunk } from "../types/rag.js";

export async function replaceSourceChunks(sourceId: string, chunks: DocumentChunk[]): Promise<void> {
  const collection = await getChunksCollection();

  await collection.deleteMany({ sourceId });

  if (chunks.length > 0) {
    await collection.insertMany(chunks);
  }
}

export async function searchChunks(
  queryEmbedding: number[],
  sourceId: string,
  limit = ragTopK,
): Promise<RetrievedChunk[]> {
  const collection = await getChunksCollection();
  const pipeline: Document[] = [
    {
      $vectorSearch: {
        index: mongoVectorIndexName,
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: Math.max(limit * 20, 100),
        limit,
        filter: {
          sourceId,
        },
      },
    },
    {
      $project: {
        _id: 0,
        chunkId: 1,
        sourceId: 1,
        sourceName: 1,
        chunkIndex: 1,
        text: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];

  return collection.aggregate<RetrievedChunk>(pipeline).toArray();
}
