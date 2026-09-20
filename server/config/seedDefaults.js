const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Listing = require('../models/Listing');

const IMG = {
  house1: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  house2: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  house3: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  house4: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
  house5: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  plot1: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
  plot2: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
  flat1: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  flat2: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  flat3: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  shop1: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop',
  office1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
  office2: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
};

const F = {
  houseF: ['Dirty & Clean Kitchen', 'Servant Quarter with Bath', 'Covered Car Porch (2-3 Cars)', 'Solar System (10-15kW)', 'Solid Wood Doors', '24/7 Gated Security Guard', 'Sui Gas Connected'],
  commercialF: ['Main Boulevard Frontage', 'Capsule Elevator', 'Dedicated Customer Parking', '100% Standby Generator Backup', 'Double Glass Facade', 'CCTV & 24/7 Security'],
  plotF: ['Corner Plot (Extra Value)', 'Main Boulevard Facing', 'Immediate Ready Possession', 'Underground Utilities (Power/Gas/Water)', '100% Clear DHA / CDA Verified Title'],
  flatF: ['Margalla / Sea / Skyline View', 'High-Speed Elevators', '100% Standby Generator Backup', 'Dedicated Covered Basement Parking', '24/7 Concierge Staff'],
  farmhouseF: ['Private Swimming Pool', 'Lush Green Lawn & Fruit Orchard', '20kW+ Solar Power System', 'BBQ Gazebo Deck', 'Servant Quarters & Guard Post'],
};

const AGENTS = [
  {
    name: 'Chaudhry Nadeem Akhtar',
    username: 'al-haram-realtors',
    slug: 'al-haram-realtors',
    agencyName: 'Al-Haram Real Estate & Builders',
    email: 'alharam@estatesocial.com',
    phone: '+92 300 8456123',
    city: 'Lahore',
    address: 'Plaza #42, Main Broadway, Commercial Phase 6, DHA Lahore',
    designation: 'Managing Director & FBR Active Filer',
    bio: 'Al-Haram Real Estate has been DHA Lahore’s premier commercial and luxury residential consultancy for 14+ years. Specializing in high-yield commercial plazas, 1-2 Kanal designer Spanish villas in Phase 6, 7 & 8, and transfer files.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop',
    verified: true,
    kycStatus: 'Approved',
    kycData: {
      cnic: '35201-1234567-1',
      ntn: '7829103-4 (Active Tax Filer)',
      certificateType: 'DHA Lahore Registered Realtor #1042',
      submittedAt: new Date('2026-01-10'),
      reviewedAt: new Date('2026-01-11'),
    },
    socialLinks: {
      whatsapp: '+92 300 8456123',
      youtube: 'https://youtube.com/@alharamrealtors',
      tiktok: 'https://tiktok.com/@alharam_estates',
      instagram: 'https://instagram.com/alharam_properties',
    },
    rating: 4.9,
    reviewsCount: 84,
    dealsClosed: 'PKR 1.2 Arab+',
  },
  {
    name: 'Syed Tariq Shah',
    username: 'dha-premier',
    slug: 'dha-premier',
    agencyName: 'DHA Premier Properties',
    email: 'premier@estatesocial.com',
    phone: '+92 321 8899771',
    city: 'Lahore',
    address: 'Sector C Commercial, Phase 5, DHA Lahore',
    designation: 'Senior Property Advisor',
    bio: 'Over a decade of dedicated real estate consultancy in DHA Lahore Phases 1 through 9 Prisma. 100% legal title guaranteed.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=600&fit=crop',
    verified: true,
    kycStatus: 'Approved',
    socialLinks: { whatsapp: '+92 321 8899771' },
    rating: 4.8,
    reviewsCount: 42,
    dealsClosed: 'PKR 85 Crore+',
  },
  {
    name: 'Kashif Mehmood',
    username: 'clifton-heritage',
    slug: 'clifton-heritage',
    agencyName: 'Clifton Heritage Realtors',
    email: 'clifton@estatesocial.com',
    phone: '+92 333 2211445',
    city: 'Karachi',
    address: 'Block 2, Near Bilawal House, Clifton Karachi',
    designation: 'CEO & Founder',
    bio: 'Luxury sea-facing apartments, penthouses, and prime commercial plots across Clifton, Defence (DHA Karachi), and Emaar Oceanfront.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=600&fit=crop',
    verified: true,
    kycStatus: 'Approved',
    socialLinks: { whatsapp: '+92 333 2211445' },
    rating: 4.9,
    reviewsCount: 65,
    dealsClosed: 'PKR 2.4 Arab+',
  },
  {
    name: 'Malik Zeeshan Awan',
    username: 'islamabad-capital-realty',
    slug: 'islamabad-capital-realty',
    agencyName: 'Islamabad Capital Realty',
    email: 'capital@estatesocial.com',
    phone: '+92 300 5544332',
    city: 'Islamabad',
    address: 'Blue Area, Jinnah Avenue, Islamabad',
    designation: 'CDA Approved Estate Broker',
    bio: 'Direct dealing in Sector F-6, F-7, F-8, E-7, Gulberg Greens, and Bahria Enclave Islamabad.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop',
    verified: true,
    kycStatus: 'Approved',
    socialLinks: { whatsapp: '+92 300 5544332' },
    rating: 5.0,
    reviewsCount: 96,
    dealsClosed: 'PKR 1.8 Arab+',
  }
];

