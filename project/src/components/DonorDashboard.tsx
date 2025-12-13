import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Package, PackageCheck, TrendingUp, Trash, Users, MapPin, Menu, LogOut, Bell, Settings, X, User2, Edit2, Edit3, Sun, Moon, Contact } from 'lucide-react';
import axios from 'axios';
import emptyListImage from "../assets/empty-list-digital-ui.jpg";
import NotificationPopup from './NotificationPopup.tsx';
import userProfileIconImage from "../assets/user-profile-icon-circle-digital-ui.jpg"


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

// Daily statistics data template
interface DailyStat {
  date: string
  total_donations: number
  partial_donation: number
  impact_score: number
  items_provided: number

}
// Monthly statistics data template
interface MonthlyStat {
  date: string
  total_donations: number
  partial_donation: number
  impact_score: number
  items_provided: number
}
// profile data template
interface ProfileData {
  name: string
  username: string
  role: string
  contact: string
  profile_pic_url: string
}

const DonorDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/logout/");
    console.log("Signout Success:", response.data);
    navigate('/'); // Redirect to homepage or login
  };

  // Session Cheack
  const [user, setUser] = useState<User | null>(null);
  const [selectedItems, setSelectedItem] = useState<SelectedItem[]>([]);
  const [addedItems, setAddedItems] = useState<Item[]>([]);
  const defaultDailyStatData: DailyStat = {
    date: '',
    total_donations: 0,
    partial_donation: 0,
    impact_score: 0,
    items_provided: 0
  };
  const defaultMonthlyStatData: MonthlyStat = {
    date: '',
    total_donations: 0,
    partial_donation: 0,
    impact_score: 0,
    items_provided: 0
  };
  const [dailyStatData, setDailyStatData] = useState<DailyStat>(defaultDailyStatData);
  const [monthlyStatData, setMonthlyStatData] = useState<MonthlyStat>(defaultMonthlyStatData);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState<boolean>(false);
  const [refreshNotifications, setRefreshNotifications] = useState<boolean>(false);
  const [isUnseen, setIsUnseen] = useState<boolean>(false);
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
        const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/verify-session/", {
          withCredentials: true,
        });
        setUser(response.data.user);
        console.log("Session:", response.data);
      } catch (err) {
        console.warn("Session not ready yet");
      }
      try {
        const dataResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/admin/get-added-items/", {
          withCredentials: true,
        });
        setAddedItems(dataResponse.data.data.items);
        setSelectedItem(dataResponse.data.data.selected_items);
        // setSelectedItem(filterdSelectedItems);
        console.log("Session:", dataResponse.data);
      } catch (err) {
        setUser(null);
        // navigate('/');
        console.log(err);
      }

      try {
        const response = await axios.get("https://smart-surplus-food-redistribution.onrender.com/admin/get-daily-stat-data/", {
          withCredentials: true,
        });
        setDailyStatData(response.data.data.daily_data);
        setMonthlyStatData(response.data.data.monthly_data);
        console.log("Stat Data:", response.data);
      }
      catch (err) {
        setDailyStatData(defaultDailyStatData);
        setMonthlyStatData(defaultMonthlyStatData);
        console.log(err);
      }

      // checking notification state
      try {
        const notificationsResponse = await axios.get("https://smart-surplus-food-redistribution.onrender.com/admin/get-admin-notification/", { withCredentials: true, });
        // setNotifications(notificationsResponse.data.data);
        setIsUnseen(notificationsResponse.data.isUnseen);
        console.log("Notifications:", notificationsResponse.data);
      } catch (err) {
        console.log(err);
      }

    };

    checkSession();
  }, []);

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
      console.warn("Session not ready yet");
    }
  };

  // useEffect(() => {
  //   setSelectedItem(addedItems.filter((item) => item.select));
  // }, [addedItems, dailyStatData]);

  const impactScore = (dailyStatData.items_provided == 0) ? 0 : ((100 * dailyStatData.total_donations) / dailyStatData.items_provided).toFixed(0);
  const stats = [
    { label: 'Total Donations', value: dailyStatData.total_donations, icon: PackageCheck, color: 'emerald' },
    { label: 'Items Provided', value: dailyStatData.items_provided, icon: Heart, color: 'orange' },
    // { label: 'People Helped', value: 0, icon: Users, color: 'emerald' },
    { label: 'Partial Donation', value: dailyStatData.partial_donation, icon: Package, color: 'emerald' },
    { label: 'Impact Score', value: dailyStatData.impact_score.toFixed(0) + "%", icon: TrendingUp, color: 'blue' }
  ];
  const monthlyImpactScore = (monthlyStatData.items_provided == 0) ? 0 : ((100 * monthlyStatData.total_donations) / monthlyStatData.items_provided).toFixed(0);
  const monthlyStats = [
    { label: 'Total Donations', value: monthlyStatData.total_donations, icon: PackageCheck, color: 'emerald' },
    { label: 'Items Provided', value: monthlyStatData.items_provided, icon: Heart, color: 'orange' },
    // { label: 'People Helped', value: 0, icon: Users, color: 'emerald' },
    // { label: 'Impact Score', value: monthlyImpactScore+"%", icon: TrendingUp, color: 'blue' }
    { label: 'Partial Donation', value: monthlyStatData.partial_donation, icon: Package, color: 'emerald' },
    { label: 'Impact Score', value: monthlyStatData.impact_score.toFixed(0) + "%", icon: TrendingUp, color: 'blue' }
  ];

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

  // Placeholder for getStatusIcon
  const getStatusIcon = (status: string) => {
    return <span className="mr-2">🍽️</span>;
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'collected': return 'bg-blue-100 text-blue-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };
  const recentDonations = [
    { id: 1, food: 'Fresh Vegetables', quantity: '15 lbs', status: 'collected', date: '2025-01-15', recipient: 'Community Kitchen' },
    { id: 2, food: 'Bakery Items', quantity: '8 items', status: 'pending', date: '2025-01-14', recipient: 'Pending...' },
    { id: 3, food: 'Dairy Products', quantity: '12 items', status: 'completed', date: '2025-01-13', recipient: 'Food Bank Central' },
    { id: 4, food: 'Prepared Meals', quantity: '25 portions', status: 'completed', date: '2025-01-12', recipient: 'Shelter Plus' }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-emerald-600 hover:text-emerald-700 hover:scale-110 transition-all duration-300 cursor-pointer" />
                <span className="text-2xl font-bold text-gray-900">Smart Surplus</span>
              </div>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Donor Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-300">
                <Bell className="w-6 h-6 hover:scale-110 transition-transform duration-300" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-300">
                <Settings className="w-6 h-6 hover:scale-110 transition-transform duration-300" />
              </button>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200 group">
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header> */}


      {/* Responsive Header for mobile screen and laptop */}
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
                Donor Portal
              </span>
              <button onClick={() => { setIsNotificationPopupOpen(true); setIsUnseen(false); }} className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                {isUnseen && (<span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full"></span>)}
              </button>
              <button onClick={() => openDropdown ? setOpenDropdown(false) : setOpenDropdown(true)} className="p-2 text-gray-400 hover:text-gray-600">
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
              <button onClick={() => { setIsNotificationPopupOpen(true); setIsDrawerOpen(false); setIsUnseen(false); }}
                className="flex items-center gap-3 text-gray-700"
              >
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello {getUserName(user?.name || "Donor")}!</h1>
            <p className="text-gray-600">Track your donations and see the impact you're making in the community.</p>
          </motion.div>
        </div>
        {/* <p className="m-2 text-lg font-semibold text-gray-900">Daily Data</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
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
        </div>
        <p className="m-2 text-lg font-semibold text-gray-900">Monthly Data</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {monthlyStats.map((stat, index) => (
            <motion.div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
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
        </div> */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div className="bg-white rounded-xl shadow-sm border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Selected Items</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4 h-[255px] overflow-y-auto">
                  {/* {recentDonations.map((donation, index) => (
                    <motion.div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(donation.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{donation.food}</h3>
                          <p className="text-sm text-gray-600">{donation.quantity} • {donation.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>{donation.status}</span>
                        <p className="text-sm text-gray-600 mt-1">{donation.recipient}</p>
                      </div>
                    </motion.div>
                  ))} */}
                  {selectedItems.length === 0 && (
                    <div className="min-w-60 bg-white rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
                      <img
                        src={emptyListImage}
                        alt="Empty"
                        className="w-[240px] h-[180px] object-cover rounded-lg mb-4"
                      />
                      <p className="text-gray-600 text-center">
                        No selected items!
                      </p>
                    </div>
                  )}
                  {selectedItems.map((item, index) => (
                    <motion.div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                      <div className="flex items-center space-x-4">
                        {/* {getStatusIcon(donation.status)} */}
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">selected</span>
                        <p className="text-sm text-gray-600 mt-1">{item.user_name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          <div className="space-y-6">
            <motion.div className="bg-white rounded-xl shadow-sm border p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200" onClick={() => navigate('/add-donation')}>
                  <Plus className="w-5 h-5 text-emerald-600 hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-emerald-700">Add New Donation</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200" onClick={async () => { await verifySession(); navigate('/food-items') }}>
                  <Package className="w-5 h-5 text-orange-600 hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-orange-700">Food Items List</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200" onClick={() => navigate('/events')}>
                  <span className="w-5 h-5 text-orange-600">🎉</span>
                  <span className="font-medium text-orange-700">Events</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200">
                  <MapPin className="w-5 h-5 text-orange-600 hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-orange-700">Find Pickup Locations</span>
                </button>
                {/* <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200" onClick={() => navigate('/impact-report')}> */}
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                  <span className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-blue-700 ml-2">View Impact Report</span>
                  </span>
                </button>
              </div>
            </motion.div>
            {/* <motion.div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm text-white p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <h3 className="text-lg font-bold mb-4">Your Impact This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Meals Provided</span>
                  <span className="font-bold">324</span>
                </div>
                <div className="flex justify-between">
                  <span>CO₂ Saved</span>
                  <span className="font-bold">156 kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Families Helped</span>
                  <span className="font-bold">28</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-400">
                <p className="text-sm text-emerald-100">You're in the top 10% of donors this month! 🎉</p>
              </div>
            </motion.div> */}
          </div>
        </div>
        <p className="m-2 text-lg font-semibold text-gray-900">Daily Data</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
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
        </div>
        <p className="m-2 text-lg font-semibold text-gray-900">Monthly Data</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {monthlyStats.map((stat, index) => (
            <motion.div key={index} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
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
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;