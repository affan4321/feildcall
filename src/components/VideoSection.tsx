import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

const VideoSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F97C0C' fill-opacity='0.2'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="text-center space-y-10 lg:space-y-12">
            {/* Section Header */}
            <div className="space-y-4 lg:space-y-6">
              <h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F2E45] leading-tight tracking-tight"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                What is FieldCall™?
              </h2>
              <p 
                className="text-lg sm:text-xl lg:text-2xl text-[#555555] font-semibold max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Watch the 55-second overview that explains everything.
              </p>
            </div>

            {/* Video Thumbnail with Play Button */}
            <div className="relative max-w-3xl mx-auto">
              <div className="relative group cursor-pointer" onClick={openModal}>
                {/* Video Thumbnail Container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1F2E45] to-[#2A3F5F] aspect-video">
                  {/* YouTube Thumbnail */}
                  <img 
                    src="https://img.youtube.com/vi/IU9NqkRB3yc/maxresdefault.jpg"
                    alt="FieldCall™ Overview - 24/7 Voice AI for Contractors"
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
                      <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                        <Play className="w-8 h-8 lg:w-10 lg:h-10 text-[#F97C0C] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-2 rounded text-base font-semibold">
                    0:55
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#F97C0C]/50 transition-all duration-300"></div>
              </div>

              {/* Call to action below video */}
              <div className="mt-6 lg:mt-8">
                <p 
                  className="text-base lg:text-lg text-[#555555] font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Click to watch how FieldCall™ transforms your business
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>
            
            {/* Video Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
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
    </>
  );
};

export default VideoSection;