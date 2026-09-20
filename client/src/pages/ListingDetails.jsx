import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListingById } from '../redux/listingSlice';
import { Heart, MapPin, Tag, DollarSign, MessageCircle, Phone, MessageSquare, Building2, User, Calendar, CheckCircle, XCircle, Calculator, Bed, Bath, UtensilsCrossed, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight, Home, Share2, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { formatPrice, formatDate, getWhatsAppLink } from '../utils/formatters';
import { toggleFavorite } from '../redux/favoriteSlice';
import { ListingSkeleton } from '../components/Skeletons';
import InquiryModal from '../components/InquiryModal';
import PropertyLocationMap from '../components/PropertyLocationMap';
import PropertyTypeHighlights from '../components/PropertyTypeHighlights';

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentListing, listings = [], loading } = useSelector((state) => state.listings);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { favorites = [] } = useSelector((state) => state.favorites || {});

  // Real listing from database
  const listing = currentListing;

  const isFavorite = Array.isArray(favorites) && favorites.some((f) => f && f._id === listing?._id);

  // Previous & Next Listing Sequential Switcher from real marketplace inventory
  const allListings = listings;
  const currentIndex = allListings.findIndex((item) => item._id === listing?._id || String(item._id) === String(id));
  const prevListing = currentIndex > 0 ? allListings[currentIndex - 1] : null;
  const nextListing = currentIndex >= 0 && currentIndex < allListings.length - 1 ? allListings[currentIndex + 1] : null;

  useEffect(() => {
    if (id) {
      dispatch(fetchListingById(id));
      window.scrollTo(0, 0);
    }
  }, [dispatch, id]);

  const handleFavorite = () => {
    if (!isAuthenticated) {
      toast('Please sign in to save this property to your favorites.', { icon: '🔑' });
      return;
    }
    if (listing?._id) {
      dispatch(toggleFavorite(listing._id));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title || 'EstateSocial Property',
        text: `Check out this property in ${listing?.society || 'Pakistan'} for ${formatPrice(listing?.price)} on EstateSocial`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Property link copied to clipboard!');
    }
  };

  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const handleInquiry = () => {
    if (!isAuthenticated) {
      toast('Please sign in to send an inquiry.', { icon: '🔑' });
      return;
    }
    setShowInquiryModal(true);
  };

  useEffect(() => {
    if (listing) {
      document.title = `${listing.title || 'Property Details'} - EstateSocial`;
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": listing.title,
        "description": listing.description || "",
        "image": listing.images || [],
        "offers": {
          "@type": "Offer",
          "price": listing.price,
          "priceCurrency": "PKR"
        },
        "spatialCoverage": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": listing.society || "Pakistan",
            "addressRegion": listing.city || "Pakistan"
          }
        }
      });
      document.head.appendChild(script);
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [listing]);

  if (loading && !listing) {
    return <ListingSkeleton />;
  }

  if (!listing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl mb-4">
          <Building2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-2">Property Listing Not Found</h2>
        <p className="text-gray-600 dark:text-zinc-400 max-w-md mb-6">
          The property listing you are looking for might have been sold, removed, or is temporarily unavailable.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Explore All Properties</span>
        </Link>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'];
  const features = listing.features || ['Parking', 'Security', 'Water Supply', 'Electricity', 'Gas Connection'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 transition-colors duration-200 pb-16">
      <Helmet>
        <title>{listing.title} | EstateSocial</title>
        <meta name="description" content={listing.description.substring(0, 160)} />
        <meta property="og:title" content={listing.title} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:type" content="product" />
      </Helmet>
      <section className="bg-white dark:bg-[#0B111E] border-b border-gray-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          {/* Top Interactive Flow Bar: Breadcrumbs & Back/Forward Arrows */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800/80">
            
            {/* Left: Back Button & Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500 dark:text-zinc-400">
              <button
                type="button"
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 font-bold transition-colors mr-2"
                title="Go back to Marketplace"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              
              <Link to="/properties" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                Properties
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />

              <span className="text-gray-700 dark:text-zinc-300 font-semibold">{listing.city || 'Pakistan'}</span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              
              <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[200px]">
                {listing.society}
              </span>
            </div>

            {/* Right: Sequential Prev / Next Property Switcher & Share */}
            <div className="flex items-center gap-2 justify-between md:justify-end">
              <span className="text-xs text-gray-400 dark:text-zinc-500 mr-2">
                Property <strong className="text-gray-800 dark:text-zinc-200">{currentIndex >= 0 ? currentIndex + 1 : 1}</strong> of <strong className="text-gray-800 dark:text-zinc-200">{allListings.length}</strong>
              </span>

              {/* Prev Listing Arrow */}
              {prevListing ? (
                <Link
                  to={`/listing/${prevListing._id}`}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 text-gray-700 dark:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-bold"
                  title={`Previous: ${prevListing.title}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Prev</span>
                </Link>
              ) : (
                <button disabled className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-300 dark:text-zinc-700 cursor-not-allowed text-xs flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
              )}

              {/* Next Listing Arrow */}
              {nextListing ? (
                <Link
                  to={`/listing/${nextListing._id}`}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40 text-gray-700 dark:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-bold"
                  title={`Next: ${nextListing.title}`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <button disabled className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-300 dark:text-zinc-700 cursor-not-allowed text-xs flex items-center gap-1">
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}

              {/* Share Property */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 transition-colors text-xs font-bold flex items-center gap-1 ml-1"
                title="Share Property"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Gallery */}
              <div className="relative">
                <div 
                  className="aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 cursor-pointer relative group border border-gray-200/80 dark:border-zinc-800"
                  onClick={() => setShowGalleryModal(true)}
                >
                  <img
                    src={images[activeImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/75 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-opacity">
                      🔍 Click to expand gallery
                    </span>
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="mt-4 flex space-x-2 overflow-x-auto scrollbar-hide snap-x pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`snap-center flex-shrink-0 w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-gray-900 dark:border-zinc-100 opacity-100 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt={`${listing.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {listing.listedBy === 'owner' ? (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                          {listing.creator?.verified ? 'Verified Direct Owner' : 'Direct Owner (0% Commission)'}
                        </span>
                      ) : (
                        <span className={`${listing.creator?.verified ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'bg-gray-700 text-white'} px-3 py-1 rounded-lg text-xs font-bold shadow-sm`}>
                          {listing.creator?.verified ? 'Verified Agent 🛡️' : 'Agent Listing'}
                        </span>
                      )}
                      <span className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 px-3 py-1 rounded-lg text-xs font-medium capitalize">
                        For {listing.purpose?.toLowerCase()}
                      </span>
                      <span className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 px-3 py-1 rounded-lg text-xs font-medium">
                        {listing.propertyType}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        listing.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' :
                        listing.status === 'Sold' ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300' :
                        'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {listing.status}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 mb-2 leading-snug">{listing.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-zinc-400 text-sm">
                      <span className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                        <span>{listing.society}{listing.phase && `, ${listing.phase}`}{listing.block && `, ${listing.block}`}{listing.city && `, ${listing.city}`}</span>
                      </span>
                      {listing.mapUrl && (listing.mapUrl.startsWith('http://') || listing.mapUrl.startsWith('https://')) && (
                        <a
                          href={listing.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline font-medium text-xs ml-2"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View on Google Maps</span>
                        </a>
                      )}
                    </div>

                    {/* Room Details Row */}
                    {(listing.beds != null || listing.baths != null || listing.kitchens != null) && (
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-800 dark:text-zinc-200 bg-gray-50 dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/80 rounded-xl px-4 py-2.5 mt-4 w-fit">
                        {listing.beds != null && listing.beds > 0 && (
                          <span className="flex items-center space-x-1.5">
                            <Bed className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                            <span className="font-bold">{listing.beds} <span className="font-normal text-gray-500 dark:text-zinc-400">Bedrooms</span></span>
                          </span>
                        )}
                        {listing.baths != null && listing.baths > 0 && (
                          <span className="flex items-center space-x-1.5">
                            <Bath className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                            <span className="font-bold">{listing.baths} <span className="font-normal text-gray-500 dark:text-zinc-400">Baths</span></span>
                          </span>
                        )}
                        {listing.kitchens != null && listing.kitchens > 0 && (
                          <span className="flex items-center space-x-1.5">
                            <UtensilsCrossed className="h-4 w-4 text-gray-500 dark:text-zinc-400" />
                            <span className="font-bold">{listing.kitchens} <span className="font-normal text-gray-500 dark:text-zinc-400">Kitchens</span></span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="md:text-right shrink-0">
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50">{formatPrice(listing.price)}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                      {listing.size} {listing.sizeUnit || 'Marla'} • Demand / Asking Price
                    </p>
                  </div>
                </div>

                {/* Specific Property Type Highlights (Commercial / House / Plot / Apartment) */}
                <div className="mb-8">
                  <PropertyTypeHighlights listing={listing} />
                </div>

                {/* Description */}
                <div className="mb-8 bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-3">About this Property</h2>
                  <p className="text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {listing.description}
                  </p>
                </div>

                {/* Features & Amenities */}
                <div className="mb-8 bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {features.map((feature, idx) => (
                      <span key={idx} className="flex items-center space-x-2 text-gray-700 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-zinc-800 p-3 rounded-xl text-xs sm:text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {listing.isInstallmentAvailable && listing.installmentDetails && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-1 text-emerald-600 dark:text-emerald-400" /> Installment Plan Available
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-emerald-100 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Down Payment</p>
                        <p className="font-bold text-gray-900 dark:text-zinc-100 text-lg">{formatPrice(listing.installmentDetails.downPayment)}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-emerald-100 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Monthly Payment</p>
                        <p className="font-bold text-gray-900 dark:text-zinc-100 text-lg">{formatPrice(listing.installmentDetails.monthlyPayment)}</p>
                      </div>
                      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-emerald-100 dark:border-zinc-800">
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Duration</p>
                        <p className="font-bold text-gray-900 dark:text-zinc-100 text-lg">{listing.installmentDetails.durationMonths} Months</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Society Location & Interactive Map */}
                <div className="mb-8">
                  <PropertyLocationMap listing={listing} />
                </div>
              </div>
            </div>

            {/* Creator / Contact Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-6 sticky top-24 shadow-sm">
                <div className="text-center pb-6 border-b border-gray-100 dark:border-zinc-800 mb-6">
                  {listing.creator?.avatar ? (
                    <img src={listing.creator.avatar} alt={listing.creator.name} className="h-20 w-20 rounded-full mx-auto mb-3 border-2 border-gray-200 dark:border-zinc-700 object-cover shadow-sm" />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 border-2 border-gray-200 dark:border-zinc-700">
                      <User className="h-8 w-8 text-gray-500 dark:text-zinc-400" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 flex items-center justify-center space-x-1">
                    <span>{listing.creator?.name || (listing.listedBy === 'owner' ? 'Property Owner' : 'Verified Agent')}</span>
                    {listing.listedBy !== 'owner' && <CheckCircle className="h-4 w-4 text-blue-500" title="Verified Realtor" />}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-zinc-400 mt-0.5">
                    {listing.listedBy === 'owner' 
                      ? 'Direct Property Owner (0% Broker Fee)' 
                      : (listing.creator?.agencyName || 'DHA / Society Registered Realtor')}
                  </p>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-zinc-400">Direct Phone</span>
                    <a href={`tel:${listing.creator?.phone || listing.phone}`} className="font-semibold text-gray-900 dark:text-zinc-100 hover:underline flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1 text-emerald-600" /> {listing.creator?.phone || listing.phone || '0300-1234567'}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-zinc-400">Listed Date</span>
                    <span className="font-medium text-gray-700 dark:text-zinc-300">{listing.createdAt ? formatDate(listing.createdAt) : 'Recently Added'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-zinc-400">Buyer Trust</span>
                    <span className="font-bold text-amber-500 flex items-center text-xs">
                      ★ 4.9 <span className="text-gray-400 dark:text-zinc-500 ml-1">(Verified Profile)</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast('Please sign in to send a private inquiry.', { icon: '🔑' });
                      }
                      setShowInquiryModal(true);
                    }}
                    className="w-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl font-bold hover:bg-black dark:hover:bg-white transition-colors flex items-center justify-center space-x-2 text-sm shadow-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Send Inquiry (CRM)</span>
                  </button>

                  <a
                    href={`tel:${listing.creator?.phone || listing.phone || ''}`}
                    className="w-full bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center space-x-2 text-sm"
                  >
                    <Phone className="h-4 w-4 text-gray-600 dark:text-zinc-400" />
                    <span>Direct Phone Call</span>
                  </a>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={handleFavorite}
                      className={`py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-1.5 text-xs ${isFavorite ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900' : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                    >
                      <Heart className={`${isFavorite ? 'fill-current' : ''} h-3.5 w-3.5`} />
                      <span>{isFavorite ? 'Saved' : 'Save'}</span>
                    </button>
                    <a 
                      href={getWhatsAppLink(
                        listing.creator?.phone || listing.phone,
                        `Hello, I am interested in your property "${listing.title}" (${formatPrice(listing.price)}) on EstateSocial: ${window.location.href}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-1.5 text-xs shadow-sm" 
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {listing.price && (
                    <Link
                      to={`/loan-calculator?price=${listing.price}`}
                      className="w-full bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 py-2.5 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center space-x-2 text-xs"
                    >
                      <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>Bank EMI & Loan Calculator</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center">
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setShowGalleryModal(false)}
          >
            <XCircle className="h-8 w-8" />
          </button>
          
          <img 
            src={images[activeImage]} 
            alt={listing.title} 
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
          
          {images.length > 1 && (
            <div className="absolute bottom-6 flex space-x-4 max-w-full overflow-x-auto px-6 py-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <InquiryModal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        listing={currentListing}
      />
    </div>
  );
}

export default ListingDetails;