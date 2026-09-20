import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  MapPin, 
  TrendingUp, 
  Users, 
  Compass, 
  FileText, 
  Ruler, 
  Hammer, 
  ArrowRight
} from 'lucide-react';

export default function ExploreTools() {
  const tools = [
    {
      id: 'loan',
      title: 'Home Loan Calculator',
      description: 'Compare bank markup and calculate monthly installments',
      icon: Calculator,
      link: '/loan-calculator'
    },
    {
      id: 'unitConverter',
      title: 'Area Unit Converter',
      description: 'Convert Marla, Kanal, SqFt & SqYd instantly',
      icon: Ruler,
      link: '/unit-converter'
    },
    {
      id: 'constructionCost',
      title: 'Construction Cost Estimator',
      description: 'Estimate grey structure & finishing costs by city',
      icon: Hammer,
      link: '/construction-cost-calculator'
    },
    {
      id: 'valuation',
      title: 'Property Valuation',
      description: 'Get AI-estimated market price for your property',
      icon: TrendingUp,
      link: '/valuation'
    },
    {
      id: 'plot',
      title: 'Plot Finder',
      description: 'Find residential & commercial plots in top societies',
      icon: MapPin,
      link: '/properties?propertyType=Plot'
    },
    {
      id: 'agents',
      title: 'Verified Property Agents',
      description: 'Connect with licensed estate consultants',
      icon: Users,
      link: '/agents'
    },
    {
      id: 'locations',
      title: 'Society Area Guides',
      description: 'Explore DHA, Bahria, and Gulberg maps',
      icon: Compass,
      link: '/properties'
    },
    {
      id: 'trends',
      title: 'Market Trends & Insights',
      description: 'Read real estate tax updates & ROI reports',
      icon: FileText,
      link: '/blog'
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-white dark:bg-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
            Explore Tools & Real Estate Services
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-zinc-400 mt-1">
            Calculators, unit converters, area guides, and market intelligence for smart decision making
          </p>
        </div>

        {/* 2x4 Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            
            return (
              <Link key={tool.id} to={tool.link} className="block">
                <div className="bg-gray-50/70 dark:bg-zinc-800/40 hover:bg-gray-100/80 dark:hover:bg-zinc-800/80 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-5 transition-all duration-200 ease-out group cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200/60 dark:border-zinc-700 w-10 h-10 rounded-xl flex items-center justify-center text-gray-900 dark:text-zinc-100 mb-4 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100 mb-1 flex items-center justify-between">
                      <span>{tool.title}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
