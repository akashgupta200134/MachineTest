import { useState, useEffect } from 'react';

export default function ProductForm({ editTarget, categories, onSave, onCancel }) {
  const [form, setForm]     = useState({ ProductName: '', CategoryId: '', Price: '', Stock: '', Description: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTarget) {
      setForm({
        ProductName:  editTarget.ProductName,
        CategoryId:   String(editTarget.CategoryId),
        Price:        String(editTarget.Price),
        Stock:        String(editTarget.Stock),
        Description:  editTarget.Description || '',
      });
    } else {
      setForm({ ProductName: '', CategoryId: '', Price: '', Stock: '', Description: '' });
    }
    setErrors({});
  }, [editTarget]);

  const validate = () => {
    const e = {};
    if (!form.ProductName.trim())              e.ProductName = 'Product name is required';
    if (!form.CategoryId)                       e.CategoryId  = 'Please select a category';
    if (form.Price === '' || isNaN(Number(form.Price))) e.Price = 'Valid price is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        CategoryId: Number(form.CategoryId),
        Price:      Number(form.Price),
        Stock:      Number(form.Stock) || 0,
      });
      setForm({ ProductName: '', CategoryId: '', Price: '', Stock: '', Description: '' });
    } finally {
      setSaving(false);
    }
  };

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));
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
        {isEdit ? '✏️  Edit Product' : '➕  Add New Product'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            className={inputClass(errors.ProductName)}
            type="text"
            placeholder="e.g. Wireless Headphones"
            value={form.ProductName}
            onChange={set('ProductName')}
          />
          {errors.ProductName && <span className="text-xs text-red-400">{errors.ProductName}</span>}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            className={inputClass(errors.CategoryId)}
            value={form.CategoryId}
            onChange={set('CategoryId')}
          >
            <option value="">— Select Category —</option>
            {categories.map(c => (
              <option key={c.CategoryId} value={c.CategoryId}>{c.CategoryName}</option>
            ))}
          </select>
          {errors.CategoryId && <span className="text-xs text-red-400">{errors.CategoryId}</span>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">
            Price (₹) <span className="text-red-400">*</span>
          </label>
          <input
            className={inputClass(errors.Price)}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.Price}
            onChange={set('Price')}
          />
          {errors.Price && <span className="text-xs text-red-400">{errors.Price}</span>}
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400">Stock Quantity</label>
          <input
            className={inputClass(false)}
            type="number"
            min="0"
            placeholder="0"
            value={form.Stock}
            onChange={set('Stock')}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-medium text-gray-400">Description</label>
          <input
            className={inputClass(false)}
            type="text"
            placeholder="Short description (optional)"
            value={form.Description}
            onChange={set('Description')}
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
            : (isEdit ? '✓ Update Product' : '+ Save Product')
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