export default function Pagination({ pagination, onPageChange }) {
  const { page = 1, totalPages = 1, from = 0, to = 0, total = 0 } = pagination || {};

  if (!total) return null;

  function buildRange(current, max) {
    if (max <= 7) return Array.from({ length: max }, (_, i) => i + 1);
    if (current <= 4)       return [1, 2, 3, 4, 5, '...', max];
    if (current >= max - 3) return [1, '...', max-4, max-3, max-2, max-1, max];
    return [1, '...', current-1, current, current+1, '...', max];
  }

  const range = buildRange(page, totalPages);

  const base = "min-w-[34px] h-[34px] px-2 flex items-center justify-center rounded-lg border text-sm transition-all cursor-pointer";
  const normal   = `${base} bg-gray-800 border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400`;
  const active   = `${base} bg-blue-600 border-blue-600 text-white font-bold`;
  const disabled = `${base} bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed opacity-40`;

  return (
    <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
      <p className="text-sm text-gray-500">
        Showing{' '}
        <span className="text-white font-semibold">{from}–{to}</span>
        {' '}of{' '}
        <span className="text-white font-semibold">{total}</span>
        {' '}records
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1 flex-wrap">
          <button
            className={page === 1 ? disabled : normal}
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            ←
          </button>

          {range.map((p, i) =>
            p === '...'
              ? <span key={`e${i}`} className="text-gray-600 px-1">…</span>
              : <button
                  key={p}
                  className={p === page ? active : normal}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
          )}

          <button
            className={page === totalPages ? disabled : normal}
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}