const SEED_LISTINGS = [
  {
    title: '5 Marla Triple Storey Commercial Plaza on Main Broadway',
    description: 'Direct owner offering prime 5 Marla commercial plaza in DHA Phase 6 Commercial Broadway. Ground floor rented to multinational pharmacy chain generating PKR 4.5 Lac monthly rental yield with 10% annual escalation. Lower ground, ground, 1st and 2nd floor with capsule elevator and rooftop terrace.',
    purpose: 'Sale',
    propertyType: 'Commercial',
    society: 'DHA Phase 6',
    phase: 'Commercial Broadway',
    block: 'Block CCA',
    landmark: 'Facing Main Commercial Roundabout & Bank Square',
    size: 5,
    sizeUnit: 'Marla',
    price: 95000000,
    rentalIncome: 450000,
    totalFloors: 'Triple Storey + Lower Ground',
    roadWidth: '150 Ft Main Broadway',
    parkingCapacity: 'Dedicated Front Parking for 8 Cars',
    powerBackup: '100% Standby Generator Backup',
    isInstallmentAvailable: true,
    installmentDetails: { downPayment: 30000000, monthlyInstallment: 1500000, durationMonths: 44 },
    images: [IMG.office1, IMG.shop1, IMG.office2],
    features: F.commercialF,
    status: 'Active',
    isFeatured: true,
    views: 480,
    city: 'Lahore',
    agentIndex: 0,
    listedBy: 'agent'
  },
  {
    title: '1 Kanal Ultra Modern Luxury Spanish Villa with Heated Pool',
    description: 'Architect-designed 1 Kanal brand new designer bungalow in DHA Phase 6 Block J. Features 5 master ensuite bedrooms with Italian Grohe fittings, dirty & clean kitchens with SMEG appliances, basement home cinema, heated swimming pool, servant quarters, and 15kW Net-Metered Solar System.',
    purpose: 'Sale',
    propertyType: 'House',
    society: 'DHA Phase 6',
    phase: 'Phase 6',
    block: 'Block J',
    landmark: 'Walking distance to Sector J Mosque & Park',
    size: 1,
    sizeUnit: 'Kanal',
    price: 85000000,
    beds: 5,
    baths: 6,
    kitchens: 2,
    carParking: 'Covered Porch for 3 SUVs',
    isInstallmentAvailable: false,
    images: [IMG.house2, IMG.house3, IMG.villa],
    features: F.houseF,
    status: 'Active',
    isFeatured: true,
    views: 620,
    city: 'Lahore',
    agentIndex: 0,
    listedBy: 'agent'
  },
  {
    title: '1 Kanal Residential Corner Possession Plot in DHA Phase 7',
    description: 'Prime 1 Kanal corner plot on wide 60ft street in DHA Phase 7 Block U. 100% clear DHA allocation letter, immediate construction ready with all utility dues and development charges cleared. Facing large community park.',
    purpose: 'Sale',
    propertyType: 'Plot',
    society: 'DHA Phase 7',
    phase: 'Phase 7',
    block: 'Block U',
    landmark: 'Adjacent to Sector U Central Park & Commercial Zone',
    size: 1,
    sizeUnit: 'Kanal',
    price: 38500000,
    plotType: 'Corner',
    dimensions: '50 x 90 Feet',
    possessionStatus: 'Ready',
    isInstallmentAvailable: false,
    images: [IMG.plot1, IMG.plot2],
    features: F.plotF,
    status: 'Active',
    isFeatured: false,
    views: 310,
    city: 'Lahore',
    agentIndex: 1,
    listedBy: 'agent'
  },
  {
    title: '3 Bed Luxury Sea-Facing Penthouse in Emaar Oceanfront',
    description: 'Exclusive 3-bedroom luxury penthouse overlooking the Arabian Sea in Clifton Block 2. Panoramic sunset views, floor-to-ceiling glass, Italian modular kitchen, maid room, infinity pool access, and 2 reserved basement parking bays.',
    purpose: 'Sale',
    propertyType: 'Flat',
    society: 'Emaar Oceanfront Clifton',
    phase: 'Tower 2',
    block: 'Floor 18',
    landmark: 'Clifton Beach Promenade & Dolmen Mall',
    size: 2650,
    sizeUnit: 'SqFt',
    price: 115000000,
    beds: 3,
    baths: 4,
    floorLevel: '18th Floor (Penthouse)',
    viewType: '180° Panoramic Arabian Sea View',
    carParking: '2 Reserved Basement Covered Slots',
    isInstallmentAvailable: true,
    installmentDetails: { downPayment: 35000000, monthlyInstallment: 2000000, durationMonths: 40 },
    images: [IMG.flat2, IMG.flat1, IMG.flat3],
    features: F.flatF,
    status: 'Active',
    isFeatured: true,
    views: 790,
    city: 'Karachi',
    agentIndex: 2,
    listedBy: 'agent'
  },
  {
    title: '4 Kanal Luxury Farmhouse with Swimming Pool & Fruit Orchard',
    description: 'Magnificent 4 Kanal designer farmhouse in Gulberg Greens Islamabad. Featuring 4 master suites, private heated swimming pool, 25kW hybrid solar power, landscaped lawn with 40+ fruit trees, BBQ gazebo, and high boundary wall security.',
    purpose: 'Sale',
    propertyType: 'Farmhouse',
    society: 'Gulberg Greens',
    phase: 'Executive Farmhouses',
    block: 'Block A',
    landmark: 'Near Gulberg Expressway Interchange',
    size: 4,
    sizeUnit: 'Kanal',
    price: 165000000,
    beds: 4,
    baths: 5,
    kitchens: 2,
    carParking: 'Ample Parking for 10+ Vehicles',
    isInstallmentAvailable: false,
    images: [IMG.villa, IMG.house5, IMG.house1],
    features: F.farmhouseF,
    status: 'Active',
    isFeatured: true,
    views: 530,
    city: 'Islamabad',
    agentIndex: 3,
    listedBy: 'agent'
  },
  {
    title: '10 Marla Brand New Modern House in Sector F-7/2 Islamabad',
    description: 'Direct owner listing: 10 Marla newly built solid house in prime Sector F-7/2. Solid teak wood doors, Spanish tile flooring, dirty & clean kitchens, servant room, walking distance to Jinnah Super Market.',
    purpose: 'Sale',
    propertyType: 'House',
    society: 'Sector F-7',
    phase: 'F-7/2',
    block: 'Street 18',
    landmark: 'Near Jinnah Super Market & Margalla Hills View',
    size: 10,
    sizeUnit: 'Marla',
    price: 68000000,
    beds: 4,
    baths: 5,
    kitchens: 2,
    carParking: 'Covered Porch for 2 Cars',
    isInstallmentAvailable: false,
    images: [IMG.house4, IMG.house1],
    features: F.houseF,
    status: 'Active',
    isFeatured: false,
    views: 410,
    city: 'Islamabad',
    agentIndex: 3,
    listedBy: 'owner'
  }
];

