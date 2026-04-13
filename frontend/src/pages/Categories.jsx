import { useState, useEffect } from 'react';
import api from '../api/axios';
import CategoryFormPage from '../components/CategoryForm';
import CategoryTable from '../components/CategoryTable';

export default function CategoriesPage() {
  const [categories, setCategories]   = useState([]);
  const [editTarget, setEditTarget]   = useState(null); // null = Add mode

  const loadCategories = async () => {
    const res = await api.get('/categories');
    setCategories(res.data.data);
  };


  useEffect(() => {
     loadCategories(); 
    }, []);


  const handleSaveCategories = async (formData) => {
    if (editTarget) {
      await api.put(`/categories/${editTarget.CategoryId}`, formData);
    } else {
      await api.post('/categories', formData);
    }
    setEditTarget(null);
    loadCategories();
  };
 
 

  const handleDeleteCategories= async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await api.delete(`/categories/${id}`);
    loadCategories();
  };

  return (
    <div className="container">
      <h2>Category Master</h2>
      <CategoryFormPage
        editTarget={editTarget}
        onSave={handleSaveCategories}
        onCancel={() => setEditTarget(null)}
      />
      <CategoryTable
        categories={categories}
        onEdit={setEditTarget}
        onDelete={handleDeleteCategories}
      />
    </div>
  );
}

