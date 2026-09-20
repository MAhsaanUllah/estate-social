import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Map, Home, RefreshCw, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { PAKISTAN_CITIES } from '../utils/constants';
import api from '../api/axios';

const INPUT_CLS = 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100 focus:border-gray-900 dark:focus:border-zinc-100 outline-none transition-all bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100';
const LABEL_CLS = 'block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2';

export default function PropertyValuation() {
  const [form, setForm] = useState({
    city: '',
    society: '',
    propertyType: '',
    size: '',
    sizeUnit: 'Marla',
    purpose: 'Sale',
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [estimate, setEstimate] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEstimate(null);

    try {
      const payload = {
        city: form.city,
        society: form.society,
        propertyType: form.propertyType,
        size: Number(form.size),
        sizeUnit: form.sizeUnit,
        purpose: form.purpose,
      };
      if (form.name) payload.name = form.name;
      if (form.phone) payload.phone = form.phone;
      if (form.email) payload.email = form.email;

      const res = await api.post('/valuations', payload);
      setEstimate(res.data.estimate);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not get valuation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const basisLabel = {
    'market-comparables': 'Based on live market data',
    'city-heuristic': 'Based on city averages',
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pt-24 pb-20 transition-colors duration-200">
      <Helmet>
        <title>Property Valuation | EstateSocial</title>
        <meta name="description" content="Get an accurate market valuation for your property in Pakistan." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 w-16 h-16 rounded-2xl mx-auto mb-6 shadow-sm">
            <Calculator className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50 mb-3">What's Your Property Worth?</h1>
          <p className="text-base text-gray-500 dark:text-zinc-400">Get a free, data-driven estimate based on recent market trends in your society.</p>
        </div>

        {/* Estimate Result */}
        {estimate && (
          <div className="mb-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-50 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                Valuation Estimate
              </h2>
              {estimate.basis && (
                <span className="text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-3 py-1 rounded-full">
                  {basisLabel[estimate.basis] || estimate.basis}
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-5 text-center border border-gray-100 dark:border-zinc-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Low Estimate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-zinc-50">{formatPrice(estimate.low)}</p>
              </div>
              <div className="bg-gray-900 dark:bg-zinc-100 rounded-xl p-5 text-center border border-gray-900 dark:border-zinc-100">
                <p className="text-xs font-semibold text-gray-300 dark:text-zinc-500 uppercase tracking-wider mb-1">Market Value</p>
                <p className="text-2xl font-bold text-white dark:text-zinc-900">{formatPrice(estimate.mid)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-xl p-5 text-center border border-gray-100 dark:border-zinc-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1">High Estimate</p>
                <p className="text-xl font-bold text-gray-900 dark:text-zinc-50">{formatPrice(estimate.high)}</p>
              </div>
            </div>

            {form.purpose === 'Rent' && estimate.monthlyRentEstimate && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Estimated Monthly Rent</span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatPrice(estimate.monthlyRentEstimate)} / mo</span>
              </div>
            )}

            <p className="text-xs text-center text-gray-400 dark:text-zinc-500 mt-4">Estimates are indicative only. Actual value may vary based on property condition and negotiation.</p>

            <button
              onClick={() => setEstimate(null)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" /> Request Another Valuation
            </button>
          </div>
        )}

        {/* Form */}
        {!estimate && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 md:p-10 shadow-sm">
            {error && (
              <div className="mb-6 flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section: Location */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50 flex items-center mb-5">
                  <Map className="h-4 w-4 mr-2 text-gray-400 dark:text-zinc-500" /> Property Location
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL_CLS}>City <span className="text-red-500">*</span></label>
                    <select
                      name="city"
                      required
                      value={form.city}
                      onChange={handleChange}
                      className={INPUT_CLS}
                    >
                      <option value="">Select City</option>
                      {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Society / Area <span className="text-red-500">*</span></label>
                    <input
                      name="society"
                      type="text"
                      required
                      value={form.society}
                      onChange={handleChange}
                      className={INPUT_CLS}
                      placeholder="e.g. DHA Phase 6"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Property Details */}
              <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50 flex items-center mb-5">
                  <Home className="h-4 w-4 mr-2 text-gray-400 dark:text-zinc-500" /> Property Details
                </h3>
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={LABEL_CLS}>Purpose <span className="text-red-500">*</span></label>
                    <select name="purpose" required value={form.purpose} onChange={handleChange} className={INPUT_CLS}>
                      <option value="Sale">For Sale</option>
                      <option value="Rent">For Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Property Type <span className="text-red-500">*</span></label>
                    <select name="propertyType" required value={form.propertyType} onChange={handleChange} className={INPUT_CLS}>
                      <option value="">Select Type</option>
                      <option value="House">House</option>
                      <option value="Plot">Plot</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL_CLS}>Size <span className="text-red-500">*</span></label>
                    <input
                      name="size"
                      type="number"
                      min="1"
                      step="0.5"
                      required
                      value={form.size}
                      onChange={handleChange}
                      className={INPUT_CLS}
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Unit <span className="text-red-500">*</span></label>
                    <select name="sizeUnit" required value={form.sizeUnit} onChange={handleChange} className={INPUT_CLS}>
                      <option value="Marla">Marla</option>
                      <option value="Kanal">Kanal</option>
                      <option value="SqFt">Sq. Ft.</option>
                      <option value="SqYd">Sq. Yd.</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section: Contact (optional) */}
              <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50 mb-1">Your Contact Info <span className="text-gray-400 dark:text-zinc-500 font-normal text-sm">(Optional)</span></h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-5">We'll send your valuation summary if provided.</p>
                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className={LABEL_CLS}>Full Name</label>
                    <input name="name" type="text" value={form.name} onChange={handleChange} className={INPUT_CLS} placeholder="e.g. Ali Hassan" />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Phone</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={INPUT_CLS} placeholder="03XX-XXXXXXX" />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className={INPUT_CLS} placeholder="you@example.com" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-4 rounded-xl hover:bg-black dark:hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-base flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Calculating Estimate...</>
                ) : (
                  'Get Free Valuation'
                )}
              </button>
              <p className="text-center text-xs text-gray-400 dark:text-zinc-500 -mt-4">By submitting, you agree to our Terms of Service.</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
