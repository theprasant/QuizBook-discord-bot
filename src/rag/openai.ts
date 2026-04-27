import OpenAI from "openai";

import { openAiApiKey, openAiEmbeddingDimensions, openAiEmbeddingModel } from "../config/env.js";

export const openai = new OpenAI({
  apiKey: openAiApiKey,
});

export async function createEmbeddings(inputs: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: openAiEmbeddingModel,
    input: inputs,
    dimensions: openAiEmbeddingDimensions,
    encoding_format: "float",
  });

  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}
