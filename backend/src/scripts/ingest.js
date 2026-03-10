const fs = require("fs/promises");
const path = require("path");
const { connectDb, closeDb } = require("../config/db");
const { getBatchEmbeddings } = require("../services/embeddingClient");

const BATCH_SIZE = Number(process.env.INGEST_BATCH_SIZE || 25);

function toStorageDoc(doc, embedding) {
  return {
    title: doc.title,
    content: doc.content,
    metadata: {
      author: doc.metadata?.author || "unknown",
      tags: doc.metadata?.tags || [],
      createdAt: doc.metadata?.createdAt ? new Date(doc.metadata.createdAt) : new Date(),
    },
    embedding,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function ingest(filePath) {
  const absolutePath = path.resolve(filePath);
  const raw = await fs.readFile(absolutePath, "utf-8");
  const docs = JSON.parse(raw);

  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error("Input file must contain a non-empty JSON array of documents");
  }

  const collection = await connectDb();
  let inserted = 0;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    const texts = batch.map((doc) => `${doc.title}\n${doc.content}`);
    const embeddings = await getBatchEmbeddings(texts);

    const payload = batch.map((doc, idx) => toStorageDoc(doc, embeddings[idx]));
    const result = await collection.insertMany(payload);
    inserted += result.insertedCount;
  }

  return inserted;
}

(async () => {
  try {
    const inputFile = process.argv[2] || path.join(__dirname, "example-documents.json");
    const inserted = await ingest(inputFile);
    console.log(`Ingestion completed. Inserted ${inserted} documents.`);
  } catch (error) {
    console.error("Ingestion failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
})();
