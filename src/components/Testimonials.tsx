import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Luis G.",
      trade: "Remodeler",
      city: "Sarasota, FL",
      quote: "We were losing leads while I was literally under a sink. Not anymore."
    },
    {
      name: "Mike H.",
      trade: "Roofer",
      city: "Fort Myers, FL",
      quote: "FieldCall's doing the admin I didn't even know I was behind on."
    },
    {
      name: "Carlos R.",
      trade: "Restoration Pro",
      city: "Orlando, FL",
      quote: "I don't answer calls anymore — FieldCall screens and tags them all."
    },
    {
      name: "Jessica M.",
      trade: "GC",
      city: "Naples, FL",
      quote: "This isn't AI hype. This is jobsite backup."
    }
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97C0C' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Success Story Visual - Enhanced with better positioning */}
        <div className="relative max-w-4xl mx-auto mb-20 lg:mb-24 animate-slide-up">
          <div className="relative rounded-3xl overflow-hidden shadow-strong bg-white p-3 hover-lift">
            <div className="aspect-[16/9] rounded-2xl overflow-hidden">
              <img 
                src="/contractor-success.png"
                alt="Contractor receiving job completion notification from FieldCall while heading to next job"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
          
          {/* Success overlay - Better positioned */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
            <div className="bg-green-500 text-white px-5 py-2 rounded-2xl shadow-strong border-2 border-white hover:shadow-glow transition-all duration-300">
              <p 
                className="font-bold text-center text-sm sm:text-base lg:text-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Another job booked while you're on the move
              </p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-20 lg:mb-24 animate-fade-in">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 mb-6 lg:mb-8 tracking-tight text-shadow-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            This system books jobs while I'm still on the job.
          </h2>
          <p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium max-w-3xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Real feedback from the people we built this for.
          </p>
        </div>

        {/* Testimonials Grid - Enhanced Design */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 lg:p-10 shadow-medium border border-gray-100 hover:shadow-strong transition-all duration-500 hover:-translate-y-3 h-full flex flex-col hover-lift"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Quote Icon - Enhanced */}
              <div className="absolute -top-3 left-6">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-accent-500 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                  <Quote className="w-6 h-6 lg:w-7 lg:h-7 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Quote Text - Enhanced Typography */}
              <div className="pt-6 space-y-4 flex-1 flex flex-col">
                <blockquote 
                  className="text-base sm:text-lg lg:text-xl text-primary-900 font-semibold leading-relaxed italic group-hover:text-primary-800 transition-colors duration-300 flex-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  "{testimonial.quote}"
                </blockquote>

                {/* Attribution - Clean Design */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p 
                        className="font-bold text-primary-900 text-base lg:text-lg group-hover:text-accent-500 transition-colors duration-300"
                        style={{ fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {testimonial.name}
                      </p>
                      <p 
                        className="text-gray-600 font-medium text-sm mt-1"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {testimonial.trade} • {testimonial.city}
                      </p>
                    </div>
                    
                    {/* Subtle verification badge */}
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-3 h-3 lg:w-4 lg:h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle hover accent */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom accent - Subtle credibility indicator */}
        <div className="mt-20 lg:mt-24 text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-soft border border-gray-200 hover:shadow-medium transition-all duration-300">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span 
              className="text-sm sm:text-base font-medium text-gray-600"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Verified customer feedback
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;