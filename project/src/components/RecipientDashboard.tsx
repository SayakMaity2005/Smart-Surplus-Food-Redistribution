import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Search, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle, 
  Calendar,
  Users, 
  LogOut,
  Bell,
  Settings,
  Star,
  Truck
} from 'lucide-react';

const RecipientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');

  const stats = [
    { label: 'Meals Received', value: '156', icon: Package, color: 'emerald' },
    { label: 'Active Requests', value: '3', icon: Clock, color: 'orange' },
    { label: 'This Month', value: '42', icon: Calendar, color: 'emerald' },
    { label: 'Saved Money', value: '$284', icon: Star, color: 'orange' }
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

  const handleLogout = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, Marcus!</h1>
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
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'available'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Food
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'requests'
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

                <div className="grid md:grid-cols-2 gap-6">
                  {availableFood.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                            {item.category}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{item.donor}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{item.distance} away</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Package className="w-4 h-4 hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{item.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400 hover:scale-110 transition-transform duration-300" />
                            <span className={`text-sm font-medium ${getExpiryColor(item.expires)}`}>
                              Expires in {item.expires}
                            </span>
                          </div>
                        </div>
                        
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors duration-200">
                          Request This Food
                        </button>
                      </div>
                    </motion.div>
                  ))}
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
                      Search Radius
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500">
                      <option>Within 2 miles</option>
                      <option>Within 5 miles</option>
                      <option>Within 10 miles</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Categories
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-emerald-600" defaultChecked />
                        <span className="ml-2 text-sm">Fresh Produce</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-emerald-600" defaultChecked />
                        <span className="ml-2 text-sm">Baked Goods</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-emerald-600" />
                        <span className="ml-2 text-sm">Dairy</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-emerald-600" />
                        <span className="ml-2 text-sm">Prepared Meals</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-sm text-white p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-bold mb-4">This Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>New Donations</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Available</span>
                    <span className="font-bold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Distance</span>
                    <span className="font-bold">1.3 mi</span>
                  </div>
                </div>
              </motion.div>
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
              <div className="space-y-4">
                {myRequests.map((request, index) => (
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
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecipientDashboard;