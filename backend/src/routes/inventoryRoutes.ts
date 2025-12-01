import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';

const router = Router();

// GET /api/items - Get all items
router.get('/', InventoryController.getItems);

// GET /api/items/stats - Get inventory statistics
router.get('/stats', InventoryController.getStats);

// GET /api/items/categories - Get all categories
router.get('/categories', InventoryController.getCategories);

// GET /api/items/:id - Get single item
router.get('/:id', InventoryController.getItem);

// POST /api/items - Create new item
router.post('/', InventoryController.createItem);

// PUT /api/items/:id - Update item
router.put('/:id', InventoryController.updateItem);

// DELETE /api/items/:id - Delete item
router.delete('/:id', InventoryController.deleteItem);

export default router;