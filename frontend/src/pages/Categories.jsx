import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from '../components/ToastProvider';
import CategoryForm  from '../components/CategoryForm';
import CategoryTable from '../components/CategoryTable';

export default function Categories() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData) => {
    try {
      if (editTarget && editTarget.CategoryId) {
        await api.put(`/categories/${editTarget.CategoryId}`, formData);
        toast('Category updated successfully');
      } else {
        await api.post('/categories', formData);
        toast('Category created successfully');
      }
      setEditTarget(null);
      load();
    } catch (err) {
      toast(err.message, 'error');
      throw err;
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast('Category deleted successfully');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };
console.log("EDIT TARGET:", editTarget);
console.log("ID:", editTarget?.CategoryId);


useEffect(() => {
  console.log("EDIT TARGET UPDATED:", editTarget);
}, [editTarget]);


  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Category Master
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Add, edit or delete product categories.
        </p>
      </div>

      <CategoryForm
        editTarget={editTarget}
        onSave={handleSave}
        onCancel={() => setEditTarget(null)}
      />

      <CategoryTable
        categories={categories}
        loading={loading}
        onEdit={(cat) => {
          setEditTarget(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDelete={handleDelete}
      />
    </div>
  );
}