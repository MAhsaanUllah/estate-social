import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Star, Phone, Mail, Calendar, Award, 
  CheckCircle, ShieldCheck, Share2, Copy, Check, MessageCircle,
  ExternalLink, Play, QrCode, X, Sparkles, TrendingUp, Users,
  Globe, Video, Layers, FileCheck, Loader2, ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import FeedCard from '../components/FeedCard';
import { formatPrice, getWhatsAppLink } from '../utils/formatters';

export default function AgentProfile() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [agentListings, setAgentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('listings');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadAgentData = async () => {
      try {
        const agentRes = await api.get(`/users/${id}`);
        if (!isMounted) return;
        const loadedAgent = agentRes.data.user;
        setAgent(loadedAgent);

        // Fetch their real active listings
        const listingsRes = await api.get(`/listings/agent/${loadedAgent._id}`);
        if (isMounted) {
          setAgentListings(listingsRes.data.listings || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Agent profile not found');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      loadAgentData();
      window.scrollTo(0, 0);
    }

    return () => { isMounted = false; };
  }, [id]);

  const handleCopyBioLink = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    toast.success('Bio link copied! Paste into your TikTok bio or YouTube description.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-600 dark:text-zinc-400">Loading verified agency profile...</p>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-[70vh] bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-2xl mb-4 text-red-600">
          <Building2 className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-2">Agent Profile Not Found</h2>
        <p className="text-gray-600 dark:text-zinc-400 max-w-md mb-6">
          The agent handle <strong className="text-gray-900 dark:text-zinc-100">@{id}</strong> is not registered or has been moved.
        </p>
        <Link
          to="/agents"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse Verified Agent Directory</span>
        </Link>
      </div>
    );
  }

  const profileUrl = `${window.location.origin}/@${agent.slug || agent.username || agent._id}`;
  const bioHandle = `@${agent.slug || agent.username || 'agent'}`;
  const phoneFormatted = (agent.phone || '03001234567').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20 text-gray-900 dark:text-zinc-50 transition-colors duration-200">
      <Helmet>
        <title>{agent.agencyName || agent.name} | EstateSocial Verified Realtor</title>
        <meta name="description" content={`View ${agent.agencyName || agent.name} verified property portfolio in ${agent.city || 'Pakistan'}. Connect directly on WhatsApp.`} />
      </Helmet>

      {/* ========================================================
          1. HERO FACEBOOK / LINK-IN-BIO BANNER & COVER
      ======================================================== */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 sm:h-72 w-full overflow-hidden bg-gray-900 relative">
          <img
            src={agent.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop'}
            alt="Agency cover banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090E17] via-black/40 to-transparent" />
        </div>

        {/* Hero Profile Bar Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24 bg-white dark:bg-[#0B111E] rounded-3xl border border-gray-200/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xl mb-8">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Left: Avatar + Title Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative">
                  <img
                    src={agent.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'}
                    alt={agent.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-zinc-900 shadow-xl border border-gray-200 dark:border-zinc-700"
                  />
                  {agent.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-xl shadow-md border-2 border-white dark:border-zinc-900" title="Verified Realtor">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-zinc-50">
                      {agent.agencyName || agent.name}
                    </h1>
                    {agent.verified ? (
                      <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-lg text-xs flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Verified Partner</span>
                      </span>
                    ) : (
                      <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold px-2 py-0.5 rounded-lg text-xs">
                        Registered Member
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                    {agent.name} <span className="text-gray-400">• {agent.designation || 'Real Estate Advisor'}</span>
                  </p>

                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{agent.address || `${agent.city || 'Pakistan'}`}</span>
                  </p>

                  {/* Trust Metrics Pill Bar */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{agent.rating || 4.9} ({agent.reviewsCount || 0} reviews)</span>
                    </span>
                    <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-2.5 py-1 rounded-lg">
                      🏢 {agentListings.length} Active Listings
                    </span>
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg">
                      💼 {agent.dealsClosed || 'Verified Transactions'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: TikTok / YouTube Bio & Contact CTAs */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                
                {/* 1-Click WhatsApp Button */}
                {agent.phone && (
                  <a
                    href={getWhatsAppLink(agent.phone, `Hello ${agent.name}, I am contacting you through your EstateSocial agency profile: ${profileUrl}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle className="h-4 w-4 fill-white" />
                    <span>Direct WhatsApp Chat</span>
                  </a>
                )}

                {/* Direct Call & QR Card Buttons */}
                <div className="flex items-center gap-2">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-zinc-100 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{agent.phone}</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="p-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl transition-colors"
                    title="View QR Business Card"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyBioLink}
                    className={`p-2.5 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold ${
                      copiedLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                    title="Copy Profile Link for TikTok/YouTube Bio"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                {/* Social Channels Row (Sanitized URLs) */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {agent.socialLinks?.tiktok && (agent.socialLinks.tiktok.startsWith('http://') || agent.socialLinks.tiktok.startsWith('https://')) && (
                    <a href={agent.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-500 hover:text-black dark:hover:text-white px-2 py-1 rounded bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                      TikTok
                    </a>
                  )}
                  {agent.socialLinks?.youtube && (agent.socialLinks.youtube.startsWith('http://') || agent.socialLinks.youtube.startsWith('https://')) && (
                    <a href={agent.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                      YouTube
                    </a>
                  )}
                  {agent.socialLinks?.instagram && (agent.socialLinks.instagram.startsWith('http://') || agent.socialLinks.instagram.startsWith('https://')) && (
                    <a href={agent.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-pink-600 hover:text-pink-700 px-2 py-1 rounded bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900">
                      Instagram
                    </a>
                  )}
                </div>

              </div>

            </div>

            {/* Creator Bio Link Callout Banner */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50/40 dark:bg-emerald-950/20 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-4 sm:p-6 rounded-b-3xl">
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Official Creator Bio Link:</span>
                  <code className="bg-white dark:bg-zinc-900 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono text-xs">
                    estatesocial.pk/{bioHandle}
                  </code>
                </p>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                  Add this link to your TikTok Bio, Instagram Bio, and YouTube video descriptions to receive direct WhatsApp inquiries.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyBioLink}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Bio Link'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          2. PROFILE CONTENT TABS (Listings, Videos, Credentials)
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-zinc-800 mb-8 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-gray-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Active Listings ({agentListings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === 'credentials'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-gray-900'
            }`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Verification & Credentials</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE LISTINGS PORTFOLIO */}
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50">
                Verified Inventory Portfolio
              </h2>
              <span className="text-xs text-gray-500">0% Middleman Overcharging • Direct Verified Deals</span>
            </div>

            {agentListings.length === 0 ? (
              <div className="bg-white dark:bg-[#0B111E] rounded-3xl border border-gray-200/80 dark:border-zinc-800 p-12 text-center">
                <Building2 className="h-12 w-12 text-gray-300 dark:text-zinc-700 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-base">No active listings currently published</h3>
                <p className="text-xs text-gray-500 mt-1">This agent hasn't published active listings on the marketplace yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {agentListings.map((item) => (
                  <FeedCard key={item._id} listing={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEGAL CREDENTIALS & FBR BADGE */}
        {activeTab === 'credentials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0B111E] rounded-3xl border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <span>Verified Legal & Tax Status</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-xl">
                  <span className="font-semibold text-gray-600 dark:text-zinc-400">FBR Active Tax Filer Status</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {agent.kycData?.ntn || (agent.verified ? 'Active Tax Filer Verified' : 'Standard')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-xl">
                  <span className="font-semibold text-gray-600 dark:text-zinc-400">KYC Verification State</span>
                  <span className={`font-bold px-2.5 py-0.5 rounded-lg ${
                    agent.verified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {agent.verified ? 'Officially Verified 🛡️' : 'Standard Member'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900/60 rounded-xl">
                  <span className="font-semibold text-gray-600 dark:text-zinc-400">Operating City</span>
                  <span className="font-bold text-gray-900 dark:text-zinc-200">
                    {agent.city || 'Pakistan'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0B111E] rounded-3xl border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span>About {agent.agencyName || agent.name}</span>
              </h2>
              <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {agent.bio || `${agent.agencyName || agent.name} is a licensed real estate consultancy based in ${agent.city || 'Pakistan'}, offering direct verified property deals on EstateSocial.`}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          3. DIGITAL BUSINESS CARD QR MODAL
      ======================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQrModal(false)}>
          <div className="bg-white dark:bg-[#0B111E] rounded-3xl border border-gray-200 dark:border-zinc-800 max-w-sm w-full p-6 text-center shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>

            <img
              src={agent.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'}
              alt={agent.name}
              className="w-20 h-20 rounded-2xl mx-auto mb-3 object-cover border-2 border-emerald-500 shadow-md"
            />
            <h3 className="font-bold text-lg text-gray-900 dark:text-zinc-50">{agent.agencyName || agent.name}</h3>
            <p className="text-xs text-gray-500">{agent.name} • {agent.city}</p>

            {/* QR Code Canvas */}
            <div className="my-6 p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-500/40 w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-inner">
              <QrCode className="h-36 w-36 text-gray-900" />
            </div>

            <p className="text-xs text-gray-600 dark:text-zinc-400 mb-4">
              Scan with mobile camera to view verified listings & chat directly on WhatsApp.
            </p>

            <button
              type="button"
              onClick={handleCopyBioLink}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Direct Link</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}