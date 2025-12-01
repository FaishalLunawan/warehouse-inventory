import { InventoryItem } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateInventoryItem = (item: Partial<InventoryItem>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!item.name || item.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (item.name.length > 100) {
    errors.name = 'Name cannot exceed 100 characters';
  }

  // Category validation
  if (!item.category || item.category.trim().length === 0) {
    errors.category = 'Category is required';
  } else if (item.category.length > 50) {
    errors.category = 'Category cannot exceed 50 characters';
  }

  // Price validation
  if (item.price === undefined) {
    errors.price = 'Price is required';
  } else if (isNaN(item.price) || item.price < 0) {
    errors.price = 'Price must be a valid non-negative number';
  } else if (item.price > 1000000) {
    errors.price = 'Price cannot exceed $1,000,000';
  }

  // Stock validation
  if (item.stock === undefined) {
    errors.stock = 'Stock is required';
  } else if (!Number.isInteger(item.stock) || item.stock < 0) {
    errors.stock = 'Stock must be a valid non-negative integer';
  } else if (item.stock > 1000000) {
    errors.stock = 'Stock cannot exceed 1,000,000 units';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Predefined categories for validation
export const VALID_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Stationery',
  'Kitchen',
  'Clothing',
  'Books',
  'Tools',
  'Other'
];

export const validateCategory = (category: string): boolean => {
  return VALID_CATEGORIES.includes(category);
};