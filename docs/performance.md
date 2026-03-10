# Performance Optimization Playbook

## 1. Redis Caching

- Cache query embeddings keyed by normalized query string.
- Cache top-k response payloads for repeated searches.
- Benefit: avoids repeated embedding and vector search work for hot queries.

## 2. Query Optimization

- Tune `numCandidates` and `limit` based on latency/recall benchmarks.
- Apply metadata filters in `$vectorSearch.filter` to shrink candidate space.
- Use tight `$project` output to reduce payload size.
- Benefit: lower CPU and network overhead.

## 3. Hybrid Search

- Combine `$vectorSearch` with lexical scoring (`$search` / BM25) and rerank.
- Benefit: stronger relevance for exact phrases and semantic intent together.

## 4. Index Tuning

- Keep vector dimension exactly aligned with embedding model output (384).
- Add filter fields in vector index for fast pre-filtering.
- Keep non-vector operational indexes for list/reporting paths.
- Benefit: stable latency and better index utilization.

## 5. Monitoring

- Add Prometheus metrics to backend and AI service (request latency, error rate).
- Use Grafana dashboards for API p95 and ingestion throughput.
- Track Atlas metrics (query latency, index utilization, RU/CPU spikes).
- Benefit: faster bottleneck detection and proactive capacity planning.
