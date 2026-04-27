import { MessageFlags, SlashCommandBuilder } from "discord.js";

import { botAdminUserIds } from "../../config/env.js";
import { ingestGoogleDoc } from "../../rag/ingest-google-doc.js";
import type { SlashCommand } from "../../types/bot.js";

export const refreshDocCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("refresh-doc")
    .setDescription("Refresh the bot knowledge base from the configured Google Doc."),

  async execute(interaction) {
    if (!canRefresh(interaction.user.id)) {
      await interaction.reply({
        content: "You are not allowed to refresh the document index.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral }); // Ephemeral reply

    const result = await ingestGoogleDoc();

    await interaction.editReply(
      `Refreshed "${result.sourceName}" with ${result.chunkCount} chunks in source "${result.sourceId}".`,
    );
  },
};

function canRefresh(userId: string): boolean {
  return botAdminUserIds.length === 0 || botAdminUserIds.includes(userId);
}
