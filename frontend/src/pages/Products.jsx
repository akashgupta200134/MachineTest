import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';
import { useToast } from '../components/ToastProvider';
import ProductForm  from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import Pagination   from '../components/Pagination';

export default function Products() {
  const toast = useToast();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [editTarget, setEditTarget] = useState(null);
  const [loading,    setLoading]    = useState(true);

  const [page,       setPage]       = useState(1);
  const [pageSize,   setPageSize]   = useState(10);
  const [search,     setSearch]     = useState('');
  const [categoryId, setCategoryId] = useState('');
  const searchTimer = useRef(null);

  // Load categories for dropdown
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');

      console.log("CATEGORIES API:", res.data);

      const data = res?.data?.data;

      setCategories(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Category load error:", err);
      setCategories([]);
      toast(err.message || "Failed to load categories", 'error');
    }
  };

  fetchCategories();
}, [toast]);

  // Load products on every filter/page change
 const loadProducts = useCallback(async () => {
  try {
    setLoading(true);

    const params = { page, pageSize };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;

    const res = await api.get('/products', { params });

    const data = res?.data?.data;

    setProducts(Array.isArray(data) ? data : []);
    setPagination(res?.data?.pagination || {});
  } catch (err) {
    toast(err.message, 'error');
    setProducts([]); // 🔥 IMPORTANT fallback
  } finally {
    setLoading(false);
  }
}, [page, pageSize, search, categoryId, toast]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimer.current);
    const val = e.target.value;
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  };

  const handleSave = async (formData) => {
    try {
      if (editTarget) {
        await api.put(`/products/${editTarget.ProductId}`, formData);
        toast('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast('Product created successfully');
      }
      setEditTarget(null);
      loadProducts();
    } catch (err) {
      toast(err.message, 'error');
      throw err;
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast('Product deleted successfully');
      const remaining = pagination.total - 1;
      const maxPage   = Math.ceil(remaining / pageSize) || 1;
      if (page > maxPage) setPage(maxPage);
      else loadProducts();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const inputClass = `bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm
    text-gray-300 placeholder-gray-600 outline-none focus:border-blue-500
    focus:ring-2 focus:ring-blue-500/20 transition-all`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Product Master
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Server-side pagination — only current page rows fetched from DB.
        </p>
      </div>

      <ProductForm
        editTarget={editTarget}
        categories={categories}
        onSave={handleSave}
        onCancel={() => setEditTarget(null)}
      />

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            📦 Product List
          </h2>
          {pagination.total > 0 && (
            <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1
                             rounded-full border border-gray-700">
              {pagination.total} total records
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center mb-5">
          <input
            type="text"
            placeholder="🔍  Search product or category…"
            className={`${inputClass} min-w-[220px]`}
            onChange={handleSearchChange}
          />
          <select
            className={`${inputClass} min-w-[160px]`}
            value={categoryId}
            onChange={e => { setCategoryId(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.CategoryId} value={c.CategoryId}>{c.CategoryName}</option>
            ))}
          </select>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap">
              Rows per page:
            </label>
            <select
              className={`${inputClass} w-20`}
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              {[5, 10, 15, 20, 50].map(n =>
                <option key={n} value={n}>{n}</option>
              )}
            </select>
          </div>
        </div>

        {/* Table */}
        <ProductTable
          products={products}
          loading={loading}
          onEdit={(p) => {
            setEditTarget(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}