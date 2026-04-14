const express = require('express');
const router = express.Router();
const db = require('../db/database');


// ========================
// GET PRODUCTS (PAGINATION + FILTER)
// ========================
router.get('/', (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 10);
    const offset = (page - 1) * pageSize;

    const search = req.query.search ? `%${req.query.search}%` : null;
    const catFilter = req.query.categoryId
      ? parseInt(req.query.categoryId)
      : null;

    let where = 'WHERE 1=1';
    const args = [];

    if (search) {
      where += ' AND (p.ProductName LIKE ? OR c.CategoryName LIKE ?)';
      args.push(search, search);
    }

    if (catFilter) {
      where += ' AND p.CategoryId = ?';
      args.push(catFilter);
    }

    const { total } = db
      .prepare(
        `
      SELECT COUNT(*) as total
      FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      ${where}
    `
      )
      .get(...args);

    const products = db
      .prepare(
        `
      SELECT
        p.ProductId,
        p.ProductName,
        p.CategoryId,
        c.CategoryName,
        p.Price,
        p.Stock,
        p.Description,
        p.CreatedAt
      FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      ${where}
      ORDER BY p.ProductId DESC
      LIMIT ? OFFSET ?
    `
      )
      .all(...args, pageSize, offset);

    // ✅ ALWAYS return array
    res.json({
      success: true,
      data: Array.isArray(products) ? products : [],
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        from: total === 0 ? 0 : offset + 1,
        to: Math.min(offset + pageSize, total),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ========================
// GET SINGLE PRODUCT
// ========================
router.get('/:id', (req, res) => {
  try {

    const row = db.prepare(`
      SELECT p.*, c.CategoryName
      FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = ?
    `).get(req.params.id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: row
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ========================
// CREATE PRODUCT
// ========================
router.post('/', (req, res) => {
  try {

    const { ProductName, CategoryId, Price, Stock, Description } = req.body;

    if (!ProductName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name required"
      });
    }

    const result = db.prepare(`
      INSERT INTO products (ProductName, CategoryId, Price, Stock, Description)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      ProductName.trim(),
      CategoryId,
      parseFloat(Price),
      parseInt(Stock) || 0,
      Description || ''
    );

    const newRow = db.prepare(`
      SELECT p.*, c.CategoryName
      FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: newRow,
      message: "Product created successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ========================
// UPDATE PRODUCT
// ========================
router.put('/:id', (req, res) => {
  try {

    const { ProductName, CategoryId, Price, Stock, Description } = req.body;

    const exists = db.prepare(
      'SELECT ProductId FROM products WHERE ProductId = ?'
    ).get(req.params.id);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    db.prepare(`
      UPDATE products
      SET ProductName=?, CategoryId=?, Price=?, Stock=?, Description=?
      WHERE ProductId=?
    `).run(
      ProductName.trim(),
      CategoryId,
      parseFloat(Price) || 0,
      parseInt(Stock) || 0,
      Description || '',
      req.params.id
    );

    const updated = db.prepare(`
      SELECT p.*, c.CategoryName
      FROM products p
      JOIN categories c ON p.CategoryId = c.CategoryId
      WHERE p.ProductId = ?
    `).get(req.params.id);

    res.json({
      success: true,
      data: updated,
      message: "Product updated successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// ========================
// DELETE PRODUCT
// ========================
router.delete('/:id', (req, res) => {
  try {

    const exists = db.prepare(
      'SELECT ProductId FROM products WHERE ProductId = ?'
    ).get(req.params.id);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    db.prepare(
      'DELETE FROM products WHERE ProductId = ?'
    ).run(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;