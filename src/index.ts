import { createDiscordClient } from "./bot/client.js";
import { discordToken } from "./config/env.js";
import { closeMongo } from "./db/mongo.js";

const client = createDiscordClient();

process.once("SIGINT", () => {
  void shutdown();
});

process.once("SIGTERM", () => {
  void shutdown();
});

await client.login(discordToken);

async function shutdown(): Promise<void> {
  client.destroy();
  await closeMongo();
  process.exit(0);
}
