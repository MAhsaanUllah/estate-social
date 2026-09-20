import React from 'react';
import { 
  ShieldCheck, Zap, Building2, Landmark, Rocket, CheckCircle2, 
  DollarSign, ArrowRight, Award, BadgePercent, Sparkles, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BusinessModelSection() {
  const revenueStreams = [
    {
      id: 1,
      icon: Zap,
      badge: 'High Conversion',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300',
      title: 'Featured Listing Boosts',
      subtitle: 'Top-of-Search Priority & Social Blast',
      description: 'Property owners and realtors pay a modest fee (from PKR 1,500) to feature their listings at the top of search results, society feeds, and direct WhatsApp broadcasts for 10x faster buyer discovery.',
      benefit: '10x more verified buyer inquiries'
    },
    {
      id: 2,
      icon: Building2,
      badge: 'SaaS Subscription',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300',
      title: 'Agency Pro CRM & Team Suite',
      subtitle: 'For Authorized Real Estate Firms',
      description: 'Professional agencies pay a monthly or annual SaaS subscription (PKR 4,999/month) for dedicated multi-agent lead management, automated inventory marketing, and custom agency branding.',
      benefit: 'Complete digital agency workflow'
    },
    {
      id: 3,
      icon: ShieldCheck,
      badge: 'Trust & Safety',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300',
      title: 'FBR NTN & Legal Title Badges',
      subtitle: 'Official Blue Verified Badge',
      description: 'Optional legal and physical vetting of society allotment letters, FBR tax filer credentials, and agency licenses. We verify document authenticity and award the official Blue Shield Badge.',
      benefit: 'Maximum buyer trust & scam prevention'
    },
    {
      id: 4,
      icon: Landmark,
      badge: 'Institutional Partner',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
      title: 'Bank Mortgage Referrals',
      subtitle: 'Meezan, HBL, Bank Alfalah Integration',
      description: 'When buyers calculate EMI and apply for Islamic home financing through our platform, partner banks pay EstateSocial a direct institutional referral fee—at 0% cost to the homebuyer.',
      benefit: '0% cost to buyer, paid by partner bank'
    },
    {
      id: 5,
      icon: Rocket,
      badge: 'Enterprise Media',
      badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300',
      title: 'Developer Project Launches',
      subtitle: 'Commercial Plazas & Master-Planned Housing',
      description: 'Mega housing developers (DHA, Bahria, Gulberg, Eighteen) pay for sponsored launch banners, interactive masterplan showcases, and dedicated digital booking campaigns.',
      benefit: 'Exclusive pre-launch buyer deals'
    }
  ];

  return (
    <section className="bg-white dark:bg-[#090E17] py-16 md:py-24 border-y border-gray-200/80 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <BadgePercent className="h-4 w-4" />
            <span>Transparent Business Model</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight leading-tight">
            How EstateSocial Operates at <span className="text-emerald-600 dark:text-emerald-400">0% Commission</span>
          </h2>
          
          <p className="text-base text-gray-600 dark:text-zinc-400 mt-4 leading-relaxed">
            We never take 1% or 2% broker cuts from families buying or selling their homes. Here is exactly how our business model stays profitable, sustainable, and 100% aligned with user trust.
          </p>
        </div>

        {/* 0% Commission Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Free Forever Promise</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              0% Commission for Direct Buyers & Sellers
            </h3>
            <p className="text-emerald-100 text-sm max-w-2xl mt-2">
              Browse thousands of direct owner and verified listings, contact sellers on WhatsApp, and close deals without paying lakhs in unnecessary marketplace middleman cuts.
            </p>
          </div>

          <Link
            to="/properties"
            className="px-6 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 flex-shrink-0 justify-center"
          >
            <span>Explore 0% Fee Listings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 5 Revenue Streams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {revenueStreams.map((stream) => {
            const Icon = stream.icon;
            return (
              <div
                key={stream.id}
                className="bg-gray-50/70 dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all hover:shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${stream.badgeColor}`}>
                      {stream.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1">
                    {stream.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                    {stream.subtitle}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                    {stream.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200/60 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500 dark:text-zinc-400">Impact:</span>
                  <span className="font-bold text-gray-900 dark:text-zinc-200">{stream.benefit}</span>
                </div>
              </div>
            );
          })}

          {/* Call to Action Card in Grid */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800/60 p-6 flex flex-col justify-between text-center">
            <div>
              <div className="p-3 rounded-2xl bg-emerald-600 text-white w-fit mx-auto mb-4 shadow-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">
                Grow with EstateSocial Pro
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                Are you an agency or property developer looking to scale your portfolio across Pakistan?
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
              >
                <span>Register as Certified Agency</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
