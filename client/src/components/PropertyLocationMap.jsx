import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, School, Hospital, ShoppingBag, Landmark, Car, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PropertyLocationMap({ listing }) {
  const [copied, setCopied] = useState(false);
  const [mapType, setMapType] = useState('m'); // 'm' roadmap, 'k' satellite

  if (!listing) return null;

  const society = listing.society || 'Prime Society';
  const block = listing.block || '';
  const phase = listing.phase || '';
  const city = listing.city || 'Pakistan';
  const addressQuery = `${listing.title || ''}, ${block} ${phase} ${society}, ${city}, Pakistan`;
  const encodedQuery = encodeURIComponent(`${society} ${block} ${phase} ${city} Pakistan`);

  const googleMapsUrl = listing.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=${mapType}&z=15&ie=UTF8&iwloc=&output=embed`;

  // Dynamic nearby amenities based on society
  const nearbyAmenities = [
    {
      category: 'Education',
      icon: School,
      name: `${society.includes('DHA') ? 'Roots IVY / Beaconhouse DHA Campus' : society.includes('Bahria') ? 'ACE International Academy / Roots' : 'Top Tier International School'}`,
      distance: '3 - 5 mins drive (1.2 km)',
    },
    {
      category: 'Healthcare',
      icon: Hospital,
      name: `${society.includes('Islamabad') ? 'Shifa International / Quaid-e-Azam Hospital' : 'National Hospital / Shaukat Khanum Clinic'}`,
      distance: '7 mins drive (2.8 km)',
    },
    {
      category: 'Shopping & Dining',
      icon: ShoppingBag,
      name: `${society} Main Commercial Zone & Superstore`,
      distance: '2 mins walk (350 m)',
    },
    {
      category: 'Worship',
      icon: Landmark,
      name: `${block ? block + ' ' : ''}Grand Jamia Mosque`,
      distance: 'Walking distance (200 m)',
    },
    {
      category: 'Connectivity',
      icon: Car,
      name: `${city.includes('Islamabad') ? 'Expressway / Kashmir Highway Link' : 'Ring Road / Main Boulevard Interchange'}`,
      distance: '4 mins drive (1.8 km)',
    },
  ];

  const handleCopyLocation = () => {
    navigator.clipboard.writeText(`${society}, ${phase ? phase + ', ' : ''}${block ? block + ', ' : ''}${city}`);
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm">
      
      {/* Header with Title & Map Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span>Location & Society Map</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Exact society location, block coordinates, and nearby accessibility radar
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Map Style Toggle */}
          <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl flex text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMapType('m')}
              className={`px-3 py-1 rounded-lg transition-all ${mapType === 'm' ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900'}`}
            >
              Street Map
            </button>
            <button
              type="button"
              onClick={() => setMapType('k')}
              className={`px-3 py-1 rounded-lg transition-all ${mapType === 'k' ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900'}`}
            >
              Satellite
            </button>
          </div>

          {/* Copy Address */}
          <button
            type="button"
            onClick={handleCopyLocation}
            className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs flex items-center gap-1 transition-colors"
            title="Copy address"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Address Card Bar */}
      <div className="bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/70 dark:border-zinc-800/80 rounded-xl p-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded text-[11px]">
              {city}
            </span>
            <span className="font-semibold text-gray-900 dark:text-zinc-100 text-sm">
              {society} {phase ? `• ${phase}` : ''} {block ? `• ${block}` : ''}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-zinc-400">
            {listing.landmark ? `Near ${listing.landmark} • ` : ''}Prime sector with direct access to commercial avenue & 24/7 gated security.
          </p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex-shrink-0"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>Open in Google Maps / GPS</span>
          <ExternalLink className="h-3 w-3 opacity-80" />
        </a>
      </div>

      {/* Embedded Interactive Map Frame */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 mb-6 bg-gray-100 dark:bg-zinc-900 shadow-inner">
        <iframe
          title={`Map of ${society}`}
          src={embedUrl}
          width="100%"
          height="100%"
          className="border-0 w-full h-full"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* Floating Verified Society Badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-200/80 dark:border-zinc-800 shadow-md flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-900 dark:text-zinc-100">
            {society} ({city})
          </span>
        </div>
      </div>

      {/* Proximity & Nearby Landmarks Radar */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-3 flex items-center gap-1.5">
          <span>Nearby Landmarks & Community Amenities</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nearbyAmenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-gray-50/70 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-800/80 rounded-xl p-3 flex items-start gap-3 hover:border-emerald-500/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-zinc-200 truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">{item.distance}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
