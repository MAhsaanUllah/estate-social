import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, Shield, Users, TrendingUp } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <Helmet>
        <title>About Us | EstateSocial</title>
        <meta name="description" content="Learn more about EstateSocial, Pakistan's most trusted real estate marketplace." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Digitizing Pakistan's Real Estate Market
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            EstateSocial was founded with a single mission: to bring transparency, trust, and modern technology to the real estate sector in Pakistan. We connect buyers, sellers, and verified agents in a seamless digital ecosystem.
          </p>
        </div>

        {/* Vision Image */}
        <div className="rounded-3xl overflow-hidden aspect-[21/9] mb-24 relative shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=800&fit=crop" 
            alt="Modern Architecture" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/10"></div>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div>
            <div className="bg-gray-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-gray-900">
              <Shield className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Transparency</h3>
            <p className="text-gray-600">We verify listings and agents to ensure you deal in a secure, scam-free environment.</p>
          </div>
          <div>
            <div className="bg-gray-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-gray-900">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
            <p className="text-gray-600">Building strong neighborhoods by connecting families with the perfect societies.</p>
          </div>
          <div>
            <div className="bg-gray-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-gray-900">
              <Building2 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Listings</h3>
            <p className="text-gray-600">Curating the finest homes and commercial spaces across top-tier cities.</p>
          </div>
          <div>
            <div className="bg-gray-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-gray-900">
              <TrendingUp className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Market Insights</h3>
            <p className="text-gray-600">Providing data-driven valuations and trend analysis to help you make informed decisions.</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-gray-50 rounded-3xl p-12 md:p-20 text-center border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Our Journey</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Starting from a small office in Lahore, we realized that finding a home in Pakistan often involved endless phone calls, unverified information, and hidden fees. We built EstateSocial to be the antidote to that chaos. Today, we are proud to serve millions of Pakistanis, offering a pristine, high-utility platform that respects your time and your investment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/properties" className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
              Explore Marketplace
            </a>
            <a href="/contact" className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              Get in Touch
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

