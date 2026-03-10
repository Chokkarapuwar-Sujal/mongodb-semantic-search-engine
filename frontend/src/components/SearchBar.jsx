import { useState } from "react";

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form onSubmit={submit} className="w-full max-w-3xl rounded-2xl bg-white/90 p-4 shadow-lg ring-1 ring-slate-200 backdrop-blur">
      <label htmlFor="query" className="mb-2 block font-display text-lg text-ink">
        Search by intent, not keyword
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="query"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="e.g. How do I optimize MongoDB query latency?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-5 py-3 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
