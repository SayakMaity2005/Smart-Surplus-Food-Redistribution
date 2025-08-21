import React, { useState } from 'react';

const AddDonationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'vegetarian',
    quantity: '',
    unit: 'servings',
    freshness: 'excellent',
    location: '',
    safeToEatHours: '4',
    pickupStart: '',
    pickupEnd: '',
    specialInstructions: '',
  });

  const foodTypes = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'non-vegetarian', label: 'Non-Vegetarian' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'contains-dairy', label: 'Contains Dairy' },
  ];

  const freshnessLevels = [
    { value: 'excellent', label: 'Excellent - Just prepared' },
    { value: 'good', label: 'Good - Still fresh' },
    { value: 'fair', label: 'Fair - Best consumed soon' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    alert('Donation submitted!');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-emerald-700">Add New Donation</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food Title</label>
          <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Fresh Vegetable Curry" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded">
            {foodTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input name="quantity" type="number" min="1" value={formData.quantity} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., 25" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="servings">Servings</option>
              <option value="kg">Kilograms</option>
              <option value="pieces">Pieces</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Freshness Level</label>
          <select name="freshness" value={formData.freshness} onChange={handleChange} className="w-full border p-2 rounded">
            {freshnessLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
          <input name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" placeholder="e.g., Main Campus Canteen, Room 101" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safe to Eat (Hours)</label>
            <input name="safeToEatHours" type="number" min="1" max="24" value={formData.safeToEatHours} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Window</label>
            <div className="flex gap-2">
              <input name="pickupStart" type="time" value={formData.pickupStart} onChange={handleChange} className="border p-2 rounded w-1/2" />
              <input name="pickupEnd" type="time" value={formData.pickupEnd} onChange={handleChange} className="border p-2 rounded w-1/2" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
          <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} className="w-full border p-2 rounded" rows={3} placeholder="Any special handling instructions, containers needed, etc." />
        </div>
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">Submit Donation</button>
      </form>
    </div>
  );
};

export default AddDonationForm;
