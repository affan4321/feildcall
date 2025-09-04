import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('Login timeout - forcing error state');
      setSubmitStatus('error');
      setErrorMessage('Login timeout. Please try again.');
      setIsSubmitting(false);
    }, 30000); // 30 second timeout
    
    try {
     
      const { error } = await signIn(formData.email, formData.password);
  
      
      if (error) {
        clearTimeout(timeoutId);
        throw new Error(error.message || 'Login failed');
      } else {
        clearTimeout(timeoutId);
        setSubmitStatus('success');
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error caught:', error);
      clearTimeout(timeoutId);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Login failed. Please check your credentials and try again.');
    } finally {
      // Ensure loading state is always cleared
      setTimeout(() => {
        if (submitStatus !== 'success') {
          setIsSubmitting(false);
        }
      }, 100);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 min-h-screen">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-auto animate-fade-in my-auto">
        <div className="bg-white rounded-3xl shadow-strong border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-8 py-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <img 
                src="/LogoFieldCall.png"
                alt="FieldCall™"
                className="h-8 w-auto mx-auto mb-4 brightness-0 invert"
              />
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Welcome Back
              </h2>
              <p 
                className="text-primary-100"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Sign in to your FieldCall™ account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label 
                  className="block text-sm font-bold text-primary-900 mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label 
                  className="block text-sm font-bold text-primary-900 mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span 
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {errorMessage}
                  </span>
                </div>
              )}

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span 
                    className="text-sm font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Login successful! Redirecting...
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className={`w-full px-6 py-3 font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitting || submitStatus === 'success'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-accent-500 text-white hover:bg-accent-600 hover:scale-105 shadow-medium hover:shadow-strong'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Success!</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-accent-500 hover:text-accent-600 font-medium transition-colors duration-200"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  onClick={() => {
                    // Handle forgot password
                  
                  }}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p 
                  className="text-sm text-gray-600 mb-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Don't have an account?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.location.href = '/signup';
                  }}
                  className="text-sm text-primary-900 hover:text-accent-500 font-bold transition-colors duration-200"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Create your FieldCall™ account
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;