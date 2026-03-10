import ResultCard from "./ResultCard";

function SearchResults({ data, loading, error }) {
  if (loading) {
    return <p className="text-sm text-slate-600">Running semantic vector search...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-slate-600">Submit a query to see ranked semantic results.</p>;
  }

  if (!data.results?.length) {
    return <p className="text-sm text-slate-600">No relevant documents found for this query.</p>;
  }

  return (
    <section className="grid gap-4">
      {data.results.map((result, idx) => (
        <ResultCard key={`${result.title}-${idx}`} result={result} index={idx} />
      ))}
    </section>
  );
}

export default SearchResults;
