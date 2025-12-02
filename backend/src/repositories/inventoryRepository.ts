import { InventoryItem } from '../types';
import { dbQuery, dbRun } from '../database';

export class InventoryRepository {
  // Get all items with optional search
  static async findAll(searchParams?: {
    search?: string;
    category?: string;
  }): Promise<InventoryItem[]> {
    let query = 'SELECT * FROM inventory';
    const params: any[] = [];
    
    if (searchParams?.search || searchParams?.category) {
      const conditions: string[] = [];
      
      if (searchParams.search) {
        conditions.push('(name LIKE ? OR category LIKE ?)');
        params.push(`%${searchParams.search}%`, `%${searchParams.search}%`);
      }
      
      if (searchParams.category) {
        conditions.push('category = ?');
        params.push(searchParams.category);
      }
      
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY updated_at DESC, created_at DESC';
    
    return dbQuery<InventoryItem[]>(query, params);
  }

  // Get item by ID
  static async findById(id: number): Promise<InventoryItem | null> {
    const query = 'SELECT * FROM inventory WHERE id = ?';
    const items = await dbQuery<InventoryItem[]>(query, [id]);
    
    return items.length > 0 ? items[0] : null;
  }

  // Create new item
  static async create(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const query = `
      INSERT INTO inventory (name, category, price, stock)
      VALUES (?, ?, ?, ?)
    `;
    
    const result = await dbRun(query, [
      item.name,
      item.category,
      item.price,
      item.stock
    ]);
    
    return {
      id: result.lastID,
      ...item
    };
  }

  // Update existing item
  static async update(id: number, item: Partial<InventoryItem>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (item.name !== undefined) {
      updates.push('name = ?');
      params.push(item.name);
    }
    
    if (item.category !== undefined) {
      updates.push('category = ?');
      params.push(item.category);
    }
    
    if (item.price !== undefined) {
      updates.push('price = ?');
      params.push(item.price);
    }
    
    if (item.stock !== undefined) {
      updates.push('stock = ?');
      params.push(item.stock);
    }
    
    // Always update the updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    if (updates.length === 0) {
      return false;
    }
    
    const query = `
      UPDATE inventory 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;
    
    params.push(id);
    
    const result = await dbRun(query, params);
    return result.changes > 0;
  }

  // Delete item
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM inventory WHERE id = ?';
    const result = await dbRun(query, [id]);
    
    return result.changes > 0;
  }

  // Get all unique categories
  static async getCategories(): Promise<string[]> {
    const query = 'SELECT DISTINCT category FROM inventory ORDER BY category';
    const results = await dbQuery<{ category: string }[]>(query);
    
    return results.map(row => row.category);
  }

  // Get total value of inventory
  static async getTotalValue(): Promise<number> {
    const query = 'SELECT SUM(price * stock) as total FROM inventory';
    const result = await dbQuery<{ total: number }[]>(query);
    
    return result[0]?.total || 0;
  }

}