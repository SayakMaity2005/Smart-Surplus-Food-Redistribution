import React from 'react';

// Dummy food items data
const now = new Date();
const foodItems = [
  {
    title: 'Fresh Vegetable Curry',
    description: 'A healthy mix of fresh vegetables and spices.',
    provider: 'Sunita Kitchen',
    quantity: 25,
    unit: 'servings',
    freshness: 'Excellent',
    location: 'Main Campus Canteen',
    pickupWindow: '10:00 - 12:00',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg',
    safeToEatHours: 4,
    addedAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    title: 'Bakery Items',
    description: 'Assorted breads and pastries.',
    provider: 'Green Grocery Co.',
    quantity: 8,
    unit: 'pieces',
    freshness: 'Good',
    location: 'Community Center',
    pickupWindow: '14:00 - 16:00',
    image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
    safeToEatHours: 2,
    addedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
  }
];

const FoodItemsList: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">Added Food Items</h1>
      <div className="space-y-6">
        {foodItems.map((item, idx) => {
          const expiresAt = new Date(item.addedAt.getTime() + item.safeToEatHours * 60 * 60 * 1000);
          const timeLeftMs = expiresAt.getTime() - now.getTime();
          const expired = timeLeftMs <= 0;
          const hoursLeft = Math.floor(timeLeftMs / (1000 * 60 * 60));
          const minsLeft = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
          if (expired) return null; // auto-remove expired items
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
              <h2 className="text-xl font-bold text-orange-600 mb-2">{item.title}</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Safe to Eat for {item.safeToEatHours} hours</span>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{hoursLeft}h {minsLeft}m left</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.freshness}</span>
              </div>
              <p className="text-gray-700 mb-1"><strong>Description:</strong> {item.description}</p>
              <p className="text-gray-700 mb-1"><strong>Provider:</strong> {item.provider}</p>
              <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
              <p className="text-gray-700 mb-1"><strong>Location:</strong> {item.location}</p>
              <p className="text-gray-700 mb-1"><strong>Pickup Window:</strong> {item.pickupWindow}</p>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <strong>Packaging & Storage:</strong> Please use clean, sealed containers. Store perishable items in cool conditions. Follow food safety guidelines to ensure quality.
              </div>
              {/* Removed Donate Item button */}
              <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">{item.freshness}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodItemsList;
