import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// User template
interface User {
  name: string;
  username: string;
  role: string;
}
// Item details template
interface Item {
  title: string
  type: string
  quantity: number
  unit: string
  freshness_level: string
  pickup_location: string
  expiry_time: string
  timestamp: string
  special_instruction: string
}

const FoodItemsList: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItem] = useState<Item[]>([]);

  useEffect(() => {
    const checkSessionGetData = async () => {
      try {
        // Session Cheack
        const sessionResponse = await axios.get("http://localhost:8000/verify-session/", {
          withCredentials: true,
        });
        setUser(sessionResponse.data.user);
        console.log("Session:", sessionResponse.data);
        // Get data
        const dataResponse = await axios.get("http://localhost:8000/admin/get-added-items/", {
          withCredentials: true,
        });
        setItem(dataResponse.data.data);
        console.log("Session:", dataResponse.data);
      } catch (err) {
        setUser(null);
        navigate('/');
        console.log(err);
      }
    };
    checkSessionGetData();
  }, []);

  // All items in a list
  // const itemObjects: JSX.Element[] = [];
  // for (let i = 0; i < items.length; i++) {
  //   console.log(".........loop..........");
  //   itemObjects.push(
  //     <div key={i} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden">
  //       <img src={'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg'} alt={items[i].title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
  //       <h2 className="text-xl font-bold text-orange-600 mb-2">{items[i].title}</h2>
  //       <div className="flex flex-wrap gap-2 mb-2">
  //         <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Safe to Eat for {items[i].expiry_time} hours</span>
  //         <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{items[i].expiry_time}hr left</span>
  //         <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{items[i].freshness_level}</span>
  //       </div>
  //       {/* <p className="text-gray-700 mb-1"><strong>Description:</strong> {item.description}</p> */}
  //       <p className="text-gray-700 mb-1"><strong>Provider:</strong> {user?.name}</p>
  //       <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {items[i].quantity} {items[i].unit}</p>
  //       <p className="text-gray-700 mb-1"><strong>Location:</strong> {items[i].pickup_location}</p>
  //       <p className="text-gray-700 mb-1"><strong>Pickup Window:</strong> {"12: 00 - 18: 00"} {/*item.pickupWindow*/}</p>
  //       <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
  //         <strong>Packaging & Storage:</strong> {items[i].special_instruction}
  //       </div>
  //       {/* Removed Donate Item button */}
  //       <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">{items[i].freshness_level}</div>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">Added Food Items</h1>
      <div className="space-y-6">
        {/* {foodItems.map((item, idx) => {
          const expiresAt = new Date(item.addedAt.getTime() + item.safeToEatHours * 60 * 60 * 1000);
          const timeLeftMs = expiresAt.getTime() - now.getTime();
          const expired = timeLeftMs <= 0;
          const hoursLeft = (items == null) ? 3 : items[0].expiry_time; //Math.floor(timeLeftMs / (1000 * 60 * 60));
          const minsLeft = 0; //Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
          if (expired) return null; // auto-remove expired items */}



        {/* return ( */}
        {/* // <div key={idx} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden"> */}
        <div className="bg-white rounded-xl shadow-md p-6 border ">
          {/* <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
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
              {/* Removed Donate Item button 
              <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">{item.freshness}</div> */}
          {/* {itemObjects} */}
          {items.map((item, index) => {
            const expiryTime = new Date(item.expiry_time);
            const now = new Date();
            const diffMillis = expiryTime.getTime() - now.getTime();
            const diffMinutes = Math.floor((diffMillis / 1000) / 60);
            const hrLeft = Math.floor(diffMinutes / 60);
            const minLeft = diffMinutes % 60;
            const expTime = new Date(item.expiry_time).toString().substring(4,21);
            const pickupStartTime = new Date(item.timestamp).toString().substring(16, 21);
            const pickupCloseTime = new Date(item.expiry_time).toString().substring(16, 21);

            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden">
                <img src={'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg'} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
                <h2 className="text-xl font-bold text-orange-600 mb-2">{item.title}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Safe to Eat upto {expTime}</span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{hrLeft}h {minLeft}m left</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.freshness_level}</span>
                </div>
                {/* <p className="text-gray-700 mb-1"><strong>Description:</strong> {item.description}</p> */}
                <p className="text-gray-700 mb-1"><strong>Provider:</strong> {user?.name}</p>
                <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                <p className="text-gray-700 mb-1"><strong>Location:</strong> {item.pickup_location}</p>
                <p className="text-gray-700 mb-1"><strong>Pickup Window:</strong> {pickupStartTime} - {pickupCloseTime} {/*item.pickupWindow*/}</p>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  <strong>Packaging & Storage:</strong> {item.special_instruction}
                </div>
                {/* Removed Donate Item button */}
                <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">{item.freshness_level}</div>
              </div>
            )
          })}

        </div>
        {/* ); */}
        {/* })} */}
      </div>
    </div>
  );
};

export default FoodItemsList;
