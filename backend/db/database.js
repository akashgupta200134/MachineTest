const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "app.db"),
  (err) => {
    if (err) {
      console.error("DB error:", err.message);
    } else {
      console.log("Connected to SQLite DB");
    }
  }
);

// Enable PRAGMAs
db.serialize(() => {
  db.run(`PRAGMA journal_mode = WAL`);
  db.run(`PRAGMA foreign_keys = ON`);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      CategoryId INTEGER PRIMARY KEY AUTOINCREMENT,
      CategoryName TEXT NOT NULL UNIQUE,
      Description TEXT,
      CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      ProductId INTEGER PRIMARY KEY AUTOINCREMENT,
      ProductName TEXT NOT NULL,
      CategoryId INTEGER NOT NULL,
      Price REAL NOT NULL DEFAULT 0,
      Stock INTEGER NOT NULL DEFAULT 0,
      Description TEXT,
      CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (CategoryId) REFERENCES categories(CategoryId) ON DELETE RESTRICT
    )
  `);

  // Seed data safely
  db.get("SELECT COUNT(*) as cnt FROM categories", (err, row) => {
    if (row.cnt === 0) {
      const categories = [
        ["Electronics", "Gadgets and devices"],
        ["Clothing", "Apparel and fashion"],
        ["Books", "Books and education"],
        ["Home & Kitchen", "Appliances and tools"],
        ["Sports", "Equipment and accessories"],
      ];

      const products = [
        ["Wireless Headphones", 1, 2999, 50, "Noise cancelling"],
        ["Smartphone X12", 1, 15999, 30, "Latest flagship"],
        ["Laptop Pro 15", 1, 55999, 15, "16GB RAM 512GB SSD"],
        ["Cotton T-Shirt", 2, 499, 200, "Pack of 3"],
        ["Denim Jeans", 2, 1499, 100, "Slim fit"],
        ["JavaScript Guide", 3, 599, 70, "Beginner to advanced"],
        ["Node.js Cookbook", 3, 699, 55, "Recipes and patterns"],
        ["Air Fryer 5L", 4, 4999, 25, "Digital display"],
        ["Yoga Mat", 5, 799, 90, "Non-slip 6mm"],
        ["Dumbbells Set", 5, 2499, 30, "5-25kg adjustable"],
      ];

      const insertCat = db.prepare(
        "INSERT INTO categories (CategoryName, Description) VALUES (?, ?)"
      );

      categories.forEach((c) => insertCat.run(c));

      const insertProd = db.prepare(
        "INSERT INTO products (ProductName, CategoryId, Price, Stock, Description) VALUES (?, ?, ?, ?, ?)"
      );

      products.forEach((p) => insertProd.run(p));
    }
  });
});

module.exports = db;