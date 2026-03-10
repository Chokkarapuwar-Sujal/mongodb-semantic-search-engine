const request = require("supertest");

jest.mock("../src/config/db", () => ({
  connectDb: jest.fn(),
}));

jest.mock("../src/services/embeddingClient", () => ({
  getEmbedding: jest.fn(),
}));

const { connectDb } = require("../src/config/db");
const { getEmbedding } = require("../src/services/embeddingClient");
const app = require("../src/app");

describe("POST /api/search", () => {
  it("returns semantic search results", async () => {
    getEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
    connectDb.mockResolvedValue({
      aggregate: () => ({
        toArray: async () => [
          {
            title: "Test Doc",
            content: "Some content",
            score: 0.91,
            metadata: { tags: ["test"] },
          },
        ],
      }),
    });

    const response = await request(app).post("/api/search").send({ query: "database optimization" });

    expect(response.statusCode).toBe(200);
    expect(response.body.results).toHaveLength(1);
    expect(response.body.results[0].title).toBe("Test Doc");
  });

  it("returns 400 for invalid payload", async () => {
    const response = await request(app).post("/api/search").send({ query: "" });
    expect(response.statusCode).toBe(400);
  });
});
