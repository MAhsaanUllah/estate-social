import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Sparkles, Share2, Copy, Check, ArrowRight, 
  Building2, MessageCircle, ShieldCheck, Home, PlusCircle, LayoutDashboard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  const type = searchParams.get('type') || 'property'; // 'property' | 'inquiry' | 'verification'
  const title = searchParams.get('title') || '1 Kanal Modern Luxury Spanish Villa';
  const listingId = searchParams.get('id') || 'pk-feed-1';
  const society = searchParams.get('society') || 'DHA Phase 6, Lahore';

  const listingUrl = `${window.location.origin}/listing/${listingId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(listingUrl);
    setCopied(true);
    toast.success('Listing link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-[85vh] bg-gray-50 dark:bg-[#090E17] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <Helmet>
        <title>Success | EstateSocial</title>
      </Helmet>

      <div className="max-w-xl w-full bg-white dark:bg-[#0B111E] rounded-3xl border border-gray-200/80 dark:border-zinc-800 p-8 sm:p-10 shadow-2xl text-center">
        
        {/* Animated Celebration Badge */}
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-600/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
        </div>

        {/* Dynamic Titles */}
        {type === 'property' ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Live on Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-zinc-50">
              Property Listed Successfully! 🚀
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-2 mb-6">
              Your property in <strong className="text-gray-900 dark:text-zinc-200">{society}</strong> is now visible to thousands of active buyers and investors.
            </p>

            {/* Quick Share Box */}
            <div className="bg-gray-50 dark:bg-zinc-900/60 border border-gray-200/80 dark:border-zinc-800 rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1 truncate">{title}</p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  readOnly
                  value={listingUrl}
                  className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-600 dark:text-zinc-300"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to={`/listing/${listingId}`}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>View Live Listing</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>My Dashboard</span>
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <Link to="/add-property" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Post Another Property</span>
              </Link>

              <Link to="/properties" className="text-gray-500 hover:underline">
                Back to Marketplace
              </Link>
            </div>
          </>
        ) : type === 'verification' ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs font-bold mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Under Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-zinc-50">
              Verification Request Submitted! 🛡️
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-2 mb-6">
              Our compliance team is verifying your FBR NTN and society registration documents. Verified badges are typically approved within 12-24 hours.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <span>Back to Dashboard</span>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-zinc-50">
              Inquiry Sent to Seller! 💬
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-2 mb-6">
              The property owner has received your private inquiry and contact details. You will be contacted shortly.
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              <span>Explore More Properties</span>
            </Link>
          </>
        )}

      </div>
    </div>
  );
}
