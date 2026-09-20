import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Tag, Building2, DollarSign, MessageCircle, Bed, Bath, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../redux/favoriteSlice';
import { formatPrice, formatDate, getWhatsAppLink } from '../utils/formatters';

function FeedCard({ listing }) {
  if (!listing) return null;

  const dispatch = useDispatch();
  const { favorites = [] } = useSelector((state) => state.favorites || {});
  const isFavorite = Array.isArray(favorites) && favorites.some((f) => f && f._id === listing._id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (listing._id) {
      dispatch(toggleFavorite(listing._id));
    }
  };

  const images = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop'];

  const activeImage = images[currentImageIndex] || images[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40';
      case 'Sold':
        return 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/40';
      case 'UnderOffer':
      default:
        return 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40';
    }
  };

  const isVerified = Boolean(listing.creator?.verified);
  const sellerName = listing.creator?.name || (listing.listedBy === 'owner' ? 'Property Owner' : 'Agent Listing');
  const sellerPhone = listing.creator?.phone || listing.phone || '';
  const waLink = getWhatsAppLink(
    sellerPhone,
    `Hello, I saw your property "${listing.title || 'Listing'}" (${formatPrice(listing.price)}) on EstateSocial: ${window.location.origin}/listing/${listing._id}`
  );

  return (
    <article className="bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800/80 overflow-hidden hover:shadow-lg hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between">
      <Link to={`/listing/${listing._id}`} className="block h-full flex flex-col justify-between" aria-label={`View ${listing.title || 'Property'}`}>
        
        <div>
          {/* Card Media Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-zinc-800">
            <img
              src={activeImage}
              alt={listing.title || 'Property image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
              {listing.listedBy === 'owner' ? (
                <span className="bg-blue-600/95 backdrop-blur-md text-white text-[11px] font-bold rounded-lg px-2.5 py-0.5 shadow-sm">
                  {isVerified ? 'Verified Direct Owner' : 'Direct Owner (0% Fee)'}
                </span>
              ) : (
                <span className={`${isVerified ? 'bg-emerald-700/90' : 'bg-gray-800/90'} backdrop-blur-md text-white text-[11px] font-bold rounded-lg px-2.5 py-0.5 shadow-sm flex items-center gap-1`}>
                  {isVerified && <ShieldCheck className="h-3 w-3 text-emerald-300" />}
                  <span>{isVerified ? 'Verified Agent' : 'Agent Listing'}</span>
                </span>
              )}
              {listing.purpose && (
                <span className="bg-black/75 backdrop-blur-md text-zinc-100 text-[11px] font-semibold rounded-lg px-2 py-0.5">
                  {listing.purpose}
                </span>
              )}
              {listing.propertyType && (
                <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-gray-900 dark:text-zinc-100 text-[11px] font-semibold rounded-lg px-2 py-0.5 shadow-sm">
                  {listing.propertyType}
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={handleFavorite}
              className="absolute top-3 right-3 h-8 w-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full flex items-center justify-center transition-all z-10 hover:scale-110 shadow-sm"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-zinc-300'}`} />
            </button>

            {/* Image Carousel Navigation Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`transition-all duration-200 ${
                      idx === currentImageIndex
                        ? 'bg-emerald-400 w-5 h-1.5 rounded-full shadow-sm'
                        : 'bg-white/70 w-1.5 h-1.5 rounded-full hover:bg-white'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4">
            {/* Price & Status */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                {formatPrice(listing.price)}
              </span>
              <span className={`text-[11px] font-bold rounded-md px-2 py-0.5 ${getStatusBadge(listing.status || 'Active')}`}>
                {listing.status || 'Active'}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-zinc-100 line-clamp-1 mb-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {listing.title || 'Property Listing in Pakistan'}
            </h3>

            {/* Location */}
            <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400 mb-3 font-medium">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate">
                {listing.society || 'Prime Location'}{listing.phase ? `, ${listing.phase}` : ''}{listing.city ? `, ${listing.city}` : ''}
              </span>
            </div>

            {/* Property Key Specs Pill Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-zinc-300 py-2 border-y border-gray-100 dark:border-zinc-800/80 mb-3 bg-gray-50/50 dark:bg-zinc-900/40 rounded-xl px-2.5">
              {listing.beds != null && listing.beds > 0 && (
                <span className="flex items-center gap-1 font-semibold">
                  <Bed className="h-3.5 w-3.5 text-gray-500 dark:text-zinc-400" />
                  <span>{listing.beds} <span className="font-normal text-gray-500 dark:text-zinc-400">Beds</span></span>
                </span>
              )}
              {listing.baths != null && listing.baths > 0 && (
                <span className="flex items-center gap-1 font-semibold">
                  <Bath className="h-3.5 w-3.5 text-gray-500 dark:text-zinc-400" />
                  <span>{listing.baths} <span className="font-normal text-gray-500 dark:text-zinc-400">Baths</span></span>
                </span>
              )}
              {listing.size && (
                <span className="flex items-center gap-1 font-semibold">
                  <Tag className="h-3.5 w-3.5 text-gray-500 dark:text-zinc-400" />
                  <span>{listing.size} {listing.sizeUnit || 'Marla'}</span>
                </span>
              )}
              {listing.isInstallmentAvailable && (
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-[10px] font-bold">
                  <DollarSign className="h-3 w-3" />
                  <span>Installments</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seller & Action Footer */}
        <div className="p-4 pt-0">
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800 text-xs">
            
            {/* Seller Info */}
            <div className="flex items-center space-x-2 min-w-0">
              {listing.creator?.avatar ? (
                <img src={listing.creator.avatar} alt={sellerName} className="h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500/20 flex-shrink-0" />
              ) : (
                <div className="h-7 w-7 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-xs ring-1 ring-emerald-500/20 flex-shrink-0">
                  {sellerName.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-zinc-200 truncate text-[12px]">{sellerName}</p>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 capitalize">
                  {listing.listedBy === 'owner' ? (isVerified ? 'Verified Owner' : 'Direct Owner') : (isVerified ? 'Verified Agent' : 'Agent')}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            {sellerPhone ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-[11px] shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            ) : null}
          </div>
        </div>

      </Link>
    </article>
  );
}

export default FeedCard;