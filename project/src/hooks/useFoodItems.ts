import { useState, useEffect } from 'react';
import { FoodItem } from '../types';

// Mock data for demonstration
const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    title: 'Fresh Vegetable Curry',
    description: 'Delicious mixed vegetable curry with rice, freshly prepared',
    type: 'vegetarian',
    quantity: 25,
    unit: 'servings',
    location: 'Main Campus Canteen',
    providerId: 'provider1',
    providerName: 'Campus Canteen',
    freshness: 'excellent',
    safeToEatHours: 4,
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    createdAt: new Date(),
    status: 'available',
    pickupWindow: { start: '14:00', end: '16:00' },
    specialInstructions: 'Please bring containers for takeaway',
  },
  {
    id: '2',
    title: 'Leftover Pizza Slices',
    description: 'Margherita and pepperoni pizza slices from student event',
    type: 'vegetarian',
    quantity: 15,
    unit: 'pieces',
    location: 'Student Activity Center',
    providerId: 'provider2',
    providerName: 'SAC Events Team',
    freshness: 'good',
    safeToEatHours: 2,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    createdAt: new Date(),
    status: 'available',
    pickupWindow: { start: '18:00', end: '19:30' },
  },
];

export const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems);
  const [loading, setLoading] = useState(false);

  const addFoodItem = async (item: Omit<FoodItem, 'id' | 'createdAt' | 'status'>) => {
    const newItem: FoodItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      status: 'available',
    };
    
    setFoodItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateFoodItem = async (id: string, updates: Partial<FoodItem>) => {
    setFoodItems(prev =>
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const reserveFoodItem = async (id: string, buyerId: string) => {
    updateFoodItem(id, { status: 'reserved', reservedBy: buyerId });
  };

  const getAvailableFoodItems = () => {
    return foodItems.filter(item => 
      item.status === 'available' && new Date() < item.expiresAt
    );
  };

  const getFoodItemsByProvider = (providerId: string) => {
    return foodItems.filter(item => item.providerId === providerId);
  };

  // Auto-update expired items
  useEffect(() => {
    const interval = setInterval(() => {
      setFoodItems(prev =>
        prev.map(item =>
          new Date() >= item.expiresAt && item.status === 'available'
            ? { ...item, status: 'expired' }
            : item
        )
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    foodItems,
    loading,
    addFoodItem,
    updateFoodItem,
    reserveFoodItem,
    getAvailableFoodItems,
    getFoodItemsByProvider,
  };
};