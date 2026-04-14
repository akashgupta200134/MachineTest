export default function CategoryTable({ categories, onEdit, onDelete, loading }) {
  const th = "text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider";
  const td = "py-3 px-4 border-b border-gray-800";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          🗂 All Categories
        </h2>
        <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
          {categories.length} records
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-800/60">
            <tr>
              <th className={th}>Category ID</th>
              <th className={th}>Category Name</th>
              <th className={th}>Description</th>
              <th className={th}>Created</th>
              <th className={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  <span className="spinner mr-2" />Loading…
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-600">
                  No categories yet. Add one above!
                </td>
              </tr>
            ) : categories.map(c => (
              <tr key={c.CategoryId} className="hover:bg-gray-800/50 transition-colors">
                <td className={td}>
                  <span className="font-mono text-xs text-gray-500 bg-gray-800
                                   px-2 py-1 rounded border border-gray-700">
                    #{c.CategoryId}
                  </span>
                </td>
                <td className={td}>
                  <span className="font-semibold text-gray-100">{c.CategoryName}</span>
                </td>
                <td className={td}>
                  <span className="text-gray-400">{c.Description || '—'}</span>
                </td>
                <td className={td}>
                  <span className="text-gray-500 text-xs">
                    {new Date(c.CreatedAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </span>
                </td>
                <td className={td}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="text-xs font-semibold text-blue-400 bg-blue-950
                                 hover:bg-blue-900 border border-blue-900
                                 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(c.CategoryId, c.CategoryName)}
                      className="text-xs font-semibold text-red-400 bg-red-950
                                 hover:bg-red-900 border border-red-900
                                 hover:border-red-600 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}