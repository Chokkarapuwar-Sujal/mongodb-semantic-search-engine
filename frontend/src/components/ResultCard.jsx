function ResultCard({ result, index }) {
  return (
    <article className="animate-fade-slide rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h3 className="font-display text-lg text-ink">
          {index + 1}. {result.title}
        </h3>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-pop">
          Score: {Number(result.score || 0).toFixed(4)}
        </span>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-700">{result.content}</p>
      <div className="flex flex-wrap gap-2">
        {(result.metadata?.tags || []).map((tag) => (
          <span key={tag} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs text-teal-800">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

export default ResultCard;
