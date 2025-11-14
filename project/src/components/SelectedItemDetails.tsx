import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, MapPin, ArrowLeft } from "lucide-react";
import axios from "axios";
import DefaultFoodItemImage from "../assets/default-food-item-image.webp";
import { nav } from "framer-motion/client";

const SelectedItemDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { item } = location.state || {}; // item data passed via navigate('/review', { state: { item } })

    const [quantity, setQuantity] = useState<number>(1);
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

    if (!item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
                <p>No item selected for review.</p>
                <button
                    className="mt-4 text-emerald-600 font-semibold hover:underline"
                    onClick={() => navigate(-1)}
                >
                    ← Go Back
                </button>
            </div>
        );
    }

    const expiryTime = new Date(item.expiry_time);
    const now = new Date();
    const diffMillis = expiryTime.getTime() - now.getTime();
    const diffMinutes = Math.floor((diffMillis / 1000) / 60);
    const hrLeft = Math.floor(diffMinutes / 60);
    const minLeft = diffMinutes % 60;
    const expTime = new Date(item.expiry_time).toString().substring(4, 21);
    const pickupStartTime = new Date(item.timestamp).toString().substring(16, 21);
    const pickupCloseTime = new Date(item.expiry_time).toString().substring(16, 21);

    // const handleConfirm = async () => {
    //     if (confirming) return;
    //     try {
    //         setLoading(true);
    //         setLoadingMessage("Confirming your selection...");
    //         const res = await axios.post("http://localhost:8000/user/select-item/", {
    //             item_id: item.id,
    //             quantity: quantity,
    //         }, {withCredentials: true});
    //         console.log(res.data);
    //         setLoading(false);
    //         setLoadingMessage(null);
    //         alert("Item selected successfully !!");
    //         navigate(-1);
    //     } catch (err) {
    //         console.log(err);
    //         setLoading(false);
    //         setLoadingMessage(null);
    //     }
    // };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center py-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between w-full max-w-2xl mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-emerald-700">Review Your Selection</h1>
                <div className="w-6" /> {/* spacer */}
            </div>

            {/* Card */}
            <motion.div
                className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl border border-emerald-100"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <img
                    src={item.image_url || DefaultFoodItemImage}
                    alt={item.title}
                    className="w-full h-56 object-cover rounded-xl mb-4"
                />
                <h2 className="text-xl font-bold text-orange-600 mb-2">{item.title}</h2>


                {/* <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                        Safe till {new Date(item.expiry_time).toString().substring(4, 21)}
                    </span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                        Quantity available: {item.quantity}
                    </span>
                </div> */}

                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Safe to Eat upto {expTime}</span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{hrLeft}h {minLeft}m left</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold shadow">{item.freshness_level}</span>
                </div>

                <p className="text-gray-700 mb-1"><strong>Type:</strong> {item.type}</p>
                <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                <p className="text-gray-700 mb-1"><strong>Pickup Location:</strong> {item.pickup_location}
                    <a
                        className="mx-4 text-emerald-600 hover:underline"
                        href={`https://www.google.com/maps/search/?api=1&query=${item.pickup_location}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MapPin className="inline-block w-4 h-5 relative bottom-0.5" />
                        View on Google Maps
                    </a>
                </p>
                <p className="text-gray-700 mb-1"><strong>Pickup Window:</strong> {pickupStartTime} - {pickupCloseTime}</p>
                <p className="text-gray-700 mb-1"><strong>Provider:</strong> {item.admin_name}</p>
                <p className="text-gray-700 mb-1"><strong>Contact:</strong> {item.admin_contact}</p>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <strong>Packaging & Storage:</strong> {item.special_instruction}
                </div>
                {/* <p className="text-gray-600 mb-4">{item.special_instruction}</p> */}
                {/* <p className="text-gray-700 mb-1"><strong>Provider:</strong> {user?.name}</p> */}



                {/* Quantity Input */}
                {/*  */}

                {/* Confirm Button */}
                {/* {loadingMessage && <p className="text-gray-500">{loadingMessage}</p>}
                <div className="flex justify-center mt-8">
                    <motion.button
                        // onClick={handleConfirm}
                        disabled={confirming}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-2 rounded-full text-white font-semibold shadow ${confirming ? "bg-gray-400" : "bg-emerald-500 hover:bg-emerald-600"
                            } transition-all`}
                    >
                        {confirming ? "Confirming..." : "Confirm & Receive"}
                    </motion.button>
                </div> */}
            </motion.div>
        </motion.div>
    );
};

export default SelectedItemDetails;
