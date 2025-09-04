import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I know this works?",
      answer: "You don't — until you call the demo. Try it now: (888) 440-9613"
    },
    {
      question: "What if I'm not ready for a monthly plan?",
      answer: "Start with Pay-as-you-go. No commitments. $2.60 per call. That's it."
    },
    {
      question: "Do I need to set anything up?",
      answer: "Just fill the form. We configure your agent, test it, and activate it."
    },
    {
      question: "When do I pay?",
      answer: "For PayG: only after you reach $100 in usage. For plans: you're billed at sign-up."
    },
    {
      question: "Can I cancel?",
      answer: "Anytime. No contract."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 animate-float">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97C0C' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

      <div className="relative max-w-4xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 lg:mb-24 animate-fade-in">
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 mb-6 lg:mb-8 text-shadow-sm"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Frequently asked questions
          </h2>
          <p 
            className="text-lg sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Everything you need to know about getting started with FieldCall™
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 lg:space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl shadow-medium border border-gray-200 hover:shadow-strong transition-all duration-500 hover:-translate-y-2 overflow-hidden h-auto hover-lift"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 lg:px-10 py-6 lg:py-8 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-300"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 
                  className="text-base sm:text-lg lg:text-xl font-bold text-primary-900 group-hover:text-accent-500 transition-colors duration-300 pr-4 leading-relaxed"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  {faq.question}
                </h3>
                
                {/* Enhanced Icon Container */}
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-accent-500 transition-all duration-300 group-hover:shadow-soft">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                  ) : (
                    <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                  )}
                </div>
              </button>

              {/* Answer Content with Smooth Animation */}
              <div 
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 lg:px-10 pb-6 lg:pb-8 border-t border-gray-100">
                  <div className="pt-6 lg:pt-8">
                    <p 
                      className="text-gray-600 leading-relaxed font-medium text-base lg:text-lg"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 lg:mt-24 text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-strong border border-gray-200 relative overflow-hidden hover-lift">
            {/* Subtle accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-green-500"></div>
            
            <div className="space-y-8 lg:space-y-10">
              <h3 
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Still have questions?
              </h3>
              <p 
                className="text-base lg:text-lg text-gray-600 font-medium max-w-2xl mx-auto"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                The fastest way to get answers is to hear FieldCall™ in action.
              </p>
              
              {/* CTA Button */}
              <div className="pt-6 lg:pt-8">
                <a 
                  href="tel:+18884409613"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-accent-500 text-white font-bold rounded-xl hover:bg-accent-600 transition-all duration-300 transform hover:scale-105 shadow-medium hover:shadow-glow group"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="text-base sm:text-lg">Call For Demo</span>
                  <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;