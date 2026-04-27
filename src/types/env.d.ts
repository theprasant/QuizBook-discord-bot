declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_TOKEN?: string;
    DISCORD_CLIENT_ID?: string;
    DISCORD_GUILD_ID?: string;
    OPENAI_API_KEY?: string;
    MONGODB_URI?: string;
    GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
    GOOGLE_PRIVATE_KEY?: string;
  }
}
