const axios = require("axios");
const env = require("../config/env");

async function getEmbedding(text) {
  const response = await axios.post(`${env.aiServiceUrl}/embed`, { text }, { timeout: 20000 });
  return response.data.embedding;
}

async function getBatchEmbeddings(texts) {
  const response = await axios.post(
    `${env.aiServiceUrl}/embed/batch`,
    { texts },
    { timeout: 30000 }
  );
  return response.data.embeddings;
}

module.exports = { getEmbedding, getBatchEmbeddings };
