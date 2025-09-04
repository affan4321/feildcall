import React from 'react';
import { ArrowRight, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const FinalCTA = () => {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'loading' | 'success' | 'blocked'>('idle');

  const handleSetupAccount = () => {
    // Track form open attempt
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_open_attempt', {
        event_category: 'engagement',
        event_label: 'final_cta_signup'
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

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97C0C' fill-opacity='0.15'%3E%3Cpath d='M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent-100/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-100/20 to-transparent rounded-full blur-3xl animate-float"></div>

      <div className="relative max-w-5xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-strong border border-gray-200 text-center relative overflow-hidden hover-lift animate-fade-in">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-green-500"></div>
          
          {/* Content with scroll-reveal animation */}
          <div className="space-y-8 lg:space-y-10">
            {/* Main Headline - Bold with Emoji */}
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-primary-900 leading-tight tracking-tight text-shadow-sm"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Silence doesn't pay.
            </h2>

            {/* Subtext - Enhanced with financial urgency */}
            <p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Let FieldCall™ pick up the phone, so you never miss another $12,000 job.
            </p>

            {/* Primary CTA Button */}
            <div className="pt-6 lg:pt-8 relative">
              <div className="relative group inline-block">
                {/* Softer glow effect behind button */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500 to-accent-400 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
                
                {/* Main CTA Button */}
                <button 
                  onClick={handleSetupAccount}
                  className="relative inline-flex items-center space-x-2 px-10 py-5 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 hover:scale-105 hover:shadow-glow transition-all duration-300 transform shadow-medium group"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="text-lg lg:text-xl">{getButtonContent()}</span>
                </button>
              </div>
              
              {/* Subtext below button */}
              <p 
                className="text-sm lg:text-base text-gray-600 font-medium mt-4 max-w-md mx-auto"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Pay-as-you-go. No monthly fee. Live in 48 hours.
              </p>
            </div>

            {/* Supporting text */}
            <p 
              className="text-sm lg:text-base text-gray-600 font-medium max-w-2xl mx-auto"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Join hundreds of contractors who trust FieldCall™ to handle their calls — even after hours.
            </p>
          </div>

          {/* Subtle background accent elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-accent-500/10 to-transparent rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-primary-900/5 to-transparent rounded-full blur-3xl animate-float"></div>
        </div>

        {/* Benefits Row - Enhanced with checkmarks */}
        <div className="mt-12 lg:mt-16 flex flex-wrap justify-center gap-4 lg:gap-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {[
            "No contracts",
            "Cancel anytime", 
            "Live agent setup in 48h"
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 group">
              <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
              <span 
                className="text-sm font-medium text-gray-600 group-hover:text-primary-900 transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default FinalCTA;