async function seedDefaults(force = false) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Seeding demo accounts is strictly blocked in production mode.');
    return;
  }

  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !force) {
      return;
    }

    console.log('🌱 Seeding initial Pakistani real-estate database fixtures for development...');
    const passwordHash = await bcrypt.hash('password123', 12);

    const admin = await User.create({
      name: 'Super Admin',
      username: 'admin',
      slug: 'admin',
      email: 'admin@estatesocial.com',
      password: passwordHash,
      role: 'admin',
      phone: '+92 300 0000001',
      city: 'Islamabad',
      verified: true,
      kycStatus: 'Approved',
    });

    const owner = await User.create({
      name: 'Chaudhry Tariq (Direct Owner)',
      username: 'tariq-owner',
      slug: 'tariq-owner',
      email: 'owner@estatesocial.com',
      password: passwordHash,
      role: 'owner',
      phone: '+92 321 4567890',
      city: 'Islamabad',
      verified: true,
      kycStatus: 'Approved',
    });

    const agentDocs = [];
    for (const a of AGENTS) {
      const doc = await User.create({
        ...a,
        password: passwordHash,
        role: 'agent',
      });
      agentDocs.push(doc);
    }

    const listingDocs = [];
    for (const item of SEED_LISTINGS) {
      const creator = item.listedBy === 'owner' ? owner._id : agentDocs[item.agentIndex]._id;
      const doc = await Listing.create({
        ...item,
        creator,
      });
      listingDocs.push(doc);
    }

    console.log(`✅ Seeded ${agentDocs.length} agents, Admin, Owner, and ${listingDocs.length} listings into MongoDB.`);
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

module.exports = seedDefaults;
