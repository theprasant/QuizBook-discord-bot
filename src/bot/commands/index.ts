import type { SlashCommand } from "../../types/bot.js";
import { refreshDocCommand } from "./refresh-doc.js";

export const slashCommands: SlashCommand[] = [
  refreshDocCommand,
];

export const slashCommandMap = new Map(
  slashCommands.map((command) => [command.data.name, command]),
);
