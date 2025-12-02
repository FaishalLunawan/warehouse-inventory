'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import ItemList from '@/components/inventory/ItemList';
import ItemForm from '@/components/inventory/ItemForm';
import SearchBar from '@/components/inventory/SearchBar';
import { inventoryApi } from '@/lib/api';
import { InventoryItem } from '@/types';
import { toast, Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: ''
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        inventoryApi.getItems(),
        inventoryApi.getCategories()
      ]);
      setItems(itemsData);
      setFilteredItems(itemsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      await loadData();
    };
    
    if (isMounted) {
      fetchData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [loadData]); 

  const handleSearch = useCallback(async (search: string, category: string) => {
    setSearchParams({ search, category });
    
    try {
      setIsLoading(true);
      const data = await inventoryApi.getItems({ search, category });
      setFilteredItems(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to search items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = useCallback(async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      const newItem = await inventoryApi.createItem(itemData);
      setItems(prevItems => [newItem, ...prevItems]);
      setFilteredItems(prevItems => [newItem, ...prevItems]);
      
      setCategories(prevCategories => {
        if (!prevCategories.includes(newItem.category)) {
          return [...prevCategories, newItem.category].sort();
        }
        return prevCategories;
      });
      
      setShowForm(false);
      toast.success('Item created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create item');
      throw error;
    }
  }, []);

  const handleUpdate = useCallback(async (itemData: Omit<InventoryItem, 'id'>) => {
    if (!editingItem) return;
    
    try {
      const updatedItem = await inventoryApi.updateItem(editingItem.id, itemData);
      
      setItems(prevItems => 
        prevItems.map(item => item.id === editingItem.id ? updatedItem : item)
      );
      setFilteredItems(prevItems => 
        prevItems.map(item => item.id === editingItem.id ? updatedItem : item)
      );
      
      setEditingItem(null);
      setShowForm(false);
      toast.success('Item updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update item');
      throw error;
    }
  }, [editingItem]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await inventoryApi.deleteItem(id);
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      setFilteredItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast.success('Item deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
    }
  }, []);

  const handleEdit = useCallback((item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  }, []);

  return (
    <Layout>
      <Toaster position="top-right" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage your warehouse</p>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </button>
        </div>

        {showForm ? (
          <ItemForm
            item={editingItem}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            categories={categories}
          />
        ) : (
          <>
            <SearchBar
              onSearch={handleSearch}
              categories={categories}
              initialSearch={searchParams.search}
              initialCategory={searchParams.category}
            />
            
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">All Items</h2>
                  <p className="text-sm text-gray-600">
                    {filteredItems.length} items found
                  </p>
                </div>
              </div>  
              
              <ItemList
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}