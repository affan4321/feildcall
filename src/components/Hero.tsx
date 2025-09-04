import React from 'react';
import { Phone, ArrowRight, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const Hero = () => {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'loading' | 'success' | 'blocked'>('idle');
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);

  const handleSetupAccount = () => {
    // Track form open attempt
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_open_attempt', {
        event_category: 'engagement',
        event_label: 'hero_signup'
      });
    }
    
    // Navigate to custom signup form
    window.location.href = '/signup';
  };

  const getSecondaryButtonContent = () => {
    return (
      <>
        <span>Sign up</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </>
    );
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center pt-20 pb-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97C0C' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm20 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent-100/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-100/20 to-transparent rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-8 lg:pr-4 text-center lg:text-left order-1 lg:order-1 animate-fade-in">
            {/* Headlines */}
            <div className="space-y-8 order-1 lg:order-1">
              <h1 
                className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-primary-900 leading-[1.1] tracking-tight text-shadow-sm"
                style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 800 }}
              >
                You shouldn't lose business just because you're on the job.
              </h1>
              <p 
                className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                FieldCall™ is a 24/7 voice AI that answers every call, qualifies every lead, and books jobs while you focus on the work.
              </p>
            </div>

            {/* Video Column - Mobile Only */}
            <div className="relative lg:hidden order-2">
              {/* Video Container */}
              <div className="relative max-w-lg mx-auto animate-slide-up">
                <div className="relative group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
                  {/* Video Thumbnail Container */}
                  <div className="relative rounded-2xl overflow-hidden shadow-strong bg-gradient-to-br from-primary-900 to-primary-800 aspect-video transform hover:scale-105 transition-all duration-500 hover-lift">
                    {/* YouTube Thumbnail */}
                    <img 
                      src="https://img.youtube.com/vi/IU9NqkRB3yc/maxresdefault.jpg"
                      alt="See FieldCall™ in action - 55 second overview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative group-hover:scale-110 transition-transform duration-300">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        
                        {/* Play button */}
                        <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-strong hover:shadow-glow transition-all duration-300">
                          <div className="w-0 h-0 border-l-[12px] lg:border-l-[16px] border-l-accent-500 border-t-[8px] lg:border-t-[10px] border-t-transparent border-b-[8px] lg:border-b-[10px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-semibold">
                      0:55
                    </div>
                  </div>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-500/50 transition-all duration-300"></div>
                </div>
                
                {/* Video caption */}
                <div className="mt-4 text-center">
                  <p 
                    className="text-sm lg:text-base text-gray-600 font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Watch how FieldCall™ works (55 seconds)
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="order-3 lg:order-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-6 justify-center lg:justify-start">
                {/* Primary CTA - Enhanced Design */}
                <div className="flex-1 sm:flex-initial">
                  <div className="relative group inline-block">
                    {/* Softer glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-500 to-accent-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                    
                    <a 
                      href="tel:+18884409613"
                      className="relative inline-flex items-center space-x-3 px-8 py-4 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-strong group w-full sm:w-auto justify-center"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <div className="relative">
                        <Phone className="w-5 h-5 group-hover:animate-bounce" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                      </div>
                      <div className="text-left">
                        <div className="text-base font-bold">Call For Demo</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Secondary CTA - Enhanced Design */}
                <div className="flex-1 sm:flex-initial relative">
                  <button 
                    onClick={handleSetupAccount}
                    disabled={formStatus === 'loading'}
                    className={`inline-flex items-center space-x-2 px-8 py-4 border-2 font-bold rounded-xl transition-all duration-300 transform shadow-soft hover:shadow-medium group w-full sm:w-auto justify-center ${
                      formStatus === 'success' 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : formStatus === 'blocked'
                        ? 'border-red-500 bg-red-500 text-white'
                        : formStatus === 'loading'
                        ? 'border-primary-900/50 text-primary-900/50 cursor-not-allowed'
                        : 'border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white hover:scale-105'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {getSecondaryButtonContent()}
                  </button>
                </div>
              </div>
              
              {/* Supporting text moved outside and centered */}
              <div className="text-center lg:text-left order-4 lg:order-3 mt-6">
                  <p 
                    className="text-sm sm:text-base text-gray-600 font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Pay-as-you-go. Start today. No monthly commitment.
                  </p>
              </div>
            </div>
          </div>

          {/* Video Column */}
          <div className="relative lg:pl-4 mt-0 lg:mt-0 hidden lg:block order-2 lg:order-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Video Container */}
            <div className="relative max-w-lg mx-auto">
              <div className="relative group cursor-pointer" onClick={() => setIsVideoModalOpen(true)}>
                {/* Video Thumbnail Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-strong bg-gradient-to-br from-primary-900 to-primary-800 aspect-video transform hover:scale-105 transition-all duration-500 hover-lift">
                  {/* YouTube Thumbnail */}
                  <img 
                    src="https://img.youtube.com/vi/IU9NqkRB3yc/maxresdefault.jpg"
                    alt="See FieldCall™ in action - 55 second overview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Dark overlay for better contrast */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      
                      {/* Play button */}
                      <div className="relative w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-strong hover:shadow-glow transition-all duration-300">
                        <div className="w-0 h-0 border-l-[12px] lg:border-l-[16px] border-l-accent-500 border-t-[8px] lg:border-t-[10px] border-t-transparent border-b-[8px] lg:border-b-[10px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-semibold">
                    0:55
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-accent-500/50 transition-all duration-300"></div>
              </div>
              
              {/* Video caption */}
              <div className="mt-4 text-center">
                <p 
                  className="text-sm lg:text-base text-gray-600 font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Watch how FieldCall™ works (55 seconds)
                </p>
              </div>
            </div>

            {/* Background accent elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-accent-500/10 to-transparent rounded-full blur-2xl animate-pulse-slow"></div>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary-900/5 to-transparent rounded-full blur-3xl animate-float"></div>
          </div>
        </div>
      </div>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsVideoModalOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10 hover:scale-110"
            >
              <div className="w-5 h-5 relative">
                <div className="absolute inset-0 w-0.5 h-5 bg-white transform rotate-45 left-1/2 -translate-x-1/2"></div>
                <div className="absolute inset-0 w-0.5 h-5 bg-white transform -rotate-45 left-1/2 -translate-x-1/2"></div>
              </div>
            </button>
            
            {/* Video Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-strong">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/IU9NqkRB3yc?autoplay=1&rel=0&modestbranding=1"
                  title="FieldCall™ Overview - 24/7 Voice AI for Contractors"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;