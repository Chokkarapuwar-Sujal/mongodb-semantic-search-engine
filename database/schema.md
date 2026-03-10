# MongoDB Schema Design

## Collection: `documents`

```json
{
  "_id": "ObjectId",
  "title": "string",
  "content": "string",
  "metadata": {
    "author": "string",
    "tags": ["string"],
    "source": "string",
    "createdAt": "date"
  },
  "embedding": [0.0123, -0.0042],
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Example Document

```json
{
  "title": "MongoDB Query Optimization Guide",
  "content": "Use compound indexes and reduce scanned documents to optimize query latency.",
  "metadata": {
    "author": "DB Team",
    "tags": ["mongodb", "performance", "indexing"],
    "source": "internal-wiki",
    "createdAt": { "$date": "2026-01-10T10:00:00.000Z" }
  },
  "embedding": [0.024, -0.013, 0.441],
  "createdAt": { "$date": "2026-01-10T10:00:00.000Z" },
  "updatedAt": { "$date": "2026-01-10T10:00:00.000Z" }
}
```

## Atlas Vector Search Index

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "metadata.tags"
    },
    {
      "type": "filter",
      "path": "metadata.author"
    }
  ]
}
```

## Indexing Strategy

- Create one Atlas Vector Search index on `embedding` for semantic retrieval.
- Add filter fields inside the same vector index for pre-filtering by tags/author.
- Add standard B-tree indexes for operational queries:
  - `metadata.createdAt` descending
  - `metadata.tags` multikey

## Query Optimization

- Keep `numCandidates` high enough for recall and tune per latency budget.
- Pre-filter on metadata to reduce candidate set.
- Return only needed fields with `$project`.
- Normalize embeddings consistently at write and query time.

## Aggregation Pipeline (Vector Search)

```javascript
[
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 200,
      limit: 10,
      filter: {
        "metadata.tags": { $in: ["mongodb"] }
      }
    }
  },
  { $set: { score: { $meta: "vectorSearchScore" } } },
  {
    $project: {
      title: 1,
      content: 1,
      metadata: 1,
      score: 1
    }
  }
]
```
