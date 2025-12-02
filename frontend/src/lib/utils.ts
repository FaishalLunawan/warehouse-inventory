import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}

export function getStockColor(stock: number): string {
  if (stock === 0) return 'bg-red-100 text-red-800';
  if (stock <= 5) return 'bg-orange-100 text-orange-800';
  if (stock <= 10) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Electronics: 'bg-blue-100 text-blue-800',
    Furniture: 'bg-purple-100 text-purple-800',
    Stationery: 'bg-green-100 text-green-800',
    Kitchen: 'bg-yellow-100 text-yellow-800',
    Clothing: 'bg-pink-100 text-pink-800',
    Books: 'bg-indigo-100 text-indigo-800',
    Tools: 'bg-gray-100 text-gray-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function validateFormData(data: {
  name: string;
  category: string;
  price: string;
  stock: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  const price = parseFloat(data.price);
  if (isNaN(price) || price < 0) {
    errors.price = 'Price must be a valid non-negative number';
  } else if (price > 1000000) {
    errors.price = 'Price cannot exceed $1,000,000';
  }

  const stock = parseInt(data.stock);
  if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
    errors.stock = 'Stock must be a valid non-negative integer';
  } else if (stock > 1000000) {
    errors.stock = 'Stock cannot exceed 1,000,000 units';
  }

  return errors;
}