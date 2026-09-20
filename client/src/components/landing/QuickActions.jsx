import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Key, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

export default function QuickActions() {
  return (
    <section className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-5">
        
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200/80 dark:border-zinc-800 flex flex-col items-center text-center transition-all duration-200 ease-out hover:shadow-md dark:hover:shadow-zinc-950/40 relative overflow-hidden group">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              0% Commission
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-800 p-3.5 rounded-xl text-gray-900 dark:text-zinc-100 mb-5 border border-gray-200/50 dark:border-zinc-700 group-hover:scale-105 transition-transform">
            <Home className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-2">Direct Owner Homes</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed max-w-xs">
            Connect directly with verified property owners across Lahore, Karachi & Islamabad. Save lakhs in broker fees.
          </p>
          <Link to="/properties?listedBy=owner" className="mt-auto w-full">
            <Button variant="secondary" className="w-full h-10 rounded-xl text-xs font-semibold">
              Browse Owner Listings
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200/80 dark:border-zinc-800 flex flex-col items-center text-center transition-all duration-200 ease-out hover:shadow-md dark:hover:shadow-zinc-950/40 relative overflow-hidden group">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
              🛡️ Blue Shield
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-800 p-3.5 rounded-xl text-gray-900 dark:text-zinc-100 mb-5 border border-gray-200/50 dark:border-zinc-700 group-hover:scale-105 transition-transform">
            <Key className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-2">Verified Realtors</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed max-w-xs">
            Explore premium houses, luxury apartments, and commercial plazas from DHA & CDA registered real estate agencies.
          </p>
          <Link to="/properties" className="mt-auto w-full">
            <Button variant="secondary" className="w-full h-10 rounded-xl text-xs font-semibold">
              Explore Verified Feed
            </Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200/80 dark:border-zinc-800 flex flex-col items-center text-center transition-all duration-200 ease-out hover:shadow-md dark:hover:shadow-zinc-950/40 relative overflow-hidden group">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
              Free Listing
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-zinc-800 p-3.5 rounded-xl text-gray-900 dark:text-zinc-100 mb-5 border border-gray-200/50 dark:border-zinc-700 group-hover:scale-105 transition-transform">
            <TrendingUp className="h-6 w-6 text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-2">Sell / Rent In Minutes</h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed max-w-xs">
            Post your property in 2 minutes with YouTube video tour, room specs, and receive instant direct WhatsApp buyer inquiries.
          </p>
          <Link to="/add-property" className="mt-auto w-full">
            <Button variant="primary" className="w-full h-10 rounded-xl text-xs font-semibold">
              + Post Your Property Free
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
