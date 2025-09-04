import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97C0C' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 animate-fade-in">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <img 
                src="/LogoFieldCall.png"
                alt="FieldCall™ - 24/7 Voice AI for Contractors"
                className="h-10 w-auto brightness-0 invert"
                style={{ maxWidth: '240px' }}
              />
            </div>
            <p 
              className="text-gray-300 mb-4 max-w-md font-medium text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              24/7 voice AI that answers calls, qualifies leads, and books jobs for contractors and field professionals.
            </p>
            <div className="flex items-center space-x-2 text-base text-gray-400 hover:text-gray-300 transition-colors duration-200">
              <span style={{ fontFamily: 'Inter, sans-serif' }}>Powered by</span>
              <span className="bg-white text-primary-900 px-3 py-1 rounded text-sm font-bold shadow-soft">
                GoHighLevel
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 
              className="font-bold mb-4 text-base"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Contact
            </h3>
            <div className="space-y-4">
              <a 
                href="mailto:onboarding@fieldcall.ai"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 font-medium text-sm hover:translate-x-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Mail className="w-5 h-5" />
                <span>onboarding@fieldcall.ai</span>
              </a>
              <a 
                href="tel:+18884409613"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 font-medium text-sm hover:translate-x-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Phone className="w-5 h-5" />
                <span>(888) 440-9613</span>
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 
              className="font-bold mb-4 text-base"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Legal
            </h3>
            <div className="space-y-3">
              <a 
                href="#"
                className="block text-gray-300 hover:text-white transition-all duration-200 font-medium text-sm hover:translate-x-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Terms of Service
              </a>
              <a 
                href="#"
                className="block text-gray-300 hover:text-white transition-all duration-200 font-medium text-sm hover:translate-x-1"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-16 pt-10 text-center">
          <p 
            className="text-gray-400 font-medium text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            © 2024 FieldCall™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;