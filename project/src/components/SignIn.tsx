import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, Contact } from 'lucide-react';
import axios from "axios";
import { form } from 'framer-motion/client';

type LocationState = {
  signup: boolean
  userType: string
};

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  const [isSignUp, setIsSignUp] = useState(locationState?.signup || false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    userType: locationState?.userType || 'request',
    otp: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Simulate authentication
  //   if (formData.userType === 'donate') {
  //     navigate('/donor-dashboard');
  //   } else {
  //     navigate('/recipient-dashboard');
  //   }
  // };

  const [error, setError] = useState<string>("");
  const [otpSection, setOtpSection] = useState<Boolean>(false);
  const [otpSent, setOtpSent] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [loadMessage, setLoadMessage] = useState<string>("");
  const [seconds, setSeconds] = useState(60);
  // const [otpError, setOtpError] = useState<string>("");

  useEffect(() => {
    if (otpSent && seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // cleanup
    }
  }, [seconds, otpSent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(loading) return;

    try {
      if (isSignUp) {
        console.log("request...");
        // Check for validation of registration
        try {
          setLoading(true);
          setLoadMessage("Checking registration request...");
          const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/check-registration-request/", {
            name: formData.name,
            username: formData.email,
            contact: formData.contact,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.userType,
          }, { withCredentials: true });
          setLoading(false);
          setError("");
          setOtpSection(true);
          console.log("Registration Success:", response.data);
        } catch (err: any) {
          setLoading(false);
          setError(err.response.data["detail"]);
          console.error("Registration Error:", err);
        }
        // // Sign Up API
        // try {
        //   const response = await axios.post("http://localhost:8000/register/", {
        //     name: formData.name,
        //     username: formData.email,
        //     password: formData.password,
        //     confirmPassword: formData.confirmPassword,
        //     role: formData.userType,
        //   }, { withCredentials: true });  // { withCredentials: true } this the line makes the cookie thing possible
        //   setError("");
        //   console.log("Signup Success:", response.data);
        //   navigate(formData.userType === "donate" ? "/donor-dashboard" : "/recipient-dashboard");
        // } catch (err: any) {
        //   setError(err.response.data["detail"]);
        //   console.log("Signup Error:", err);
        // }

      } else {
        // Sign In API
        console.log("request...");
        try {
          setLoading(true);
          setLoadMessage("Logging in...");
          const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/login/", {
            username: formData.email,
            password: formData.password,
          }, { withCredentials: true });  // { withCredentials: true } this the line makes the cookie thing possible
          setLoading(false);
          setError("");
          console.log("Signin Success:", response.data);
          navigate(response.data.user.role === "donate" ? "/donor-dashboard" : "/recipient-dashboard");
        } catch (err: any) {
          setLoading(false);
          setError(err.response.data["detail"]);
          console.log("Signin Error:", err.response.data["detail"]);
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Auth error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleOtpRequest = async () => {
    if(loading) return;
    try {
      setLoading(true);
      setLoadMessage("OTP sending...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/generate-otp/", {
        username: formData.email,
        name: formData.name,
        email_subject_otp: "Registration request",
        email_body_otp: `Dear ${formData.name},\nYour OTP for registration to FoodSurplus is`
      }, { withCredentials: true });
      setLoading(false);
      setError("");
      setOtpSent(true);
      setSeconds(60);
      console.log("OTP Sent:", response.data);
    } catch (err: any) {
      setLoading(false);
      setError(err.response.data["detail"]);
      setOtpSection(false);
      setOtpSent(false);
      setSeconds(60);
      console.log("OTP Error:", err);
    }
  };

  const handleOtpVerification = async () => {
    if(loading) return;
    try {
      setLoading(true);
      setLoadMessage("Verifying OTP...");
      const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/verify-otp/", {
        otp: formData.otp
      }, { withCredentials: true });
      setLoading(false);
      setError("");
      // Sign Up API
      try {
        setLoading(true);
        setLoadMessage("Creating account...");
        const response = await axios.post("https://smart-surplus-food-redistribution.onrender.com/register/", {
          name: formData.name,
          username: formData.email,
          contact: formData.contact,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.userType,
        }, { withCredentials: true });  // { withCredentials: true } this the line makes the cookie thing possible
        setLoading(false);
        setError("");
        console.log("Signup Success:", response.data);
        navigate(formData.userType === "donate" ? "/donor-dashboard" : "/recipient-dashboard");
      } catch (err: any) {
        setLoading(false);
        setError(err.response.data["detail"]);
        console.log("Signup Error:", err);
      }
      console.log("OTP Verified:", response.data);
    } catch (err: any) {
      setLoading(false);
      setError(err.response.data["detail"]);
      console.log("OTP Verification Error:", err);
    }

  };

  const handleGoogleSignIn = () => {
    // Simulate Google authentication
    if (formData.userType === 'donate') {
      navigate('/donor-dashboard');
    } else {
      navigate('/recipient-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration & Info */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center space-y-6">
            <img
              src="https://t3.ftcdn.net/jpg/02/64/54/28/360_F_264542845_WC4Yrdum8YIDuGK33GVBil5YsyR6csXz.jpg"
              alt="Community sharing food"
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.userType === 'donate' ? 'Share Your Surplus' : 'Get the Help You Need'}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {formData.userType === 'donate'
                  ? 'Turn your extra food into smiles and make a meaningful impact in your community.'
                  : 'Access fresh, nutritious food from local donors and build a stronger community together.'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Sign In Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 mb-6 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center justify-center space-x-2 mb-6">
              <Heart className="w-8 h-8 text-emerald-600 hover:text-emerald-700 hover:scale-110 transition-all duration-300 cursor-pointer" />
              {/* Removed SurplusShare/Smart Surplus text */}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isSignUp ? 'Join our community today' : 'Sign in to your account'}
            </p>
          </div>

          {/* User Type Toggle */}
          {isSignUp && (
            <div className="bg-gray-100 p-1 rounded-xl mb-6 grid grid-cols-2">
              <button
                onClick={() => setFormData({ ...formData, userType: 'donate' })}
                className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${formData.userType === 'donate'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Provider
              </button>
              <button
                onClick={() => setFormData({ ...formData, userType: 'request' })}
                className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${formData.userType === 'request'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Receiver
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 hover:text-emerald-500 hover:scale-110 transition-all duration-300" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {isSignUp && (<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 hover:text-emerald-500 hover:scale-110 transition-all duration-300" />
                <input
                  type="number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your contact number"
                  required
                />
              </div>
            </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 hover:text-emerald-500 hover:scale-110 transition-all duration-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 hover:scale-110 transition-transform duration-300" /> : <Eye className="w-5 h-5 hover:scale-110 transition-transform duration-300" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 hover:text-emerald-500 hover:scale-110 transition-all duration-300" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}



            {(error != "") && !otpSection && (
              <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
            )}

            {loading && !otpSent && !otpSection && (
              <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
            )}

            {!otpSection && (<motion.button
              type="submit"
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${formData.userType === 'donate'
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </motion.button>)}
          </form>

          {otpSection && isSignUp && (
            <div className="mt-6">
              {otpSent && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter OTP"
                    required={isSignUp}
                  />
                </div>
              </div>)}
              {otpSent && (
                <div>
                  <div className="flex items-center my-3">
                    <button onClick={(seconds > 0) ? undefined : handleOtpRequest} className={(seconds > 0) ? "text-sm my-3 mx-2 text-gray-500" : "text-sm my-3 text-blue-500"}>Resend OTP</button>
                    {seconds > 0 && (<p> in {seconds}s</p>)}
                  </div>
                  {loading && (
                    <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
                  )}
                  {(error != "") && otpSection && (
                    <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
                  )}
                  <button onClick={handleOtpVerification} className="mt-1 w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300">
                    Verify OTP
                  </button>
                </div>
              )}
              {loading && !otpSent && (
                <p className="my-2 text-center text-gray-500 text-base font-normal mt-1"> {loadMessage}</p>
              )}
              {(error != "") && !otpSent && otpSection && (
                <p className="err-msg text-center text-red-500 text-base font-normal mt-1">{error}</p>
              )}

              {!otpSent && (<button onClick={handleOtpRequest} className="mt-1 w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-300">
                Send OTP
              </button>)}

            </div>
          )}

          <div className="my-6 flex items-center">
            <div className="border-t border-gray-300 flex-1"></div>
            <span className="bg-white px-4 text-sm text-gray-500">Or</span>
            <div className="border-t border-gray-300 flex-1"></div>
          </div>

          {/* <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button> */}

          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-emerald-600 hover:text-emerald-700 font-medium ml-2 transition-colors duration-200"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;