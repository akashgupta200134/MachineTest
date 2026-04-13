const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'app.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    CategoryId   INTEGER PRIMARY KEY AUTOINCREMENT,
    CategoryName TEXT    NOT NULL UNIQUE,
    Description  TEXT,
    CreatedAt    DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    ProductId   INTEGER PRIMARY KEY AUTOINCREMENT,
    ProductName TEXT    NOT NULL,
    CategoryId  INTEGER NOT NULL,
    Price       REAL    NOT NULL DEFAULT 0,
    Stock       INTEGER NOT NULL DEFAULT 0,
    Description TEXT,
    CreatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryId) REFERENCES categories(CategoryId) ON DELETE RESTRICT
  );
`);

// Seed demo data if empty
const catCount = db.prepare('SELECT COUNT(*) as cnt FROM categories').get();
if (catCount.cnt === 0) {
  const insertCat = db.prepare(
    'INSERT INTO categories (CategoryName, Description) VALUES (?, ?)'
  );
  [
    ['Electronics',    'Gadgets and devices'],
    ['Clothing',       'Apparel and fashion'],
    ['Books',          'Books and education'],
    ['Home & Kitchen', 'Appliances and tools'],
    ['Sports',         'Equipment and accessories'],
  ].forEach(c => insertCat.run(...c));

  const insertProd = db.prepare(
    'INSERT INTO products (ProductName, CategoryId, Price, Stock, Description) VALUES (?, ?, ?, ?, ?)'
  );
  [
    ['Wireless Headphones', 1, 2999,  50, 'Noise cancelling'],
    ['Smartphone X12',      1, 15999, 30, 'Latest flagship'],
    ['Laptop Pro 15',       1, 55999, 15, '16GB RAM 512GB SSD'],
    ['Smartwatch Z3',       1, 8999,  40, 'Heart rate monitor'],
    ['Bluetooth Speaker',   1, 1999,  60, 'Portable waterproof'],
    ['USB-C Hub 7-in-1',    1, 1499,  80, 'Multiport adapter'],
    ['Cotton T-Shirt',      2, 499,  200, 'Pack of 3'],
    ['Denim Jeans',         2, 1499, 100, 'Slim fit'],
    ['Running Shoes',       2, 2499,  80, 'Breathable mesh'],
    ['Winter Jacket',       2, 3999,  45, 'Down filled'],
    ['Formal Shirt',        2, 999,  120, 'Cotton blend'],
    ['JavaScript Guide',    3, 599,   70, 'Beginner to advanced'],
    ['Node.js Cookbook',    3, 699,   55, 'Recipes and patterns'],
    ['Design Patterns',     3, 749,   40, 'Gang of Four'],
    ['Clean Code',          3, 649,   65, 'By Robert Martin'],
    ['React Deep Dive',     3, 799,   90, 'Hooks to advanced'],
    ['Air Fryer 5L',        4, 4999,  25, 'Digital display'],
    ['Coffee Maker',        4, 2999,  35, 'Programmable'],
    ['Yoga Mat',            5, 799,   90, 'Non-slip 6mm'],
    ['Dumbbells Set',       5, 2499,  30, '5-25kg adjustable'],
    ['Cycling Helmet',      5, 1499,  50, 'CE certified'],
    ['Skipping Rope',       5, 299,  150, 'Adjustable length'],
  ].forEach(p => insertProd.run(...p));
}

module.exports = db;