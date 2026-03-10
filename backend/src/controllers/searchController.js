const { z } = require("zod");
const { connectDb } = require("../config/db");
const { getEmbedding } = require("../services/embeddingClient");
const { semanticSearch } = require("../services/searchService");

const searchSchema = z.object({
  query: z.string().min(2).max(400),
  limit: z.number().int().min(1).max(50).optional(),
  page: z.number().int().min(1).max(1000).optional(),
  filter: z
    .object({
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
    })
    .optional(),
});

function buildFilter(filter) {
  if (!filter) return {};
  const mongoFilter = {};

  if (filter.tags?.length) {
    mongoFilter["metadata.tags"] = { $in: filter.tags };
  }
  if (filter.author) {
    mongoFilter["metadata.author"] = filter.author;
  }

  return mongoFilter;
}

async function searchDocuments(req, res, next) {
  try {
    const parsed = searchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request payload",
        details: parsed.error.flatten(),
      });
    }

    const { query, limit = 10, page = 1, filter } = parsed.data;
    const skip = (page - 1) * limit;

    const vector = await getEmbedding(query);
    const collection = await connectDb();
    const results = await semanticSearch(collection, vector, {
      limit,
      skip,
      filter: buildFilter(filter),
    });

    return res.json({
      query,
      page,
      limit,
      totalReturned: results.length,
      results,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { searchDocuments };
