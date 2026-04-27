import { closeMongo } from "../db/mongo.js";
import { answerWithRag } from "./answer.js";

async function main(): Promise<void> {
  const question = process.argv.slice(2).join(" ").trim();

  if (!question) {
    throw new Error('Ask a question, for example: npm run ask -- "What is this document about?"');
  }

  const response = await answerWithRag(question);
  console.log(response.answer);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeMongo();
  });
