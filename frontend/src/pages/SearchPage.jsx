import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import { useSemanticSearch } from "../hooks/useSemanticSearch";

function SearchPage() {
  const [payload, setPayload] = useState(null);
  const searchMutation = useSemanticSearch();

  const handleSearch = async (query) => {
    const requestPayload = { query, page: 1, limit: 8 };
    setPayload(requestPayload);
    await searchMutation.mutateAsync(requestPayload);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 animate-fade-slide">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">MongoDB Semantic Search Engine</p>
        <h1 className="font-display text-3xl text-ink sm:text-4xl">Find meaning across your documents</h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          This UI sends a natural-language query to the Node API, which calls the Python embedding service and
          executes Atlas Vector Search.
        </p>
      </header>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} loading={searchMutation.isPending} />
      </div>

      <div className="space-y-3">
        {payload ? (
          <p className="text-xs text-slate-500">
            Query: <span className="font-medium text-slate-700">{payload.query}</span>
          </p>
        ) : null}
        <SearchResults
          data={searchMutation.data}
          loading={searchMutation.isPending}
          error={searchMutation.error?.response?.data?.error || searchMutation.error?.message}
        />
      </div>
    </main>
  );
}

export default SearchPage;
