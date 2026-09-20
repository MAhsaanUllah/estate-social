import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hammer, Building, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

export default function ConstructionCalculator() {
  const [city, setCity] = useState('Lahore');
  const [plotSize, setPlotSize] = useState('10 Marla');
  const [coveredAreaSqFt, setCoveredAreaSqFt] = useState(2800);
  const [floors, setFloors] = useState('Double Story');
  const [qualityGrade, setQualityGrade] = useState('A+ Premium');
  const [inflationPercent, setInflationPercent] = useState(0);

  const cityRates = {
    Lahore: 1.0,
    Karachi: 1.05,
    Islamabad: 1.08,
    Rawalpindi: 1.02,
    Faisalabad: 0.95,
    Gujranwala: 0.95,
    Multan: 0.96,
    Peshawar: 0.98,
    Sialkot: 0.97,
  };

  const gradeRates = {
    'A+ Premium': 4800,
    'A Standard': 4100,
    'Economy': 3400,
  };

  const inflationMultiplier = 1 + (inflationPercent / 100);
  const baseRate = (gradeRates[qualityGrade] || 4800) * (cityRates[city] || 1.0) * inflationMultiplier;
  const totalCost = coveredAreaSqFt * baseRate;

  // Breakdown percentages based on Pakistani construction industry standard
  const greyStructure = totalCost * 0.55;
  const finishing = totalCost * 0.45;

  const itemizedBreakdown = [
    { item: 'Bricks & Block Work', cost: totalCost * 0.16, icon: '🧱' },
    { item: 'Cement & Sand', cost: totalCost * 0.14, icon: '🏗️' },
    { item: 'Rebar Steel (Mughal/Ittehad 60-Grade)', cost: totalCost * 0.18, icon: '⛓️' },
    { item: 'Plumbing & Drainage', cost: totalCost * 0.10, icon: '🚰' },
    { item: 'Electrical Wiring & DBs', cost: totalCost * 0.09, icon: '⚡' },
    { item: 'Tiles, Marble & Flooring', cost: totalCost * 0.15, icon: '🔳' },
    { item: 'Woodwork, Doors & Kitchen', cost: totalCost * 0.10, icon: '🚪' },
    { item: 'Paint, False Ceiling & Glass', cost: totalCost * 0.08, icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>Construction Cost Estimator 2026 | EstateSocial</title>
        <meta name="description" content="Calculate estimated house construction costs in Lahore, Karachi, Islamabad for 5 Marla, 10 Marla, and 1 Kanal houses." />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3 rounded-2xl shadow-sm mb-2">
            <Hammer className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
            Construction Cost Estimator 2026
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400">
            Estimate grey structure and full finishing budgets for your house construction in Pakistan.
          </p>
        </div>

        {/* Input Controls Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* City */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none"
              >
                {Object.keys(cityRates).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Plot Size Preset */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Plot Size Preset</label>
              <select
                value={plotSize}
                onChange={(e) => {
                  setPlotSize(e.target.value);
                  if (e.target.value === '5 Marla') setCoveredAreaSqFt(1600);
                  if (e.target.value === '10 Marla') setCoveredAreaSqFt(2800);
                  if (e.target.value === '1 Kanal') setCoveredAreaSqFt(4800);
                }}
                className="w-full h-11 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="5 Marla">5 Marla (Approx 1,600 SqFt)</option>
                <option value="10 Marla">10 Marla (Approx 2,800 SqFt)</option>
                <option value="1 Kanal">1 Kanal (Approx 4,800 SqFt)</option>
                <option value="Custom">Custom Area</option>
              </select>
            </div>

            {/* Covered Area */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Covered Area (Sq. Ft.)</label>
              <input
                type="number"
                value={coveredAreaSqFt}
                onChange={(e) => setCoveredAreaSqFt(Number(e.target.value))}
                className="w-full h-11 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none"
              />
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Finish Quality</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full h-11 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="A+ Premium">A+ Premium Finish</option>
                <option value="A Standard">A Standard Finish</option>
                <option value="Economy">Economy Finish</option>
              </select>
            </div>

          </div>

          {/* Material & Inflation Rate Adjuster (Every 6-12 Months) */}
          <div className="bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-zinc-100 block">
                📈 Inflation & Material Price Surcharge (Cement/Steel/Labor)
              </span>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                Adjust up or down to account for quarterly price fluctuations in Pakistan.
              </p>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <input 
                type="range" 
                min="-10" 
                max="40" 
                step="5"
                value={inflationPercent} 
                onChange={(e) => setInflationPercent(Number(e.target.value))} 
                className="w-32 accent-gray-900 dark:accent-zinc-100 cursor-pointer"
              />
              <span className="text-xs font-bold px-2.5 py-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-zinc-100 min-w-[55px] text-center">
                {inflationPercent > 0 ? `+${inflationPercent}%` : `${inflationPercent}%`}
              </span>
            </div>
          </div>

          {/* Grand Total Summary Banner */}
          <div className="bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-zinc-600 block mb-1">
                Estimated Total Budget ({city}):
              </span>
              <span className="text-3xl sm:text-4xl font-bold">
                PKR {(totalCost / 100000).toFixed(2)} Lakh
              </span>
              <p className="text-xs text-gray-300 dark:text-zinc-700 mt-2">
                Approx rate: <strong>PKR {Math.round(baseRate).toLocaleString()} / SqFt</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t sm:border-t-0 sm:border-l border-gray-800 dark:border-zinc-300 pt-4 sm:pt-0 sm:pl-6 text-xs">
              <div>
                <span className="text-gray-400 dark:text-zinc-600 block">Grey Structure (55%)</span>
                <strong className="text-sm font-semibold">PKR {(greyStructure / 100000).toFixed(2)} Lakh</strong>
              </div>
              <div>
                <span className="text-gray-400 dark:text-zinc-600 block">Full Finishing (45%)</span>
                <strong className="text-sm font-semibold">PKR {(finishing / 100000).toFixed(2)} Lakh</strong>
              </div>
            </div>
          </div>

          {/* Itemized Materials Breakdown Grid */}
          <div className="pt-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50 mb-4">
              Itemized Material & Labor Cost Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {itemizedBreakdown.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-semibold text-gray-900 dark:text-zinc-100 truncate">{item.item}</span>
                  </div>
                  <strong className="text-sm font-bold text-gray-900 dark:text-zinc-100 block">
                    PKR {(item.cost / 100000).toFixed(2)} Lakh
                  </strong>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

