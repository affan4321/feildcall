import React from 'react';
import { Check, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const Pricing = () => {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'loading' | 'success' | 'blocked'>('idle');

  const handleSetupAccount = () => {
    // Track form open attempt
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_open_attempt', {
        event_category: 'engagement',
        event_label: 'pricing_signup'
      });
    }
    
    // Navigate to custom signup form
    window.location.href = '/signup';
  };

  const handleTalkToSales = () => {
    window.open('mailto:onboarding@fieldcall.ai?subject=Enterprise Sales Inquiry', '_blank');
  };

  const plans = [
    {
      name: "Pay-as-you-go",
      price: "$2.60",
      unit: "per call",
      badge: "Coming Soon",
      badgeColor: "bg-gray-500",
      features: [
        "No overages",
        "No hidden fees",
        "Every call logged, tagged, and billed fairly",
        "Auto-billed at $100 usage"
      ],
      cta: "Sign up",
      action: handleSetupAccount,
    },
    {
      name: "Starter",
      price: "$99",
      unit: "per month",
      badge: "Best Value",
      badgeColor: "bg-[#4CAF50]",
      features: [
        "40 calls included",
        "$2.48 per call after",
        "Cancel anytime"
      ],
      cta: "Sign up",
      action: handleSetupAccount,
      highlighted: true
    },
    {
      name: "Growth",
      price: "$189",
      unit: "per month",
      features: [
        "80 calls included",
        "$2.36 per call after",
        "CRM sync included",
        "Cancel anytime"
      ],
      badge: "Coming Soon", 
      badgeColor: "bg-gray-500",
      cta: "Sign up",
      action: handleSetupAccount
    },
    {
      name: "Pro",
      price: "$375",
      unit: "per month",
      badge: "Popular",
      badgeColor: "bg-[#F97C0C]",
      features: [
        "160 calls included",
        "$2.34 per call after",
        "CRM sync included",
        "Cancel anytime"
      ],
      cta: "Sign up",
      action: handleSetupAccount,
      highlighted: true
    }
  ];

  const getButtonText = (originalText: string) => {
    return originalText;
  };

  const getButtonIcon = () => {
    return null;
  };
  const guarantees = [
    "No overages",
    "No hidden fees", 
    "Every call logged, tagged, and billed fairly"
  ];

  return (
    <section id="pricing" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97C0C' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="text-center mb-20 lg:mb-24 animate-fade-in">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 mb-6 lg:mb-8 text-shadow-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Plans that pay for themselves.
          </h2>
          <p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium mb-8 lg:mb-10 max-w-3xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Start with Pay-as-you-go — upgrade only if you need to.
          </p>
          
          {/* Guarantees */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {guarantees.map((guarantee, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" strokeWidth={3} />
                </div>
                <span 
                  className="text-sm sm:text-base lg:text-lg text-primary-900 font-bold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {guarantee}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 lg:mb-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl p-4 lg:p-6 shadow-medium border-2 transition-all duration-500 hover:shadow-strong hover:-translate-y-3 group h-full flex flex-col hover-lift ${
                plan.highlighted 
                  ? 'border-accent-500 ring-2 ring-accent-500/20' 
                  : 'border-gray-200 hover:border-accent-500/50'
              }`}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                  {plan.badge}
                </div>
              )}
              
              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 
                  className="text-lg lg:text-xl font-bold text-primary-900 mb-3"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span 
                    className="text-3xl lg:text-4xl font-extrabold text-primary-900"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {plan.price}
                  </span>
                  <span 
                    className="text-gray-600 ml-1 font-medium text-base"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {plan.unit}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </div>
                    <span 
                      className="text-gray-600 font-medium leading-relaxed text-sm lg:text-base"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-auto">
                <button 
                onClick={plan.action}
                className={`w-full px-4 py-3 font-bold rounded-xl transition-all duration-300 transform group-hover:scale-105 text-sm flex items-center justify-center space-x-2 shadow-soft hover:shadow-medium ${
                  plan.highlighted
                    ? 'bg-accent-500 text-white hover:bg-accent-600'
                    : 'bg-primary-900 text-white hover:bg-primary-800'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <span>{plan.cta}</span>
              </button>
              </div>
            </div>
          ))}
        </div>


        {/* Enterprise Fallback Message */}
        <div className="max-w-4xl mx-auto mb-10 lg:mb-12">
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-200 text-center relative overflow-hidden">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F97C0C] to-transparent"></div>
            
            <div className="space-y-3 lg:space-y-4">
              <h3 
                className="text-base sm:text-lg lg:text-xl font-bold text-[#1F2E45] flex items-center justify-center space-x-2"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                <span>💼</span>
                <span>Need more than 300 calls per month?</span>
              </h3>
              <p 
                className="text-sm lg:text-base text-[#555555] font-medium max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                We offer custom enterprise solutions tailored to your call volume and business needs.
              </p>
              
              {/* Contact CTA */}
              <div className="pt-2">
                <button 
                  onClick={handleTalkToSales}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1F2E45] text-white font-bold rounded-xl hover:bg-[#2A3F5F] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="text-sm sm:text-base">Contact us to configure your system</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Fee Section - Enhanced Visibility */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-200 relative overflow-hidden">
            {/* Subtle accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F97C0C] to-[#4CAF50]"></div>
            
            <div className="text-center space-y-4">
              <h3 
                className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1F2E45]"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                One-time setup fee: $199
              </h3>
              <div className="max-w-4xl mx-auto">
                <p 
                  className="text-sm lg:text-base text-[#555555] font-medium leading-relaxed"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  This covers the full activation of your FieldCall™ agent — including custom voice identity, CRM sync, calendar integration, and full testing before go-live. You'll also be assigned a dedicated onboarding specialist who will guide you personally from setup to launch, ensuring your agent sounds right, performs right, and starts booking jobs fast.
                </p>
              </div>
              
              {/* Value indicators */}
              <div className="flex flex-wrap justify-center gap-3 lg:gap-4 pt-3">
                {[
                  "Custom voice identity",
                  "CRM sync setup", 
                  "Calendar integration",
                  "Full testing & optimization",
                  "Dedicated onboarding specialist"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-[#F97C0C] rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" strokeWidth={3} />
                    </div>
                    <span 
                      className="text-xs sm:text-sm font-semibold text-[#1F2E45]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;