Welcome to the Faishal Lunawan Warehouse App.
<img width="1310" height="645" alt="image" src="https://github.com/user-attachments/assets/909126a8-c16d-452d-bd12-081551375c24" />

How to run the app
```
# Open terminal and Backend setup
cd backend
npm install
npm run dev

# In a new terminal, frontend setup
cd frontend
npm install
npm run dev
```
API endpoints
```
// GET /api/items - Get all items
router.get('/', InventoryController.getItems);

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
```
Why you chose your stack ???
I chose **Node.js/Express + Next.js** with **TypeScript** across the stack for its perfect balance of speed and productivity. Node.js handles API requests efficiently, while Next.js provides optimized React features out of the box. **TypeScript** ensures type safety in both frontend and backend, catching errors early. **SQLite** keeps setup simple with zero configuration, and **Tailwind CSS** enables rapid, responsive UI development. This full-stack TypeScript approach creates a unified, maintainable codebase that's both developer-friendly and production-ready.
