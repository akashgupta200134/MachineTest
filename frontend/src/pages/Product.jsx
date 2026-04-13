import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';

export default function ProductsPage() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [pagination, setPagination] = useState({});

  // Pagination and filter state


  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(10);
  const [search, setSearch]       = useState('');
  const [categoryId, setCategoryId] = useState('');

  const loadCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.data);
  };


  // Called every time page/pageSize/search/categoryId changes

  const loadProducts = async () => {
    const params = { page, pageSize };

    if (search)  {
        params.search = search;
    }    
    if (categoryId){
       params.categoryId = categoryId; 
    } 

    const res = await api.get('/products', { params });
    setProducts(res.data.data);
     setPagination(res.data.pagination);
  };

  useEffect(() => { 
    loadCategories(); 
}, []);

  useEffect(() => { 
    loadProducts();
 }, [page, pageSize, search, categoryId]);

  const handleSaveProducts = async (formData) => {
    if (editTarget) {
      await api.put(`/products/${editTarget.ProductId}`, formData);
    } else {
      await api.post('/products', formData);
    }
    setEditTarget(null);
    loadProducts();
  };

  const handleDeleteProducts= async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="container">
      <h2>Product Master</h2>

      <ProductForm
        editTarget={editTarget}
        categories={categories}
        onSave={handleSaveProducts}
        onCancel={() => setEditTarget(null)}
      />

      // Filters 
      <div className="filters">
        <input
          placeholder="Search..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />


// this select is for to Filter categories
        <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.CategoryId} value={c.CategoryId}>{c.CategoryName}</option>
          ))}
        </select>


// this select is for pagination
        <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}>
          {[5, 10, 15, 20, 50].map(n => <option key={n} value={n}>{n} / page</option>)}
        </select>
      </div>


      // this Table — shows ProductId, ProductName, CategoryId, CategoryName 
      <ProductTable
        products={products}
        onEdit={setEditTarget}
        onDelete={handleDeleteProducts}
      />


      // Server-side Pagination 
      <Pagination
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}