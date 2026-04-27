import { ragSourceId } from "../config/env.js";
import type { DocumentChunk } from "../types/rag.js";
import { chunkText } from "./chunk.js";
import { readGoogleDocText } from "./google-docs.js";
import { replaceSourceChunks } from "./mongo-vector-store.js";
import { createEmbeddings } from "./openai.js";

const EMBEDDING_BATCH_SIZE = 64;

export interface IngestGoogleDocResult {
  sourceId: string;
  sourceName: string;
  chunkCount: number;
}

export async function ingestGoogleDoc(): Promise<IngestGoogleDocResult> {
  const document = await readGoogleDocText();
  const chunks = chunkText(document.text);

  if (chunks.length === 0) {
    throw new Error(`Google Doc "${document.title}" did not produce any text chunks.`);
  }

  const records: DocumentChunk[] = [];

  for (let start = 0; start < chunks.length; start += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(start, start + EMBEDDING_BATCH_SIZE);
    const embeddings = await createEmbeddings(batch.map((chunk) => chunk.text));

    for (let index = 0; index < batch.length; index += 1) {
      const chunk = batch[index];
      const embedding = embeddings[index];

      if (!chunk || !embedding) {
        continue;
      }

      const now = new Date();

      records.push({
        chunkId: `${ragSourceId}#chunk-${chunk.index}`,
        sourceId: ragSourceId,
        sourceType: "google_doc",
        sourceName: document.title,
        chunkIndex: chunk.index,
        text: chunk.text,
        embedding,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await replaceSourceChunks(ragSourceId, records);

  return {
    sourceId: ragSourceId,
    sourceName: document.title,
    chunkCount: records.length,
  };
}
