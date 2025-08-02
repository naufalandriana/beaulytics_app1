import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FiEye as Eye, FiEyeOff as EyeOff, FiUser as User, FiMail as Mail, FiLock as Lock, FiArrowRight as ArrowRight } from 'react-icons/fi';
import logo from '../assets/favicon.ico';

const ModernLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // Google OAuth
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const handleGoogleAuth = useGoogleLogin({
    flow: 'implicit',
    scope: 'openid profile email',
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        await loginWithGoogle(tokenResponse);
        navigate('/');
      } catch (err) {
        console.error('Google login error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (err) => console.error('Google login failed:', err)
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords must match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log(isLogin ? 'Login' : 'Register', formData);
    }, 2000);
  };

  
  

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const InputField = ({ icon: Icon, type, name, placeholder, value, error }) => (
    <div className="space-y-2">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className={`h-5 w-5 transition-colors duration-200 ${
            error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-yellow-500' 
          }`} />
        </div>
        <input
          type={type === 'password' && name === 'password' && showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          disabled={isLoading}
          className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-300 bg-red-50' : 'border-transparent hover:border-gray-200'
          }`}
        />
        {(type === 'password' && (name === 'password' || name === 'confirmPassword')) && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm ml-1 animate-pulse">{error}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
            <img src={logo} alt="Logo" className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Beaulytics.
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full translate-y-12 -translate-x-12"></div>

          {/* Form Toggle */}
          <div className="relative mb-8">
            <div className="flex bg-gray-100 rounded-2xl p-1 relative">
              <div 
                className={`absolute top-1 bottom-1 rounded-xl bg-white shadow-sm transition-all duration-300 ${
                  isLogin ? 'left-1 right-1/2' : 'left-1/2 right-1'
                }`}
              ></div>
              <button
                onClick={() => setIsLogin(true)}
                disabled={isLoading}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                  isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-yellow-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                disabled={isLoading}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${
                  !isLogin ? 'text-gray-900' : 'text-gray-500 hover:text-yellow-700'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Please sign in to your account to continue your journey'
                  : 'Join us to discover amazing beauty products'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <InputField
                  icon={User}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  error={errors.name}
                />
              )}

              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                error={errors.email}
              />

              <InputField
                icon={Lock}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                error={errors.password}
              />

              {!isLogin && (
                <InputField
                  icon={Lock}
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  error={errors.confirmPassword}
                />
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <span>{isLoading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign up')}</span>
                {!isLoading && (
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                )}
                {isLoading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                )}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">atau</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <p className="text-center mt-8 text-gray-600 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={toggleForm}
                disabled={isLoading}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;