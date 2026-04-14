const sqlite3 = require('sqlite3').verbose();
const path    = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'app.db'), (err) => {
  if (err) {
    console.error('DB Connection Error:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      CategoryId   INTEGER PRIMARY KEY AUTOINCREMENT,
      CategoryName TEXT    NOT NULL UNIQUE,
      Description  TEXT,
      CreatedAt    DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      ProductId   INTEGER PRIMARY KEY AUTOINCREMENT,
      ProductName TEXT    NOT NULL,
      CategoryId  INTEGER NOT NULL,
      Price       REAL    NOT NULL DEFAULT 0,
      Stock       INTEGER NOT NULL DEFAULT 0,
      Description TEXT,
      CreatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (CategoryId) REFERENCES categories(CategoryId) ON DELETE RESTRICT
    )
  `);

  // Seed data if empty
  db.get('SELECT COUNT(*) as cnt FROM categories', (err, row) => {
    if (row && row.cnt === 0) {
      const cats = [
        ['Electronics',    'Gadgets and devices'],
        ['Clothing',       'Apparel and fashion'],
        ['Books',          'Books and education'],
        ['Home & Kitchen', 'Appliances and tools'],
        ['Sports',         'Equipment and accessories'],
      ];
      cats.forEach(([name, desc]) => {
        db.run('INSERT INTO categories (CategoryName, Description) VALUES (?, ?)', [name, desc]);
      });

      const prods = [
        ['Wireless Headphones', 1, 2999,  50, 'Noise cancelling'],
        ['Smartphone X12',      1, 15999, 30, 'Latest flagship'],
        ['Laptop Pro 15',       1, 55999, 15, '16GB RAM 512GB SSD'],
        ['Smartwatch Z3',       1, 8999,  40, 'Heart rate monitor'],
        ['Bluetooth Speaker',   1, 1999,  60, 'Portable waterproof'],
        ['Cotton T-Shirt',      2, 499,  200, 'Pack of 3'],
        ['Denim Jeans',         2, 1499, 100, 'Slim fit'],
        ['Running Shoes',       2, 2499,  80, 'Breathable mesh'],
        ['Winter Jacket',       2, 3999,  45, 'Down filled'],
        ['JavaScript Guide',    3, 599,   70, 'Beginner to advanced'],
        ['Node.js Cookbook',    3, 699,   55, 'Recipes and patterns'],
        ['Design Patterns',     3, 749,   40, 'Gang of Four'],
        ['Air Fryer 5L',        4, 4999,  25, 'Digital display'],
        ['Coffee Maker',        4, 2999,  35, 'Programmable'],
        ['Yoga Mat',            5, 799,   90, 'Non-slip 6mm'],
        ['Dumbbells Set',       5, 2499,  30, '5-25kg adjustable'],
      ];
      prods.forEach(([name, catId, price, stock, desc]) => {
        db.run(
          'INSERT INTO products (ProductName, CategoryId, Price, Stock, Description) VALUES (?, ?, ?, ?, ?)',
          [name, catId, price, stock, desc]
        );
      });
    }
  });
});

module.exports = db;