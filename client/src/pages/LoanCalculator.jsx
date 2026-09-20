import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, Landmark, ShieldCheck, ArrowRight, CheckCircle2, Building, DollarSign } from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import Button from '../components/ui/Button';

const PAKISTAN_BANKS = [
  {
    id: 'sbp-mpg',
    name: 'Mera Pakistan Mera Ghar (PM Low-Cost Scheme)',
    shortName: 'SBP — Mera Ghar',
    provider: 'State Bank of Pakistan (SBP)',
    type: 'Govt Subsidized',
    baseRate: 5.0,
    minDownPercent: 10,
    maxTenureYears: 20,
    badge: 'Govt Subsidized (3% - 7%)',
    desc: 'Subsidized markup scheme for first-time home buyers across Pakistan.'
  },
  {
    id: 'meezan',
    name: 'Easy Home Financing',
    shortName: 'Meezan Bank',
    provider: 'Meezan Bank',
    type: 'Islamic Shariah (Diminishing Musharakah)',
    baseRate: 13.5,
    minDownPercent: 15,
    maxTenureYears: 25,
    badge: '100% Shariah Compliant',
    desc: "Pakistan's leading Shariah-compliant joint ownership & rental model."
  },
  {
    id: 'hbl',
    name: 'HBL Ghar Finance',
    shortName: 'HBL',
    provider: 'Habib Bank Limited (HBL)',
    type: 'Conventional Commercial',
    baseRate: 14.0,
    minDownPercent: 20,
    maxTenureYears: 25,
    badge: 'Up to 70% Financing',
    desc: 'Financing for buying, constructing, or renovating residential units.'
  },
  {
    id: 'alfalah',
    name: 'Bank Alfalah Home Finance',
    shortName: 'Bank Alfalah',
    provider: 'Bank Alfalah',
    type: 'Conventional & Islamic',
    baseRate: 13.8,
    minDownPercent: 20,
    maxTenureYears: 20,
    badge: 'Fast-Track Processing',
    desc: 'Flexible options for plot purchase + construction with quick turnaround.'
  },
  {
    id: 'abl',
    name: 'ABL Ghar Finance',
    shortName: 'Allied Bank (ABL)',
    provider: 'Allied Bank Limited (ABL)',
    type: 'Conventional Commercial',
    baseRate: 14.2,
    minDownPercent: 20,
    maxTenureYears: 20,
    badge: 'Low Documentation',
    desc: 'Competitive rates with minimal upfront processing charges.'
  }
];

