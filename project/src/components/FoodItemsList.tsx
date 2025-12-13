import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, CheckCircle } from "lucide-react"; // icons
import { motion, AnimatePresence } from "framer-motion";
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emptyListImage from "../assets/empty-added-item-digital-ui.png";
import defaultFoodImage from "../assets/default-food-item-image.webp";
import Popup from "./Popup.tsx";

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
  id: number,
  title: string
  type: string
  quantity: number
  unit: string
  freshness_level: string
  pickup_location: string
  expiry_time: string
  timestamp: string
  special_instruction: string
  image_url: string
}

// Selected Item details template
interface SelectedItem {
  id: number,
  title: string
  type: string
  quantity: number
  unit: string
  freshness_level: string
  pickup_location: string
  expiry_time: string
  timestamp: string
  special_instruction: string
  image_url: string
  user_id: number
  user_name: string
  user_username: string
  user_contact: string
}

const FoodItemsList: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItem] = useState<Item[]>([]);
  const [selectedItems, setSelectedItem] = useState<SelectedItem[]>([]);
  const [filteredSelectedItems, setFilteredSelectedItems] = useState<SelectedItem[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState<string>("");
  // const [otpSent, setOtpSent] = useState<Boolean>(true);
  const [loading, setLoading] = useState<Boolean>(false);
  const [loadMessage, setLoadMessage] = useState<string>("");
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState<boolean>(false);
  const [triggeredItem, setTriggeredItem] = useState<Item | null>(null);
  const [triggeredSelectedItem, setTriggeredSelectedItem] = useState<SelectedItem | null>(null);
  const [detectChange, setDetectChange] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<{ value: string; label: string }[]>([]);
  const [tapForConfirmItem, setTapForConfirmItem] = useState<SelectedItem | null>(null);

  useEffect(() => {
    const checkSessionGetData = async () => {
      // // Remove expired items
      // try {
      //   const res = await axios.get("https://smart-surplus-food-redistribution.onrender.com/remove-expired-item/", { withCredentials: true });
      //   console.log(res.data);
      // } catch (err) {
      //   console.log(err);
      // }
      try {
        // Session Cheack
        const sessionResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
          withCredentials: true,
        });
        setUser(sessionResponse.data.user);
        console.log("Session:", sessionResponse.data);
        // Get data
        const dataResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/admin/get-added-items/", {
          withCredentials: true,
        });
        setItem(dataResponse.data.data.items);
        const selectedItemsData = dataResponse.data.data.selected_items;
        setSelectedItem(selectedItemsData);
        setFilteredSelectedItems(selectedItemsData);
        const options = [{ value: "all", label: "All" }, ...selectedItemsData.map((item: SelectedItem) => ({ value: item.user_username, label: item.user_username }))];
        setFilterOptions(options);
        console.log("Session:", dataResponse.data);
      } catch (err) {
        setUser(null);
        navigate('/');
        console.log(err);
      }

    };
    checkSessionGetData();
  }, [detectChange]);

  const handleEdit = async (item: Item) => {
    // try {
    //   // Session Cheack
    //   const sessionResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
    //     withCredentials: true,
    //   });
    //   setUser(sessionResponse.data.user);
    //   console.log("Session:", sessionResponse.data);
    //   // Get data
    // } catch (err) {
    //   setUser(null);
    //   navigate('/');
    //   console.log(err);
    // }
    if (loading) return;
    setLoading(true);
    setLoadMessage("Checking editability...");
    try {
      // Cheack if it can be edited or not
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/admin/check-editability/", {
        id: item.id
      },
        { withCredentials: true, });
      console.log("Session:", response.data);
      setLoading(false);
      setLoadMessage("");
      navigate('/edit-item', { state: { item } });
    } catch (err: any) {
      setLoading(false);
      setLoadMessage("");
      console.log(err);
      alert(err.response.data["detail"] + " !!");
    }
  };

  const handleRemoveItem = async (item: Item) => {
    if (loading) return;
    setTriggeredItem(null);
    // try {
    //   // Session Cheack
    //   const sessionResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
    //     withCredentials: true,
    //   });
    //   setUser(sessionResponse.data.user);
    //   console.log("Session:", sessionResponse.data);
    //   // Get data
    // } catch (err) {
    //   setUser(null);
    //   navigate('/');
    //   console.log(err);
    // }
    try {
      setLoading(true);
      setLoadMessage("Removing item...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/admin/remove-item/", {
        id: item.id
      }, { withCredentials: true, });
      console.log("Session:", response.data);
      detectChange ? setDetectChange(false) : setDetectChange(true);
    } catch (err: any) {
      setLoading(false);
      setLoadMessage("");
      console.log(err);
      alert(err.response.data["detail"] + " !!");
    } finally {
      setLoading(false);
      setLoadMessage("");
    }
  };

  const handleRemoveSelectedItem = async (item: SelectedItem) => {
    setTriggeredSelectedItem(null);
    // try {
    //   // Session Cheack
    //   const sessionResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
    //     withCredentials: true,
    //   });
    //   setUser(sessionResponse.data.user);
    //   console.log("Session:", sessionResponse.data);
    //   // Get data
    // } catch (err) {
    //   setUser(null);
    //   navigate('/');
    //   console.log(err);
    // }
    if (loading) return;
    try {
      setLoading(true);
      setLoadMessage("Removing selected item...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/admin/remove-selected-item/", {
        id: item.id
      }, { withCredentials: true, });
      console.log("Session:", response.data);
      detectChange ? setDetectChange(false) : setDetectChange(true);
    } catch (err: any) {
      console.log(err);
      alert(err.response.data["detail"] + " !!");
    }
  };

  const handleConfirm = async (item: SelectedItem) => {
    if (loading) return;
    try {
      setLoading(true);
      setLoadMessage("OTP sending...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/generate-otp/", {
        username: item.user_username,
        name: item.user_name,
        email_subject_otp: "Pickup Confirmation request",
        email_body_otp: `Dear ${item.user_name},\nYour OTP to confirm pickup for ${item.title} [${item.quantity} ${item.unit}] at ${item.pickup_location} in FoodSurplus is`
      }, { withCredentials: true });
      setLoading(false);
      setError("");
      // setOtpSent(true);
      // setSeconds(60);
      setTapForConfirmItem(item);
      setIsPopupOpen(true);
      detectChange ? setDetectChange(false) : setDetectChange(true);
      console.log("OTP Sent:", response.data);
    } catch (err: any) {
      setLoading(false);
      setTapForConfirmItem(null);
      setError(err.response.data["detail"]);
      // setOtpSent(false);
      // setSeconds(60);
      console.log("OTP Error:", err);
    }
  };

  const handleFilteration = (username: string) => {
    if (username === "all") {
      setFilteredSelectedItems(selectedItems);
    } else {
      const filtered = selectedItems.filter(item => item.user_username === username);
      setFilteredSelectedItems(filtered);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mx-2 mb-6 text-emerald-700">Added Food Items</h1>
      <div className="space-y-6 mx-2">
        {selectedItems.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Selected Items by Email Address of User
            </label>
            <Select
              className="w-72"
              onChange={(opt) => { handleFilteration(opt!.value) }}
              options={filterOptions}
              isSearchable
              styles={{
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "#10B981" // emerald-500
                    : state.isFocused
                      ? "#D1FAE5" // emerald-100
                      : "transparent",
                  color: state.isSelected ? "white" : "#1F2937", // gray-800
                }),
                control: (base) => ({
                  ...base,
                  borderColor: "#5b5b5bff", // emerald-400
                  borderRadius: 9999, // full rounded
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#10B981", // emerald-500
                  },
                }),
              }}
            >
            </Select>
          </div>
        )}

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
          {items.length === 0 && selectedItems.length === 0 && (
            <div className="min-w-60 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
              <img
                src={emptyListImage}
                alt="Empty"
                className="w-[240px] h-[180px] object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 text-center">
                No item added yet!
              </p>
              <button className="max-w-50 flex items-center space-x-3 p-3 my-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200" onClick={() => navigate('/add-donation')}>
                {/* <Plus className="w-5 h-5 text-emerald-600 hover:scale-110 transition-transform duration-300" /> */}
                <span className="font-medium text-emerald-700">Add New Donation</span>
              </button>
            </div>
          )}
          {selectedItems.length > 0 && (
            <h2 className="text-2xl font-bold text-emerald-700 m-4">Selected Items</h2>
          )}
          <AnimatePresence>
            {/* Show selected items applying filter */}
            {filteredSelectedItems.map((item, index) => {
              const expiryTime = new Date(item.expiry_time);
              const now = new Date();
              const diffMillis = expiryTime.getTime() - now.getTime();
              const diffMinutes = Math.floor((diffMillis / 1000) / 60);
              const hrLeft = Math.floor(diffMinutes / 60);
              const minLeft = diffMinutes % 60;
              const expTime = new Date(item.expiry_time).toString().substring(4, 21);
              const pickupStartTime = new Date(item.timestamp).toString().substring(16, 21);
              const pickupCloseTime = new Date(item.expiry_time).toString().substring(16, 21);

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden"
                >
                  <img src={(item.image_url == "") ? defaultFoodImage : item.image_url} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
                  <h2 className="text-xl font-bold text-orange-600 mb-2">{item.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Safe to Eat upto {expTime}</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{hrLeft}h {minLeft}m left</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.freshness_level}</span>
                  </div>
                  {/* <p className="text-gray-700 mb-1"><strong>Description:</strong> {item.description}</p> */}
                  {/* <p className="text-gray-700 mb-1"><strong>Provider:</strong> {user?.name}</p> */}
                  <p className="text-gray-700 mb-1"><strong>Type:</strong> {item.type}</p>
                  <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                  <p className="text-gray-700 mb-1"><strong>Location:</strong> {item.pickup_location}</p>
                  <p className="text-gray-700 mb-1"><strong>Pickup Window:</strong> {pickupStartTime} - {pickupCloseTime} {/*item.pickupWindow*/}</p>
                  <p className="text-gray-700 mb-1"><strong>Selected By:</strong> {item.user_name}</p>
                  <p className="text-gray-700 mb-1"><strong>Contact:</strong> {item.user_contact}</p>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <strong>Packaging & Storage:</strong> {item.special_instruction}
                  </div>
                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleConfirm(item)}
                      // onClick={() => setIsPopupOpen(true)}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium hover:bg-emerald-200 transition"
                    >
                      <CheckCircle size={16} /> Confirm
                    </button>
                    {(item===tapForConfirmItem || item===triggeredSelectedItem) && loading && (
                      <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
                    )}
                    {(item===tapForConfirmItem || item===triggeredSelectedItem) && (error != "") && (
                      <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
                    )}
                    {item && item.user_id && item.user_name && item.user_username && (
                      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} item={item} />
                    )}
                    <button
                      onClick={() => { setIsRemovePopupOpen(true); setTriggeredSelectedItem(item); }}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                  {/* Selected label (top-left) */}

                  <div className="absolute top-4 left-4 bg-emerald-200 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold shadow flex items-center gap-1">
                    <CheckCircle className="text-emerald-600" size={14} /> Selected
                  </div>

                  {/* Removed Donate Item button */}
                  {/* <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">{item.freshness_level}</div> */}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {selectedItems.length > 0 && (
            <h2 className="text-2xl font-bold text-emerald-700 m-4">Added items</h2>
          )}
          <AnimatePresence>
            {items.map((item, index) => {
              const expiryTime = new Date(item.expiry_time);
              const now = new Date();
              const diffMillis = expiryTime.getTime() - now.getTime();
              const diffMinutes = Math.floor((diffMillis / 1000) / 60);
              const hrLeft = Math.floor(diffMinutes / 60);
              const minLeft = diffMinutes % 60;
              const expTime = new Date(item.expiry_time).toString().substring(4, 21);
              const pickupStartTime = new Date(item.timestamp).toString().substring(16, 21);
              const pickupCloseTime = new Date(item.expiry_time).toString().substring(16, 21);

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden"
                >
                  <img src={(item.image_url == "") ? defaultFoodImage : item.image_url} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
                  <h2 className="text-xl font-bold text-orange-600 mb-2">{item.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Safe to Eat upto {expTime}</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{hrLeft}h {minLeft}m left</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.freshness_level}</span>
                  </div>
                  {/* <p className="text-gray-700 mb-1"><strong>Provider:</strong> {user?.name}</p> */}
                  <p className="text-gray-700 mb-1"><strong>Type:</strong> {item.type}</p>
                  <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                  <p className="text-gray-700 mb-1"><strong>Location:</strong> {item.pickup_location}</p>
                  <p className="text-gray-700 mb-1"><strong>Pickup Window:</strong> {pickupStartTime} - {pickupCloseTime} {/*item.pickupWindow*/}</p>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <strong>Packaging & Storage:</strong> {item.special_instruction}
                  </div>
                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    {(item===triggeredItem) && loading && (
                      <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
                    )}
                    {(item===triggeredItem) && (error != "") && (
                      <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
                    )}
                    {true && (<button
                      onClick={() => { setIsRemovePopupOpen(true); setTriggeredItem(item) }}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} /> Remove
                    </button>)}
                  </div>
                  {/* Selected label (top-left) */}
                  {/* Removed Donate Item button */}
                  {/* <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">{item.freshness_level}</div> */}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {/* Remove popup */}
          <AnimatePresence>
            {isRemovePopupOpen && (
              <motion.div
                className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setIsRemovePopupOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Popup card */}
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-6 relative w-80"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button
                    className="absolute top-3 right-3 text-gray-700 hover:text-black font-bold"
                    onClick={() => setIsRemovePopupOpen(false)}
                  >
                    ✕
                  </button>

                  <h2 className="text-xl font-bold mb-4">Remove this item?</h2>
                  <p className="text-gray-700 text-sm">This item will be removed from database parmanently. Proceed with caution.</p>

                  <div className="mt-6">
                    {loading && (
                      <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
                    )}
                    {(error != "") && (
                      <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
                    )}
                    <div>
                      <div className="flex items-center my-3 mb-0">
                        <button onClick={() => setIsRemovePopupOpen(false)} className="text-sm my-3 text-blue-700">Cancel</button>
                        <p className="text-sm mx-6 text-gray-500">|</p>
                        <button onClick={() => { triggeredItem ? handleRemoveItem(triggeredItem) : handleRemoveSelectedItem(triggeredSelectedItem!); setIsRemovePopupOpen(false); }} className="text-sm my-3 text-red-700">Remove</button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default FoodItemsList;
