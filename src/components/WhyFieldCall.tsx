import React from 'react';

const WhyFieldCall = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97C0C' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/30 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Image on the left - Visual authenticity */}
          <div className="relative lg:order-1 animate-slide-up">
            {/* Clean image container - no overlays */}
            <div className="relative rounded-2xl overflow-hidden shadow-strong hover-lift">
              <img 
                src="/contractor-working-late.png"
                alt="Contractor working late at desk with paperwork and laptop - the reality of running a contracting business"
                className="w-full h-auto object-cover"
              />
            </div>
            
            {/* Badge-style quote positioned below image */}
            <div className="mt-6 flex justify-center lg:justify-start">
              <div className="inline-block bg-gray-100 border-l-4 border-accent-500 px-3 py-2 rounded-r-lg shadow-soft max-w-sm hover:shadow-medium transition-all duration-300">
                <p 
                  className="text-sm sm:text-base text-primary-900 font-medium italic leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  "This is not AI from the top down. It's a tool from the ground up."
                </p>
              </div>
            </div>
          </div>

          {/* Text on the right - Core message delivery */}
          <div className="space-y-8 lg:order-2 text-center lg:text-left animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Headline - Sentence Case */}
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 text-shadow-sm"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              We didn't build this in a lab.
            </h2>

            {/* Subheadline / Lead-in */}
            <p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium leading-relaxed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              FieldCall™ was built after 40 years in the trades — by contractors, for contractors.
            </p>

            {/* Body copy */}
            <div className="space-y-6">
              <p 
                className="text-base lg:text-lg text-gray-600 font-medium leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                We've run the jobs, missed the calls, lost the leads, and felt the pressure. That's why FieldCall™ exists — not as a startup experiment, but as a voice system designed to solve the problems we lived firsthand.
              </p>
              
              <p 
                className="text-base lg:text-lg text-gray-600 font-medium leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Every workflow, every prompt, every integration is based on what actually happens in the field — not what tech companies think happens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyFieldCall;