import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const Header = () => {
  const { user, signOut, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'blocked'>('idle');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleSetupAccount = () => {
    // Track form open attempt
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_open_attempt', {
        event_category: 'engagement',
        event_label: 'header_signup'
      });
    }
    
    // Navigate to custom signup form
    window.location.href = '/signup';
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // Force navigation after logout
      navigate('/');
      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to home
      window.location.href = '/';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getButtonContent = () => {
    return (
      <>
        <ExternalLink className="w-4 h-4" />
        <span>Sign up</span>
      </>
    );
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect shadow-medium border-b border-gray-200' 
          : 'glass-effect backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/LogoFieldCall.png"
              alt="FieldCall™ - 24/7 Voice AI for Contractors"
              className="h-9 lg:h-10 w-auto"
              style={{ maxWidth: '240px' }}
            />
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              // Show Dashboard and Logout buttons when logged in
              <>
                {(isAdmin || isSuperAdmin) && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="px-6 py-2 text-primary-900 font-bold hover:text-accent-500 transition-all duration-200 hover:scale-105"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Admin
                  </button>
                )}
                <button 
                  onClick={handleDashboard}
                  className="px-6 py-2 text-primary-900 font-bold hover:text-accent-500 transition-all duration-200 hover:scale-105"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  type="button"
                  className={`px-6 py-2 font-bold rounded-lg shadow-soft transition-all duration-200 flex items-center space-x-2 ${
                    isLoggingOut 
                      ? 'bg-red-300 text-red-100 cursor-not-allowed' 
                      : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 hover:shadow-medium'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <span>🚪</span>
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              // Show Sign In, Call For Demo, and Sign Up when logged out
              <>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-6 py-2 text-primary-900 font-bold hover:text-accent-500 transition-all duration-200 hover:scale-105"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    // Auto-fill admin credentials and open login modal
                    setIsLoginModalOpen(true);
                    // Small delay to ensure modal is open
                    setTimeout(() => {
                      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
                      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
                      if (emailInput && passwordInput) {
                        emailInput.value = 'admin@fieldcall.ai';
                        passwordInput.value = 'SuperAdmin2024!';
                        // Trigger change events
                        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }, 100);
                  }}
                  className="px-4 py-2 text-xs bg-accent-100 text-accent-700 font-bold rounded-lg hover:bg-accent-200 transition-all duration-200 hover:scale-105 flex items-center space-x-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span>👑</span>
                  <span>Admin</span>
                </button>
                <button 
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                    // Auto-fill admin credentials
                    setTimeout(() => {
                      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
                      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
                      if (emailInput && passwordInput) {
                        emailInput.value = 'admin@fieldcall.ai';
                        passwordInput.value = 'SuperAdmin2024!';
                        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    }, 100);
                  }}
                  className="block w-full text-center bg-accent-100 text-accent-700 font-bold py-3 px-4 rounded-lg hover:bg-accent-200 transition-all duration-200 hover:scale-105"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  👑 Admin Login
                </button>
                <a 
                  href="tel:+18884409613"
                  className="px-6 py-2 text-primary-900 font-bold hover:text-accent-500 transition-all duration-200 hover:scale-105"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Call For Demo
                </a>
                <button 
                  onClick={handleSetupAccount}
                  className="px-6 py-2 bg-accent-500 text-white font-bold rounded-lg hover:bg-accent-600 hover:scale-105 shadow-soft hover:shadow-medium transition-all duration-200 flex items-center space-x-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {getButtonContent()}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95 hover:shadow-soft"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-primary-900" strokeWidth={2.5} />
            ) : (
              <Menu className="w-6 h-6 text-primary-900" strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass-effect border-b border-gray-200 shadow-strong animate-fade-in">
            <div className="px-6 py-6 space-y-4">
              {user ? (
                // Show Logout button when logged in (mobile)
                <>
                  {(isAdmin || isSuperAdmin) && (
                    <button 
                      onClick={() => {
                        navigate('/admin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-center text-primary-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      👑 Admin Panel
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      handleDashboard();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center text-primary-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    📊 Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isLoggingOut}
                    type="button"
                    className={`w-full px-6 py-4 font-bold rounded-xl shadow-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      isLoggingOut 
                        ? 'bg-red-300 text-red-100 cursor-not-allowed' 
                        : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 hover:shadow-strong'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <span>🚪</span>
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                // Show Sign In, Call For Demo, and Sign Up when logged out (mobile)
                <>
                  <button 
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center text-primary-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    🔐 Sign In
                  </button>
                  <a 
                    href="tel:+18884409613"
                    className="block w-full text-center text-primary-900 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    📞 Call For Demo
                  </a>
                  <button 
                    onClick={handleSetupAccount}
                    className="w-full px-6 py-4 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 hover:scale-105 shadow-medium hover:shadow-strong transition-all duration-200 flex items-center justify-center space-x-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <span>🚀</span>
                    {getButtonContent()}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {!user && (
        <LoginForm 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </header>
  );
};

export default Header;