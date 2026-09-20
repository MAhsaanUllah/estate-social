import React, { useState } from 'react';
import { Calculator, ArrowRight, Landmark, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import Button from '../ui/Button';

const PAKISTAN_BANKS = [
  {
    id: 'sbp-mpg',
    name: 'Mera Pakistan Mera Ghar (PM Low-Cost Scheme)',
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
    provider: 'Meezan Bank',
    type: 'Islamic Shariah (Diminishing Musharakah)',
    baseRate: 13.5,
    minDownPercent: 15,
    maxTenureYears: 25,
    badge: '100% Shariah Compliant',
    desc: 'Pakistan’s leading Shariah-compliant joint ownership & rental model.'
  },
  {
    id: 'hbl',
    name: 'HBL Ghar Finance',
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
    provider: 'Allied Bank Limited (ABL)',
    type: 'Conventional Commercial',
    baseRate: 14.2,
    minDownPercent: 20,
    maxTenureYears: 20,
    badge: 'Low Documentation',
    desc: 'Competitive rates with minimal upfront processing charges.'
  },
  {
    id: 'custom',
    name: 'Custom Calculation',
    provider: 'User Defined',
    type: 'General',
    baseRate: 12.5,
    minDownPercent: 10,
    maxTenureYears: 25,
    badge: 'Custom Rate',
    desc: 'Enter custom interest rate and terms for your tailored estimate.'
  }
];

export default function MortgageCalculator() {
  const [selectedBankId, setSelectedBankId] = useState('sbp-mpg');
  const [propertyPrice, setPropertyPrice] = useState(25000000);
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
    <section className="py-10 md:py-16 bg-surface-muted dark:bg-zinc-950 border-y border-gray-200/80 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Single Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 md:p-10 transition-colors duration-200">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center space-x-3.5">
              <div className="bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-3 rounded-xl shrink-0">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
                  Home Loan & Installment Calculator
                </h2>
                <p className="text-[15px] text-gray-500 dark:text-zinc-400 mt-0.5">
                  Select a bank or government scheme policy to calculate your loan plan.
                </p>
              </div>
            </div>
          </div>

          {/* Bank Option Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center">
              <Landmark className="h-3.5 w-3.5 mr-1.5 text-gray-900 dark:text-zinc-100" /> Choose Partner / Govt Scheme:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {PAKISTAN_BANKS.map((bank) => {
                const isSelected = bank.id === selectedBankId;
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleBankChange(bank.id)}
                    className={`p-3 rounded-xl text-left border text-xs transition-colors duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-gray-900 dark:border-zinc-100 font-medium'
                        : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold line-clamp-1 ${isSelected ? 'text-white dark:text-zinc-900' : 'text-gray-900 dark:text-zinc-100'}`}>
                        {bank.provider}
                      </p>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-gray-300 dark:text-zinc-600' : 'text-gray-500 dark:text-zinc-400'}`}>
                        {bank.baseRate}% • {bank.type.split(' ')[0]}
                      </p>
                    </div>
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

          {/* Sliders & Inputs Grid */}
          <div className="space-y-6 mb-8">
            
            {/* Property Price */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Property Price</label>
                <span className="text-lg font-semibold text-gray-900 dark:text-zinc-50">{formatPrice(propertyPrice)}</span>
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
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Down Payment (%)</label>
                <span className="text-lg font-semibold text-gray-900 dark:text-zinc-50">{downPaymentPercent}% ({formatPrice(downPaymentAmount)})</span>
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

          {/* Integrated Output Bar */}
          <div className="bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-zinc-600">Monthly Payment:</span>
                <span className="text-2xl md:text-3xl font-bold text-white dark:text-zinc-900">{formatPrice(Math.round(monthlyPayment))} <span className="text-xs font-normal text-gray-400 dark:text-zinc-600">/ mo</span></span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-300 dark:text-zinc-700 mt-2 font-medium">
                <span>Down: {formatPrice(downPaymentAmount)}</span>
                <span>•</span>
                <span>Financed: {formatPrice(loanAmount)}</span>
                <span>•</span>
                <span>Interest: {formatPrice(Math.round(totalInterest))}</span>
              </div>
            </div>

            <a href="/valuation" className="shrink-0">
              <Button variant="secondary" className="h-10 px-5 rounded-xl font-semibold text-sm">
                Get Pre-Approved <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
