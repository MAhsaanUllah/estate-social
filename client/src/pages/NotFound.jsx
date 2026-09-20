import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, Search, ArrowLeft, Building2, Calculator, Users, 
  HelpCircle, Sparkles, MapPin, Compass
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

function NotFound() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/properties');
    }
  };

  const quickLinks = [
    {
      title: 'Browse All Properties',
      desc: 'Explore houses, plots & commercial plazas in top societies',
      href: '/properties',
      icon: Building2,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Property Calculators',
      desc: 'Home loan EMI, construction cost 2026 & unit converter',
      href: '/loan-calculator',
      icon: Calculator,
      color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Verified Agents Directory',
      desc: 'Connect directly with FBR & society registered realtors',
      href: '/agents',
      icon: Users,
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Help & Safety Center',
      desc: 'Legal verification guidelines, FBR tax info & FAQs',
      href: '/help',
      icon: HelpCircle,
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="min-h-[85vh] bg-gray-50 dark:bg-[#090E17] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>404 - Page Not Found | EstateSocial</title>
        <meta name="description" content="The page you are looking for does not exist on EstateSocial." />
      </Helmet>

      <div className="max-w-3xl w-full text-center">
        
        {/* Animated 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold uppercase tracking-widest mb-4">
          <Compass className="h-4 w-4 text-emerald-600 animate-spin" />
          <span>Error 404 • Destination Lost</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
          4<span className="text-emerald-600 dark:text-emerald-400">0</span>4
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-zinc-100 mt-2">
          Page Not Found in Housing Matrix
        </h2>

        <p className="text-gray-600 dark:text-zinc-400 mt-2 mb-8 max-w-lg mx-auto text-sm sm:text-base">
          The property listing or page you are looking for might have been sold, renamed, or relocated. Let's get you back on track!
        </p>

        {/* Quick Search Box */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-10">
          <div className="relative flex items-center bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-1.5 shadow-md">
            <Search className="h-5 w-5 text-gray-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search society, city, plot, or commercial..."
              className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex-shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick Links Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-10">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                to={link.href}
                className="bg-white dark:bg-[#0B111E] p-4 rounded-2xl border border-gray-200/80 dark:border-zinc-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-md transition-all group flex items-start gap-3.5"
              >
                <div className={`p-2.5 rounded-xl ${link.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {link.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-xl font-bold text-xs transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default NotFound;
