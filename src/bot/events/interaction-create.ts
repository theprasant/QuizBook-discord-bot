import type { Interaction } from "discord.js";

import { slashCommandMap } from "../commands/index.js";

export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = slashCommandMap.get(interaction.commandName);

  if (!command) {
    await interaction.reply({
      content: "Unknown command.",
      ephemeral: true,
    });
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error: unknown) {
    console.error(error);

    const message = "I could not run that command right now.";

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(message);
    } else {
      await interaction.reply({
        content: message,
        ephemeral: true,
      });
    }
  }
}
