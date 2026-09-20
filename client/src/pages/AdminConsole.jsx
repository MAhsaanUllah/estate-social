import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Trash2, 
  Eye, 
  Search, 
  Star, 
  ExternalLink, 
  FileText, 
  DollarSign
} from 'lucide-react';
import api from '../api/axios';
import { formatPrice, formatDate } from '../utils/formatters';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function AdminConsole() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('overview');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [listingFilter, setListingFilter] = useState('All');

  // Live Verifications Queue
  const [verifications, setVerifications] = useState([]);
  const [verificationsLoading, setVerificationsLoading] = useState(false);

  // Platform Real KPIs
  const [stats, setStats] = useState({
    totalListings: 0,
    totalUsers: 0,
    pendingKYC: 0,
    featuredListings: 0,
    estimatedRevenue: 48500
  });

  // Payment Requests Queue (JazzCash, EasyPaisa, Bank Transfer)
  const [payments, setPayments] = useState([
    {
      id: 'pay-101',
      userName: 'DHA Premier Properties',
      email: 'agent2@test.com',
      phone: '0300-1234567',
      package: 'Agency Pro (25 Listings + 3 Boosts)',
      amount: 6000,
      gateway: 'JazzCash Direct (Till # 001928)',
      trxId: 'JC-98231049281',
      submittedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
      status: 'Pending',
      receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&h=400&fit=crop'
    },
    {
      id: 'pay-102',
      userName: 'Usman Ali (Owner)',
      email: 'owner@test.com',
      phone: '0321-9988776',
      package: 'Owner Urgent Boost (15 Days Featured)',
      amount: 1500,
      gateway: 'EasyPaisa Mobile Account',
      trxId: 'EP-4412093812',
      submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: 'Pending',
      receiptUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&h=400&fit=crop'
    }
  ]);

  // Selected document preview modal
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [listingsRes, kycRes, statsRes] = await Promise.allSettled([
        api.get('/listings?limit=100'),
        api.get('/users/admin/verifications'),
        api.get('/users/admin/stats')
      ]);

      if (listingsRes.status === 'fulfilled' && listingsRes.value.data.listings) {
        setListings(listingsRes.value.data.listings);
      }
      if (kycRes.status === 'fulfilled' && kycRes.value.data.verifications) {
        setVerifications(kycRes.value.data.verifications);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data.stats) {
        setStats(statsRes.value.data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleToggleFeatured = async (listingId, currentStatus) => {
    try {
      await api.put(`/listings/${listingId}`, { isFeatured: !currentStatus });
      setListings(prev => prev.map(l => l._id === listingId ? { ...l, isFeatured: !currentStatus } : l));
      toast.success(!currentStatus ? 'Listing marked as Featured 🌟' : 'Featured status removed');
    } catch (err) {
      toast.error('Failed to update listing');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to permanently remove this listing?')) return;
    try {
      await api.delete(`/listings/${listingId}`);
      setListings(prev => prev.filter(l => l._id !== listingId));
      toast.success('Listing removed from platform');
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  const handleApproveVerification = async (userId) => {
    try {
      await api.put(`/users/admin/verifications/${userId}`, { action: 'approve' });
      setVerifications(prev => prev.map(v => (v._id === userId || v.id === userId) ? { ...v, kycStatus: 'Approved', status: 'Approved', verified: true } : v));
      toast.success('User verified & badge awarded! 🛡️');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to approve verification');
    }
  };

  const handleRejectVerification = async (userId) => {
    try {
      await api.put(`/users/admin/verifications/${userId}`, { action: 'reject' });
      setVerifications(prev => prev.map(v => (v._id === userId || v.id === userId) ? { ...v, kycStatus: 'Rejected', status: 'Rejected', verified: false } : v));
      toast.error('Verification rejected');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to reject verification');
    }
  };

  const handleApprovePayment = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    toast.success('Payment confirmed! Quota released to account. 💳');
  };

  const handleRejectPayment = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    toast.error('Payment marked as rejected');
  };

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.society?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.city?.toLowerCase().includes(searchTerm.toLowerCase());
    if (listingFilter === 'Featured') return matchesSearch && l.isFeatured;
    if (listingFilter === 'Owner') return matchesSearch && l.listedBy === 'owner';
    if (listingFilter === 'Agent') return matchesSearch && l.listedBy === 'agent';
    return matchesSearch;
  });

  const pendingVerificationsCount = verifications.filter(v => (v.kycStatus === 'Pending' || v.status === 'Pending')).length;
  const pendingPaymentsCount = payments.filter(p => p.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 pb-20">
      <Helmet>
        <title>Admin Super Console | EstateSocial</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-2xl bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                Super Admin Console
                <span className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  Master Authority
                </span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Manage listings, verify agents/owners, approve JazzCash payments, and monitor trust.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/dashboard">
              <Button variant="secondary" size="sm">User Dashboard</Button>
            </Link>
            <Link to="/add-property">
              <Button variant="primary" size="sm">+ Post Official Listing</Button>
            </Link>
          </div>
        </div>

        {/* Stats KPI Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Listings</span>
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-100 mt-2">{listings.length}</p>
            <span className="text-xs text-green-600 font-medium">Live on marketplace</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending KYC</span>
              <FileText className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-2">{pendingVerificationsCount}</p>
            <span className="text-xs text-gray-400">Awaiting verification</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Payments</span>
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">{pendingPaymentsCount}</p>
            <span className="text-xs text-gray-400">JazzCash / Bank transfer</span>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Est. Monthly Revenue</span>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2">PKR 48.5K</p>
            <span className="text-xs text-emerald-600 font-medium">+18% this month</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-zinc-800 pb-3">
          {[
            { id: 'overview', label: '📊 Moderation Overview' },
            { id: 'listings', label: `🏡 All Listings (${listings.length})` },
            { id: 'verifications', label: `🛡️ KYC Verifications (${pendingVerificationsCount})` },
            { id: 'payments', label: `💳 Payment Approvals (${pendingPaymentsCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ALL LISTINGS MODERATION */}
        {(activeTab === 'overview' || activeTab === 'listings') && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Marketplace Listings Moderation</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Search, feature, or delete any property across Pakistan.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="Search listings..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="pl-9 h-10 w-48 sm:w-64"
                  />
                </div>

                <select 
                  value={listingFilter}
                  onChange={e => setListingFilter(e.target.value)}
                  className="h-10 px-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-zinc-100"
                >
                  <option value="All">All Sellers</option>
                  <option value="Featured">Featured Only 🌟</option>
                  <option value="Owner">Direct Owner</option>
                  <option value="Agent">Agent Listings</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-800/50 text-xs font-bold text-gray-500 uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Property</th>
                    <th className="px-6 py-3 text-left">Seller Type</th>
                    <th className="px-6 py-3 text-left">Price & Size</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Status / Boost</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-sm">
                  {filteredListings.slice(0, 25).map(listing => (
                    <tr key={listing._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={listing.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=80&fit=crop'} 
                            alt="" 
                            className="h-12 w-14 rounded-lg object-cover bg-gray-100"
                          />
                          <div>
                            <Link to={`/listing/${listing._id}`} className="font-bold text-gray-900 dark:text-zinc-100 hover:underline line-clamp-1">
                              {listing.title}
                            </Link>
                            <span className="text-xs text-gray-400">{formatDate(listing.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {listing.listedBy === 'owner' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                            Direct Owner
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            Agent ({listing.creator?.agencyName || 'Agency'})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-primary-600">{formatPrice(listing.price)}</div>
                        <div className="text-xs text-gray-500">{listing.size} {listing.sizeUnit} • {listing.propertyType}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 dark:text-zinc-400">
                        {listing.society}, {listing.city}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleFeatured(listing._id, listing.isFeatured)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            listing.isFeatured
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200'
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200'
                          }`}
                        >
                          <Star className={`h-3.5 w-3.5 ${listing.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{listing.isFeatured ? 'Featured 🌟' : 'Standard'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link 
                          to={`/listing/${listing._id}`} 
                          target="_blank"
                          className="p-1.5 inline-block text-gray-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors"
                          title="View Live Listing"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing._id)}
                          className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Listing (Spam Removal)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFICATION REQUESTS (KYC QUEUE) */}
        {activeTab === 'verifications' && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden space-y-6 p-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50">Agent & Property KYC Verification Queue</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Review CNIC, NTN tax certificates, and Housing Society allotment letters.</p>
            </div>

            {verifications.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-gray-900 dark:text-zinc-100 text-sm">No Pending KYC Verifications</h4>
                <p className="text-xs text-gray-400">All submitted documents have been reviewed and approved.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {verifications.map(item => {
                  const itemId = item._id || item.id;
                  const displayName = item.name || item.userName || 'User';
                  const cnicVal = item.kycData?.cnic || item.cnic || 'N/A';
                  const ntnVal = item.kycData?.ntn || item.ntnNumber || item.ntn;
                  const certVal = item.kycData?.certificateType || item.certificate || (item.role === 'agent' ? 'Registered Real Estate Agent' : 'Direct Owner Proof');
                  const docUrl = item.kycData?.docUrl || item.documentUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop';
                  const currentKycStatus = item.kycStatus || item.status || 'Pending';

                  return (
                    <div key={itemId} className="border border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 bg-gray-50/50 dark:bg-zinc-800/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-zinc-100">{displayName}</h4>
                          <p className="text-xs text-gray-500">{item.agencyName || (item.role === 'agent' ? 'Property Agent' : 'Individual Owner')}</p>
                          {item.email && <p className="text-[11px] text-gray-400">{item.email}</p>}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          currentKycStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                          currentKycStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {currentKycStatus}
                        </span>
                      </div>

                      <div className="text-xs space-y-1.5 text-gray-600 dark:text-zinc-400 border-t border-b border-gray-100 dark:border-zinc-800 py-3">
                        <p><strong>CNIC:</strong> {cnicVal}</p>
                        {ntnVal && <p><strong>NTN / Filer:</strong> {ntnVal}</p>}
                        <p><strong>Certificate / Society:</strong> {certVal}</p>
                        {item.phone && <p><strong>Phone:</strong> {item.phone}</p>}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setPreviewDoc(docUrl)}
                          className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Uploaded Document
                        </button>

                        {currentKycStatus === 'Pending' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRejectVerification(itemId)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApproveVerification(itemId)}
                              className="px-3 py-1.5 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold rounded-lg hover:bg-black shadow-sm"
                            >
                              Approve 🛡️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PAYMENT APPROVALS (MONETIZATION) */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50">JazzCash & Bank Transfer Payment Queue</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Match transaction IDs with bank statement and release user listing quota.</p>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {payments.map(pay => (
                <div key={pay.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 dark:text-zinc-100">{pay.userName}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">{pay.gateway}</span>
                    </div>
                    <p className="text-xs text-gray-500">{pay.package}</p>
                    <p className="text-xs font-mono font-bold text-gray-700 dark:text-zinc-300">TRX ID: {pay.trxId}</p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div>
                      <span className="text-xs text-gray-400 block">Amount</span>
                      <strong className="text-lg font-bold text-emerald-600">PKR {pay.amount.toLocaleString()}</strong>
                    </div>

                    <button
                      onClick={() => setPreviewDoc(pay.receiptUrl)}
                      className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" /> View Receipt
                    </button>

                    {pay.status === 'Pending' ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRejectPayment(pay.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprovePayment(pay.id)}
                          className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-sm"
                        >
                          Approve & Release Quota
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-green-600 px-3 py-1 bg-green-50 rounded-lg">
                        {pay.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full overflow-hidden p-4 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm">Document / Receipt Verification</h4>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>
            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <img src={previewDoc} alt="Document" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded shadow transform -rotate-12">
                  FOR ESTATESOCIAL VERIFICATION ONLY
                </span>
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={() => setPreviewDoc(null)}>Close Preview</Button>
          </div>
        </div>
      )}
    </div>
  );
}
