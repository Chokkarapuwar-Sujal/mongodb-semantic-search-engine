import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 20000,
});

export async function searchDocuments(payload) {
  const response = await client.post("/search", payload);
  return response.data;
}
