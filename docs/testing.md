# Testing Strategy

## Backend (Jest + Supertest)

- Validate search endpoint request schema.
- Validate successful semantic search response shape.
- Validate 4xx and 5xx behaviors.
- Validate health endpoint and middleware behavior.

## AI Service (pytest)

- Validate `/embed` and `/embed/batch` success responses.
- Validate validation failures for empty payloads.
- Validate embedding module conversion logic with mocked model.

## Database Integration

- Run optional integration suite against test Atlas cluster.
- Verify inserted documents include 384-d vector length.
- Verify vector query returns deterministic top-k for seeded fixtures.
