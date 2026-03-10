const env = require("../config/env");

async function semanticSearch(collection, queryVector, options = {}) {
  const limit = Number(options.limit || env.defaultSearchLimit);
  const numCandidates = Number(options.numCandidates || env.defaultNumCandidates);
  const skip = Number(options.skip || 0);
  const filter = options.filter || {};
  const hasFilter = filter && Object.keys(filter).length > 0;

  const pipeline = [
    {
      $vectorSearch: {
        index: env.vectorIndexName,
        path: "embedding",
        queryVector,
        numCandidates,
        limit: limit + skip,
        ...(hasFilter ? { filter } : {}),
      },
    },
    { $set: { score: { $meta: "vectorSearchScore" } } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        title: 1,
        content: 1,
        metadata: 1,
        score: 1,
      },
    },
  ];

  return collection.aggregate(pipeline).toArray();
}

module.exports = { semanticSearch };
