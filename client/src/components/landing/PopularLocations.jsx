import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import api from '../../api/axios';

function LocationSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-1/3 mb-3" />
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

export default function PopularLocations() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    api.get('/listings/locations')
      .then(res => {
        if (!cancelled) {
          const locations = res.data.locations || [];
          // Group by city, keep top 8 societies per city
          const byCity = {};
          locations.forEach(loc => {
            if (!byCity[loc.city]) byCity[loc.city] = [];
            byCity[loc.city].push(loc);
          });
          // Sort each city's societies by count desc, cap at 8
          Object.keys(byCity).forEach(city => {
            byCity[city] = byCity[city]
              .sort((a, b) => b.count - a.count)
              .slice(0, 8);
          });
          setGrouped(byCity);
        }
      })
      .catch(() => {
        // silently fail
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const cities = Object.keys(grouped);
  if (!loading && cities.length === 0) return null;

  return (
    <section className="bg-white dark:bg-zinc-900 py-10 md:py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 border-b border-gray-100 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">Popular Locations in Pakistan</h2>
          <p className="text-[15px] text-gray-500 dark:text-zinc-400 mt-1">Explore the most searched areas to buy or rent properties</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {loading
            ? [...Array(6)].map((_, i) => <LocationSkeleton key={i} />)
            : cities.slice(0, 6).map(city => (
              <div key={city}>
                <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-1.5 text-gray-400 dark:text-zinc-500" />
                  {city}
                </h3>
                <ul className="space-y-2">
                  {grouped[city].map(loc => (
                    <li key={loc.society}>
                      <button
                        onClick={() => navigate(`/properties?city=${encodeURIComponent(city)}&society=${encodeURIComponent(loc.society)}`)}
                        className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors duration-200 flex items-center justify-between w-full text-left group"
                      >
                        <span>Properties in {loc.society}</span>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300 ml-2 shrink-0">
                          {loc.count} listing{loc.count !== 1 ? 's' : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          }
        </div>

      </div>
    </section>
  );
}
