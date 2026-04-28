import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";

import { botAdminRoleIds, botAdminUserIds } from "../../config/env.js";
import { ingestGoogleDoc } from "../../rag/ingest-google-doc.js";
import type { SlashCommand } from "../../types/bot.js";

const botAdminUserIdSet = new Set(botAdminUserIds);
const botAdminRoleIdSet = new Set(botAdminRoleIds);

export const refreshDocCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("refresh-doc")
    .setDescription("Refresh the bot knowledge base from the configured Google Doc."),

  async execute(interaction) {
    if (!canRefresh(interaction.user.id, getMemberRoleIds(interaction.member))) {
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

function canRefresh(userId: string, roleIds: string[]): boolean {
  if (botAdminUserIdSet.size === 0 && botAdminRoleIdSet.size === 0) {
    return true;
  }

  return botAdminUserIdSet.has(userId) || roleIds.some((roleId) => botAdminRoleIdSet.has(roleId));
}

function getMemberRoleIds(member: ChatInputCommandInteraction["member"]): string[] {
  const roles = member?.roles;

  if (!roles) {
    return [];
  }

  if (Array.isArray(roles)) {
    return roles;
  }

  return [...roles.cache.keys()];
}
