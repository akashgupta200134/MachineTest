export default function ProductTable({ products, onEdit, onDelete, loading }) {
  const th = "text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap";
  const td = "py-3 px-4 border-b border-gray-800";

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-800/60">
          <tr>
            <th className={th}>Product ID</th>
            <th className={th}>Product Name</th>
            <th className={th}>Category ID</th>
            <th className={th}>Category Name</th>
            <th className={th}>Price</th>
            <th className={th}>Stock</th>
            <th className={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-500">
                <span className="spinner mr-2" />Loading…
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-12 text-gray-600">
                No products found.
              </td>
            </tr>
          ) : products.map(p => (
            <tr key={p.ProductId} className="hover:bg-gray-800/50 transition-colors">
              {/* Product ID */}
              <td className={td}>
                <span className="font-mono text-xs text-gray-500 bg-gray-800
                                 px-2 py-1 rounded border border-gray-700">
                  #{p.ProductId}
                </span>
              </td>

              {/* Product Name */}
              <td className={td}>
                <span className="font-semibold text-gray-100">{p.ProductName}</span>
                {p.Description && (
                  <p className="text-xs text-gray-600 mt-0.5">{p.Description}</p>
                )}
              </td>

              {/* Category ID */}
              <td className={td}>
                <span className="font-mono text-xs text-gray-500">{p.CategoryId}</span>
              </td>

              {/* Category Name */}
              <td className={td}>
                <span className="text-xs font-semibold text-blue-400 bg-blue-950
                                 border border-blue-900 px-2.5 py-1 rounded-full">
                  {p.CategoryName}
                </span>
              </td>

              {/* Price */}
              <td className={td}>
                <span className="font-mono font-semibold text-green-400">
                  ₹{Number(p.Price).toLocaleString('en-IN')}
                </span>
              </td>

              {/* Stock */}
              <td className={td}>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md
                  ${p.Stock > 20
                    ? 'text-green-400 bg-green-950'
                    : p.Stock > 0
                    ? 'text-yellow-400 bg-yellow-950'
                    : 'text-red-400 bg-red-950'
                  }`}>
                  {p.Stock}
                </span>
              </td>

              {/* Actions */}
              <td className={td}>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-xs font-semibold text-blue-400 bg-blue-950
                               hover:bg-blue-900 border border-blue-900
                               hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.ProductId, p.ProductName)}
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
  );
}