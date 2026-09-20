import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Ruler, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('Kanal');
  const [marlaStandard, setMarlaStandard] = useState(225); // 225 or 272.25

  const getConversions = () => {
    const val = parseFloat(inputValue) || 0;
    let sqft = 0;
    const kanalSqft = marlaStandard * 20;
    
    if (fromUnit === 'Kanal') sqft = val * kanalSqft;
    else if (fromUnit === 'Marla') sqft = val * marlaStandard;
    else if (fromUnit === 'SqYd') sqft = val * 9;
    else if (fromUnit === 'SqFt') sqft = val;
    else if (fromUnit === 'Acre') sqft = val * 43560;

    return {
      kanal: (sqft / kanalSqft).toFixed(3),
      marla: (sqft / marlaStandard).toFixed(2),
      sqyd: (sqft / 9).toFixed(2),
      sqft: Math.round(sqft).toLocaleString(),
      acre: (sqft / 43560).toFixed(4)
    };
  };

  const conversions = getConversions();

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>Pakistani Land & Area Unit Converter | EstateSocial</title>
        <meta name="description" content="Convert Marla, Kanal, Square Feet, Square Yards, and Acres instantly for Pakistani real estate." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3 rounded-2xl shadow-sm mb-2">
            <Ruler className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
            Pakistani Real Estate Unit Converter
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400">
            Instant conversions between Marla, Kanal, Square Feet, Square Yards, and Acres.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                Enter Value
              </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-12 px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-lg font-bold text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                Select Unit
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full h-12 px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-base font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100"
              >
                <option value="Kanal">Kanal</option>
                <option value="Marla">Marla</option>
                <option value="SqYd">Square Yards</option>
                <option value="SqFt">Square Feet</option>
                <option value="Acre">Acres</option>
              </select>
            </div>
          </div>

          {/* Marla Standard Basis Toggle */}
          <div className="p-3.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-zinc-100 block">Regional Marla Basis:</span>
              <span className="text-[11px] text-gray-500 dark:text-zinc-400">Choose standard based on your housing authority</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setMarlaStandard(225)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  marlaStandard === 225
                    ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700'
                }`}
              >
                225 Sq. Ft. (DHA / Bahria / CDA)
              </button>
              <button
                type="button"
                onClick={() => setMarlaStandard(272.25)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  marlaStandard === 272.25
                    ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700'
                }`}
              >
                272.25 Sq. Ft. (Revenue Standard)
              </button>
            </div>
          </div>

          {/* Equivalent Output Grid */}
          <div className="bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl p-6 sm:p-8 space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-zinc-600 block">
              Equivalent Conversion Values:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
              <div className="bg-gray-800 dark:bg-zinc-200 p-4 rounded-xl">
                <span className="text-xs text-gray-400 dark:text-zinc-600 block">Kanal</span>
                <strong className="text-xl font-bold">{conversions.kanal}</strong>
              </div>
              <div className="bg-gray-800 dark:bg-zinc-200 p-4 rounded-xl">
                <span className="text-xs text-gray-400 dark:text-zinc-600 block">Marla</span>
                <strong className="text-xl font-bold">{conversions.marla}</strong>
              </div>
              <div className="bg-gray-800 dark:bg-zinc-200 p-4 rounded-xl">
                <span className="text-xs text-gray-400 dark:text-zinc-600 block">Sq. Yards</span>
                <strong className="text-xl font-bold">{conversions.sqyd}</strong>
              </div>
              <div className="bg-gray-800 dark:bg-zinc-200 p-4 rounded-xl">
                <span className="text-xs text-gray-400 dark:text-zinc-600 block">Sq. Feet</span>
                <strong className="text-xl font-bold">{conversions.sqft}</strong>
              </div>
              <div className="bg-gray-800 dark:bg-zinc-200 p-4 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-xs text-gray-400 dark:text-zinc-600 block">Acre</span>
                <strong className="text-xl font-bold">{conversions.acre}</strong>
              </div>
            </div>
          </div>

          {/* Regional Standards Guide */}
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center">
              <HelpCircle className="h-4 w-4 mr-1.5 text-gray-500" /> Standard Land Conversion Reference in Pakistan:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-zinc-400">
              <div className="p-3 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800">
                <strong className="text-gray-900 dark:text-zinc-200 block mb-0.5">1 Marla (Standard)</strong>
                <span>= 225 Sq. Ft. (Used in DHA, Bahria Town, CDA & Modern Societies)</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800">
                <strong className="text-gray-900 dark:text-zinc-200 block mb-0.5">1 Kanal</strong>
                <span>= 20 Marla = 4,500 Sq. Ft. = 500 Sq. Yards</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800">
                <strong className="text-gray-900 dark:text-zinc-200 block mb-0.5">1 Acre (Killa)</strong>
                <span>= 8 Kanal = 160 Marla = 43,560 Sq. Ft.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

