import type { Client } from "discord.js";

import { slashCommands } from "../commands/index.js";

export async function handleReady(client: Client<true>): Promise<void> {
  await client.application.commands.set(slashCommands.map((command) => command.data.toJSON()));
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Registered ${slashCommands.length} slash command(s).`);
}
