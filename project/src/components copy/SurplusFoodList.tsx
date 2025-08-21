import React from 'react';

// Dummy surplus food listings
const surplusFood = [
  {
    title: 'Leftover Rice & Dal',
    provider: 'Hostel Mess',
    type: 'Vegetarian',
    quantity: 40,
    unit: 'servings',
    freshness: 'Good',
    availability: '18:00 - 20:00',
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg',
  },
  {
    title: 'Sandwiches from Seminar',
    provider: 'Event Organizer',
    type: 'Vegetarian',
    quantity: 25,
    unit: 'pieces',
    freshness: 'Excellent',
    availability: '16:00 - 17:00',
    image: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg',
  }
];

const SurplusFoodList: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">Surplus Food Listings</h1>
      <div className="space-y-6">
        {surplusFood.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
            <h2 className="text-xl font-bold text-orange-600 mb-2">{item.title}</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.type}</span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.quantity} {item.unit}</span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.freshness}</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Available: {item.availability}</span>
            </div>
            <p className="text-gray-700 mb-1"><strong>Provider:</strong> {item.provider}</p>
            <button className="mt-4 bg-gradient-to-r from-emerald-500 to-orange-400 text-white px-4 py-2 rounded shadow hover:scale-105 transition-transform duration-300">Claim Surplus Food</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurplusFoodList;
