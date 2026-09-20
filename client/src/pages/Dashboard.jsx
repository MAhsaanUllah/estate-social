import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyListings, deleteListing } from '../redux/listingSlice';
import { fetchReceivedInquiries, fetchSentInquiries, updateInquiry } from '../redux/inquirySlice';
import { fetchFavorites } from '../redux/favoriteSlice';
import { updateProfile } from '../redux/authSlice';
import FeedCard from '../components/FeedCard';
import { DashboardSkeleton } from '../components/Skeletons';
import { formatPrice, formatDate } from '../utils/formatters';
import { Plus, Trash2, Edit, Eye, MessageSquare, Filter, Phone, Loader2, Home, MapPin, ShieldCheck, Award, CheckCircle2, Upload, FileText, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { listings: myListings, loading: listingsLoading } = useSelector((state) => state.listings);
  const { inquiries: receivedInquiries, loading: inquiriesLoading } = useSelector((state) => state.inquiries);
  const [activeTab, setActiveTab] = useState('listings');
  const [filterStatus, setFilterStatus] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    agencyName: user?.agencyName || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Identity / KYC Verification Request State
  const [kycForm, setKycForm] = useState({
    cnic: user?.kycData?.cnic || '',
    ntn: user?.kycData?.ntn || user?.ntnNumber || '',
    certificateType: user?.kycData?.certificateType || 'DHA / LDA / CDA Registered Member',
    allotmentInfo: user?.kycData?.allotmentInfo || '',
    docUrl: user?.kycData?.docUrl || ''
  });
  const [kycSubmitted, setKycSubmitted] = useState(user?.kycStatus === 'Pending');
  const [kycSubmitting, setKycSubmitting] = useState(false);

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const { favorites, loading: favoritesLoading } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchMyListings());
    dispatch(fetchReceivedInquiries());
    dispatch(fetchSentInquiries());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      dispatch(deleteListing(id));
    }
  };

  const handleStatusChange = (inquiryId, newStatus) => {
    dispatch(updateInquiry({ id: inquiryId, data: { status: newStatus } }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    if (!kycForm.cnic) {
      toast.error('Please provide a valid CNIC number');
      return;
    }
    setKycSubmitting(true);
    try {
      const res = await api.post('/users/kyc', kycForm);
      setKycSubmitted(true);
      toast.success('Verification documents submitted for Admin review! 🛡️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit KYC verification');
    } finally {
      setKycSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPasswordUpdating(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully! 🔒');
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordUpdating(false);
    }
  };

  const filteredInquiries = filterStatus
    ? receivedInquiries.filter((i) => i.status === filterStatus)
    : receivedInquiries;

  const { inquiries: sentInquiries } = useSelector((state) => state.inquiries);

  const statusColors = {
    New: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
    Contacted: 'bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400',
    'Site Visit': 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400',
    Closed: 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400',
  };

  if (!user) return navigate('/login');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 pb-16">
      <Helmet>
        <title>Dashboard | EstateSocial</title>
        <meta name="description" content="Manage your property listings, inquiries, favorites, and profile on EstateSocial." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'admin' && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-900/90 to-indigo-900/90 border border-blue-700/50 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                <ShieldCheck className="h-6 w-6 text-blue-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Super Admin Console Active</h3>
                <p className="text-xs text-blue-200">Manage listing spam, review CNIC/NTN identity verifications, and approve JazzCash/EasyPaisa payments.</p>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="primary" className="bg-white text-blue-950 hover:bg-blue-50 font-bold text-xs h-9 px-4 rounded-xl flex items-center space-x-1.5 whitespace-nowrap shadow-sm">
                <span>Open Admin Console</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-50">Dashboard</h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">Manage your account and properties</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-2 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {['listings', 'inquiries', 'favorites', 'profile'].map((tab) => {
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? 'bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                      : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Listings Tab — all roles can list (persona: agents + owners) */}
        {activeTab === 'listings' && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50">My Listings ({myListings.length})</h2>
              <Link to="/add-property">
                <Button variant="primary" className="h-9 px-4 rounded-lg flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Property</span>
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-zinc-800">
              {listingsLoading && myListings.length === 0 ? (
                <div className="p-6">
                  <DashboardSkeleton />
                </div>
              ) : myListings.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="bg-gray-50 dark:bg-zinc-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-zinc-700">
                    <Home className="h-10 w-10 text-gray-400 dark:text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-1">No listings yet</h3>
                  <p className="text-gray-500 dark:text-zinc-400 mb-6">Start building your portfolio by adding a property.</p>
                  <Link to="/add-property">
                    <Button variant="primary">
                      <Plus className="h-4 w-4 mr-2" /> Add Property
                    </Button>
                  </Link>
                </div>
              ) : (
                myListings.map((listing) => (
                  <div key={listing._id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={listing.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=80&fit=crop'}
                        alt={listing.title}
                        className="h-20 w-28 rounded-lg object-cover shadow-sm bg-gray-100 dark:bg-zinc-800"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-zinc-100">{listing.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center space-x-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{listing.society}{listing.phase && `, ${listing.phase}`}</span>
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                            statusColors[listing.status] || 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <p className="font-bold text-gray-900 dark:text-zinc-50 text-lg">{formatPrice(listing.price)}</p>
                      <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-zinc-800 pl-6">
                        <Link to={`/listing/${listing._id}`} className="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="View">
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link to={`/edit-property/${listing._id}`} className="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" title="Edit">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button type="button" onClick={() => handleDelete(listing._id)} className="p-2 text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            {/* Seller (Agent or Owner): Received Inquiries */}
            {
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50">Received Inquiries</h2>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 rounded-lg focus:ring-gray-900 dark:focus:ring-zinc-100 font-medium"
                    >
                      <option value="">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Site Visit">Site Visit</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {inquiriesLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 text-gray-900 dark:text-zinc-100 animate-spin" /></div>
                  ) : filteredInquiries.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="bg-gray-50 dark:bg-zinc-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-zinc-700">
                        <MessageSquare className="h-8 w-8 text-gray-400 dark:text-zinc-500" />
                      </div>
                      <p className="text-gray-500 dark:text-zinc-400 font-medium">No received inquiries match your criteria.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Buyer</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Property</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                          {filteredInquiries.map(inquiry => (
                            <tr key={inquiry._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="text-sm font-bold text-gray-900 dark:text-zinc-100">{inquiry.buyerName || inquiry.buyer?.name}</div>
                                <div className="text-sm text-gray-500 dark:text-zinc-400 flex items-center space-x-1 mt-0.5">
                                  <Phone className="h-3 w-3" />
                                  <span>{inquiry.buyerPhone}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/listing/${inquiry.listing?._id}`} className="text-sm font-semibold text-gray-900 dark:text-zinc-100 hover:underline">
                                  {inquiry.listing?.title || 'Unknown Property'}
                                </Link>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 max-w-xs" title={inquiry.message}>
                                  {inquiry.message || 'No message provided'}
                                </p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={inquiry.status}
                                  onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                                  className={`text-sm font-medium rounded-md border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm ${statusColors[inquiry.status] || 'text-gray-700 dark:text-zinc-300'}`}
                                >
                                  <option value="New">New</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Site Visit">Site Visit</option>
                                  <option value="Closed">Closed</option>
                                </select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                                {formatDate(inquiry.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            }

            {/* Buyer: Sent Inquiries */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50">Sent Inquiries</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {sentInquiries?.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">You haven't sent any inquiries yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                      <thead className="bg-gray-50 dark:bg-zinc-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Property</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Agent</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                        {sentInquiries?.map(inquiry => (
                          <tr key={inquiry._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link to={`/listing/${inquiry.listing?._id}`} className="text-sm font-semibold text-gray-900 dark:text-zinc-100 hover:underline">
                                {inquiry.listing?.title || 'Unknown Property'}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-zinc-100 font-medium">
                              {inquiry.agent?.name || 'Unknown Agent'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[inquiry.status] || 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200'}`}>
                                {inquiry.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                              {formatDate(inquiry.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            {favoritesLoading && favorites.length === 0 ? (
              <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 text-gray-900 dark:text-zinc-100 animate-spin" /></div>
            ) : favorites.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-12 text-center">
                <div className="bg-gray-50 dark:bg-zinc-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-zinc-700">
                  <svg className="h-8 w-8 text-gray-400 dark:text-zinc-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">No Saved Favorites</h2>
                <p className="text-gray-500 dark:text-zinc-400 max-w-md mx-auto mb-6">You haven't saved any properties yet. Explore the marketplace to save your favorite homes.</p>
                <Link to="/properties">
                  <Button variant="primary">
                    Explore Properties
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {favorites.map((listing) => (
                  <FeedCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-6">Profile Settings</h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">Full Name</label>
                    <Input 
                      type="text" 
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">Phone Number</label>
                    <Input 
                      type="tel" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">City</label>
                    <Input 
                      type="text" 
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                    />
                  </div>
                  {(user.role === 'agent' || user.role === 'admin') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">Agency Name</label>
                      <Input 
                        type="text" 
                        value={profileForm.agencyName}
                        onChange={(e) => setProfileForm({...profileForm, agencyName: e.target.value})}
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">Bio</label>
                    <textarea 
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-zinc-50 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-zinc-100/10 focus:border-gray-900 dark:focus:border-zinc-100 transition-all duration-200" 
                      placeholder="Tell buyers about yourself..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">Avatar URL</label>
                    <Input 
                      type="url" 
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({...profileForm, avatar: e.target.value})}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-gray-100 dark:border-zinc-800 pt-6">
                  <Button 
                    type="submit" 
                    disabled={profileSaving}
                    variant="primary"
                  >
                    {profileSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Pakistani Identity & Verification Card (CNIC / NTN / Allotment) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-8">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl ${user.verified ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600'}`}>
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50">Trust & Identity Verification</h2>
                      {user.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Badge Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                      {user.role === 'agent' 
                        ? 'Submit CNIC, FBR NTN, or DHA/LDA Society Member Certificate to earn the Blue Verified Realtor Badge.'
                        : 'Submit CNIC or Property Allotment Letter / Fard to earn the 100% Direct Owner Verified Badge.'}
                    </p>
                  </div>
                </div>
              </div>

              {user.verified ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Your profile holds maximum buyer trust</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">All your listings and public agent card display the official verified shield badge.</p>
                    </div>
                  </div>
                </div>
              ) : kycSubmitted ? (
                <div className="p-6 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 text-center">
                  <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-blue-950 dark:text-blue-200">Verification Request Under Admin Review</h3>
                  <p className="text-xs text-blue-800 dark:text-blue-400 mt-1 max-w-md mx-auto">
                    Your CNIC / registration documents have been submitted to our moderation team. You will receive a verified badge once approved (typically within 2-6 hours).
                  </p>
                </div>
              ) : (
                <form onSubmit={handleKycSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Pakistani CNIC Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. 35201-1234567-1"
                        value={kycForm.cnic}
                        onChange={(e) => setKycForm({ ...kycForm, cnic: e.target.value })}
                        required
                      />
                    </div>
                    {user.role === 'agent' ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                          FBR NTN or Tax Filer #
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. 7829103-4 (Active Tax Filer)"
                          value={kycForm.ntn}
                          onChange={(e) => setKycForm({ ...kycForm, ntn: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                          Property / Plot Allotment No.
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Plot # 452, Block C, Phase 5"
                          value={kycForm.allotmentInfo}
                          onChange={(e) => setKycForm({ ...kycForm, allotmentInfo: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Document / Certificate Type
                    </label>
                    <select
                      value={kycForm.certificateType}
                      onChange={(e) => setKycForm({ ...kycForm, certificateType: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                    >
                      <option value="DHA / LDA / CDA Registered Realtor">DHA / LDA / CDA Registered Realtor</option>
                      <option value="Local Property Dealer Association Member">Local Property Dealer Association Member</option>
                      <option value="Direct Owner Allotment Letter / Fard">Direct Owner Allotment Letter / Fard</option>
                      <option value="CNIC Front & Back Photo">CNIC Front & Back Photo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Document Scan / Photo URL (or Image Link)
                    </label>
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/your-doc-photo.jpg"
                      value={kycForm.docUrl}
                      onChange={(e) => setKycForm({ ...kycForm, docUrl: e.target.value })}
                    />
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">
                      🔒 Documents are securely stored with watermark encryption and strictly reviewed by EstateSocial compliance admins only.
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={kycSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-5 text-sm font-semibold flex items-center space-x-2"
                    >
                      {kycSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Submit For Verification</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100">Change Password</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Update your password to keep your account secure.</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)}>
                    Update Password
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-zinc-100">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Add an extra layer of security to your account.</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg">
                    Protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-zinc-50">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Current Password</label>
                <Input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">New Password (Min 6 chars)</label>
                <Input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
                <Input
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={passwordUpdating}>
                  {passwordUpdating ? 'Updating...' : 'Save Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;