import { openAiModel, ragSourceId, ragTopK } from "../config/env.js";
import type { ConversationMessage, RetrievedChunk } from "../types/rag.js";
import { createEmbeddings, openai } from "./openai.js";
import { searchChunks } from "./mongo-vector-store.js";

export interface RagAnswer {
  answer: string;
  chunks: RetrievedChunk[];
}

export async function answerWithRag(
  question: string,
  history: ConversationMessage[] = [],
): Promise<RagAnswer> {
  const [queryEmbedding] = await createEmbeddings([buildRetrievalQuery(question, history)]);

  if (!queryEmbedding) {
    throw new Error("Could not create a query embedding.");
  }

  const chunks = await searchChunks(queryEmbedding, ragSourceId, ragTopK);
  const context = chunks
    .map((chunk, index) => {
      return [
        `[${index + 1}] ${chunk.sourceName}, chunk ${chunk.chunkIndex}, score ${chunk.score.toFixed(3)}`,
        chunk.text,
      ].join("\n");
    })
    .join("\n\n");

  const response = await openai.responses.create({
    model: openAiModel,
    input: [
      {
        role: "system",
        content: [
          "You are a private DM assistant for a Discord bot.",
          "Answer using only the provided Google Doc context and the recent chat history.",
          "Use the history only to understand follow-up questions; do not invent facts from it.",
          "If the document context does not contain the answer, say you do not know from the document.",
          // "Be concise and cite source chunks like [1] or [2].",
        ].join(" "),
      },
      ...history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user" as const,
        content: `Question: ${question}\n\nGoogle Doc context:\n${context || "No relevant chunks found."}`,
      },
    ],
  });

  return {
    answer: response.output_text,
    chunks,
  };
}

function buildRetrievalQuery(question: string, history: ConversationMessage[]): string {
  const recentHistory = history
    .slice(-4)
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  return [recentHistory, `user: ${question}`].filter(Boolean).join("\n");
}
