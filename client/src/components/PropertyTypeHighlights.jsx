import React from 'react';
import { 
  Building2, Home, MapPin, Warehouse, DollarSign, TrendingUp, 
  Layers, Navigation, Car, Zap, ShieldCheck, CheckCircle2, 
  Sparkles, Bed, Bath, UtensilsCrossed, Sun, Maximize2, FileText,
  Flame, KeyRound, Compass
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function PropertyTypeHighlights({ listing }) {
  if (!listing) return null;

  const type = listing.propertyType || 'House';
  const isCommercial = type === 'Commercial' || type === 'Office' || type === 'Shop' || type === 'Building';
  const isPlot = type === 'Plot' || type === 'Land';
  const isApartment = type === 'Flat' || type === 'Apartment' || type === 'Penthouse';
  const isHouse = type === 'House' || type === 'Villa' || type === 'Farmhouse';

  return (
    <div className="space-y-6">

      {/* ========================================================
          1. COMMERCIAL PROPERTY HIGHLIGHTS
      ======================================================== */}
      {isCommercial && (
        <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent dark:from-amber-950/30 dark:via-emerald-950/20 border-2 border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-black font-extrabold text-xs px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Commercial Asset
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> High Rental Yield
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                Commercial Investment & Building Specifications
              </h2>
            </div>
            
            {listing.rentalIncome && (
              <div className="bg-white dark:bg-zinc-900 border border-amber-500/30 rounded-xl px-4 py-2 text-right">
                <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400">Monthly Rental Income</p>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(listing.rentalIncome)} <span className="text-xs font-normal text-gray-500">/mo</span>
                </p>
              </div>
            )}
          </div>

          {/* Commercial Grid Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-xl border border-gray-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <Layers className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Floors</span>
              </div>
              <p className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                {listing.totalFloors || 'Triple Storey + Lower Ground'}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-xl border border-gray-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Navigation className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Road Exposure</span>
              </div>
              <p className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                {listing.roadWidth || '150 Ft Main Boulevard'}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-xl border border-gray-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <Car className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Customer Parking</span>
              </div>
              <p className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                {listing.parkingCapacity || '15+ Dedicated Bays'}
              </p>
            </div>

            <div className="bg-white/80 dark:bg-zinc-900/80 p-4 rounded-xl border border-gray-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Standby Power</span>
              </div>
              <p className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                {listing.powerBackup || '100% Generator Backup'}
              </p>
            </div>
          </div>

          {/* Verified Commercial Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-gray-200/60 dark:border-zinc-800 font-medium text-gray-700 dark:text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Fire Safety Certified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-gray-200/60 dark:border-zinc-800 font-medium text-gray-700 dark:text-zinc-300">
              <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>Capsule Passenger Lift</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-gray-200/60 dark:border-zinc-800 font-medium text-gray-700 dark:text-zinc-300">
              <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span>Double Glass Facade</span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-gray-200/60 dark:border-zinc-800 font-medium text-gray-700 dark:text-zinc-300">
              <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <span>Commercial NOC Approved</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. RESIDENTIAL HOUSE / VILLA HIGHLIGHTS
      ======================================================== */}
      {isHouse && (
        <div className="bg-white dark:bg-[#0B111E] border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-emerald-600" />
            <span>Residential Living & Room Layout</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <Bed className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Bedrooms</span>
              </div>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg">
                {listing.beds || 5} <span className="text-xs font-normal text-gray-500">Master Suites</span>
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                <Bath className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Bathrooms</span>
              </div>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg">
                {listing.baths || 6} <span className="text-xs font-normal text-gray-500">En-suite</span>
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                <UtensilsCrossed className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Kitchens</span>
              </div>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg">
                {listing.kitchens || 2} <span className="text-xs font-normal text-gray-500">Dirty & Clean</span>
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                <Car className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">Parking Porch</span>
              </div>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg">
                {listing.carParking || '2 - 3 Cars'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Solar System (10-15kW)</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <KeyRound className="h-4 w-4 text-blue-500" />
              <span>Servant Quarter + Bath</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>A+ Construction Standard</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-purple-500" />
              <span>Solid Wood Doors & Tiles</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. PLOTS & LAND HIGHLIGHTS
      ======================================================== */}
      {isPlot && (
        <div className="bg-white dark:bg-[#0B111E] border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-600" />
            <span>Plot Coordinates & Legal Possession Status</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Possession Status</p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-zinc-100 mt-1">
                {listing.possessionStatus || 'Immediate Ready Possession'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Ready for immediate house construction</p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">Plot Dimension</p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-zinc-100 mt-1">
                {listing.dimensions || (listing.sizeUnit === 'Kanal' ? '50 x 90 Feet' : '35 x 65 Feet')}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Standard Society Dimension</p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase">Registry & Title</p>
              <p className="text-lg font-extrabold text-gray-900 dark:text-zinc-100 mt-1">
                100% Clear Title
              </p>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">DHA / Society Verified Transfer Letter</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Underground Electricity</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Sui Gas Line Connected</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Water Supply & Sewerage</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>60 - 80 Ft Wide Road</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. APARTMENT / PENTHOUSE HIGHLIGHTS
      ======================================================== */}
      {isApartment && (
        <div className="bg-white dark:bg-[#0B111E] border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            <span>Apartment Living & Building Amenities</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Floor Level</p>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg mt-1">
                {listing.floorLevel || 'Top Floor Corner'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">View</p>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg mt-1">
                {listing.viewType || 'Margalla / Skyline'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Parking</p>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg mt-1">
                Dedicated Basement
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-zinc-900/60 p-4 rounded-xl border border-gray-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Elevators</p>
              <p className="font-extrabold text-gray-900 dark:text-zinc-100 text-lg mt-1">
                24/7 Dual Backup
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Biometric Entrance</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>Rooftop Gym & Lounge</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>100% Generator Backup</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-900/40 p-2.5 rounded-lg font-medium text-gray-700 dark:text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
              <span>Dedicated Maintenance Staff</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
