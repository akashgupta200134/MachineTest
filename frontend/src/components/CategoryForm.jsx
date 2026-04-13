import { useState, useEffect } from 'react';

export default function CategoryForm({ editTarget, onSave, onCancel }) {
  const [form, setForm]     = useState({ CategoryName: '', Description: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setForm({
        CategoryName: editTarget.CategoryName,
        Description:  editTarget.Description || ''
      });
    } else {
      setForm({ CategoryName: '', Description: '' });
    }
    setErrors({});
  }, [editTarget]);

  const validate = () => {
    const e = {};
    if (!form.CategoryName.trim()) e.CategoryName = 'Category name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      setForm({ CategoryName: '', Description: '' });
    } finally {
      setSaving(false);
    }
  };

  const isEdit = Boolean(editTarget);

  const inputClass = (hasError) =>
    `w-full bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-100
     outline-none transition-all placeholder-gray-600
     ${hasError
       ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
       : 'border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
     }`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
        {isEdit ? '✏️  Edit Category' : '➕  Add New Category'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">
            Category Name <span className="text-red-400">*</span>
          </label>
          <input
            className={inputClass(errors.CategoryName)}
            type="text"
            placeholder="e.g. Electronics"
            value={form.CategoryName}
            onChange={e => setForm(f => ({ ...f, CategoryName: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          {errors.CategoryName && (
            <span className="text-xs text-red-400">{errors.CategoryName}</span>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">Description</label>
          <input
            className={inputClass(false)}
            type="text"
            placeholder="Short description (optional)"
            value={form.Description}
            onChange={e => setForm(f => ({ ...f, Description: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-white text-sm font-semibold px-5 py-2.5
                     rounded-lg transition-all"
        >
          {saving
            ? <><span className="spinner" /> Saving…</>
            : (isEdit ? '✓ Update Category' : '+ Save Category')
          }
        </button>

        {isEdit && (
          <button
            onClick={onCancel}
            disabled={saving}
            className="text-sm font-medium text-gray-400 hover:text-white
                       px-5 py-2.5 rounded-lg border border-gray-700
                       hover:border-gray-500 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}