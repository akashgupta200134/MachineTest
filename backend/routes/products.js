const express = require('express');
const router  = express.Router();
const db      = require('../db/database');

// GET products with SERVER-SIDE PAGINATION
router.get('/', (req, res) => {
  const page      = Math.max(1, parseInt(req.query.page)     || 1);
  const pageSize  = Math.max(1, parseInt(req.query.pageSize) || 10);
  const search    = req.query.search     ? `%${req.query.search}%`      : null;
  const catFilter = req.query.categoryId ? parseInt(req.query.categoryId) : null;
  const offset    = (page - 1) * pageSize;  // page 9, size 10 → offset 80

  let where  = 'WHERE 1=1';
  const args = [];
  if (search) {
    where += ' AND (p.ProductName LIKE ? OR c.CategoryName LIKE ?)';
    args.push(search, search);
  }
  if (catFilter) {
    where += ' AND p.CategoryId = ?';
    args.push(catFilter);
  }

  // First get total count
  db.get(
    `SELECT COUNT(*) as total FROM products p
     JOIN categories c ON p.CategoryId = c.CategoryId ${where}`,
    args,
    (err, countRow) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      const total = countRow.total;

      // Then fetch only current page rows — LIMIT + OFFSET
      db.all(
        `SELECT p.ProductId, p.ProductName, p.CategoryId, c.CategoryName,
                p.Price, p.Stock, p.Description, p.CreatedAt
         FROM products p
         JOIN categories c ON p.CategoryId = c.CategoryId
         ${where}
         ORDER BY p.ProductId DESC
         LIMIT ? OFFSET ?`,
        [...args, pageSize, offset],
        (err, rows) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({
            success: true,
            data: rows,
            pagination: {
              page, pageSize, total,
              totalPages: Math.ceil(total / pageSize),
              from: total === 0 ? 0 : offset + 1,
              to:   Math.min(offset + pageSize, total),
            }
          });
        }
      );
    }
  );
});

// GET single product
router.get('/:id', (req, res) => {
  db.get(
    `SELECT p.*, c.CategoryName FROM products p
     JOIN categories c ON p.CategoryId = c.CategoryId
     WHERE p.ProductId = ?`,
    [req.params.id],
    (err, row) => {
      if (err)  return res.status(500).json({ success: false, message: err.message });
      if (!row) return res.status(404).json({ success: false, message: 'Product not found' });
      res.json({ success: true, data: row });
    }
  );
});

// POST create product
router.post('/', (req, res) => {
  const { ProductName, CategoryId, Price, Stock, Description } = req.body;
  if (!ProductName?.trim())
    return res.status(400).json({ success: false, message: 'Product name is required' });
  if (!CategoryId)
    return res.status(400).json({ success: false, message: 'Category is required' });
  if (Price == null || isNaN(Price))
    return res.status(400).json({ success: false, message: 'Valid price is required' });

  db.run(
    'INSERT INTO products (ProductName, CategoryId, Price, Stock, Description) VALUES (?, ?, ?, ?, ?)',
    [ProductName.trim(), CategoryId, parseFloat(Price), parseInt(Stock) || 0, Description || ''],
    function (err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.get(
        `SELECT p.*, c.CategoryName FROM products p
         JOIN categories c ON p.CategoryId = c.CategoryId
         WHERE p.ProductId = ?`,
        [this.lastID],
        (err, row) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.status(201).json({ success: true, data: row, message: 'Product created successfully' });
        }
      );
    }
  );
});

// PUT update product
router.put('/:id', (req, res) => {
  const { ProductName, CategoryId, Price, Stock, Description } = req.body;
  if (!ProductName?.trim())
    return res.status(400).json({ success: false, message: 'Product name is required' });
  if (!CategoryId)
    return res.status(400).json({ success: false, message: 'Category is required' });

  db.get('SELECT ProductId FROM products WHERE ProductId = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Product not found' });

    db.run(
      'UPDATE products SET ProductName=?, CategoryId=?, Price=?, Stock=?, Description=? WHERE ProductId=?',
      [ProductName.trim(), CategoryId, parseFloat(Price)||0, parseInt(Stock)||0, Description||'', req.params.id],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.get(
          `SELECT p.*, c.CategoryName FROM products p
           JOIN categories c ON p.CategoryId = c.CategoryId
           WHERE p.ProductId = ?`,
          [req.params.id],
          (err, updated) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, data: updated, message: 'Product updated successfully' });
          }
        );
      }
    );
  });
});

// DELETE product
router.delete('/:id', (req, res) => {
  db.get('SELECT ProductId FROM products WHERE ProductId = ?', [req.params.id], (err, row) => {
    if (err)  return res.status(500).json({ success: false, message: err.message });
    if (!row) return res.status(404).json({ success: false, message: 'Product not found' });

    db.run('DELETE FROM products WHERE ProductId = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Product deleted successfully' });
    });
  });
});

module.exports = router;