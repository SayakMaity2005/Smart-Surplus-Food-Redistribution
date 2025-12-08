import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { use } from "framer-motion/client";

interface SelectedItem {
    id: number
    title: string
    type: string
    quantity: number
    unit: string
    freshness_level: string
    pickup_location: string
    expiry_time: string
    timestamp: string
    special_instruction: string
    user_id: number
    user_name: string
    user_username: string
    user_contact: string
}

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
    item: SelectedItem;
}

// User template
interface User {
    name: string;
    username: string;
    role: string;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, item }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>("");
    // const [otpSent, setOtpSent] = useState<Boolean>(true);
    const [loading, setLoading] = useState<Boolean>(false);
    const [loadMessage, setLoadMessage] = useState<string>("");
    const [seconds, setSeconds] = useState(60);
    const [otpData, setOtpData] = useState<string>("");

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains("popup-overlay")) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const checkSessionGetData = async () => {
            try {
                // Session Cheack
                const sessionResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
                    withCredentials: true,
                });
                setUser(sessionResponse.data.user);
                console.log("Session:", sessionResponse.data);
                setSeconds(60);
            } catch (err) {
                setUser(null);
                navigate('/');
                console.log(err);
            }
        };
        checkSessionGetData();
    }, [isOpen]);

    // Timer for OTP resend
    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // cleanup
        }
    }, [seconds]);

    const handleOtpRequest = async () => {
        if(loading) return;
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
            setSeconds(60);
            console.log("OTP Sent:", response.data);
        } catch (err: any) {
            setLoading(false);
            setError(err.response.data["detail"]);
            // setOtpSent(false);
            // setSeconds(60);
            console.log("OTP Error:", err);
        }
    };

    const handleOtpVerification = async () => {
        if(loading) return;
        try {
            setLoading(true);
            setLoadMessage("Verifying OTP...");
            const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/verify-otp/", {
                otp: otpData
            }, { withCredentials: true });
            setLoading(false);
            setError("");
            // Confirm Donation API
            try {
                setLoading(true);
                setLoadMessage("Confirming item...");
                const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/admin/confirm-donation/", {
                    item_id: item.id,
                    user_id: item.user_id,
                    user_name: item.user_name,
                    user_username: item.user_username
                }, { withCredentials: true });  // { withCredentials: true } this the line makes the cookie thing possible
                setLoading(false);
                setError("");
                console.log("Confirm Donation Success:", response.data);
                // navigate(formData.userType === "donate" ? "/donor-dashboard" : "/recipient-dashboard");
            } catch (err: any) {
                setLoading(false);
                setError(err.response.data["detail"]);
                alert(err.response.data["detail"]);
                console.log("Confirm Donation Error:", err);
            }
            console.log("OTP Verified:", response.data);
            onClose();
        } catch (err: any) {
            setLoading(false);
            setError(err.response.data["detail"]);
            console.log("OTP Verification Error:", err);
        }

    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Popup card */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg p-6 relative w-96"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-3 right-3 text-gray-700 hover:text-black font-bold"
                            onClick={onClose}
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">Confirmation</h2>
                        <p className="text-gray-700 text-sm">An OTP will be sent to <span className="font-semibold">{item.user_name} <span className="font-normal"> via </span> <span className="italic ">{item.user_username}</span></span> to confirm pickup of <span className="font-semibold">{item.title} [{item.quantity} {item.unit}]</span> at <span className="font-semibold">{item.pickup_location}</span>.</p>

                        <div className="mt-6">
                            {(<div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    OTP
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="otp"
                                        value={otpData}
                                        onChange={(e) => setOtpData(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter OTP"
                                        required={true}
                                    />
                                </div>
                            </div>)}
                            {(
                                <div>
                                    <div className="flex items-center my-3">
                                        <button onClick={(seconds > 0) ? undefined : handleOtpRequest} className={(seconds > 0) ? "text-sm my-3 mx-2 text-gray-500" : "text-sm my-3 text-blue-500"}>Resend OTP</button>
                                        {seconds > 0 && (<p> in {seconds}s</p>)}
                                    </div>
                                    {loading && (
                                        <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
                                    )}
                                    {(error != "") && (
                                        <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
                                    )}
                                    <button onClick={handleOtpVerification} className="mt-1 w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300">
                                        Verify OTP
                                    </button>
                                </div>
                            )}
                            {/* {loading && (
                                <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
                            )} */}

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Popup;