export default function LoanCalculator() {
  const [searchParams] = useSearchParams();
  const initialPrice = Number(searchParams.get('price')) || 25000000;

  const [selectedBankId, setSelectedBankId] = useState('sbp-mpg');
  const [propertyPrice, setPropertyPrice] = useState(initialPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(5.0);

  const activeBank = PAKISTAN_BANKS.find((b) => b.id === selectedBankId) || PAKISTAN_BANKS[0];

  const handleBankChange = (bankId) => {
    setSelectedBankId(bankId);
    const bank = PAKISTAN_BANKS.find((b) => b.id === bankId);
    if (bank) {
      setInterestRate(bank.baseRate);
      if (downPaymentPercent < bank.minDownPercent) {
        setDownPaymentPercent(bank.minDownPercent);
      }
      if (loanTenureYears > bank.maxTenureYears) {
        setLoanTenureYears(bank.maxTenureYears);
      }
    }
  };

  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = Math.max(0, propertyPrice - downPaymentAmount);
  
  const monthlyRate = (interestRate / 100) / 12;
  const totalMonths = loanTenureYears * 12;
  
  const monthlyPayment = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanAmount / totalMonths;

  const totalPayment = monthlyPayment * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>Home Loan & Mortgage Calculator | EstateSocial</title>
        <meta name="description" content="Calculate home loan monthly installments for SBP, Meezan Bank, HBL, ABL, and Bank Alfalah schemes in Pakistan." />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center justify-center bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3 rounded-2xl shadow-sm mb-2">
            <Calculator className="h-6 w-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
            Home Loan & Mortgage Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400">
            Compare Pakistani bank mortgage policies, calculate down payments, and estimate monthly installments.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-10 shadow-sm transition-colors duration-200">
          
          {/* Bank Partner Selection */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center">
              <Landmark className="h-4 w-4 mr-1.5 text-gray-900 dark:text-zinc-100" /> Choose Financing Partner / Govt Scheme:
            </label>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {PAKISTAN_BANKS.map((bank) => {
                const isSelected = bank.id === selectedBankId;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleBankChange(bank.id)}
                    className={`px-4 py-3 rounded-xl text-left border transition-colors duration-200 flex flex-col flex-shrink-0 w-44 ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-100'
                        : 'bg-gray-50 dark:bg-zinc-800/60 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <p className={`font-semibold text-sm leading-snug ${isSelected ? 'text-white dark:text-zinc-900' : 'text-gray-900 dark:text-zinc-100'}`}>
                      {bank.shortName}
                    </p>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-gray-300 dark:text-zinc-600' : 'text-gray-500 dark:text-zinc-400'}`}>
                      {bank.baseRate}% • {bank.type.split(' ')[0]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Bank Policy Banner */}
          <div className="mb-8 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center text-xs font-semibold text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 px-3 py-1 rounded-md border border-gray-200 dark:border-zinc-700">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                {activeBank.badge}
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium uppercase tracking-wider">{activeBank.type}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">{activeBank.desc}</p>
          </div>

          {/* Controls Grid */}
          <div className="space-y-6 mb-10">
            {/* Property Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Property Price</label>
                <span className="text-xl font-bold text-gray-900 dark:text-zinc-50">{formatPrice(propertyPrice)}</span>
              </div>
              <input 
                type="range" 
                min={5000000} 
                max={200000000} 
                step={1000000} 
                value={propertyPrice} 
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-zinc-100 cursor-pointer h-2 bg-gray-200 dark:bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-xs text-gray-400 dark:text-zinc-500 mt-1">
                <span>50 Lakh</span>
                <span>10 Crore</span>
                <span>20 Crore</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Down Payment (%)</label>
                <span className="text-xl font-bold text-gray-900 dark:text-zinc-50">{downPaymentPercent}% ({formatPrice(downPaymentAmount)})</span>
              </div>
              <input 
                type="range" 
                min={activeBank.minDownPercent} 
                max={50} 
                step={5} 
                value={downPaymentPercent} 
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-gray-900 dark:accent-zinc-100 cursor-pointer h-2 bg-gray-200 dark:bg-zinc-800 rounded-lg"
              />
            </div>

            {/* Tenure & Rate */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Loan Tenure (Years)</label>
                <select 
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100"
                >
                  {[5, 10, 15, 20, 25].filter(y => y <= activeBank.maxTenureYears).map(y => (
                    <option key={y} value={y}>{y} Years</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1.5">Est. Rate (%)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-11 px-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-zinc-100"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-zinc-600">Monthly Payment:</span>
                <span className="text-3xl font-bold text-white dark:text-zinc-900">{formatPrice(Math.round(monthlyPayment))} <span className="text-xs font-normal text-gray-400 dark:text-zinc-600">/ mo</span></span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-300 dark:text-zinc-700 font-medium">
                <span>Down: {formatPrice(downPaymentAmount)}</span>
                <span>•</span>
                <span>Financed: {formatPrice(loanAmount)}</span>
                <span>•</span>
                <span>Total Interest: {formatPrice(Math.round(totalInterest))}</span>
              </div>
            </div>

            <a href="/valuation" className="shrink-0">
              <Button variant="secondary" className="h-11 px-6 rounded-xl font-semibold text-sm">
                Get Pre-Approved <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}

