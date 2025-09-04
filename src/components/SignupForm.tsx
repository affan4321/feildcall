import React, { useState } from 'react';
import { ArrowLeft, Phone, Mail, User, Building, MapPin, Calendar, Clock, DollarSign, CheckCircle, AlertCircle, Loader, CreditCard, Check, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  locale: 'en'
});

const SignupForm = () => {
  const navigate = useNavigate();
  const { refreshProfile, signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    businessType: '',
    yearsInBusiness: '',
    averageJobValue: '',
    callVolume: '',
    currentChallenges: '',
    preferredStartDate: '',
    hearAboutUs: '',
    selectedPlan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Check for payment return on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const paymentCancelled = urlParams.get('payment') === 'cancelled';

    if (sessionId) {
      handlePaymentReturn(sessionId);
    } else if (paymentCancelled) {
      setPaymentError('Payment was cancelled. Please try again.');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handlePaymentReturn = async (sessionId: string) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setPaymentError('');

    try {
      // Verify payment with our Netlify function
      const response = await fetch('/.netlify/functions/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment verification failed');
      }

      if (result.paid && result.formData) {
        // Payment successful, create account with retrieved form data
        await createAccountAfterPayment(result.formData, result.selectedPlan);
      } else {
        throw new Error('Payment was not completed successfully');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to verify payment. Please contact support.');
    } finally {
      setIsSubmitting(false);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const createAccountAfterPayment = async (paidFormData: any, selectedPlan: string) => {
    try {
      // Create user account with payment confirmed
      const { error } = await signUp(paidFormData.email, paidFormData.password, {
        first_name: paidFormData.firstName,
        last_name: paidFormData.lastName,
        phone: paidFormData.phone,
        company: paidFormData.company,
        business_type: paidFormData.businessType,
        address: paidFormData.address,
        city: paidFormData.city,
        state: paidFormData.state,
        zip_code: paidFormData.zipCode,
        years_in_business: paidFormData.yearsInBusiness,
        average_job_value: paidFormData.averageJobValue,
        call_volume: paidFormData.callVolume,
        current_challenges: paidFormData.currentChallenges,
        preferred_start_date: paidFormData.preferredStartDate,
        hear_about_us: paidFormData.hearAboutUs,
        selected_plan: selectedPlan,
        payment_status: 'completed', // Mark as paid
      });

      if (error) {
        throw new Error(error.message || 'Account creation failed');
      }

      // Submit to GoHighLevel
      try {
        const url = 'https://services.leadconnectorhq.com/contacts/';
        const options = {
          method: 'POST',
          headers: {
            Authorization: 'Bearer pit-5b102959-5a03-45c0-b831-b601c619a1b1',
            Version: '2021-07-28',
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            locationId: "yyTbibKYQhtCYuKKsjbN",
            type: "lead",
            firstName: paidFormData.firstName,
            lastName: paidFormData.lastName,
            email: paidFormData.email,
            phone: paidFormData.phone,
            city: paidFormData.city,
            address1: paidFormData.address,
            companyName: paidFormData.company,
            state: paidFormData.state,
            postalCode: paidFormData.zipCode,
            customFields: [
              { id: "v0eGTMj6rFuXji4r1Omp", value: paidFormData.yearsInBusiness },
              { id: "7nra59HgaNb7SxfojKLS", value: paidFormData.averageJobValue },
              { id: "M4uxUGl6zMF4ODz5A3Ju", value: paidFormData.callVolume },
              { id: "hGuGil82mHIRP8ytL7vy", value: paidFormData.currentChallenges },
              { id: "SBzpHwGMzeyJiCPpjN1p", value: paidFormData.preferredStartDate },
              { id: "Pz5nZm958YTBtXD2gPMN", value: paidFormData.hearAboutUs },
              { id: "quFCVTG7j5iVly7ngoig", value: selectedPlan },
              { id: "HIedxID7MPkTo3JOyJIB", value: paidFormData.businessType }
            ]
          })
        };
        await fetch(url, options);
      } catch (error) {
        // Ignore GHL errors for now
        console.warn('GoHighLevel submission failed:', error);
      }

      setSubmitStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to create account after payment. Please contact support.');
    }
  };

  // Available plans (not coming soon)
  const availablePlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$99',
      unit: 'per month',
      badge: 'Best Value',
      badgeColor: 'bg-green-500',
      features: [
        '40 calls included',
        '$2.48 per call after',
        'Cancel anytime'
      ],
      highlighted: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$375',
      unit: 'per month',
      badge: 'Popular',
      badgeColor: 'bg-accent-500',
      features: [
        '160 calls included',
        '$2.34 per call after',
        'CRM sync included',
        'Cancel anytime'
      ],
      highlighted: true
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    
    // Validate all required fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.password || !formData.selectedPlan) {
      setErrorMessage('Please fill in all required fields.');
      setSubmitStatus('error');
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setSubmitStatus('error');
      return;
    }
    
    setIsProcessingPayment(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setPaymentError('');
    
    try {
      let responseText;

      const response = await fetch('/.netlify/functions/create-stripe-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          selectedPlan: formData.selectedPlan,
        }),
      });

      let result;
      try {
        responseText = await response.text();
        if (!responseText || responseText.trim() === '') {
          throw new Error('Empty response from server. Please check if Stripe is properly configured.');
        }
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError, 'Response text:', responseText);
        if (responseText && responseText.includes('STRIPE_SECRET_KEY')) {
          throw new Error('Stripe is not configured properly. Please contact support.');
        }
        throw new Error('Invalid response from payment service. Please contact support if this continues.');
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment session creation error:', error);
      setPaymentError(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (submitStatus === 'success') {
    // No popup, just return null (user will be redirected to dashboard)
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Back</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <img 
              src="/LogoFieldCall.png"
              alt="FieldCall™"
              className="h-8 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-strong border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-8 py-8 text-white text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Get Started with FieldCall™
            </h1>
            <p className="text-primary-100 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              Set up your 24/7 voice agent in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Personal & Business Info */}
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-primary-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Personal Information
                    </h2>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Let's start with your basic details
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 ${
                            submitStatus === 'error' && errorMessage.toLowerCase().includes('email')
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300'
                          }`}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="(555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="Create a password"
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

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 ${
                            formData.confirmPassword && formData.password !== formData.confirmPassword
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-300'
                          }`}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-primary-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Business Information
                    </h2>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Tell us about your business
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="Your Company Name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Business Type *
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                        required
                      >
                        <option value="">Select your business type</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="hvac">HVAC</option>
                        <option value="roofing">Roofing</option>
                        <option value="general-contractor">General Contractor</option>
                        <option value="landscaping">Landscaping</option>
                        <option value="restoration">Restoration</option>
                        <option value="remodeling">Remodeling</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Business Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="Street address"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="City"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="State"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          placeholder="ZIP"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Years in Business
                      </label>
                      <select
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                      >
                        <option value="">Select years in business</option>
                        <option value="less-than-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="4-10">4-10 years</option>
                        <option value="11-20">11-20 years</option>
                        <option value="more-than-20">More than 20 years</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Business Details & Plan Selection */}
              <div className="space-y-8">
                {/* Business Details */}
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-primary-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Business Details
                    </h2>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Help us customize your FieldCall™ experience
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Average Job Value *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="averageJobValue"
                          value={formData.averageJobValue}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          required
                        >
                          <option value="">Select average job value</option>
                          <option value="under-500">Under $500</option>
                          <option value="500-2000">$500 - $2,000</option>
                          <option value="2000-5000">$2,000 - $5,000</option>
                          <option value="5000-15000">$5,000 - $15,000</option>
                          <option value="over-15000">Over $15,000</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Monthly Call Volume *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="callVolume"
                          value={formData.callVolume}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                          required
                        >
                          <option value="">Select monthly call volume</option>
                          <option value="under-20">Under 20 calls</option>
                          <option value="20-50">20-50 calls</option>
                          <option value="50-100">50-100 calls</option>
                          <option value="100-200">100-200 calls</option>
                          <option value="over-200">Over 200 calls</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Preferred Start Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="preferredStartDate"
                          value={formData.preferredStartDate}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                        >
                          <option value="">Select preferred start date</option>
                          <option value="immediately">Immediately</option>
                          <option value="within-week">Within a week</option>
                          <option value="within-month">Within a month</option>
                          <option value="flexible">I'm flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Current Challenges
                      </label>
                      <textarea
                        name="currentChallenges"
                        value={formData.currentChallenges}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 resize-none"
                        placeholder="What challenges are you facing with missed calls or lead management?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-primary-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        How did you hear about us?
                      </label>
                      <select
                        name="hearAboutUs"
                        value={formData.hearAboutUs}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                      >
                        <option value="">Select an option</option>
                        <option value="google-search">Google Search</option>
                        <option value="social-media">Social Media</option>
                        <option value="referral">Referral</option>
                        <option value="advertisement">Advertisement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="space-y-6">
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-bold text-primary-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Choose Your Plan *
                    </h2>
                    <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Select the plan that best fits your business needs
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {availablePlans.map((plan) => (
                      <div 
                        key={plan.id}
                        className={`relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-strong hover:-translate-y-1 ${
                          formData.selectedPlan === plan.id
                            ? 'border-accent-500 ring-2 ring-accent-500/20 shadow-medium'
                            : 'border-gray-200 hover:border-accent-500/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, selectedPlan: plan.id }))}
                      >
                        {/* Selection Indicator */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          formData.selectedPlan === plan.id
                            ? 'border-accent-500 bg-accent-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.selectedPlan === plan.id && (
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          )}
                        </div>

                        {/* Badge */}
                        {plan.badge && (
                          <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                            {plan.badge}
                          </div>
                        )}
                        
                        {/* Plan Header */}
                        <div className="text-center mb-6 pt-2">
                          <h3 
                            className="text-xl font-bold text-primary-900 mb-3"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {plan.name}
                          </h3>
                          <div className="mb-2">
                            <span 
                              className="text-3xl font-extrabold text-primary-900"
                              style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                              {plan.price}
                            </span>
                            <span 
                              className="text-gray-600 ml-1 font-medium text-base"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              {plan.unit}
                            </span>
                          </div>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                              </div>
                              <span 
                                className="text-gray-600 font-medium leading-relaxed text-sm"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message Display */}
            {(submitStatus === 'error' && errorMessage) || paymentError ? (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {paymentError ? 'Payment Error' : 'Signup Failed'}
                    </h4>
                    <p className="text-sm text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {paymentError || errorMessage}
                    </p>
                    {(errorMessage?.toLowerCase().includes('email') || paymentError) && (
                      <p className="text-xs text-red-600 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {paymentError ? 'Please try again or contact support if this continues.' : 'Please try a different email address or contact support if this continues.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <button
                type="submit"
                disabled={isSubmitting || isProcessingPayment || !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.selectedPlan || formData.password !== formData.confirmPassword}
                className={`px-12 py-4 font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 mx-auto ${
                  isSubmitting || isProcessingPayment || !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.selectedPlan || formData.password !== formData.confirmPassword
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-accent-500 text-white hover:bg-accent-600 hover:scale-105 shadow-medium hover:shadow-strong'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : isProcessingPayment ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Redirecting to payment...</span>
                  </>
                ) : (
                  <span>Proceed to Payment</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>Secure & Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>Setup in 48 hours</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-accent-500" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>24/7 Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-green-500" />
            <span style={{ fontFamily: 'Inter, sans-serif' }}>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;