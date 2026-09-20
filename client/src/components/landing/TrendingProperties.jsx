import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ArrowRight, Heart } from 'lucide-react';
import { formatPrice, formatArea } from '../../utils/formatters';
import { PropertyCardSkeleton } from '../Skeletons';
import api from '../../api/axios';

const fallbackTrending = [
  {
    _id: 'trend-1',
    title: '1 Kanal Brand New Spanish Villa with Swimming Pool',
    price: 95000000,
    purpose: 'Sale',
    propertyType: 'House',
    society: 'DHA Phase 6',
    city: 'Lahore',
    beds: 5,
    baths: 6,
    size: 1,
    sizeUnit: 'Kanal',
    listedBy: 'owner',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop']
  },
  {
    _id: 'trend-2',
    title: '10 Marla Luxury Modern Designer House',
    price: 42500000,
    purpose: 'Sale',
    propertyType: 'House',
    society: 'Bahria Town Sector C',
    city: 'Lahore',
    beds: 4,
    baths: 5,
    size: 10,
    sizeUnit: 'Marla',
    listedBy: 'agent',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop']
  },
  {
    _id: 'trend-3',
    title: '3 Bed Luxury Corner Apartment, Margalla Facing',
    price: 31000000,
    purpose: 'Sale',
    propertyType: 'Flat',
    society: 'Sector F-7/2',
    city: 'Islamabad',
    beds: 3,
    baths: 3,
    size: 2200,
    sizeUnit: 'Sq. Ft.',
    listedBy: 'owner',
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop']
  },
  {
    _id: 'trend-4',
    title: '2 Kanal Commercial Corner Plot on Main Boulevard',
    price: 280000000,
    purpose: 'Sale',
    propertyType: 'Commercial',
    society: 'Gulberg Main Boulevard',
    city: 'Lahore',
    size: 2,
    sizeUnit: 'Kanal',
    listedBy: 'agent',
    isFeatured: true,
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop']
  }
];

export default function TrendingProperties() {
  const [properties, setProperties] = useState(fallbackTrending);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/listings/trending?limit=8')
      .then(res => {
        if (!cancelled && res.data.listings && res.data.listings.length > 0) {
          setProperties(res.data.listings);
        }
      })
      .catch(() => {
        // Fallback already in state
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-surface-muted dark:bg-zinc-950 py-10 md:py-16 border-y border-gray-200/80 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">Trending Properties</h2>
            <p className="text-[15px] text-gray-500 dark:text-zinc-400 mt-1">Most sought-after properties in top Pakistani cities</p>
          </div>
          <Link to="/properties" className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-zinc-100 hover:underline transition-colors">
            View All Properties <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {error && (
          <p className="text-center text-sm text-gray-500 dark:text-zinc-400 py-8">{error}</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? [...Array(4)].map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.slice(0, 8).map(listing => (
              <article key={listing._id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-zinc-800 hover:shadow-md dark:hover:shadow-zinc-950/40 transition-all duration-200 group">
                <Link to={`/listing/${listing._id}`} className="block" aria-label={`View ${listing.title}`}>
                  
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <img 
                      src={listing.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'} 
                      alt={listing.title}
                      className="w-full h-full object-cover transition-opacity duration-200"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                      {listing.listedBy === 'owner' ? (
                        <span className="bg-blue-600 text-white text-[11px] font-bold rounded-md px-2 py-0.5 shadow-sm">
                          Direct Owner • 0% Commission
                        </span>
                      ) : (
                        <span className="bg-zinc-900/90 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold rounded-md px-2 py-0.5 shadow-sm">
                          Verified Agent 🛡️
                        </span>
                      )}
                      {listing.purpose && (
                        <span className="bg-black/60 backdrop-blur text-white text-[11px] font-medium rounded-md px-2 py-0.5">
                          {listing.purpose}
                        </span>
                      )}
                      {listing.isFeatured && (
                        <span className="bg-amber-500 text-white text-[11px] font-bold rounded-md px-2 py-0.5">
                          Featured 🌟
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute top-3 right-3 h-8 w-8 bg-white/85 dark:bg-zinc-800/85 backdrop-blur rounded-full flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-sm"
                      aria-label="Add to favorites"
                      onClick={e => e.preventDefault()}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-lg font-semibold text-gray-900 dark:text-zinc-50 block mb-1">
                      {formatPrice(listing.price)}
                    </span>
                    <h3 className="text-[15px] font-medium text-gray-900 dark:text-zinc-100 line-clamp-1 mb-2">
                      {listing.title}
                    </h3>
                    
                    <div className="flex items-center text-[13px] text-gray-500 dark:text-zinc-400 mb-3">
                      <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-gray-400 dark:text-zinc-500" />
                      <span className="line-clamp-1">{listing.society}{listing.city ? `, ${listing.city}` : ''}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-zinc-400 pt-3 border-t border-gray-100 dark:border-zinc-800">
                      {listing.beds != null && (
                        <div className="flex items-center" title="Bedrooms">
                          <Bed className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-zinc-500" />
                          <span>{listing.beds} Beds</span>
                        </div>
                      )}
                      {listing.baths != null && (
                        <div className="flex items-center" title="Bathrooms">
                          <Bath className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-zinc-500" />
                          <span>{listing.baths} Baths</span>
                        </div>
                      )}
                      {listing.size && (
                        <div className="flex items-center" title="Area">
                          <Square className="h-3.5 w-3.5 mr-1 text-gray-400 dark:text-zinc-500" />
                          <span>{formatArea(listing.size, listing.sizeUnit)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))
          }
        </div>

      </div>
    </section>
  );
}
