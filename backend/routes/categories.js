const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET all categories
router.get('/', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY CategoryName', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: rows });
  });
});

// GET single category
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM categories WHERE CategoryId = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: row });
  });
});

// POST create category
router.post('/', (req, res) => {
  const { CategoryName, Description } = req.body;
  if (!CategoryName?.trim())
    return res.status(400).json({ success: false, message: 'Category name is required' });

  db.run(
    'INSERT INTO categories (CategoryName, Description) VALUES (?, ?)',
    [CategoryName.trim(), Description || ''],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE'))
          return res.status(400).json({ success: false, message: 'Category name already exists' });
        return res.status(500).json({ success: false, message: err.message });
      }
      db.get('SELECT * FROM categories WHERE CategoryId = ?', [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, data: row, message: 'Category created successfully' });
      });
    }
  );
});

// PUT update category
router.put('/:id', (req, res) => {
  const { CategoryName, Description } = req.body;
  if (!CategoryName?.trim())
    return res.status(400).json({ success: false, message: 'Category name is required' });

  db.get('SELECT CategoryId FROM categories WHERE CategoryId = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Category not found' });

    db.run(
      'UPDATE categories SET CategoryName = ?, Description = ? WHERE CategoryId = ?',
      [CategoryName.trim(), Description || '', req.params.id],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE'))
            return res.status(400).json({ success: false, message: 'Category name already exists' });
          return res.status(500).json({ success: false, message: err.message });
        }
        db.get('SELECT * FROM categories WHERE CategoryId = ?', [req.params.id], (err, updated) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, data: updated, message: 'Category updated successfully' });
        });
      }
    );
  });
});

// DELETE category
router.delete('/:id', (req, res) => {
  db.get('SELECT CategoryId FROM categories WHERE CategoryId = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Category not found' });

    db.get('SELECT COUNT(*) as cnt FROM products WHERE CategoryId = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (result.cnt > 0)
        return res.status(400).json({
          success: false,
          message: `Cannot delete — ${result.cnt} product(s) use this category`
        });

      db.run('DELETE FROM categories WHERE CategoryId = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Category deleted successfully' });
      });
    });
  });
});

module.exports = router;