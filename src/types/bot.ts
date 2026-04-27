import type { ChatInputCommandInteraction, ClientEvents, SlashCommandBuilder } from "discord.js";

export type BotEventName = keyof ClientEvents;

export interface BotConfig {
  token: string;
  clientId: string;
  guildId?: string;
}

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
