import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createListing, fetchMyListings } from '../redux/listingSlice';
import ImageUploader from '../components/ImageUploader';
import { 
  Plus, X, Image, MapPin, Tag, DollarSign, Home, Building2, 
  Warehouse, Upload, Loader2, Save, AlertCircle, CheckCircle,
  TrendingUp, Layers, Navigation, Car, Zap, ShieldCheck,
  Compass, Bed, Bath, UtensilsCrossed, Sun, KeyRound
} from 'lucide-react';
import { PAKISTAN_CITIES, SIZE_UNITS } from '../utils/constants';
import { step1Schema, step2Schema, step3Schema } from '../utils/propertySchemas';
import { Helmet } from 'react-helmet-async';

const PROPERTY_TYPES = [
  { value: 'House', label: 'House / Villa', icon: Home, desc: 'Independent villa, bungalow or portion' },
  { value: 'Commercial', label: 'Commercial Plaza / Shop', icon: Warehouse, desc: 'Plaza, office floor, shop, building' },
  { value: 'Plot', label: 'Plot / Land', icon: MapPin, desc: 'Residential plot, commercial plot, file' },
  { value: 'Flat', label: 'Apartment / Flat', icon: Building2, desc: 'Luxury apartment, penthouse, studio' },
  { value: 'Farmhouse', label: 'Farmhouse / Estate', icon: Home, desc: 'Rural luxury farmhouse, retreat' },
];

const PURPOSE_TYPES = [
  { value: 'Sale', label: 'For Sale' },
  { value: 'Rent', label: 'For Rent' },
];

const TYPE_SPECIFIC_FEATURES = {
  Commercial: [
    'Main Boulevard Frontage',
    'Capsule Elevator',
    'Dedicated Customer Parking',
    'Fire Safety Certified',
    '100% Standby Generator Backup',
    'Double Glass Facade',
    'Commercial NOC Approved',
    'CCTV & 24/7 Security',
    'High Footfall Commercial Area',
    'Central HVAC / Air Conditioning'
  ],
  House: [
    'Dirty & Clean Kitchen',
    'Servant Quarter with Bath',
    'Covered Car Porch (2-3 Cars)',
    'Swimming Pool & Lawn',
    'Solar System (10-15kW)',
    'Solid Wood Doors & Spanish Tiles',
    'Double Glazed Windows',
    '24/7 Gated Security Guard',
    'Underground Electricity',
    'Sui Gas Connected'
  ],
  Farmhouse: [
    'Private Swimming Pool',
    'Lush Green Lawn & Fruit Orchard',
    '20kW+ Solar Power System',
    'BBQ Gazebo Deck',
    'Servant Quarters & Guard Post',
    'High Boundary Wall Security',
    'Borehole & Continuous Water Supply',
    'Peaceful Countryside Access'
  ],
  Plot: [
    'Corner Plot (Extra Value)',
    'Main Boulevard Facing',
    'Park Facing Plot',
    'Immediate Ready Possession',
    'Underground Utilities (Power/Gas/Water)',
    '100% Clear DHA / CDA Verified Title',
    'Wide 60 - 80 Ft Road',
    'Ready for Construction'
  ],
  Flat: [
    'Margalla / Sea / Skyline View',
    'Biometric High-Speed Elevators',
    '100% Standby Generator Backup',
    'Dedicated Covered Basement Parking',
    'Rooftop Gym, Pool & Clubhouse',
    '24/7 Concierge & Maintenance Staff',
    'Intercom & CCTV System',
    'Imported Kitchen & Wardrobes'
  ]
};

