import { ChannelType, type Client, type Message } from "discord.js";
import type { GatewayMessageCreateDispatchData } from "discord-api-types/v10";

import { answerWithRag } from "../../rag/answer.js";
import { appendConversationTurn, getRecentConversation } from "../../rag/conversation-store.js";
import { replyInChunks } from "../utils/discord-messages.js";

export async function handleMessageCreate(message: Message): Promise<void> {
  if (message.author.bot || message.channel.type !== ChannelType.DM) {
    return;
  }

  const question = message.content.trim();

  if (!question) {
    return;
  }

  await message.channel.sendTyping();

  try {
    const history = await getRecentConversation(message.author.id);
    const response = await answerWithRag(question, history);

    await replyInChunks(message, response.answer);
    await appendConversationTurn(message.author.id, question, response.answer);
  } catch (error: unknown) {
    console.error(error);
    await message.reply("I could not answer that from the document right now. Please try again in a moment.");
  }
}
