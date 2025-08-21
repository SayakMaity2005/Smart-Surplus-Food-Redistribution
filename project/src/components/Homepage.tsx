import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Truck, 
  ArrowRight, 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Handshake,
  Target,
  Award,
  Utensils, // for meals
  Users as UsersIcon, // for people helped
  CalendarCheck // for monthly meals
} from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();
  const [currentStory, setCurrentStory] = useState(0);
  const [dailyMeals, setDailyMeals] = useState(0);
  const [monthlyMeals, setMonthlyMeals] = useState(0);
  const [peopleHelped, setPeopleHelped] = useState(0);

  // Animated counters
  useEffect(() => {
    const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(current));
        }
      }, 30);
    };

    animateCounter(setDailyMeals, 1247);
    animateCounter(setMonthlyMeals, 35680);
    animateCounter(setPeopleHelped, 8934);
  }, []);

  const successStories = [
    {
      name: "Sunita's Kitchen",
      story: "Thanks to the platform, we've been able to feed 500+ families in our community every month with quality surplus food.",
      image: "https://media.istockphoto.com/id/1449552590/photo/portrait-of-indian-woman-enjoying-while-cooking-meal-in-the-kitchen-stock-photo.jpg?s=612x612&w=0&k=20&c=sSSFGWffGnjDJEX_VCA3YQ5B3T1jQ_0kCbPTL0BItlg="
    },
    {
      name: "Green Grocery Co.",
      story: "Instead of wasting 200kg of fresh produce weekly, we now donate it all through this amazing platform.",
      image: "https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg"
    },
    {
      name: "Community Center",
      story: "Our food distribution program has grown 300% since joining. We're making a real difference!",
      image: "https://images.pexels.com/photos/6995245/pexels-photo-6995245.jpeg"
    }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  const handleCTAClick = (type: 'donate' | 'request') => {
    navigate('/signin', { state: { userType: type } });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-emerald-600 hover:text-emerald-700 hover:scale-110 transition-all duration-300 cursor-pointer" />
              <span className="text-2xl font-bold text-gray-900">Smart Surplus</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Home</a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">About Us</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">How It Works</a>
              <a href="#volunteers" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Partner</a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        id="home"
        className="relative bg-gradient-to-br from-emerald-50 to-orange-50 py-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/6995308/pexels-photo-6995308.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-emerald-900 bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Turning Surplus into
              <span className="text-orange-400 block">Smiles</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect food donors with those in need. Reduce waste, fight hunger, and build stronger communities together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => handleCTAClick('donate')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Donate Now</span>
              </motion.button>
              <motion.button
                onClick={() => handleCTAClick('request')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Request Food</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to make a difference in your community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Donate",
                description: "Restaurants, grocery stores, and individuals donate surplus food through our platform",
                icon: Heart,
                color: "emerald"
              },
              {
                step: "02",
                title: "Request",
                description: "Food banks, shelters, and families request food based on their needs and location",
                icon: Users,
                color: "orange"
              },
              {
                step: "03",
                title: "Distribute",
                description: "Our volunteer network ensures safe and timely delivery to those who need it most",
                icon: Truck,
                color: "emerald"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-${item.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-10 h-10 text-${item.color}-600 group-hover:scale-110 transition-all duration-300`} />
                </div>
                <div className={`text-sm font-bold text-${item.color}-600 mb-2`}>STEP {item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <ArrowRight className="w-8 h-8 text-gray-300 mx-auto mt-6 hidden md:block hover:text-emerald-400 hover:scale-110 transition-all duration-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-4xl mb-4 drop-shadow-lg"
              style={{
                fontFamily: "'Dancing Script', 'Pacifico', 'Segoe Script', 'Comic Sans MS', 'Brush Script MT', cursive, sans-serif",
                fontWeight: 700,
                color: 'white',
                letterSpacing: '0.05em'
              }}
            >
              Our Impact
            </h2>
            <p className="text-2xl font-semibold text-orange-200 drop-shadow-md">Making a difference, one meal at a time</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center bg-white bg-opacity-10 rounded-2xl p-10 backdrop-blur-sm group shadow-xl transition-all duration-300 hover:bg-white hover:bg-opacity-30 hover:scale-105 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="flex justify-center mb-4">
                <Utensils className="w-14 h-14 text-orange-300 group-hover:text-orange-500 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 group-hover:text-orange-100 transition-colors duration-300 tracking-tight drop-shadow-lg">
                {dailyMeals.toLocaleString()}
              </div>
              <div className="text-emerald-100 text-lg font-bold group-hover:text-orange-200 transition-colors duration-300 uppercase tracking-wide">Meals Distributed Today</div>
            </motion.div>
            
            <motion.div 
              className="text-center bg-white bg-opacity-10 rounded-2xl p-10 backdrop-blur-sm group shadow-xl transition-all duration-300 hover:bg-white hover:bg-opacity-30 hover:scale-105 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="flex justify-center mb-4">
                <CalendarCheck className="w-14 h-14 text-orange-300 group-hover:text-orange-500 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 group-hover:text-orange-100 transition-colors duration-300 tracking-tight drop-shadow-lg">
                {monthlyMeals.toLocaleString()}
              </div>
              <div className="text-emerald-100 text-lg font-bold group-hover:text-orange-200 transition-colors duration-300 uppercase tracking-wide">Meals This Month</div>
            </motion.div>
            
            <motion.div 
              className="text-center bg-white bg-opacity-10 rounded-2xl p-10 backdrop-blur-sm group shadow-xl transition-all duration-300 hover:bg-white hover:bg-opacity-30 hover:scale-105 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.08 }}
            >
              <div className="flex justify-center mb-4">
                <UsersIcon className="w-14 h-14 text-orange-300 group-hover:text-orange-500 transition-colors duration-300 drop-shadow-lg" />
              </div>
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 group-hover:text-orange-100 transition-colors duration-300 tracking-tight drop-shadow-lg">
                {peopleHelped.toLocaleString()}
              </div>
              <div className="text-emerald-100 text-lg font-bold group-hover:text-orange-200 transition-colors duration-300 uppercase tracking-wide">People Helped</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real impact from our community partners</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              key={currentStory}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={successStories[currentStory].image} 
                    alt={successStories[currentStory].name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {successStories[currentStory].name}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    "{successStories[currentStory].story}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <Award className="w-6 h-6 text-orange-500 hover:text-orange-600 hover:scale-110 transition-all duration-300" />
                    <span className="text-orange-600 font-semibold">Community Partner</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <button
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-emerald-600 transition-colors duration-300" />
            </button>
            
            <button
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 hover:text-emerald-600 transition-colors duration-300" />
            </button>

            <div className="flex justify-center space-x-2 mt-8">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentStory ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section id="volunteers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our mission to eliminate food waste and hunger in our communities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="relative overflow-hidden px-0 py-0 rounded-3xl w-full min-h-[520px] flex flex-col justify-center shadow-2xl md:col-span-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Background gradient and image overlay */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-100 via-orange-200 to-emerald-100 opacity-90" />
              <div 
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.18,
                  filter: 'blur(2px)'
                }}
              />
              {/* Glassmorphism effect */}
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-12 md:p-24 bg-white/40 backdrop-blur-md rounded-3xl border border-orange-200 shadow-2xl">
                <div className="flex items-center justify-center mb-12">
                  <span className="inline-flex items-center justify-center rounded-full bg-orange-100 shadow-lg p-6 border-4 border-orange-200">
                    <Handshake className="w-20 h-20 text-orange-600 hover:scale-110 hover:text-orange-700 transition-all duration-300 drop-shadow-xl" />
                  </span>
                </div>
                <h3 className="text-5xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-lg tracking-tight">
                  Partner With Us
                </h3>
                <p className="text-gray-700 mb-10 leading-relaxed text-2xl text-center font-medium drop-shadow">
                  Businesses, organizations, and community groups can join our network to maximize impact.
                </p>
                <ul className="space-y-8 text-gray-700 mb-12 text-xl font-semibold">
                  <li className="flex items-center space-x-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-orange-200 p-2">
                      <Target className="w-7 h-7 text-orange-600 transition-transform duration-300" />
                    </span>
                    <span>Corporate food donation programs</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-orange-200 p-2">
                      <Target className="w-7 h-7 text-orange-600 transition-transform duration-300" />
                    </span>
                    <span>Community sponsorship opportunities</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-orange-200 p-2">
                      <Target className="w-7 h-7 text-orange-600 transition-transform duration-300" />
                    </span>
                    <span>Educational workshops</span>
                  </li>
                </ul>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-16 py-6 rounded-full font-extrabold text-2xl shadow-xl transition-all duration-300 transform hover:scale-105 border-4 border-white/60 backdrop-blur-lg">
                  Become a Partner
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="w-8 h-8 text-emerald-400 hover:text-emerald-300 hover:scale-110 transition-all duration-300 cursor-pointer" />
                <span className="text-2xl font-bold">Smart Surplus</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting communities to reduce food waste and fight hunger. Together, we're making a difference.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors duration-200">How It Works</a></li>
                <li><a href="#volunteers" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-emerald-400 hover:text-emerald-300 hover:scale-110 transition-all duration-300" />
                  <span className="text-gray-400">team@smartsurplus.org</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-emerald-400 hover:text-emerald-300 hover:scale-110 transition-all duration-300" />
                  <span className="text-gray-400">+919474365678</span>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-emerald-400 hover:text-emerald-300 hover:scale-110 transition-all duration-300" />
                  <span className="text-gray-400">West Chowbaga Road, Mundapra, Kolkata,West Bengal 700107</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-emerald-600 transition-colors duration-300">
                  <Facebook className="w-5 h-5 hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-emerald-600 transition-colors duration-300">
                  <Twitter className="w-5 h-5 hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-emerald-600 transition-colors duration-300">
                  <Instagram className="w-5 h-5 hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-12 text-center">
            <p className="text-gray-400">
              © 2025 Smart Surplus. All rights reserved. Building a world without food waste.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;