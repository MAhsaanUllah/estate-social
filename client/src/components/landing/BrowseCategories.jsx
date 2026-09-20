import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MapPin, Building, ChevronRight } from 'lucide-react';

export default function BrowseCategories() {
  const navigate = useNavigate();

  // Active tab state for each category card
  const [homesTab, setHomesTab] = useState('popular'); // 'popular' | 'type' | 'size'
  const [plotsTab, setPlotsTab] = useState('popular');
  const [commercialTab, setCommercialTab] = useState('popular');

  const handleNavigate = (params) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        query.append(key, val);
      }
    });
    navigate(`/properties?${query.toString()}`);
  };

  // Preset Data for Homes
  const homesPresets = {
    popular: [
      { title: '5 Marla Houses', sub: 'Popular Choice', params: { propertyType: 'House', minSize: 5, maxSize: 5 } },
      { title: '10 Marla Houses', sub: 'Family Homes', params: { propertyType: 'House', minSize: 10, maxSize: 10 } },
      { title: '1 Kanal Villas', sub: 'Luxury Living', params: { propertyType: 'House', minSize: 1, maxSize: 1 } },
      { title: 'On Installments', sub: 'Easy Payment', params: { propertyType: 'House', isInstallment: 'true' } },
      { title: 'Budget Houses', sub: 'Under 1.5 Cr', params: { propertyType: 'House', maxPrice: 15000000 } },
      { title: '3 Marla Homes', sub: 'Compact Living', params: { propertyType: 'House', minSize: 3, maxSize: 3 } },
    ],
    type: [
      { title: 'Independent House', sub: 'Full Property', params: { propertyType: 'House' } },
      { title: 'Upper Portion', sub: 'Rental / Buy', params: { propertyType: 'House', search: 'Upper Portion' } },
      { title: 'Lower Portion', sub: 'Ground Floor', params: { propertyType: 'House', search: 'Lower Portion' } },
      { title: 'Modern Apartments', sub: 'Flats & Suites', params: { propertyType: 'House', search: 'Apartment' } },
      { title: 'Farm House', sub: 'Country Side', params: { propertyType: 'House', search: 'Farm' } },
      { title: 'Penthouse', sub: 'Top Floor Sky', params: { propertyType: 'House', search: 'Penthouse' } },
    ],
    size: [
      { title: '3 Marla', sub: '675 Sq.Ft.', params: { propertyType: 'House', minSize: 3, maxSize: 3 } },
      { title: '5 Marla', sub: '1,125 Sq.Ft.', params: { propertyType: 'House', minSize: 5, maxSize: 5 } },
      { title: '7 Marla', sub: '1,575 Sq.Ft.', params: { propertyType: 'House', minSize: 7, maxSize: 7 } },
      { title: '10 Marla', sub: '2,250 Sq.Ft.', params: { propertyType: 'House', minSize: 10, maxSize: 10 } },
      { title: '1 Kanal', sub: '4,500 Sq.Ft.', params: { propertyType: 'House', minSize: 1, maxSize: 1 } },
      { title: '2 Kanal+', sub: '9,000 Sq.Ft.', params: { propertyType: 'House', minSize: 2 } },
    ]
  };

  // Preset Data for Plots
  const plotsPresets = {
    popular: [
      { title: '5 Marla Residential', sub: 'Best Investment', params: { propertyType: 'Plot', minSize: 5, maxSize: 5 } },
      { title: '10 Marla Residential', sub: 'DHA / Bahria', params: { propertyType: 'Plot', minSize: 10, maxSize: 10 } },
      { title: '1 Kanal Residential', sub: 'Estate Plot', params: { propertyType: 'Plot', minSize: 1, maxSize: 1 } },
      { title: 'On Installments', sub: 'Booking Open', params: { propertyType: 'Plot', isInstallment: 'true' } },
      { title: 'Commercial Plots', sub: 'High Footfall', params: { propertyType: 'Plot', search: 'Commercial' } },
      { title: 'Corner Plots', sub: 'Double Front', params: { propertyType: 'Plot', search: 'Corner' } },
    ],
    type: [
      { title: 'Residential Plots', sub: 'Housing Societies', params: { propertyType: 'Plot' } },
      { title: 'Commercial Plots', sub: 'Plazas & Shops', params: { propertyType: 'Plot', search: 'Commercial' } },
      { title: 'Industrial Land', sub: 'Warehouses', params: { propertyType: 'Plot', search: 'Industrial' } },
      { title: 'Agricultural Land', sub: 'Farm Lands', params: { propertyType: 'Plot', search: 'Agricultural' } },
      { title: 'Files & Booking', sub: 'New Societies', params: { propertyType: 'Plot', search: 'File' } },
      { title: 'Possession Plots', sub: 'Ready to Build', params: { propertyType: 'Plot', search: 'Possession' } },
    ],
    size: [
      { title: '5 Marla', sub: 'Res Plot', params: { propertyType: 'Plot', minSize: 5, maxSize: 5 } },
      { title: '10 Marla', sub: 'Res Plot', params: { propertyType: 'Plot', minSize: 10, maxSize: 10 } },
      { title: '1 Kanal', sub: 'Res Plot', params: { propertyType: 'Plot', minSize: 1, maxSize: 1 } },
      { title: '4 Marla Commercial', sub: 'Plaza Plot', params: { propertyType: 'Plot', minSize: 4, maxSize: 4 } },
      { title: '8 Marla Commercial', sub: 'Boulevard Plot', params: { propertyType: 'Plot', minSize: 8, maxSize: 8 } },
      { title: '4 Kanal+', sub: 'Land / Mega', params: { propertyType: 'Plot', minSize: 4 } },
    ]
  };

  // Preset Data for Commercial
  const commercialPresets = {
    popular: [
      { title: 'Plaza Shops', sub: 'Ground Floor', params: { propertyType: 'Commercial', search: 'Shop' } },
      { title: 'Corporate Offices', sub: 'Business Hub', params: { propertyType: 'Commercial', search: 'Office' } },
      { title: 'On Installments', sub: 'New Plazas', params: { propertyType: 'Commercial', isInstallment: 'true' } },
      { title: 'Running Businesses', sub: 'Rental Income', params: { propertyType: 'Commercial', search: 'Running' } },
      { title: 'Small Offices', sub: 'Startups & SMEs', params: { propertyType: 'Commercial', maxSize: 500 } },
      { title: 'Mezzanine Floors', sub: 'Retail Display', params: { propertyType: 'Commercial', search: 'Mezzanine' } },
    ],
    type: [
      { title: 'Retail Shops', sub: 'Markets & Malls', params: { propertyType: 'Commercial', search: 'Shop' } },
      { title: 'Office Space', sub: 'Commercial Floors', params: { propertyType: 'Commercial', search: 'Office' } },
      { title: 'Full Plazas', sub: 'Multi-story', params: { propertyType: 'Commercial', search: 'Plaza' } },
      { title: 'Warehouses', sub: 'Storage & Hub', params: { propertyType: 'Commercial', search: 'Warehouse' } },
      { title: 'Food Court Units', sub: 'Restaurants', params: { propertyType: 'Commercial', search: 'Food' } },
      { title: 'Showrooms', sub: 'Main Boulevard', params: { propertyType: 'Commercial', search: 'Showroom' } },
    ],
    size: [
      { title: 'Under 300 SqFt', sub: 'Small Kiosk/Shop', params: { propertyType: 'Commercial', maxSize: 300 } },
      { title: '300 - 600 SqFt', sub: 'Standard Shop', params: { propertyType: 'Commercial', minSize: 300, maxSize: 600 } },
      { title: '600 - 1200 SqFt', sub: 'Corporate Suite', params: { propertyType: 'Commercial', minSize: 600, maxSize: 1200 } },
      { title: '1200 - 2500 SqFt', sub: 'Half Floor', params: { propertyType: 'Commercial', minSize: 1200, maxSize: 2500 } },
      { title: '2500 - 5000 SqFt', sub: 'Full Floor', params: { propertyType: 'Commercial', minSize: 2500, maxSize: 5000 } },
      { title: '5000+ SqFt', sub: 'Full Building', params: { propertyType: 'Commercial', minSize: 5000 } },
    ]
  };

  return (
    <section className="py-10 md:py-16 bg-surface-muted dark:bg-zinc-950 border-t border-gray-200/80 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
              Browse Properties by Category
            </h2>
            <p className="text-[15px] text-gray-500 dark:text-zinc-400 mt-1">
              Filter by popular presets, property types, and specific area sizes
            </p>
          </div>
          <Link 
            to="/properties" 
            className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-zinc-100 hover:underline transition-colors"
          >
            Explore All Properties <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* 3 Main Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CARD 1: HOMES */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
            <div>
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl border border-emerald-200/50 dark:border-emerald-900/50">
                  <Home className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">Homes & Houses</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Villas, independent houses & flats</p>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-zinc-800 mb-4 pb-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setHomesTab('popular')}
                  className={`pb-1 transition-colors ${homesTab === 'popular' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setHomesTab('type')}
                  className={`pb-1 transition-colors ${homesTab === 'type' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setHomesTab('size')}
                  className={`pb-1 transition-colors ${homesTab === 'size' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Area Size
                </button>
              </div>

              {/* Preset Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
                {homesPresets[homesTab].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleNavigate(item.params)}
                    className="p-3 bg-gray-50/80 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl text-left transition-colors duration-200 group"
                  >
                    <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100 block truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 block truncate mt-0.5">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 2: PLOTS */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
            <div>
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 p-2.5 rounded-xl border border-blue-200/50 dark:border-blue-900/50">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">Plots & Lands</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Residential, commercial & files</p>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-zinc-800 mb-4 pb-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPlotsTab('popular')}
                  className={`pb-1 transition-colors ${plotsTab === 'popular' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setPlotsTab('type')}
                  className={`pb-1 transition-colors ${plotsTab === 'type' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setPlotsTab('size')}
                  className={`pb-1 transition-colors ${plotsTab === 'size' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Area Size
                </button>
              </div>

              {/* Preset Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
                {plotsPresets[plotsTab].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleNavigate(item.params)}
                    className="p-3 bg-gray-50/80 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl text-left transition-colors duration-200 group"
                  >
                    <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100 block truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 block truncate mt-0.5">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3: COMMERCIAL */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
            <div>
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 p-2.5 rounded-xl border border-purple-200/50 dark:border-purple-900/50">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">Commercial</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Shops, offices & plazas</p>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex items-center space-x-2 border-b border-gray-100 dark:border-zinc-800 mb-4 pb-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCommercialTab('popular')}
                  className={`pb-1 transition-colors ${commercialTab === 'popular' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Popular
                </button>
                <button
                  type="button"
                  onClick={() => setCommercialTab('type')}
                  className={`pb-1 transition-colors ${commercialTab === 'type' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setCommercialTab('size')}
                  className={`pb-1 transition-colors ${commercialTab === 'size' ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'}`}
                >
                  Area Size
                </button>
              </div>

              {/* Preset Chips Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
                {commercialPresets[commercialTab].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleNavigate(item.params)}
                    className="p-3 bg-gray-50/80 dark:bg-zinc-800/40 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200/60 dark:border-zinc-800 rounded-xl text-left transition-colors duration-200 group"
                  >
                    <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100 block truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-zinc-400 block truncate mt-0.5">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

