import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const RequestFoodForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get food details from navigation state
  const food = location.state?.food;

  if (!food) {
    return <div className="max-w-xl mx-auto py-8 text-center text-red-600">No food item selected.</div>;
  }

  const handleConfirm = () => {
    alert('Food request confirmed!');
    navigate('/recipient-dashboard');
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-emerald-700">Confirm Food Request</h1>
      <div className="bg-white p-6 rounded-xl shadow-md border mb-6">
        <img src={food.image} alt={food.title} className="w-full h-48 object-cover rounded-xl mb-4" />
        <h2 className="text-xl font-bold text-orange-600 mb-2">{food.title}</h2>
        <p className="text-gray-700 mb-1"><strong>Donor:</strong> {food.donor}</p>
        <p className="text-gray-700 mb-1"><strong>Distance:</strong> {food.distance}</p>
        <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {food.quantity}</p>
        <p className="text-gray-700 mb-1"><strong>Category:</strong> {food.category}</p>
        <p className="text-gray-700 mb-1"><strong>Expires In:</strong> {food.expires}</p>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <strong>Packaging & Storage:</strong> Please use clean, sealed containers. Store perishable items in cool conditions. Follow food safety guidelines to ensure quality.
        </div>
      </div>
      <button onClick={handleConfirm} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">Confirm Request</button>
    </div>
  );
};

export default RequestFoodForm;
