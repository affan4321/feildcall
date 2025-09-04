import React from 'react';
import { Phone } from 'lucide-react';

const DemoBanner = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97C0C' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-slow" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="text-center space-y-12 lg:space-y-16 animate-fade-in">
          {/* Content Block with Enhanced Typography */}
          <div className="space-y-8">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight text-shadow-sm"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Don't take our word for it — call the demo.
            </h2>
            <p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-medium max-w-3xl mx-auto leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Hear exactly how your voice agent would answer a real lead.
            </p>
          </div>

          {/* Premium CTA Container */}
          <div className="flex justify-center">
            <div className="relative group">
              {/* Softer glow effect behind button */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500 to-accent-400 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-300 group-hover:duration-200"></div>
              
              {/* Main CTA Button */}
              <a 
                href="tel:+18884409613"
                className="relative inline-flex items-center space-x-3 px-8 sm:px-10 lg:px-12 py-5 lg:py-6 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 hover:shadow-glow group"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {/* Phone icon with subtle animation */}
                <div className="relative">
                  <Phone className="w-6 h-6 lg:w-7 lg:h-7 group-hover:animate-bounce" />
                  {/* Subtle ring indicator */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                </div>
                
                <div className="text-left">
                  <div className="text-lg lg:text-xl font-bold">Call For Demo</div> 
                </div>
              </a>
            </div>
          </div>

          {/* Subtle confidence indicator */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 text-gray-300 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span style={{ fontFamily: 'Inter, sans-serif' }}>
                Live demo available 24/7
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default DemoBanner;