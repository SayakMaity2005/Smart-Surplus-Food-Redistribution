import React, { useState } from 'react';
// You may need to adjust these imports based on your actual project structure
// import { useFoodItems } from '../hooks/useFoodItems';
// import { useAuth } from '../hooks/useAuth';
// import { Input, Button, Card, CardHeader, CardContent } from '../ui';
// import { Package, MapPin, Clock, AlertCircle } from 'lucide-react';

// Dummy types for demonstration. Replace with your actual types.
type FoodItem = {
  type: string;
  unit: string;
  freshness: string;
};

const useFoodItems = () => ({ addFoodItem: async () => {}, loading: false });
const useAuth = () => ({ user: { id: '1', organization: 'Org', name: 'Donor' } });

const Input = (props: any) => <input {...props} className={props.className || 'border p-2 rounded w-full'} />;
const Button = (props: any) => <button {...props} className={props.className || 'bg-emerald-600 text-white px-4 py-2 rounded'}>{props.children}</button>;
const Card = (props: any) => <div className="bg-white rounded-xl shadow-sm border p-6 mb-4">{props.children}</div>;
const CardHeader = (props: any) => <div className="mb-4">{props.children}</div>;
const CardContent = (props: any) => <div>{props.children}</div>;


export const AddFoodForm: React.FC = () => {
  const { addFoodItem, loading } = useFoodItems();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'vegetarian' as FoodItem['type'],
    quantity: '',
    unit: 'servings' as FoodItem['unit'],
    location: '',
    freshness: 'excellent' as FoodItem['freshness'],
    safeToEatHours: '4',
    pickupStart: '',
    pickupEnd: '',
    specialInstructions: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.pickupStart) newErrors.pickupStart = 'Pickup start time is required';
    if (!formData.pickupEnd) newErrors.pickupEnd = 'Pickup end time is required';
    if (formData.pickupStart && formData.pickupEnd && formData.pickupStart >= formData.pickupEnd) {
      newErrors.pickupEnd = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;
    const safeHours = parseInt(formData.safeToEatHours);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + safeHours);
    const newItem = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      location: formData.location,
      providerId: user.id,
      providerName: user.organization || user.name,
      freshness: formData.freshness,
      safeToEatHours: safeHours,
      expiresAt,
      pickupWindow: {
        start: formData.pickupStart,
        end: formData.pickupEnd,
      },
      specialInstructions: formData.specialInstructions || undefined,
    };
    try {
  await addFoodItem();
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        type: 'vegetarian',
        quantity: '',
        unit: 'servings',
        location: '',
        freshness: 'excellent',
        safeToEatHours: '4',
        pickupStart: '',
        pickupEnd: '',
        specialInstructions: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to add food item. Please try again.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <span className="w-6 h-6 text-emerald-600">📦</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Food Item</h2>
              <p className="text-gray-600">List your surplus food for redistribution</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 text-green-600">📦</span>
                <span className="font-medium text-green-900">Food item added successfully!</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{errors.submit}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                placeholder="e.g., Fresh Vegetable Curry"
                value={formData.title}
                onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
              />
              <div>
                <select
                  value={formData.type}
                  onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg"
                >
                  {foodTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              placeholder="Describe the food item, ingredients, etc."
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                type="number"
                placeholder="e.g., 25"
                min="1"
                value={formData.quantity}
                onChange={(e: any) => setFormData({ ...formData, quantity: e.target.value })}
              />
              <div>
                <select
                  value={formData.unit}
                  onChange={(e: any) => setFormData({ ...formData, unit: e.target.value })}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg"
                >
                  <option value="servings">Servings</option>
                  <option value="kg">Kilograms</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>
              <Input
                type="number"
                placeholder="4"
                min="1"
                max="24"
                value={formData.safeToEatHours}
                onChange={(e: any) => setFormData({ ...formData, safeToEatHours: e.target.value })}
              />
            </div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {freshnessLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, freshness: level.value })}
                    className={`p-3 border-2 rounded-lg ${formData.freshness === level.value ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-sm font-medium">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <Input
              placeholder="e.g., Main Campus Canteen, Room 101"
              value={formData.location}
              onChange={(e: any) => setFormData({ ...formData, location: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="time"
                value={formData.pickupStart}
                onChange={(e: any) => setFormData({ ...formData, pickupStart: e.target.value })}
              />
              <Input
                type="time"
                value={formData.pickupEnd}
                onChange={(e: any) => setFormData({ ...formData, pickupEnd: e.target.value })}
              />
            </div>
            <div>
              <textarea
                rows={3}
                placeholder="Any special handling instructions, containers needed, etc."
                value={formData.specialInstructions}
                onChange={(e: any) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0">⚠️</span>
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Food Safety Reminder</p>
                  <p>Please ensure the food is safe for consumption and follow proper storage guidelines. The item will be automatically removed when the safety window expires.</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" loading={loading} className="flex-1">Add Food Item</Button>
              <Button type="button" variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFoodForm;
