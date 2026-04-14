import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from '../components/ToastProvider';
import CategoryForm from '../components/CategoryForm';
import CategoryTable from '../components/CategoryTable';

export default function Categories() {
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD CATEGORIES (SAFE)
  // =========================
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get('/categories');

      const data = res?.data?.data;

      // ✅ SAFE ARRAY CHECK (prevents .map crash)
     setCategories(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Load categories error:", err);

      setCategories([]);

      toast(
        err.response?.data?.message ||
        err.message ||
        "Failed to load categories",
        'error'
      );

    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // =========================
  // SAVE (CREATE / UPDATE)
  // =========================
  const handleSave = async (formData) => {
    try {
      if (editTarget?.CategoryId) {
        await api.put(`/categories/${editTarget.CategoryId}`, formData);
        toast('Category updated successfully');
      } else {
        await api.post('/categories', formData);
        toast('Category created successfully');
      }

      setEditTarget(null);
      loadCategories();

    } catch (err) {
      toast(
        err.response?.data?.message ||
        err.message ||
        "Save failed",
        'error'
      );
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/categories/${id}`);

      toast('Category deleted successfully');

      loadCategories();

    } catch (err) {
      toast(
        err.response?.data?.message ||
        err.message ||
        "Delete failed",
        'error'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* HEADER */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Category Master
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Add, edit or delete product categories.
        </p>
      </div>

      {/* FORM */}
      <CategoryForm
        editTarget={editTarget}
        onSave={handleSave}
        onCancel={() => setEditTarget(null)}
      />

      {/* TABLE */}
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