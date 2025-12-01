import sqlite3 from 'sqlite3';
import path from 'path';
import { InventoryItem } from './types';

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

// Create database connection
export const getDb = () => {
  return new sqlite3.Database(DB_PATH);
};

// Initialize database with tables
export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = getDb();

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create inventory table
    db.run(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL CHECK(price >= 0),
        stock INTEGER NOT NULL CHECK(stock >= 0),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Create index for better search performance
      db.run(`
        CREATE INDEX IF NOT EXISTS idx_inventory_name 
        ON inventory(name)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_inventory_category 
        ON inventory(category)
      `);

      // Check if we need to seed data
      db.get('SELECT COUNT(*) as count FROM inventory', (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (row.count === 0) {
          seedDatabase(db)
            .then(() => {
              db.close();
              resolve();
            })
            .catch((seedErr) => {
              db.close();
              reject(seedErr);
            });
        } else {
          db.close();
          resolve();
        }
      });
    });
  });
};

// Seed initial data
const seedDatabase = (db: sqlite3.Database): Promise<void> => {
  return new Promise((resolve, reject) => {
    const initialItems: Omit<InventoryItem, 'id'>[] = [
      { name: 'MacBook Pro 16"', category: 'Electronics', price: 2499.99, stock: 8 },
      { name: 'Ergonomic Office Chair', category: 'Furniture', price: 349.99, stock: 15 },
      { name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 42 },
      { name: 'Desk Lamp', category: 'Furniture', price: 24.99, stock: 23 },
      { name: 'Sticky Notes', category: 'Stationery', price: 5.99, stock: 67 },
      { name: 'Coffee Mug', category: 'Kitchen', price: 12.99, stock: 89 },
      { name: 'External SSD 1TB', category: 'Electronics', price: 129.99, stock: 18 },
      { name: 'Desk Organizer', category: 'Furniture', price: 19.99, stock: 31 },
      { name: 'Ballpoint Pens (Pack of 12)', category: 'Stationery', price: 8.49, stock: 54 },
      { name: 'Water Bottle', category: 'Kitchen', price: 18.99, stock: 27 }
    ];

    const stmt = db.prepare(
      'INSERT INTO inventory (name, category, price, stock) VALUES (?, ?, ?, ?)'
    );

    let completed = 0;
    const total = initialItems.length;

    initialItems.forEach(item => {
      stmt.run([item.name, item.category, item.price, item.stock], (err) => {
        if (err) {
          stmt.finalize();
          reject(err);
          return;
        }

        completed++;
        if (completed === total) {
          stmt.finalize();
          console.log(`Seeded ${total} initial items`);
          resolve();
        }
      });
    });
  });
};

// Utility function to execute SQL queries
export const dbQuery = <T>(query: string, params: any[] = []): Promise<T> => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.all(query, params, (err, rows) => {
      db.close();
      
      if (err) {
        reject(err);
        return;
      }
      
      resolve(rows as T);
    });
  });
};

// Utility function to execute SQL commands
export const dbRun = (query: string, params: any[] = []): Promise<{ lastID: number; changes: number }> => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.run(query, params, function(err) {
      db.close();
      
      if (err) {
        reject(err);
        return;
      }
      
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};