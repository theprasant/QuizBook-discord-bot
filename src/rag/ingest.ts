import { closeMongo } from "../db/mongo.js";
import { ingestGoogleDoc } from "./ingest-google-doc.js";

async function main(): Promise<void> {
  const result = await ingestGoogleDoc();

  console.log(`Indexed Google Doc "${result.sourceName}".`);
  console.log(`Saved ${result.chunkCount} chunks to MongoDB source "${result.sourceId}".`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongo();
  });
