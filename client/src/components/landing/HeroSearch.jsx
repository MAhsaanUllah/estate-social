import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronDown, Building, DollarSign } from 'lucide-react';
import Button from '../ui/Button';

function CustomDropdown({ label, value, options, onChange, icon: Icon, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || { label: placeholder };

  return (
    <div
      className={`flex-1 flex flex-col justify-center px-4 py-3 relative cursor-pointer border-r border-gray-200 dark:border-zinc-800 last:border-r-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors duration-200 ease-out select-none ${isOpen ? 'z-50' : 'z-20'}`}
      ref={dropdownRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center text-gray-500 dark:text-zinc-400 mb-1 space-x-1">
        {Icon && <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold truncate ${value ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-500 dark:text-zinc-400'}`}>
          {selectedOption.label}
        </span>
        <ChevronDown className={`h-4 w-4 ml-1 text-gray-500 dark:text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 min-w-[170px] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden z-50 py-1.5 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-150 flex items-center justify-between ${value === opt.value ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeroSearch() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('buy'); // buy or rent
  const [searchParams, setSearchParams] = useState({
    city: 'Lahore',
    society: '',
    propertyType: '',
    priceMax: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    query.append('purpose', mode === 'buy' ? 'Sale' : 'Rent');
    if (searchParams.city) query.append('city', searchParams.city);
    if (searchParams.society) query.append('society', searchParams.society);
    if (searchParams.propertyType) query.append('propertyType', searchParams.propertyType);
    if (searchParams.priceMax) query.append('priceMax', searchParams.priceMax);
    navigate(`/properties?${query.toString()}`);
  };

  const cities = [
    { value: 'Lahore', label: 'Lahore' },
    { value: 'Karachi', label: 'Karachi' },
    { value: 'Islamabad', label: 'Islamabad' },
    { value: 'Gujranwala', label: 'Gujranwala' },
    { value: 'Faisalabad', label: 'Faisalabad' },
    { value: 'Sialkot', label: 'Sialkot' },
  ];

  const types = [
    { value: '', label: 'Any Property' },
    { value: 'House', label: 'House' },
    { value: 'Plot', label: 'Plot' },
    { value: 'Commercial', label: 'Commercial' },
  ];

  const prices = [
    { value: '', label: 'Any Budget' },
    { value: '5000000', label: '50 Lakh' },
    { value: '10000000', label: '1 Crore' },
    { value: '25000000', label: '2.5 Crore' },
    { value: '50000000', label: '5 Crore' },
    { value: '100000000', label: '10 Crore+' },
  ];

  return (
    <section className="relative h-[65vh] min-h-[480px] flex flex-col items-center justify-center pt-16 z-30">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop" 
          alt="Beautiful Home in Pakistan" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-30 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-white/15 dark:bg-black/30 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 mb-4 text-xs font-semibold text-white tracking-wide uppercase">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Pakistan's 1st Verified Social Real Estate Portal</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 drop-shadow-md leading-tight">
          Direct Owner Properties & Verified Realtors
        </h1>
        <p className="text-sm sm:text-base text-gray-100 mb-6 font-medium drop-shadow max-w-2xl mx-auto">
          Buy, sell, or rent with <span className="font-bold text-white underline decoration-emerald-400">0% Commission</span> on direct owner listings, or connect with DHA/LDA verified agents via instant WhatsApp.
        </p>

        {/* Search Card Container */}
        <div className="relative z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-zinc-800 p-2.5 md:p-3 mx-auto max-w-4xl">
          
          {/* Tabs */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex space-x-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl w-max">
              <button 
                type="button"
                onClick={() => setMode('buy')}
                className={`px-5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${mode === 'buy' ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
              >
                Buy
              </button>
              <button 
                type="button"
                onClick={() => setMode('rent')}
                className={`px-5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${mode === 'rent' ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
              >
                Rent
              </button>
            </div>

            <span className="hidden sm:inline-flex text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
              ⚡ 0% Broker Commission on Owner Listings
            </span>
          </div>

          <form onSubmit={handleSearch} className="relative z-30 flex flex-col md:flex-row border border-gray-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-visible">
            
            <CustomDropdown 
              label="City" 
              value={searchParams.city} 
              options={cities} 
              onChange={(val) => setSearchParams({...searchParams, city: val})} 
              icon={MapPin}
              placeholder="Select City"
            />

            <div className="flex-1 flex flex-col justify-center px-4 py-3 border-r border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors duration-200">
              <div className="flex items-center text-gray-500 dark:text-zinc-400 mb-1 space-x-1">
                <Search className="h-4 w-4" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Society / Area</span>
              </div>
              <input 
                type="text" 
                placeholder="e.g. DHA Phase 6, Bahria Town" 
                className="w-full text-sm text-gray-900 dark:text-zinc-100 font-medium focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500 bg-transparent"
                value={searchParams.society}
                onChange={(e) => setSearchParams({...searchParams, society: e.target.value})}
              />
            </div>

            <CustomDropdown 
              label="Type" 
              value={searchParams.propertyType} 
              options={types} 
              onChange={(val) => setSearchParams({...searchParams, propertyType: val})} 
              icon={Building}
              placeholder="Any Type"
            />

            <CustomDropdown 
              label="Budget" 
              value={searchParams.priceMax} 
              options={prices} 
              onChange={(val) => setSearchParams({...searchParams, priceMax: val})} 
              icon={DollarSign}
              placeholder="Any Budget"
            />

            <div className="p-1">
              <Button 
                type="submit" 
                variant="primary"
                className="w-full md:w-32 h-12 rounded-xl text-sm font-bold shadow-md"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Society Tags */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white">
          <span className="text-gray-200 text-xs font-semibold">Popular Societies:</span>
          {['DHA Phase 6 (LHE)', 'Bahria Town (KHI)', 'Sector F-7 (ISB)', 'Gulberg Greens', 'Lake City'].map((soc) => (
            <button
              key={soc}
              type="button"
              onClick={() => {
                navigate(`/properties?society=${encodeURIComponent(soc.split(' ')[0])}`);
              }}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg transition-colors font-medium text-[11px]"
            >
              {soc}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
