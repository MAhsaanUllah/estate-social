import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSearch from '../components/landing/HeroSearch';
import QuickActions from '../components/landing/QuickActions';
import ExploreTools from '../components/landing/ExploreTools';
import BrowseCategories from '../components/landing/BrowseCategories';
import TrendingProperties from '../components/landing/TrendingProperties';
import PopularLocations from '../components/landing/PopularLocations';
import BusinessModelSection from '../components/landing/BusinessModelSection';
import BlogSection from '../components/landing/BlogSection';

function Landing() {
  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen font-sans text-gray-900 dark:text-zinc-50 transition-colors duration-200">
      <Helmet>
        <title>EstateSocial | Pakistan's Top Real Estate Portal</title>
        <meta name="description" content="Find property for sale and rent in Pakistan. Explore luxury properties, plots, and commercial spaces in Lahore, Karachi, and Islamabad." />
      </Helmet>

      <HeroSearch />
      <QuickActions />
      <ExploreTools />
      <BrowseCategories />
      <BusinessModelSection />
      <TrendingProperties />
      <PopularLocations />
      <BlogSection />
    </div>
  );
}

export default Landing;
