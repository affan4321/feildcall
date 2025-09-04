import React, { useState, useEffect } from 'react';
import { User, Phone, Building, MapPin, Calendar, DollarSign, MessageCircle, Settings, LogOut, Copy, CheckCircle, AlertCircle, Edit3, Send, Cog, Mic, Brain, Volume2, Save, ShoppingCart, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, userProfile, signOut, loading, retell, fetchUserRetellNumber, fetchContactByEmail } = useAuth();
    const navigate = useNavigate();

    // Refetch profile if user changes (robustness)
    useEffect(() => {
        if (user && !userProfile) {
            // Optionally, you could call refreshProfile() here if exposed in context
            // But context should already fetch profile on login/signup
        }
        fetchUserRetellNumber();
    }, [user, userProfile]);

    // Auto-logout if user leaves dashboard (route change, tab close, or landing page visit)
    useEffect(() => {
        const handleBeforeUnload = () => {
            signOut();
        };
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                signOut();
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [signOut]);

    const [copySuccess, setCopySuccess] = useState(false);
    const [isBuyingNumber, setIsBuyingNumber] = useState(false);
    const [buyNumberStatus, setBuyNumberStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [buyNumberMessage, setBuyNumberMessage] = useState('');
    const [formData, setFormData] = useState({
        voiceModel: 'eleven_labs_adriel',
        sttModel: 'deepgram_nova_2',
        llmModel: 'gpt-4o',
        prompt: ''
    });

    const handleBuyNumber = async () => {
        setIsBuyingNumber(true);
        setBuyNumberStatus('idle');
        setBuyNumberMessage('');

        try {
            const response = await fetch('/.netlify/functions/buy-number', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    email: userProfile?.email,
                    first_name: userProfile?.first_name,
                    last_name: userProfile?.last_name,
                    company: userProfile?.company,
                    timestamp: new Date().toISOString()
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setBuyNumberStatus('success');
                setBuyNumberMessage(result.message || 'Number purchase request submitted successfully!');
                // Refresh the retell number after a short delay
                setTimeout(() => {
                    fetchUserRetellNumber();
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to submit number purchase request');
            }
        } catch (error) {
            console.error('Buy number error:', error);
            setBuyNumberStatus('error');
            setBuyNumberMessage('Failed to submit purchase request. Please try again.');
        } finally {
            setIsBuyingNumber(false);
            // Clear status after 5 seconds
            setTimeout(() => {
                setBuyNumberStatus('idle');
                setBuyNumberMessage('');
            }, 5000);
        }
    };

    const handleCopyNumber = () => {
        if (retell && retell !== 'Not assigned yet') {
            navigator.clipboard.writeText(retell);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }

    };

    // Format phone number for display
    const formatPhoneNumber = (phoneNumber: string) => {
        if (!phoneNumber || phoneNumber === 'Not assigned yet') return phoneNumber;

        // Remove all non-digits
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Format as (XXX) XXX-XXXX
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
        }

        // Return original if can't format
        return phoneNumber;
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };


    const sendData = async (Id: string) => {
        const values = {
  customFields: [
    { id: "Ep2hXAcuioMqaosTJX4O", value: formData.prompt },
    { id: "B4fMmr76vOhemqnye9bs", value: formData.voiceModel },
    { id: "RQOHnAAp0FBbNWNcfZ7r", value: formData.sttModel },
    { id: "zhT9FYZpID9Bu1DYa3tZ", value: formData.llmModel }
  ]
};


        const url = `https://services.leadconnectorhq.com/contacts/${Id}`; // Using dynamic ID
        const options = {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer pit-5b102959-5a03-45c0-b831-b601c619a1b1',
                Version: '2021-07-28',
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(values)
        };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error updating contact:', error);
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = await fetchContactByEmail(userProfile.email);
    console.log('User:', u)
    await sendData(u.id);
    console.log("Done!")
}
const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
        ...prev,
        [field]: value
    }));
};

if (loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Loading your dashboard...
                </p>
            </div>
        </div>
    );
}

const getPlanDetails = (planId: string) => {
    const plans = {
        starter: { name: 'Starter', price: '$99/month', calls: '40 calls included' },
        growth: { name: 'Growth', price: '$189/month', calls: '80 calls included' },
        pro: { name: 'Pro', price: '$375/month', calls: '160 calls included' }
    };
    return plans[planId as keyof typeof plans] || { name: 'Not selected', price: 'N/A', calls: 'N/A' };
};

const getBusinessTypeLabel = (type: string) => {
    const types = {
        plumbing: 'Plumbing',
        electrical: 'Electrical',
        hvac: 'HVAC',
        roofing: 'Roofing',
        'general-contractor': 'General Contractor',
        landscaping: 'Landscaping',
        restoration: 'Restoration',
        remodeling: 'Remodeling',
        other: 'Other'
    };
    return types[type as keyof typeof types] || type;
};

const planDetails = getPlanDetails(userProfile?.selected_plan || '');


return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <header className="bg-white shadow-soft border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src="/LogoFieldCall.png"
                            alt="FieldCall™"
                            className="h-8 w-auto"
                        />
                        <div className="hidden sm:block">
                            <h1
                                className="text-xl font-bold text-primary-900"
                                style={{ fontFamily: 'DM Sans, sans-serif' }}
                            >
                                Dashboard
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-primary-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h2
                    className="text-2xl sm:text-3xl font-bold text-primary-900 mb-2"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                    Welcome back, {userProfile?.first_name}!
                </h2>
                <p
                    className="text-gray-600 font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    Here's your FieldCall™ account overview
                </p>
            </div>

            {/* Retell Number Card */}
            <div className="mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200 hover:shadow-strong transition-all duration-300 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            className="text-lg font-bold text-primary-900 flex items-center space-x-2"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                            <Phone className="w-5 h-5 text-accent-500" />
                            <span>Your FieldCall™ Number</span>
                        </h3>
                    </div>

                    <div className="text-center py-8">
                        {!retell || retell === 'Not assigned yet' ? (
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto">
                                    <Cog className="w-8 h-8 text-accent-500 animate-spin" />
                                </div>
                                <div>
                                    <p
                                        className="text-2xl font-bold text-accent-600 mb-2"
                                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                                    >
                                        Your field agent is being created
                                    </p>
                                    <p
                                        className="text-gray-600 font-medium"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Your dedicated phone number and AI agent will be ready within 48 hours
                                    </p>
                                </div>
                                <div className="inline-flex items-center space-x-2 bg-accent-50 text-accent-700 px-4 py-2 rounded-lg">
                                    <Cog className="w-4 h-4 animate-spin" />
                                    <span
                                        className="text-sm font-medium"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Agent creation in progress
                                    </span>
                                </div>
                                
                                {/* Buy Number Button - Only show when number is not assigned */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleBuyNumber}
                                        disabled={isBuyingNumber}
                                        className={`inline-flex items-center space-x-2 px-6 py-3 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong ${
                                            isBuyingNumber
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : buyNumberStatus === 'success'
                                                ? 'bg-green-500 text-white'
                                                : buyNumberStatus === 'error'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-primary-900 text-white hover:bg-primary-800'
                                        }`}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {isBuyingNumber ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : buyNumberStatus === 'success' ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Request Submitted!</span>
                                            </>
                                        ) : buyNumberStatus === 'error' ? (
                                            <>
                                                <AlertCircle className="w-5 h-5" />
                                                <span>Try Again</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-5 h-5" />
                                                <span>Buy Number</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    {/* Status Message */}
                                    {buyNumberMessage && (
                                        <p 
                                            className={`mt-2 text-sm font-medium ${
                                                buyNumberStatus === 'success' ? 'text-green-600' : 'text-red-600'
                                            }`}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            {buyNumberMessage}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto">
                                    <Phone className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <p
                                        className="text-3xl font-bold text-primary-900 mb-2"
                                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                                    >
                                        {formatPhoneNumber(retell)}
                                    </p>
                                    <p
                                        className="text-gray-600 font-medium"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Your FieldCall™ agent is live and ready to take calls
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    {/* Call Button */}
                                    <a
                                        href={`tel:${retell}`}
                                        className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        <Phone className="w-5 h-5" />
                                        <span>Call This Number</span>
                                    </a>

                                    {/* Copy Button */}
                                    <button
                                        onClick={handleCopyNumber}
                                        className={`inline-flex items-center space-x-2 px-6 py-3 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong ${copySuccess
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 text-primary-900 hover:bg-gray-200'
                                            }`}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {copySuccess ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5" />
                                                <span>Copy Number</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                                    <CheckCircle className="w-4 h-4" />
                                    <span
                                        className="text-sm font-medium"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        Active
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Agent Prompt Configuration - Only show when number is assigned */}
                </div>
            </div>

            {/* Agent Customization Form - Only show when number is assigned */}
            {retell && retell !== 'Not assigned yet' && (
                <div className="mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200 hover:shadow-strong transition-all duration-300">
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-between mb-6">
                                <h3
                                    className="text-lg font-bold text-primary-900 flex items-center space-x-2"
                                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                                >
                                    <Brain className="w-5 h-5 text-accent-500" />
                                    <span>Agent Customization</span>
                                </h3>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Left Column - Model Settings */}
                                <div className="space-y-6">
                                    <div>
                                        <h4
                                            className="text-base font-bold text-primary-900 mb-4 flex items-center space-x-2"
                                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                                        >
                                            <Settings className="w-4 h-4 text-accent-500" />
                                            <span>Model Configuration</span>
                                        </h4>
                                    </div>

                                    {/* Voice Model */}
                                    <div>
                                        <label
                                            className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            <Volume2 className="w-4 h-4 text-gray-500" />
                                            <span>Voice Model</span>
                                        </label>
                                        <select
                                            value={formData.voiceModel}
                                            onChange={(e) => handleInputChange('voiceModel', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            <option value="eleven_labs_adriel">ElevenLabs - Adriel (Professional Male)</option>
                                            <option value="eleven_labs_bella">ElevenLabs - Bella (Professional Female)</option>
                                            <option value="eleven_labs_charlie">ElevenLabs - Charlie (Friendly Male)</option>
                                            <option value="eleven_labs_domi">ElevenLabs - Domi (Confident Female)</option>
                                            <option value="openai_alloy">OpenAI - Alloy (Neutral)</option>
                                            <option value="openai_echo">OpenAI - Echo (Clear)</option>
                                            <option value="openai_nova">OpenAI - Nova (Warm)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            Choose the voice that best represents your business
                                        </p>
                                    </div>

                                    {/* STT Model */}
                                    <div>
                                        <label
                                            className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            <Mic className="w-4 h-4 text-gray-500" />
                                            <span>Speech-to-Text Model</span>
                                        </label>
                                        <select
                                            value={formData.sttModel}
                                            onChange={(e) => handleInputChange('sttModel', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            <option value="deepgram_nova_2">Deepgram Nova 2 (Recommended)</option>
                                            <option value="deepgram_enhanced">Deepgram Enhanced</option>
                                            <option value="assembly_ai_best">AssemblyAI Best</option>
                                            <option value="whisper_large">OpenAI Whisper Large</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            Controls how accurately your agent understands speech
                                        </p>
                                    </div>

                                    {/* LLM Model */}
                                    <div>
                                        <label
                                            className="block text-sm font-bold text-gray-700 mb-2 flex items-center space-x-2"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            <Brain className="w-4 h-4 text-gray-500" />
                                            <span>AI Language Model</span>
                                        </label>
                                        <select
                                            value={formData.llmModel}
                                            onChange={(e) => handleInputChange('llmModel', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            <option value="gpt-4o">GPT-4o (Most Advanced)</option>
                                            <option value="gpt-4-turbo">GPT-4 Turbo (Fast & Smart)</option>
                                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Cost Effective)</option>
                                            <option value="claude-3-sonnet">Claude 3 Sonnet (Creative)</option>
                                            <option value="claude-3-haiku">Claude 3 Haiku (Quick Responses)</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            Determines your agent's intelligence and response quality
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column - Prompt Configuration */}
                                <div className="space-y-6">
                                    <div>
                                        <h4
                                            className="text-base font-bold text-primary-900 mb-4 flex items-center space-x-2"
                                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                                        >
                                            <MessageCircle className="w-4 h-4 text-accent-500" />
                                            <span>Agent Instructions</span>
                                        </h4>
                                    </div>

                                    <div>
                                        <label
                                            className="block text-sm font-bold text-gray-700 mb-2"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            Custom Prompt for Your Agent
                                        </label>
                                        <textarea
                                            value={formData.prompt}
                                            onChange={(e) => handleInputChange('prompt', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 resize-none"
                                            rows={12}
                                            placeholder="Enter detailed instructions for how your FieldCall™ agent should handle calls. Include:

• How to greet customers
• What information to collect
• Your business hours and services
• How to handle emergencies
• Appointment booking process
• Any specific phrases or terminology to use

Example: 'You are a professional receptionist for [Company Name], a plumbing service. Always greet callers warmly and ask about their plumbing issue. Collect their name, phone number, address, and preferred appointment time. For emergencies, offer our 24-hour service. Always mention our free estimates for major repairs.'"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        />
                                        <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            Be specific about how you want your agent to represent your business. The more detailed your instructions, the better your agent will perform.
                                        </p>
                                    </div>

                                    {/* Preview Section */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <h5
                                            className="text-sm font-bold text-gray-700 mb-2"
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        >
                                            Configuration Preview
                                        </h5>
                                        <div className="space-y-1 text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            <div>Voice: {formData.voiceModel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                            <div>STT: {formData.sttModel.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                            <div>LLM: {formData.llmModel.toUpperCase()}</div>
                                            <div>Prompt: {formData.prompt ? `${formData.prompt.length} characters` : 'Not set'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!formData.prompt.trim()}
                                    className={`inline-flex items-center space-x-2 px-8 py-3 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong ${formData.prompt.trim()
                                            ? 'bg-accent-500 text-white hover:bg-accent-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    <Save className="w-5 h-5" />
                                    <span>Save Agent Configuration</span>
                                </button>
                            </div>

                            <p
                                className="text-xs text-gray-500 mt-4 text-center leading-relaxed"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Changes will take effect within 5 minutes. Test your agent by calling your FieldCall™ number after saving.
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* Information Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200 hover:shadow-strong transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3
                            className="text-lg font-bold text-primary-900 flex items-center space-x-2"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                            <User className="w-5 h-5 text-accent-500" />
                            <span>Personal Information</span>
                        </h3>
                        <button className="p-2 text-gray-400 hover:text-primary-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-bold text-gray-700 mb-1"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    First Name
                                </label>
                                <p
                                    className="text-primary-900 font-medium"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {userProfile?.first_name}
                                </p>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-bold text-gray-700 mb-1"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    Last Name
                                </label>
                                <p
                                    className="text-primary-900 font-medium"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {userProfile?.last_name}
                                </p>
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-bold text-gray-700 mb-1"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Email Address
                            </label>
                            <p
                                className="text-primary-900 font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {userProfile?.email}
                            </p>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-bold text-gray-700 mb-1"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Phone Number
                            </label>
                            <p
                                className="text-primary-900 font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {userProfile?.phone}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Business Information */}
                <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200 hover:shadow-strong transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3
                            className="text-lg font-bold text-primary-900 flex items-center space-x-2"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                        >
                            <Building className="w-5 h-5 text-accent-500" />
                            <span>Business Information</span>
                        </h3>
                        <button className="p-2 text-gray-400 hover:text-primary-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label
                                className="block text-sm font-bold text-gray-700 mb-1"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Company Name
                            </label>
                            <p
                                className="text-primary-900 font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {userProfile?.company}
                            </p>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-bold text-gray-700 mb-1"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Business Type
                            </label>
                            <p
                                className="text-primary-900 font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {getBusinessTypeLabel(userProfile?.business_type || '')}
                            </p>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-bold text-gray-700 mb-1"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                Location
                            </label>
                            <p
                                className="text-primary-900 font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {userProfile?.location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
);
};

export default Dashboard;