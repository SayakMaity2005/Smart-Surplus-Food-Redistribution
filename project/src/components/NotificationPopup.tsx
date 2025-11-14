import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { use } from "framer-motion/client";


interface Notification {
    id: number;
    message: string;
    seen: boolean;
    timestamp: string;
}

interface User {
    name: string;
    username: string;
    role: string;
}

interface NotificationPopupProps {
    refreshNotifications: boolean;
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ refreshNotifications, isOpen, onClose, user }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isUnseen, setIsUnseen] = useState<boolean>(false);
    // const [user, setUser] = useState<User | null>(null);

    const makeSeen = async () => {
        try {
            const response = await axios.get("http://localhost:8000/make-notification-seen/", { withCredentials: true, });
            console.log("Make Seen Response:", response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const getNotifications = async () => {
            try {
                if(isUnseen) makeSeen();
                const notificationsResponse = (user.role === "donate") ?
                    await axios.get("http://localhost:8000/admin/get-admin-notification/", { withCredentials: true, }) :
                    await axios.get("http://localhost:8000/user/get-user-notification/", { withCredentials: true, });
                setNotifications([...notificationsResponse.data.data].reverse()); // ... means creating a copy of the array
                setIsUnseen(notificationsResponse.data.isUnseen);
                console.log("Notifications:", notificationsResponse.data);
            } catch (err) {
                console.log(err);
            }
        };
        getNotifications();
    }, [refreshNotifications]);

    // useEffect(() => {
    //     // Fetch Notifications
    //     const getNotifications = async () => {
    //         try {
    //             const notificationsResponse = (user?.role === "donate") ?
    //                 await axios.get("http://localhost:8000/admin/get-admin-notification/", { withCredentials: true, }) :
    //                 await axios.get("http://localhost:8000/user/get-user-notification/", { withCredentials: true, });
    //             setNotifications(notificationsResponse.data.data);
    //             console.log("Notifications:", notificationsResponse.data);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     getNotifications();
    // }, []);


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="popup-overlay fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div onClick={onClose} className="fixed inset-0 bg-transparent"></motion.div>
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

                        <h2 className="text-xl font-bold mb-4">Notification</h2>
                        {/* <p className="text-gray-700 text-sm">An OTP will be sent to <span className="font-semibold">{item.user_name} <span className="font-normal"> via </span> <span className="italic ">{item.user_username}</span></span> to confirm pickup of <span className="font-semibold">{item.title} [{item.quantity} {item.unit}]</span> at <span className="font-semibold">{item.pickup_location}</span>.</p> */}

                        <div className="mt-4 max-h-[70vh] overflow-y-auto flex flex-col space-y-2">
                            {notifications.length === 0 && (
                                <p className="text-gray-500 text-sm">No new notifications</p>
                            )}
                            {notifications.map((notification) => {
                                const date = new Date(notification.timestamp).toString().substring(4, 21);
                                // makeSeen();
                                return (
                                    <div key={notification.id} className={`${(!notification.seen) ? "bg-emerald-100/50" : "bg-gray-100"} p-2 w-full rounded-md mb-2`}>
                                        <p className={`text-gray-700 text-sm ${(!notification.seen) ? "font-semibold" : "font-normal"}`}>{notification.message}</p>
                                        <p className="text-gray-400 text-xs mt-1 text-right">{date}</p>
                                    </div>
                                );
                            })}
                            {/* {notifications.map((notification) => {
                                const date = new Date(notification.timestamp).toString().substring(4, 21);
                                return (
                                    <div key={notification.id} className={`${(notification.seen)?"bg-emerald-100/50":"bg-gray-100"} p-2 w-full rounded-md mb-2`}>
                                        <p className={`text-gray-700 text-sm ${(notification.seen)?"font-semibold":"font-normal"}`}>{notification.message}</p>
                                        <p className="text-gray-400 text-xs mt-1 text-right">{date}</p>
                                    </div>
                                );
                            })} */}


                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationPopup;