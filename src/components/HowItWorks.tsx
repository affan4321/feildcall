import React from 'react';
import { Phone, MessageCircle, CheckCircle, Database, Check } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Phone,
      title: "A call comes in.",
      description: "Customer calls while you're on the job"
    },
    {
      icon: MessageCircle,
      title: "Your agent picks up.",
      description: "Sounds professional, not robotic"
    },
    {
      icon: CheckCircle,
      title: "The lead gets qualified or booked.",
      description: "Your agent handles the conversation completely"
    },
    {
      icon: Database,
      title: "You get the result instantly.",
      description: "Everything syncs automatically"
    }
  ];

  const benefits = [
    "No missed info",
    "No admin work", 
    "Just leads → booked jobs"
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97C0C' fill-opacity='0.15'%3E%3Cpath d='M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 lg:mb-24 animate-fade-in">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 mb-6 text-shadow-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Your agent works while you work.
          </h2>
        </div>

        {/* Repositioned contractor image with floating notification */}
        <div className="relative max-w-2xl mx-auto mb-20 lg:mb-24 animate-slide-up">
          <div className="relative rounded-2xl overflow-hidden shadow-strong hover-lift">
            <img 
              src="/hero-contractor-phone.png"
              alt="Contractor working late at desk with paperwork and laptop - the reality of running a contracting business"
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Enhanced floating notification positioned below image */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-strong border border-gray-100 w-fit transform hover:scale-105 transition-all duration-300 hover:shadow-glow">
              <div className="flex items-center space-x-2">
                <div className="relative flex-shrink-0">
                  <div className="w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-accent-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="min-w-0">
                  <p 
                    className="text-xs font-bold text-primary-900 mb-0.5 leading-tight"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Your agent is handling this call
                  </p>
                  <p 
                    className="text-xs text-gray-600 font-medium leading-tight"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    While you stay focused on the work
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Steps Layout */}
        <div className="relative mb-20 lg:mb-24">
          {/* Desktop Flow Line */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-500 to-transparent"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {steps.map((step, index) => (
              <div key={index} className="relative group" style={{ animationDelay: `${0.1 * index}s` }}>
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 lg:p-8 shadow-medium border border-gray-100 hover:shadow-strong transition-all duration-500 hover:-translate-y-3 relative z-10 h-full flex flex-col hover-lift">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 left-6">
                    <div 
                      className="w-6 h-6 bg-primary-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-medium"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  {/* Icon Container */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                      <step.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center space-y-3 flex-1 flex flex-col justify-center">
                    <h3 
                      className="text-base lg:text-lg font-bold text-primary-900 group-hover:text-accent-500 transition-colors duration-300"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    <p 
                      className="text-gray-600 font-medium text-sm lg:text-base leading-relaxed"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connection Arrow (Desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 z-20">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-accent-500 flex items-center justify-center shadow-soft">
                      <div className="w-0 h-0 border-l-[4px] border-l-accent-500 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Summary */}
        <div className="text-center">
          <div className="inline-flex flex-wrap justify-center gap-4 lg:gap-8 bg-white rounded-2xl px-6 py-4 shadow-medium border border-gray-100 hover:shadow-strong transition-all duration-300">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 group">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span 
                  className="text-sm lg:text-base text-primary-900 font-bold group-hover:text-accent-500 transition-colors duration-200"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;