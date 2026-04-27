import type { Message } from "discord.js";

export async function replyInChunks(message: Message, content: string): Promise<void> {
  for (const chunk of splitDiscordMessage(content)) {
    await message.reply(chunk);
  }
}

export function splitDiscordMessage(content: string): string[] {
  const maxLength = 1900;
  const chunks: string[] = [];

  for (let index = 0; index < content.length; index += maxLength) {
    chunks.push(content.slice(index, index + maxLength));
  }

  return chunks.length > 0 ? chunks : ["I do not know from the document."];
}
