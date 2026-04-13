export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, from, to, total } = pagination;
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="pagination">
      <span>Showing {from}–{to} of {total}</span>

      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Prev</button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next →</button>
    </div>
  );
}