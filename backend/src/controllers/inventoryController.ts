import { Request, Response } from 'express';
import { InventoryRepository } from '../repositories/inventoryRepository';
import { validateInventoryItem } from '../validation/inventoryValidation';
import { ApiResponse, InventoryItem } from '../types';

export class InventoryController {
  // GET /api/items - Get all items
  static async getItems(req: Request, res: Response) {
    try {
      const { search, category } = req.query;
      
      const items = await InventoryRepository.findAll({
        search: search as string,
        category: category as string
      });
      
      const response: ApiResponse<InventoryItem[]> = {
        success: true,
        data: items
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch items'
      });
    }
  }

  // GET /api/items/:id - Get single item
  static async getItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid item ID'
        });
      }
      
      const item = await InventoryRepository.findById(id);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      const response: ApiResponse<InventoryItem> = {
        success: true,
        data: item
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch item'
      });
    }
  }

  // POST /api/items - Create new item
  static async createItem(req: Request, res: Response) {
    try {
      const itemData: Omit<InventoryItem, 'id'> = req.body;
      
      // Validate input
      const validation = validateInventoryItem(itemData);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        });
      }
      
      // Create item
      const newItem = await InventoryRepository.create(itemData);
      
      const response: ApiResponse<InventoryItem> = {
        success: true,
        data: newItem,
        message: 'Item created successfully'
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create item'
      });
    }
  }

  // PUT /api/items/:id - Update item
  static async updateItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid item ID'
        });
      }
      
      const updates = req.body;
      
      // Validate updates
      const validation = validateInventoryItem(updates);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          validationErrors: validation.errors
        });
      }
      
      // Check if item exists
      const existingItem = await InventoryRepository.findById(id);
      
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      // Update item
      const updated = await InventoryRepository.update(id, updates);
      
      if (!updated) {
        return res.status(500).json({
          success: false,
          error: 'Failed to update item'
        });
      }
      
      // Get updated item
      const updatedItem = await InventoryRepository.findById(id);
      
      const response: ApiResponse<InventoryItem> = {
        success: true,
        data: updatedItem!,
        message: 'Item updated successfully'
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update item'
      });
    }
  }

  // DELETE /api/items/:id - Delete item
  static async deleteItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid item ID'
        });
      }
      
      // Check if item exists
      const existingItem = await InventoryRepository.findById(id);
      
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      // Delete item
      const deleted = await InventoryRepository.delete(id);
      
      if (!deleted) {
        return res.status(500).json({
          success: false,
          error: 'Failed to delete item'
        });
      }
      
      const response: ApiResponse = {
        success: true,
        message: 'Item deleted successfully'
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete item'
      });
    }
  }

  // GET /api/items/stats - Get inventory statistics
  static async getStats(req: Request, res: Response) {
    try {
      const [totalItems, totalValue, categories, lowStock] = await Promise.all([
        InventoryRepository.findAll().then(items => items.length),
        InventoryRepository.getTotalValue(),
        InventoryRepository.getCategories(),
        InventoryRepository.getLowStock()
      ]);
      
      const response: ApiResponse = {
        success: true,
        data: {
          totalItems,
          totalValue: parseFloat(totalValue.toFixed(2)),
          categories,
          lowStockCount: lowStock.length,
          lowStockItems: lowStock
        }
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch statistics'
      });
    }
  }

  // GET /api/items/categories - Get all categories
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await InventoryRepository.getCategories();
      
      const response: ApiResponse<string[]> = {
        success: true,
        data: categories
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories'
      });
    }
  }
}