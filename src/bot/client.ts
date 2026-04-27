import { Client, Events, GatewayIntentBits, Partials } from "discord.js";

import { handleInteractionCreate } from "./events/interaction-create.js";
import { handleMessageCreate } from "./events/message-create.js";
import { handleReady } from "./events/ready.js";

export function createDiscordClient(): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User],
  });

  client.once(Events.ClientReady, (readyClient) => {
    void handleReady(readyClient);
  });

  client.on(Events.InteractionCreate, (interaction) => {
    void handleInteractionCreate(interaction);
  });

  client.on(Events.MessageCreate, (message) => {
    void handleMessageCreate(message);
  });

  return client;
}