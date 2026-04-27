import { ragConversationHistoryLimit } from "../config/env.js";
import { getConversationsCollection } from "../db/mongo.js";
import type { ConversationDocument, ConversationMessage } from "../types/rag.js";

export async function getRecentConversation(userId: string): Promise<ConversationMessage[]> {
  const collection = await getConversationsCollection();
  const conversation = await collection.findOne({ userId });

  return conversation?.messages.slice(-ragConversationHistoryLimit) ?? [];
}

export async function appendConversationTurn(
  userId: string,
  userContent: string,
  assistantContent: string,
): Promise<void> {
  const now = new Date();
  const messages: ConversationMessage[] = [
    { role: "user", content: userContent, createdAt: now },
    { role: "assistant", content: assistantContent, createdAt: now },
  ];
  const collection = await getConversationsCollection();

  await collection.updateOne(
    { userId },
    {
      $setOnInsert: {
        userId,
        createdAt: now,
      } satisfies Partial<ConversationDocument>,
      $push: {
        messages: {
          $each: messages,
          $slice: -(ragConversationHistoryLimit * 2),
        },
      },
      $set: {
        updatedAt: now,
      },
    },
    { upsert: true },
  );
}