function AddProperty() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.listings);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: 'Sale',
    propertyType: 'House',
    city: '',
    society: '',
    phase: '',
    block: '',
    landmark: '',
    possessionStatus: 'Ready',
    size: '',
    sizeUnit: 'Marla',
    price: '',
    beds: '',
    baths: '',
    kitchens: '',
    rentalIncome: '',
    totalFloors: '',
    roadWidth: '',
    parkingCapacity: '',
    powerBackup: '',
    plotType: 'Standard',
    dimensions: '',
    floorLevel: '',
    viewType: '',
    carParking: '',
    mapUrl: '',
    isInstallmentAvailable: false,
    downPayment: '',
    monthlyInstallment: '',
    durationMonths: '',
    images: [],
    features: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const validateStep = () => {
    let schema;
    if (step === 1) schema = step1Schema;
    else if (step === 2) schema = step2Schema;
    else if (step === 3) schema = step3Schema;

    const result = schema.safeParse(formData);
    if (!result.success) {
      const formatted = {};
      result.error.issues.forEach(issue => {
        formatted[issue.path[0]] = issue.message;
      });
      setErrors(formatted);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const processFiles = (files) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...formData.images];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;
      if (newImages.length >= 10) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        newImages.push(reader.result);
        if (newImages.length <= 10) {
          setFormData(prev => ({ ...prev, images: newImages }));
          setImagePreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e) => {
    processFiles(e.target.files);
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setSaving(true);
    const result = await dispatch(createListing(formData));
    setSaving(false);

    if (createListing.fulfilled.match(result)) {
      dispatch(fetchMyListings());
      navigate('/dashboard');
    }
  };

  const nextStep = () => {
    if (validateStep() && step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const currentFeaturesList = TYPE_SPECIFIC_FEATURES[formData.propertyType] || TYPE_SPECIFIC_FEATURES.House;

  const steps = [
    { num: 1, label: 'Basic Info', desc: 'Title, category & purpose' },
    { num: 2, label: 'Location & Specs', desc: 'Address, size, price & features' },
    { num: 3, label: 'Details & Photos', desc: 'Amenities, installments & images' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 transition-colors duration-200">
      <Helmet>
        <title>Add Property | EstateSocial</title>
        <meta name="description" content="List a new residential or commercial property on EstateSocial." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Post New Property</h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
                List your residential, commercial, or land asset on Pakistan's premier marketplace
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full w-fit">
              Step {step} of 3
            </span>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`flex flex-col items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    step > s.num ? 'bg-emerald-600 border-emerald-600 text-white' :
                    step === s.num ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' :
                    'bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-400'
                  }`}>
                    {step > s.num ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-bold text-sm">{s.num}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-bold ${step >= s.num ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-400'}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${step > i + 1 ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-zinc-800'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 overflow-hidden shadow-sm p-6 sm:p-8">
          
          {/* ========================================================
              STEP 1: BASIC INFO & TYPE SELECTION
          ======================================================== */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-1">Property Category & Purpose</h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Select what type of property you are listing</p>
              </div>

              {/* Purpose Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {PURPOSE_TYPES.map(p => (
                    <label key={p.value} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="purpose"
                        value={p.value}
                        checked={formData.purpose === p.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-3.5 border-2 rounded-xl text-center font-bold text-sm transition-all ${
                        formData.purpose === p.value
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 shadow-sm'
                          : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300'
                      }`}>
                        {p.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Type Grid */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PROPERTY_TYPES.map(p => {
                    const Icon = p.icon;
                    const isSelected = formData.propertyType === p.value;
                    return (
                      <label key={p.value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="propertyType"
                          value={p.value}
                          checked={isSelected}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-xl transition-all h-full flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 shadow-sm ring-1 ring-emerald-500'
                            : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-700'
                        }`}>
                          <div>
                            <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
                            <p className={`font-bold text-sm ${isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-gray-900 dark:text-zinc-200'}`}>
                              {p.label}
                            </p>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                            {p.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-4 pt-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Listing Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'}`}
                    placeholder={
                      formData.propertyType === 'Commercial'
                        ? 'e.g., 5 Marla Triple Storey Commercial Plaza on Main Boulevard'
                        : formData.propertyType === 'Plot'
                        ? 'e.g., 1 Kanal Residential Corner Possession Plot in DHA Phase 7'
                        : 'e.g., 1 Kanal Modern Spanish Villa with Swimming Pool in DHA Phase 6'
                    }
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white dark:bg-zinc-900 border rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-zinc-700'}`}
                    placeholder="Highlight key construction quality, architectural features, rental income, and society advantages..."
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 2: LOCATION, PRICING & CATEGORY SPECIFICS
          ======================================================== */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-1">Location, Pricing & Specs</h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Complete address and category-specific property details</p>
              </div>

              {/* Address Breakdown */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                  >
                    <option value="">Select City</option>
                    {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="society" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Housing Society / Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="society"
                    name="society"
                    type="text"
                    required
                    value={formData.society}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    placeholder="e.g., DHA Phase 6, Bahria Town, Gulberg Greens"
                  />
                  {errors.society && <p className="mt-1 text-xs text-red-600">{errors.society}</p>}
                </div>
              </div>

              {/* Phase / Block / Landmark */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="phase" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Phase</label>
                  <input
                    id="phase"
                    name="phase"
                    type="text"
                    value={formData.phase}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white"
                    placeholder="e.g., Phase 6 / Sector C"
                  />
                </div>
                <div>
                  <label htmlFor="block" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Block / Sector</label>
                  <input
                    id="block"
                    name="block"
                    type="text"
                    value={formData.block}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white"
                    placeholder="e.g., Block J / Business Bay"
                  />
                </div>
                <div>
                  <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Nearby Landmark</label>
                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white"
                    placeholder="e.g., Near Commercial Market / Park"
                  />
                </div>
              </div>

              {/* Size & Price */}
              <div className="grid md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label htmlFor="size" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Area Size <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="size"
                    name="size"
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white"
                    placeholder="e.g., 5, 10, 1"
                  />
                  {errors.size && <p className="mt-1 text-xs text-red-600">{errors.size}</p>}
                </div>

                <div>
                  <label htmlFor="sizeUnit" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="sizeUnit"
                    name="sizeUnit"
                    required
                    value={formData.sizeUnit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white"
                  >
                    {SIZE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Asking Price (PKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="50000"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-bold"
                    placeholder="e.g., 45000000"
                  />
                  {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                </div>
              </div>

              {/* DYNAMIC ATTRIBUTES: COMMERCIAL */}
              {formData.propertyType === 'Commercial' && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm flex items-center gap-2">
                    <Warehouse className="h-4 w-4" />
                    <span>Commercial Property Highlights</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="rentalIncome" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Monthly Rental Income (PKR/mo)
                      </label>
                      <input
                        id="rentalIncome"
                        name="rentalIncome"
                        type="number"
                        value={formData.rentalIncome}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., 450000"
                      />
                    </div>
                    <div>
                      <label htmlFor="totalFloors" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Total Floors
                      </label>
                      <input
                        id="totalFloors"
                        name="totalFloors"
                        type="text"
                        value={formData.totalFloors}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., Triple Storey + Lower Ground"
                      />
                    </div>
                    <div>
                      <label htmlFor="roadWidth" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Road Exposure
                      </label>
                      <input
                        id="roadWidth"
                        name="roadWidth"
                        type="text"
                        value={formData.roadWidth}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., 150 Ft Main Boulevard"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC ATTRIBUTES: HOUSE / FARMHOUSE */}
              {(formData.propertyType === 'House' || formData.propertyType === 'Farmhouse') && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Residential Room Specs</span>
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="beds" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Bedrooms</label>
                      <input
                        id="beds"
                        name="beds"
                        type="number"
                        min="0"
                        value={formData.beds}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., 5"
                      />
                    </div>
                    <div>
                      <label htmlFor="baths" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Bathrooms</label>
                      <input
                        id="baths"
                        name="baths"
                        type="number"
                        min="0"
                        value={formData.baths}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., 6"
                      />
                    </div>
                    <div>
                      <label htmlFor="kitchens" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Kitchens</label>
                      <input
                        id="kitchens"
                        name="kitchens"
                        type="number"
                        min="0"
                        value={formData.kitchens}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., 2"
                      />
                    </div>
                    <div>
                      <label htmlFor="carParking" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Car Porch</label>
                      <input
                        id="carParking"
                        name="carParking"
                        type="text"
                        value={formData.carParking}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., 3 SUVs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC ATTRIBUTES: PLOTS */}
              {formData.propertyType === 'Plot' && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-purple-900 dark:text-purple-300 text-sm flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span>Plot Category & Dimensions</span>
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="plotType" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Plot Location</label>
                      <select
                        id="plotType"
                        name="plotType"
                        value={formData.plotType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                      >
                        <option value="Standard">Standard Plot</option>
                        <option value="Corner">Corner Plot</option>
                        <option value="Main Boulevard">Main Boulevard Facing</option>
                        <option value="Park Facing">Park Facing</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="dimensions" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Plot Dimensions</label>
                      <input
                        id="dimensions"
                        name="dimensions"
                        type="text"
                        value={formData.dimensions}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                        placeholder="e.g., 50 x 90 Feet"
                      />
                    </div>
                    <div>
                      <label htmlFor="possessionStatus" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Possession</label>
                      <select
                        id="possessionStatus"
                        name="possessionStatus"
                        value={formData.possessionStatus}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-sm"
                      >
                        <option value="Ready">Immediate Possession Ready</option>
                        <option value="UnderConstruction">Under Development</option>
                        <option value="OnApplication">Balloting / File</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Map URL */}
              <div>
                <label htmlFor="mapUrl" className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Google Maps / GPS Coordinates Link <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                </label>
                <input
                  id="mapUrl"
                  name="mapUrl"
                  type="url"
                  value={formData.mapUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white"
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>
            </div>
          )}

          {/* ========================================================
              STEP 3: FEATURES, INSTALLMENTS & PHOTOS
          ======================================================== */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-50 mb-1">Amenities & Photos</h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Select verified amenities and upload clear photos</p>
              </div>

              {/* Suggested Features based on Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-3">
                  Key Features ({formData.propertyType})
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentFeaturesList.map(feature => {
                    const isChecked = formData.features.includes(feature);
                    return (
                      <button
                        type="button"
                        key={feature}
                        onClick={() => toggleFeature(feature)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : 'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:border-gray-300'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '} {feature}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Installment Plan Toggle */}
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isInstallmentAvailable"
                    checked={formData.isInstallmentAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="font-bold text-sm text-gray-900 dark:text-zinc-100">
                    Offer Installment Payment Schedule
                  </span>
                </label>

                {formData.isInstallmentAvailable && (
                  <div className="grid md:grid-cols-3 gap-4 mt-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div>
                      <label htmlFor="downPayment" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Down Payment (PKR)</label>
                      <input
                        id="downPayment"
                        name="downPayment"
                        type="number"
                        value={formData.downPayment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm"
                        placeholder="e.g. 10000000"
                      />
                    </div>
                    <div>
                      <label htmlFor="monthlyInstallment" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Monthly Installment (PKR)</label>
                      <input
                        id="monthlyInstallment"
                        name="monthlyInstallment"
                        type="number"
                        value={formData.monthlyInstallment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm"
                        placeholder="e.g. 500000"
                      />
                    </div>
                    <div>
                      <label htmlFor="durationMonths" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">Duration (Months)</label>
                      <input
                        id="durationMonths"
                        name="durationMonths"
                        type="number"
                        value={formData.durationMonths}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm"
                        placeholder="e.g. 24"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Photos Uploader */}
              <div className="border-t border-gray-200 dark:border-zinc-800 pt-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                  Property Photos <span className="text-gray-400 font-normal text-xs">(Up to 10 photos)</span>
                </label>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <label htmlFor="images" className="cursor-pointer font-bold text-emerald-600 hover:text-emerald-700 text-sm">
                    Click to upload property photos
                  </label>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP up to 5MB each</p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 dark:border-zinc-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-xl font-bold text-sm transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Publish Listing Free</span>
              </button>
            )}
          </div>

        </div>
      </form>
    </div>
  );
}

export default AddProperty;