import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";

interface AppConfig {
  openai: {
    model: string;
    embeddingModel: string;
    embeddingDimensions: number;
  };
  mongodb: {
    dbName: string;
    chunksCollection: string;
    conversationsCollection: string;
    vectorIndex: string;
  };
  google: {
    docId: string;
  };
  rag: {
    sourceId: string;
    topK: number;
    conversationHistoryLimit: number;
  };
  bot?: {
    adminUserIds?: string[];
    adminRoleIds?: string[];
  };
}

const config = loadConfig();

export function getEnv(name: keyof NodeJS.ProcessEnv, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const openAiApiKey = getEnv("OPENAI_API_KEY");
export const openAiModel = config.openai.model;
export const openAiEmbeddingModel = config.openai.embeddingModel;
export const openAiEmbeddingDimensions = config.openai.embeddingDimensions;

export const discordToken = getEnv("DISCORD_TOKEN");

export const mongoUri = getEnv("MONGODB_URI");
export const mongoDbName = config.mongodb.dbName;
export const mongoChunksCollectionName = config.mongodb.chunksCollection;
export const mongoConversationsCollectionName = config.mongodb.conversationsCollection;
export const mongoVectorIndexName = config.mongodb.vectorIndex;

export const googleDocId = config.google.docId;
export const googleServiceAccountEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
export const googlePrivateKey = getEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

export const ragSourceId = config.rag.sourceId || googleDocId;
export const ragTopK = config.rag.topK;
export const ragConversationHistoryLimit = config.rag.conversationHistoryLimit;
export const botAdminUserIds = config.bot?.adminUserIds ?? [];
export const botAdminRoleIds = config.bot?.adminRoleIds ?? [];

function loadConfig(): AppConfig {
  const configPath = path.resolve("config.json");
  const raw = readFileSync(configPath, "utf8");

  return JSON.parse(raw) as AppConfig;
}
