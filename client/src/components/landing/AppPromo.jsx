import React from 'react';

export default function AppPromo() {
  return (
    <section className="bg-gray-50 py-16 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="z-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Get the EstateSocial App
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Search properties, connect with agents, and manage your favorites on the go. The fastest way to find your next home.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-black transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 22.8 184.9 2.5 273.7c-21.7 94.6 52.4 220.4 104 220.4 24.3 0 39.5-16.7 67.5-16.7 28.5 0 41.5 16.7 68.2 16.7 52.2 0 102.7-101.4 102.7-101.4-1.2-.5-26.1-9.9-26.2-36.2zm-120.6-218c21.8-26.7 34.6-58.3 30.6-90.7-25.2 1-54.8 15.3-73.6 35.5-21.4 23.1-36.2 55.4-31.5 86.8 28.1 2.2 52.7-11.6 74.5-31.6z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">Download on the</div>
                  <div className="text-lg font-bold leading-tight">App Store</div>
                </div>
              </button>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-black transition-colors">
                <svg className="w-8 h-8" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-bold opacity-80">Get it on</div>
                  <div className="text-lg font-bold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative h-64 md:h-96">
            <img 
              src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&h=800&fit=crop" 
              alt="App Screen Placeholder" 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-80 rounded-[2.5rem] shadow-2xl border-[8px] border-gray-900 object-cover rotate-12 z-0"
            />
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop" 
              alt="App Screen Mockup" 
              className="absolute left-0 lg:left-12 top-1/2 -translate-y-1/2 w-64 md:w-80 rounded-[2.5rem] shadow-2xl border-[8px] border-gray-900 object-cover -rotate-6 z-10"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

