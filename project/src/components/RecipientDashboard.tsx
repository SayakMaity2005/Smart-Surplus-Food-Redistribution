import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Search,
  MapPin,
  Clock,
  Package,
  CheckCircle,
  Calendar,
  User,
  Users,
  LogOut,
  Bell,
  Settings,
  Star,
  BarChart3,
  Truck,
  Menu, X,
  User2,
  Edit3,
  Edit2,
  Moon,
  Trash,
  Grid
} from 'lucide-react';
import axios from "axios";
import emptyListImage from "../assets/empty-list-digital-ui.jpg";
import emptyListImage2 from "../assets/empty-selected-item-digital-ui.jpg";
import defaultFoodImage from "../assets/default-food-item-image.webp";
import NotificationPopup from './NotificationPopup.tsx';
import userProfileIconImage from '../assets/user-profile-icon-circle-digital-ui.jpg'


// User template
interface User {
  name: string;
  username: string;
  role: string;
}
// Item details template
interface Item {
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
  image_url: string
  admin_name: string
  admin_contact: string
}

// Daily statistics data template
interface UserDailyStatData {
  date: string
  items_received: number
}

// Monthly statistics data template
interface UserMonthlyStatData {
  date: string
  items_received: number
}

// User Current data
interface UserCurrentData {
  active_requests: number
}

// profile data template
interface ProfileData {
  name: string
  username: string
  role: string
  contact: string
  profile_pic_url: string
}

const RecipientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');


  // Session Cheack
  const [user, setUser] = useState<User | null>(null);
  const [items, setItem] = useState<Item[]>([]);
  const [selectedItems, setSelectedItem] = useState<Item[]>([]);
  const [selectingItem, setSelectingItem] = useState<Boolean>(false);
  const defaultUserDailyStatData: UserMonthlyStatData = {
    date: '',
    items_received: 0
  };
  const defaultUserMonthlyStatData: UserMonthlyStatData = {
    date: '',
    items_received: 0
  };
  const [userDailyStatData, setUserDailyStatData] = useState<UserDailyStatData>(defaultUserDailyStatData);
  const [userMonthlyStatData, setUserMonthlyStatData] = useState<UserMonthlyStatData>(defaultUserMonthlyStatData);
  const [userCurrentData, setUserCurrentData] = useState<UserCurrentData>({
    active_requests: 0
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const [refreshNotifications, setRefreshNotifications] = useState<boolean>(false);
  const [isUnseen, setIsUnseen] = useState<boolean>(false);

  const [filters, setFilters] = useState<boolean[]>([false, false, false, false, false]);
  const [expiryFilter, setExpiryFilter] = useState<number>(0);
  // const [maxActiveRequest, setMaxActiveRequest] = useState<number>(0);
  // const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [profilePopup, setProfilePopup] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileEditPopup, setProfileEditPopup] = useState<boolean>(false);
  const [profileFormData, setProfileFormData] = useState<ProfileData | null>(null);


  useEffect(() => {
    const checkSession = async () => {
      // // Remove expired items
      // try {
      //   const res = await axios.get("https://smart-surplus-food-redistribution.onrender.com/remove-expired-item/", { withCredentials: true });
      //   console.log(res.data);
      // } catch (err) {
      //   console.log(err);
      // }

      try {
        // Session Cheack
        const res = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
          withCredentials: true,
        });
        setUser(res.data.user);
        console.log("Session:", res.data);

      } catch (err) {
        setUser(null);
        // navigate('/');
        console.log(err);
      }
      try {
        // Get items
        const res = await axios.get("https://smart-surplus-food-redistribution.onrender.com/user/get-all-items/", {
          withCredentials: true,
        });
        setItem(res.data.data);
        console.log("Session:", res.data);
      } catch (err) {
        console.log(err);
      }
      try {
        // Get selected items
        const res = await axios.get("https://smart-surplus-food-redistribution.onrender.com/user/get-selected-items-user/", {
          withCredentials: true,
        });
        setSelectedItem(res.data.data);
        console.log("Session:", res.data);
      } catch (err) {
        console.log(err);
      }

      try {
        const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/user/get-daily-user-stat-data/", {
          withCredentials: true,
        });
        setUserDailyStatData(response.data.data.daily_data);
        setUserMonthlyStatData(response.data.data.monthly_data);
        console.log("User Daily Stat Data:", response.data);
      } catch (err) {
        console.log(err);
      }

      try {
        const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/user/get-user-current-data/", {
          withCredentials: true,
        });
        setUserCurrentData(response.data.data);
        console.log("User Current Data:", response.data);
      } catch (err) {
        console.log(err);
      }

      // checking notification state
      try {
        const notificationsResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/user/get-user-notification/", { withCredentials: true, });
        // setNotifications(notificationsResponse.data.data);
        setIsUnseen(notificationsResponse.data.isUnseen);
        console.log("Notifications:", notificationsResponse.data);
      } catch (err) {
        console.log(err);
      }
    };

    checkSession();
  }, [selectingItem]);

  const verifySession = async () => {
    try {
      const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
        withCredentials: true,
      });
      setUser(response.data.user);
      console.log("Session:", response.data);
    } catch (err) {
      setUser(null);
      navigate('/');
      console.warn("Session not verified:", err);
    }
  };

  // useEffect(() => { setSelectingItem(false) }, [selectingItem]);

  const getUserName = (name: string) => {
    console.log(user?.name);
    let userName = name;
    for (let i = 0; i < name.length; i++) {
      if (i != 0 && name.charAt(i) === ' ') {
        userName = name.substring(0, i);
        break;
      }
    }
    userName = userName.toLowerCase();
    userName = userName.substring(0, 1).toUpperCase() + userName.substring(1);
    return userName;
  };

  // Select Item
  const selectItem = async (itemId: number) => {
    await verifySession();
    const triggeredItem = items.find(item => item.id === itemId);
    navigate("/review-item", { state: { item: triggeredItem } });
    // try {
    //   setSelectingItem(true);
    //   const res = await axios.post("https://smart-surplus-food-redistribution.onrender.com/user/select-item/", {
    //     item_id: itemId,
    //   },
    //     {
    //       withCredentials: true,
    //     });
    //   console.log(res.data);
    //   setSelectingItem(false);
    // } catch (err) {
    //   console.log(err);
    //   setSelectingItem(false);
    // }
  };
  // selected item details
  const selectedItemDetails = async (itemId: number) => {
    await verifySession();
    const triggeredItem = selectedItems.find(item => item.id === itemId);
    navigate("/selected-item-details", { state: { item: triggeredItem } });
  };

  const filterCheck = (idx: number) => {
    setFilters(prevFilters => {
      const tempFilters = [...prevFilters];
      tempFilters[idx] = !tempFilters[idx];
      return tempFilters;
    });
  };


  const handleProfileDataPopup = async () => {
    setProfilePopup(true);
    if (profileData) return;
    await verifySession();
    try {
      const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/profile/get-profile/", { withCredentials: true, });
      // setNotifications(notificationsResponse.data.data);
      setProfileData(response.data.data);
      setProfileFormData(response.data.data);
      console.log("Profile:", response.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleProfileDataEditPopup = async () => {
    setProfileEditPopup(true);
    if (profileData) return;
    await verifySession();
    try {
      const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/profile/get-profile/", { withCredentials: true, });
      // setNotifications(notificationsResponse.data.data);
      setProfileData(response.data.data);
      setProfileFormData(response.data.data);
      console.log("Profile:", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Image upload part
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setIsImageSelected(true);
    } else {
      alert("Please select a valid image file!");
    }
  };

  const uploadImage = async () => {
    if (loading) return;
    if (!imageFile) return alert("No image selected!");
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      setLoading(true);
      setLoadingMessage("Uploading image...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/upload-image/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setImageUrl(response.data.image_url); // Cloudinary returns this URL
      setProfileFormData({ ...profileFormData!, profile_pic_url: response.data.image_url });
      setIsImageSelected(false);
      console.log("Uploaded Image URL:", response.data);
    } catch (err) {
      setLoading(false);
      setLoadingMessage(null);
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
      setLoadingMessage(null);
      setIsImageSelected(false);
    }
  };

  const discardEditProfile = async () => {
    setProfileEditPopup(false);
    if (loading) return;
    if (!imageUrl) {
      setIsImageSelected(false);
      // setProfileEditPopup(false);
      setProfileFormData(profileData);
      return;
    }
    try {
      setLoading(true);
      setLoadingMessage("Discarding changes...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/profile/discard-profile-edit/",
        { profile_pic_url: imageUrl ? imageUrl : "" },
        { withCredentials: true },
      );
      setIsImageSelected(false);
      // setProfileEditPopup(false);
      setProfileFormData(profileData);
      setImageUrl(null);
      console.log("Uploaded Image URL:", response.data);
    } catch (err) {
      setLoading(false);
      setLoadingMessage(null);
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
      setLoadingMessage(null);
      setIsImageSelected(false);
    }
  };

  const saveProfileChanges = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setLoadingMessage("Discarding changes...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/profile/edit-profile/",
        {
          profile_pic_url: imageUrl ? imageUrl : "",
          name: profileFormData?.name,
          contact: profileFormData?.contact
        },
        { withCredentials: true },
      );
      setIsImageSelected(false);
      setProfileEditPopup(false);
      setProfileData(null);
      setImageUrl(null);
      console.log("Profile update:", response.data);
    } catch (err) {
      setLoading(false);
      setLoadingMessage(null);
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
      setLoadingMessage(null);
      setIsImageSelected(false);
    }
  };

  const handleDeleteProfilePic = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setLoadingMessage("Deleting profile picture...");
      const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/profile/delete-profile-pic/",
        { withCredentials: true },
      );
      setProfileData(null);
      setProfileFormData({ ...profileFormData!, profile_pic_url: "" });
      setImageUrl(null);
      console.log("Profile update:", response.data);
    } catch (err) {
      setLoading(false);
      setLoadingMessage(null);
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
      setLoadingMessage(null);
    }
  };


  const stats = [
    { label: 'Food items Received', value: userDailyStatData.items_received, icon: Package, color: 'emerald' },
    { label: 'Active Requests', value: userCurrentData.active_requests, icon: Clock, color: 'orange' },
    { label: 'Items Received This Month', value: userMonthlyStatData.items_received, icon: Calendar, color: 'emerald' },
    // { label: 'Pickup completion', value: '', icon: Star, color: 'orange' }
  ];

  const availableFood = [
    {
      id: 1,
      title: 'Fresh Vegetables & Fruits',
      donor: 'Green Valley Market',
      distance: '1.2 miles',
      quantity: '15 lbs',
      expires: '2 hours',
      category: 'Fresh Produce',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg'
    },
    {
      id: 2,
      title: 'Bakery Items',
      donor: 'Corner Bakery',
      distance: '0.8 miles',
      quantity: '12 items',
      expires: '4 hours',
      category: 'Baked Goods',
      image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg'
    },
    {
      id: 3,
      title: 'Prepared Meals',
      donor: 'Sunny Restaurant',
      distance: '2.1 miles',
      quantity: '8 portions',
      expires: '1 hour',
      category: 'Ready to Eat',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
    },
    {
      id: 4,
      title: 'Dairy Products',
      donor: 'Family Grocers',
      distance: '1.5 miles',
      quantity: '6 items',
      expires: '6 hours',
      category: 'Dairy',
      image: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg'
    }
  ];

  const myRequests = [
    { id: 1, food: 'Fresh Vegetables', status: 'approved', pickup: '2:00 PM today', donor: 'Green Valley Market' },
    { id: 2, food: 'Canned Goods', status: 'pending', pickup: 'TBD', donor: 'Community Pantry' },
    { id: 3, food: 'Bread & Pastries', status: 'collected', pickup: 'Yesterday 4:00 PM', donor: 'Corner Bakery' }
  ];

  const handleLogout = async () => {
    const response = await axios.post(
      "https://smart-surplus-food-redistribution.onrender.com/logout/",
      {},
      { withCredentials: true }
    );
    console.log("Signout Success:", response.data);
    navigate('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'collected': return <Package className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'collected': return 'bg-blue-100 text-blue-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getExpiryColor = (expires: string) => {
    const hours = parseInt(expires);
    if (hours <= 1) return 'text-red-600';
    if (hours <= 3) return 'text-orange-600';
    return 'text-green-600';
  };

  const expiryOptions = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Within 1 hrs' },
    { value: 2, label: 'Within 2 hrs' },
    { value: 3, label: 'Within 3 hrs' },
    { value: 4, label: 'Within 4 hrs' },
    { value: 5, label: 'Within 5 hrs' },
    { value: 6, label: 'Above 6 hrs' },
  ];

  type ProgressCircleProps = {
    percent: number;
    color: string;
    // label: string;
    // icon: React.ReactNode;
  };
  const ProgressCircle = ({ percent, color }: ProgressCircleProps) => {
    const radius = 24;
    const stroke = 6;
    const normalized = Math.min(Math.max(percent, 0), 100);
    const dash = 2 * Math.PI * radius;
    const isCircleShow = userDailyStatData.items_received != 0 || userCurrentData.active_requests != 0;
    // setMaxActiveRequest(Math.max(maxActiveRequest, userCurrentData.active_requests))

    // console.log("////////////////////MaxActiveRequest:"+maxActiveRequest);
    const fraction = isCircleShow ? userDailyStatData.items_received / (userDailyStatData.items_received + userCurrentData.active_requests) : 0;
    return (
      <motion.div className="flex flex-col items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {isCircleShow && <svg width={60} height={60} className="mb-2">
          <circle cx={30} cy={30} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
          <motion.circle
            cx={30}
            cy={30}
            r={radius}
            stroke={`#059669`}
            strokeWidth={stroke}
            fill="none"
            transform="rotate(-90 30 30)"
            strokeDasharray={dash}
            strokeDashoffset={dash * (1 - fraction)}
            initial={{ strokeDashoffset: dash }}
            animate={{ strokeDashoffset: dash * (1 - fraction) }}
            transition={{ duration: 1.2 }}
          />
        </svg>}
        {isCircleShow && (<div className="flex items-center space-x-2 relative bottom-12">
          {/* {icon} */}
          <span className={`text-xs font-bold text-${color}-700`}>{(100 * fraction).toFixed(0)}%</span>
        </div>)}
        {!isCircleShow && (<div className="flex items-center space-x-2">
          {/* {icon} */}
          <span className={`text-xl font-bold text-${color}-700`}>No request yet</span>
        </div>)}
        {/* <div className="text-2xl font-extrabold text-gray-900">{percent}%</div> */}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-emerald-600 hover:text-emerald-700 hover:scale-110 transition-all duration-300 cursor-pointer" />
                <span className="text-2xl font-bold text-gray-900">Smart Surplus</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Recipient Portal
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-300">
                <Bell className="w-6 h-6 hover:scale-110 transition-transform duration-300" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-300">
                <Settings className="w-6 h-6 hover:scale-110 transition-transform duration-300" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 group"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header> */}



      {/* Responsive Header for mobile screen */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left side */}
            <div className="flex items-center space-x-2">
              {/* Hamburger only on mobile */}
              <button
                className="sm:hidden p-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <Heart className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">Smart Surplus</span>
            </div>

            {/* Right side (only for laptop) */}
            <div className="hidden sm:flex items-center space-x-4">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Recipient Portal
              </span>
              <button onClick={() => { setIsNotificationPopupOpen(true); setIsUnseen(false) }} className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                {isUnseen && (<span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>)}
              </button>
              <button onClick={() => openDropdown?setOpenDropdown(false):setOpenDropdown(true)} className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-6 h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              {/* setting dropdown */}
              <AnimatePresence>
                {openDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-44 top-16 mt-2 w-40 rounded-xl shadow-xl bg-white backdrop-blur-md ring-1 ring-black ring-opacity-5"
                  >
                    <ul className="py-1">
                      <li onClick={handleProfileDataPopup} className="px-4 py-2 text-gray-600 flex flex-row hover:bg-gray-100 cursor-pointer"><User2 className="w-5 h-5 mr-2" />Profile</li>
                      <li onClick={handleProfileDataEditPopup} className="px-4 py-2 text-gray-600 flex flex-row hover:bg-gray-100 cursor-pointer"><Edit3 className="w-4 h-4 relative top-1 mr-2" />Edit Profile</li>
                      <li className="px-4 py-2 text-gray-600 flex flex-row hover:bg-gray-100 cursor-pointer"><Moon className="w-4 h-4 relative top-1 mr-2" />Dark</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Drawer for mobile */}
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity-transform duration-500 ${isDrawerOpen ? "opacity-100 translate-x-64 pointer-events-auto" : "opacity-0 translate-x-0 pointer-events-none"}`}
          // className="fixed w-full inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
        {/* Drawer */}
        <div className={`fixed inset-0 h-full w-64 bg-transparent shadow-lg z-50 transform transition-transform duration-500 ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          {/* Drawer box */}
          <div className="relative bg-white/30 backdrop-blur-md w-64 h-full shadow-lg p-6">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mt-10 space-y-6">
              <button onClick={() => { setIsNotificationPopupOpen(true); setIsDrawerOpen(false); setIsUnseen(false); }} className="flex items-center gap-3 text-gray-700">
                <Bell className="w-5 h-5" />
                {isUnseen && (<span className="relative -top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>)}
                Notifications
              </button>
              {/* <button className="flex items-center gap-3 text-gray-700">
                <Settings className="w-5 h-5" /> Settings
              </button> */}
              <button onClick={() => { setIsDrawerOpen(false); handleProfileDataPopup() }} className="flex items-center gap-3 text-gray-700">
                <User2 className="w-5 h-5" /> Profile
              </button>
              <button onClick={() => { setIsDrawerOpen(false); handleProfileDataEditPopup() }} className="flex items-center gap-3 text-gray-700">
                <Edit3 className="w-5 h-5" /> Edit Profile
              </button>
              <button className="flex items-center gap-3 text-gray-700">
                <Moon className="w-5 h-5" /> Dark
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-gray-700 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          </div>
        </div>

      </header>


      {user && user.role && user.name && user.username && (
        <NotificationPopup isOpen={isNotificationPopupOpen}
          onClose={() => {
            setIsNotificationPopupOpen(false);
            (refreshNotifications) ? setRefreshNotifications(false) : setRefreshNotifications(true);
          }}
          user={user}
          refreshNotifications={refreshNotifications}
        />
      )}


      {/* Profile show popup */}
      <AnimatePresence>
        {profilePopup && profileData && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            // onClick={() => setProfilePopup(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gray/20 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-8 w-[320px] flex flex-col items-center text-center"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={() => setProfilePopup(false)}
                className="absolute top-4 right-4 text-white hover:text-emerald-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Profile Photo */}
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg">
                <img
                  src={profileData.profile_pic_url == "" ? userProfileIconImage : profileData.profile_pic_url}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name & Username */}
              <h2 className="text-2xl font-bold text-white mt-4">{profileData.name}</h2>
              <p className="text-sm text-emerald-300">{profileData.username}</p>

              {/* Role */}
              <span className="mt-2 bg-emerald-500/20 text-emerald-200 text-sm px-4 py-1 rounded-full shadow-inner">
                {(profileData.role === "donate") ? "Donor" : "Receiver"}
              </span>

              {/* Contact Info */}
              <div className="mt-6 w-full text-white/90 border-t border-white/20 pt-4">
                <p className="text-sm">📞 {profileData.contact}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Edit popup */}
      <AnimatePresence>
        {profileEditPopup && profileData && profileFormData && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 w-[340px] flex flex-col items-center text-center text-white"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={discardEditProfile}
                className="absolute top-4 right-4 text-white hover:text-emerald-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Profile Photo */}
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg relative group">
                <img
                  src={
                    profileFormData.profile_pic_url === ""
                      ? userProfileIconImage
                      : profileFormData.profile_pic_url
                  }
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-sm font-medium">
                  <Edit2 />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
                {/* Floating Delete Button */}
                {profileData.profile_pic_url && (
                  <motion.button
                    onClick={handleDeleteProfilePic}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-2 -right-2 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white p-2 rounded-full shadow-[0_0_20px_rgba(255,0,0,0.6)] border border-white/30 hover:shadow-[0_0_30px_rgba(255,0,0,0.9)] transition-all duration-300"
                    title="Delete photo"
                  >
                    <Trash className="w-6 h-6" />
                  </motion.button>
                )}
              </div>

              {loading && loadingMessage && (
                <div className="mt-2 text-sm text-gray-300">
                  {loadingMessage}
                </div>
              )}
              {isImageSelected && (
                <motion.button
                  onClick={uploadImage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 bg-emerald-500/80 hover:bg-emerald-500 text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-lg"
                >
                  Upload Image
                </motion.button>
              )}

              {/* Editable Name */}
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                className="mt-4 text-2xl font-bold bg-transparent border-b border-white/30 focus:border-emerald-400 outline-none text-center"
              />

              {/* Username (Read-only) */}
              <p className="text-sm text-emerald-300 mt-1">{profileData.username}</p>

              {/* Role (Fixed) */}
              <span className="mt-2 bg-emerald-500/20 text-emerald-200 text-sm px-4 py-1 rounded-full shadow-inner">
                {profileData.role === "donate" ? "Donor" : "Receiver"}
              </span>

              {/* Editable Contact */}
              <div className="mt-6 w-full text-white/90 border-t border-white/20 pt-4">
                <input
                  type="text"
                  value={profileData.contact}
                  onChange={(e) =>
                    setProfileFormData({ ...profileFormData, contact: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-white/30 focus:border-emerald-400 outline-none text-center text-sm py-1"
                />
              </div>

              {/* {loading && loadingMessage && (
                <div className="mt-2 text-sm text-gray-300">
                  {loadingMessage}
                </div>
              )} */}

              {/* Save Button */}
              <motion.button
                // onClick={handleSaveProfile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveProfileChanges}
                className="mt-6 bg-emerald-500/80 hover:bg-emerald-500 text-white font-semibold px-6 py-2 rounded-full transition-colors shadow-lg"
              >
                Save Changes
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className='mt-12'></div>
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, {getUserName(user?.name || "User")}!</h1>
            <p className="text-gray-600">Find fresh food donations near you and track your requests.</p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100 hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 hover:scale-110 transition-transform duration-300`} />
                </div>
              </div>
            </motion.div>
          ))}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3 * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Pickup completion</p>
                <ProgressCircle percent={20} color='emerald' />
                {/* <p className="text-3xl font-bold text-gray-900">{stat.value}</p> */}
              </div>
              <div className={`p-3 rounded-full bg-orange-100 hover:scale-110 transition-transform duration-300`}>
                <BarChart3 className={`w-6 h-6 text-orange-600 hover:scale-110 transition-transform duration-300`} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'available'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Available Food
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'requests'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                My Requests
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'available' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Available Food Grid */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Available Food Near You</h2>
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 hover:text-emerald-500 hover:scale-110 transition-all duration-300" />
                    <input
                      type="text"
                      placeholder="Search food items..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {items.length === 0 && (
                  <div className="min-w-60 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
                    <img
                      src={emptyListImage}
                      alt="Empty"
                      className="w-[240px] h-[180px] object-cover rounded-lg mb-4"
                    />
                    <p className="text-gray-600 text-center">
                      No available items near you!
                    </p>
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  {items.map((item, index) => {
                    // Simulate expiry tracking (hours left)
                    // const hoursLeft = parseInt(item.expires);
                    // const expired = hoursLeft <= 0;
                    // if (expired) return null;
                    let valid = false;
                    const foodTypes = ['vegetarian', 'vegan', 'non-vegetarian', 'gluten-free', 'dairy'];
                    filters.map((filter, idx) => {
                      if (filter) valid = valid || item.type == foodTypes[idx];
                    });
                    if (filters.includes(true) && !valid) return null;
                    const expiryTime = new Date(item.expiry_time);
                    const now = new Date();
                    const diffMillis = expiryTime.getTime() - now.getTime();
                    const diffMinutes = Math.floor((diffMillis / 1000) / 60);
                    const hrLeft = Math.floor(diffMinutes / 60);
                    const minLeft = diffMinutes % 60;
                    const expTime = new Date(item.expiry_time).toString().substring(4, 21);
                    const pickupStartTime = new Date(item.timestamp).toString().substring(16, 21);
                    const pickupCloseTime = new Date(item.expiry_time).toString().substring(16, 21);

                    if (expiryFilter > 0 && expiryFilter < 6 && hrLeft > expiryFilter) return null;
                    if (expiryFilter == 6 && hrLeft < 6) return null;

                    return (
                      <motion.div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden group relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <img
                          // src={item.image} 
                          src={(item.image_url == "") ? defaultFoodImage : item.image_url}
                          alt={item.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                              {item.type}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold shadow">Safe to Eat upto {expTime}</span>
                            <span className={`bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold shadow ${hrLeft <= 1 && minLeft <= 10 ? 'animate-pulse' : ''}`}>{hrLeft}h {minLeft}m left</span>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Users className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                              <span className="text-sm">{item.admin_name}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                              <span className="text-sm">{item.pickup_location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Package className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                              <span className="text-sm">{item.quantity} {item.unit}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400 hover:scale-110 transition-transform duration-300" />
                              <span className="text-sm text-emerald-600">
                                {/* Expires in {item.expires} */}
                                {pickupStartTime} - {pickupCloseTime}
                              </span>

                            </div>
                          </div>
                          {/* <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                            <strong>Packaging & Storage:</strong> {item.special_instruction}
                          </div> */}
                          <button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors duration-200 mt-2"
                            // onClick={() => navigate('/request-food', { state: { food: item } })}
                            onClick={() => selectItem(item.id)}
                          >
                            Request This Food
                          </button>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-emerald-700 shadow">Food Safety</div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Location & Preferences */}
              <motion.div
                className="bg-white rounded-xl shadow-sm border p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry
                    </label>
                    <select onChange={(e) => { setExpiryFilter(Number(e.target.value)) }} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500">
                      {expiryOptions.map((option, _) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Categories
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" onChange={() => filterCheck(0)} className="rounded text-emerald-600" />
                        <span className="ml-2 text-sm">Vegetarian</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" onChange={() => filterCheck(1)} className="rounded text-emerald-600" />
                        <span className="ml-2 text-sm">Vegan</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" onChange={() => filterCheck(2)} className="rounded text-emerald-600" />
                        <span className="ml-2 text-sm">Non-Vegetarian</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" onChange={() => filterCheck(3)} className="rounded text-emerald-600" />
                        <span className="ml-2 text-sm">Gluten-Free</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" onChange={() => filterCheck(4)} className="rounded text-emerald-600" />
                        <span className="ml-2 text-sm">Dairy</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              {/*<motion.div
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm text-white p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold mb-4">Food Source Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>New Donations</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Available</span>
                    <span className="font-bold">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Distance</span>
                    <span className="font-bold">1.3 mi</span>
                  </div>
                </div>
              </motion.div>*/}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">My Food Requests</h2>
              <p className="text-gray-600 mt-1">Track the status of your food requests</p>
            </div>
            <div className="p-6">
              {selectedItems.length === 0 && (
                <div className="min-w-60 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
                  <img
                    src={emptyListImage2}
                    alt="Empty"
                    className="w-[240px] h-[180px] object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600 text-center">
                    No items selected yet!
                  </p>
                  <button className="max-w-50 flex items-center space-x-3 p-3 my-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200" onClick={() => setActiveTab('available')}>
                    <CheckCircle className="w-5 h-5 text-emerald-600 hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-emerald-700">Select Items</span>
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {selectedItems.map((item, index) => {
                  // Simulate expiry tracking (hours left)
                  // const hoursLeft = parseInt(item.expires);
                  // const expired = hoursLeft <= 0;
                  // if (expired) return null;
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
                      key={item.id}
                      className="flex flex-col items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => selectedItemDetails(item.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          selected
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        {/* {getStatusIcon(item.freshness_level)} */}
                        <div>
                          <h3 className="font-semibold text-gray-900 m-2 ml-3">{item.title}</h3>
                          <p className="text-sm flex flex-row text-gray-600"><Clock className="w-4 h-4 m-2 mt-1 text-orange-400 hover:scale-110 transition-transform duration-300" /><span className="font-semibold mr-2"> Pickup within: </span> {pickupStartTime} - {pickupCloseTime}</p>
                          <p className="text-sm flex flex-row text-gray-600"><User className="w-4 h-4 m-2 mt-1 text-orange-400 hover:scale-110 transition-transform duration-300" /><span className="font-semibold mr-2"> provider: </span> {item.admin_name}</p>
                          <p className="text-sm flex flex-row text-gray-600"><MapPin className="w-4 h-4 m-2 mt-1 text-orange-400 hover:scale-110 transition-transform duration-300" /><span className="font-semibold mr-2"> From: </span> {item.pickup_location}</p>
                        </div>
                      </div>
                      <div className="w-full flex flex-row justify-end">
                        <div className="mt-2">
                          <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            <Truck className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                            <span>Get Directions</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* {myRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(request.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.food}</h3>
                        <p className="text-sm text-gray-600">Pickup: {request.pickup}</p>
                        <p className="text-sm text-gray-500">From: {request.donor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      {request.status === 'approved' && (
                        <div className="mt-2">
                          <button className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                            <Truck className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                            <span>Get Directions</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))} */}

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecipientDashboard;