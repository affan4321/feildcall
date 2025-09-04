import React, { useState, useEffect } from 'react';
import { Phone, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'blocked'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero section (roughly 100vh)
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition > windowHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSetupAccount = () => {
    // Track form open attempt
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_open_attempt', {
        event_category: 'engagement',
        event_label: 'sticky_mobile_cta_signup'
      });
    }
    
    // Navigate to custom signup form
    window.location.href = '/signup';
  };

  const getButtonContent = () => {
    return (
      <>
        <span>Sign up</span>
      </>
    );
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Sticky Mobile CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
        <div className="glass-effect border-t border-gray-200 p-4 shadow-strong">
          <div className="flex gap-3">
            {/* Call Button */}
            <a 
              href="tel:+18884409613"
              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-accent-500 text-accent-500 font-bold rounded-xl hover:bg-accent-50 transition-all duration-300 shadow-soft hover:shadow-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">Call Demo</span>
            </a>
            
            {/* Setup Account Button */}
            <button 
              onClick={handleSetupAccount}
             className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-3 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all duration-300 text-sm shadow-soft hover:shadow-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {getButtonContent()}
           </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyMobileCTA;