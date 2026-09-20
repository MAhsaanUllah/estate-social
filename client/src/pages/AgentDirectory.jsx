import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Star, MapPin, Building2, Phone, ShieldCheck, Award, Loader2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PAKISTAN_CITIES } from '../utils/constants';
import { getWhatsAppLink } from '../utils/formatters';

export default function AgentDirectory() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchAgents();
  }, [selectedCity]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCity) params.city = selectedCity;
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/users/agents', { params });
      if (res.data && res.data.agents) {
        setAgents(res.data.agents);
      }
    } catch (err) {
      console.error('Failed to load agents directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAgents();
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen pt-24 pb-20 transition-colors duration-200">
      <Helmet>
        <title>Verified Agents Directory | EstateSocial Pakistan</title>
        <meta name="description" content="Find trusted and verified DHA, LDA, CDA real estate agents and direct property dealers in Pakistan." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-gray-200 dark:border-zinc-800 pb-8 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>DHA & Housing Authority Verified Network</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50">Verified Agents Directory</h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-1 text-sm max-w-xl">
              Connect with top-rated local Pakistani real estate professionals with direct portfolio links, video walkthroughs, and verified credentials.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-44 py-3 px-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Cities</option>
              {PAKISTAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or agency..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-gray-900 dark:text-zinc-100"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-bold hover:bg-black dark:hover:bg-white transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-3" />
            <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Loading verified realtors...</p>
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center max-w-lg mx-auto">
            <UserCheck className="h-12 w-12 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1">No agents found</h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              No verified agents match "{searchTerm || selectedCity}". Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => {
              const handle = agent.username ? `@${agent.username}` : (agent.slug ? `@${agent.slug}` : agent._id);
              const profileLink = `/${handle}`;
              return (
                <div 
                  key={agent._id} 
                  className="border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl transition-all bg-white dark:bg-[#0B111E] group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Identity Block */}
                    <div className="flex items-start space-x-4 mb-5">
                      <div className="relative">
                        <img 
                          src={agent.avatar || `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop`} 
                          alt={agent.name} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/20" 
                        />
                        {agent.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-zinc-900" title="Verified DHA / Housing Authority Agent">
                            <ShieldCheck className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-50 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {agent.name}
                          </h3>
                        </div>

                        {agent.username && (
                          <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            @{agent.username}
                          </p>
                        )}

                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium flex items-center mt-1 truncate">
                          <Building2 className="h-3.5 w-3.5 mr-1 flex-shrink-0" /> {agent.agencyName || 'Independent Real Estate Advisor'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 flex items-center mt-0.5">
                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" /> {agent.city || 'Pakistan'}
                        </p>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    {agent.bio && (
                      <p className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2 mb-5">
                        {agent.bio}
                      </p>
                    )}

                    {/* Performance & Inventory Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-6 pt-4 border-t border-gray-100 dark:border-zinc-800/80 text-center">
                      <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-900/60">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rating</p>
                        <div className="flex items-center justify-center text-xs font-bold text-gray-900 dark:text-zinc-100 mt-0.5">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-current mr-1" />
                          {agent.rating || 5.0}
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-900/60">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deals</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-zinc-100 mt-0.5">
                          {agent.dealsClosed || 12}+ Closed
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-900/60">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Listings</p>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {agent.listingsCount || 0} Active
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Link 
                      to={profileLink} 
                      className="flex-1 text-center bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-2.5 rounded-xl text-xs font-bold hover:bg-black dark:hover:bg-white transition-colors"
                    >
                      View Profile & Stock
                    </Link>
                    {agent.phone && (
                      <a 
                        href={getWhatsAppLink(agent.phone, `Hello ${agent.name}, I found your agency profile on EstateSocial.`)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
                        title="WhatsApp Agent"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}


