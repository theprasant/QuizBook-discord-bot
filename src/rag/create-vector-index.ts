import { openAiEmbeddingDimensions, mongoVectorIndexName } from "../config/env.js";
import { closeMongo, getChunksCollection, getConversationsCollection } from "../db/mongo.js";

async function main(): Promise<void> {
  const chunksCollection = await getChunksCollection();
  const conversationsCollection = await getConversationsCollection();

  await chunksCollection.createIndex({ sourceId: 1, chunkId: 1 }, { unique: true });
  await conversationsCollection.createIndex({ userId: 1 }, { unique: true });

  const existingSearchIndexes = await chunksCollection
    .listSearchIndexes(mongoVectorIndexName)
    .toArray();

  if (existingSearchIndexes.length === 0) {
    await chunksCollection.createSearchIndex({
      name: mongoVectorIndexName,
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: openAiEmbeddingDimensions,
            similarity: "cosine",
          },
          {
            type: "filter",
            path: "sourceId",
          },
        ],
      },
    });

    console.log(`Vector search index "${mongoVectorIndexName}" is building.`);
  } else {
    console.log(`Vector search index "${mongoVectorIndexName}" already exists.`);
  }

  console.log("MongoDB document indexes are ready.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongo();
  });
