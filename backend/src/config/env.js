const dotenv = require("dotenv");

dotenv.config();

const required = ["MONGO_URI", "MONGO_DB", "MONGO_COLLECTION", "AI_SERVICE_URL"];
const strictValidation = process.env.NODE_ENV !== "test";
if (strictValidation) {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

module.exports = {
  port: Number(process.env.BACKEND_PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017",
  mongoDb: process.env.MONGO_DB || "semantic_search",
  mongoCollection: process.env.MONGO_COLLECTION || "documents",
  vectorIndexName: process.env.VECTOR_INDEX_NAME || "vector_index",
  defaultSearchLimit: Number(process.env.DEFAULT_SEARCH_LIMIT || 10),
  defaultNumCandidates: Number(process.env.DEFAULT_NUM_CANDIDATES || 200),
};
