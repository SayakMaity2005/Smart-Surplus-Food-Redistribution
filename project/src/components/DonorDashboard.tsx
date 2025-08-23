import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Plus, Package, TrendingUp, Users, MapPin, LogOut, Bell, Settings } from 'lucide-react';
import axios from 'axios';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const response = await axios.post("http://localhost:8000/logout/");
    console.log("Signout Success:", response.data);
    navigate('/'); // Redirect to homepage or login
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
  const stats = [
    { label: 'Total Donations', value: '47', icon: Package, color: 'emerald' },
    { label: 'Meals Provided', value: '1,250', icon: Heart, color: 'orange' },
    { label: 'People Helped', value: '89', icon: Users, color: 'emerald' },
    { label: 'Impact Score', value: '95%', icon: TrendingUp, color: 'orange' }
  ];
  const recentDonations = [
    { id: 1, food: 'Fresh Vegetables', quantity: '15 lbs', status: 'collected', date: '2025-01-15', recipient: 'Community Kitchen' },
    { id: 2, food: 'Bakery Items', quantity: '8 items', status: 'pending', date: '2025-01-14', recipient: 'Pending...' },
    { id: 3, food: 'Dairy Products', quantity: '12 items', status: 'completed', date: '2025-01-13', recipient: 'Food Bank Central' },
    { id: 4, food: 'Prepared Meals', quantity: '25 portions', status: 'completed', date: '2025-01-12', recipient: 'Shelter Plus' }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
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
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello Donor!</h1>
            <p className="text-gray-600">Track your donations and see the impact you're making in the community.</p>
          </motion.div>
        </div>
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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div className="bg-white rounded-xl shadow-sm border" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Donations</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentDonations.map((donation, index) => (
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
                <button className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200" onClick={() => navigate('/food-items')}>
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
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200" onClick={() => navigate('/impact-report')}>
                  <span className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-blue-700 ml-2">View Impact Report</span>
                  </span>
                </button>
              </div>
            </motion.div>
            <motion.div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm text-white p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;