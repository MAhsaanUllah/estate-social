export const MOCK_PAKISTAN_LISTINGS = [
  {
    _id: 'pk-feed-1',
    title: '1 Kanal Modern Luxury Spanish Villa, DHA Phase 6',
    description: `Brand new 1 Kanal architectural masterpiece located in prime Block J, DHA Phase 6, Lahore. 
    
Featuring 5 master bedrooms with imported Spanish porcelain tile finishes, Italian designer kitchens with built-in appliances, a private heated swimming pool, rooftop BBQ deck, and double-height entrance lobby. Close to commercial avenue, top schools, and community park.
    
Property Highlights:
- 5 Master Bedrooms with Attached Luxury Bathrooms
- 2 Fully Equipped Designer Kitchens (Dirty & Clean Kitchen)
- Double Height Lobby with Imported Crystal Chandelier
- Heated Swimming Pool & Landscaped Lawn
- Separate Servant Quarter with Bath
- 3 Car Covered Parking Garage`,
    price: 95000000,
    purpose: 'Sale',
    propertyType: 'House',
    society: 'DHA Phase 6',
    phase: 'Phase 6',
    block: 'Block J',
    city: 'Lahore',
    landmark: 'Near Sector J Central Park & Commercial Zone',
    beds: 5,
    baths: 6,
    kitchens: 2,
    carParking: '3 Large SUVs',
    solarCapacity: '15kW Solar System',
    size: 1,
    sizeUnit: 'Kanal',
    listedBy: 'owner',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=DHA+Phase+6+Lahore',
    features: [
      'Swimming Pool',
      'Italian Kitchen',
      'Solar Powered (15kW)',
      'Double Glazed Windows',
      'Servant Quarter',
      'Gated Community 24/7 Security',
      'CCTV Surveillance',
      'Covered Car Parking'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'Chaudhry Tariq',
      phone: '03008456123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      agencyName: 'Direct Property Owner'
    },
    isInstallmentAvailable: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pk-feed-2',
    title: '10 Marla Brand New Designer House with Basement',
    description: `Super luxury 10 Marla designer house with full basement in Bahria Town Sector C, Lahore. 

Architect-designed contemporary layout featuring 4 master suites, cinema/entertainment basement, solid ash wood doors, Grohe bathroom fittings, and spacious rooftop terrace. Walking distance to Grand Mosque and Commercial Center.

Key Specs:
- 4 Master Bedrooms with En-suite Bathrooms
- Fully Finished Basement for Home Cinema / Gym
- Solid Ash Wood Doors & Spanish Tile Flooring
- 2 Modular Kitchens with Oven, Microwave & Hood
- Covered Parking for 2 Large SUVs`,
    price: 43500000,
    purpose: 'Sale',
    propertyType: 'House',
    society: 'Bahria Town Sector C',
    phase: 'Sector C',
    block: 'Block A',
    city: 'Lahore',
    landmark: 'Walking distance to Grand Jamia Mosque',
    beds: 4,
    baths: 5,
    kitchens: 2,
    carParking: '2 SUVs',
    size: 10,
    sizeUnit: 'Marla',
    listedBy: 'agent',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=Bahria+Town+Sector+C+Lahore',
    features: [
      'Full Entertainment Basement',
      'Solid Ash Wood Work',
      'Grohe Sanitary Fittings',
      '2 Modular Kitchens',
      'Underground Electricity',
      '24/7 Security Patrol',
      'Walking Distance to Commercial'
    ],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'Al-Haram Real Estate',
      phone: '03214567890',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
      agencyName: 'DHA & Bahria Registered Realtor',
      rating: 4.9,
      reviewCount: 38
    },
    isInstallmentAvailable: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pk-feed-3',
    title: '3 Bed Luxury Corner Apartment with Margalla View',
    description: `Stunning 3-bedroom executive corner apartment in prestigious Sector F-7/2, Islamabad.

Breathtaking panoramic views of the Margalla Hills, top-floor corner unit with wrap-around balcony, 24/7 power backup generator, biometric elevator access, and reserved basement parking.

Features:
- 3 Large Bedrooms with attached designer baths
- Imported German kitchen with breakfast counter
- 2,200 Sq. Ft. total covered area
- Dedicated basement parking slot + guest parking
- High-speed elevators with full generator backup`,
    price: 32000000,
    purpose: 'Sale',
    propertyType: 'Flat',
    society: 'Sector F-7/2',
    city: 'Islamabad',
    landmark: 'Near Margalla Road & F-7 Markaz (Jinnah Super)',
    beds: 3,
    baths: 3,
    kitchens: 1,
    floorLevel: 'Top Floor Corner Suite (Level 6)',
    viewType: 'Panoramic Margalla Hills View',
    size: 2200,
    sizeUnit: 'Sq. Ft.',
    listedBy: 'owner',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=Sector+F-7+Islamabad',
    features: [
      'Margalla Hills View',
      '100% Power Generator Backup',
      'Biometric Elevator Access',
      'Dedicated Basement Parking',
      'German Kitchen Fittings',
      '24/7 Concierge & Security'
    ],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'Dr. Kamran Siddiqui',
      phone: '03335123456',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      agencyName: 'Direct Property Owner'
    },
    isInstallmentAvailable: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pk-feed-4',
    title: '1 Kanal Residential Corner Possession Plot',
    description: `Direct hot deal: 1 Kanal residential corner plot situated in Block T, DHA Phase 7, Lahore.

Fully developed with all utilities available (underground electricity, gas, water, and sewerage). Ready for immediate house construction with no litigation or dues. Direct registry transfer.

Details:
- Ideal 50x90 Dimension Corner Plot
- Facing 60 Ft Wide Boulevard
- Near 20-Kanal Community Park & Commercial Market
- 100% Clear Title with verified DHA Allotment Letter`,
    price: 38000000,
    purpose: 'Sale',
    propertyType: 'Plot',
    society: 'DHA Phase 7',
    block: 'Block T',
    city: 'Lahore',
    landmark: 'Facing 60 Ft Boulevard, 100m from 20-Kanal Sector Park',
    plotType: 'Corner Plot',
    dimensions: '50 x 90 Feet',
    possessionStatus: 'Immediate Ready Possession',
    size: 1,
    sizeUnit: 'Kanal',
    listedBy: 'agent',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=DHA+Phase+7+Lahore',
    features: [
      'Direct Corner Plot',
      '60 Ft Wide Road',
      'Immediate Possession',
      'Underground Utilities',
      'DHA Verified Allotment',
      'Close to Sector Mosque & Park'
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524813686514-a57563d77d66?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'DHA Premier Realtors',
      phone: '03001234567',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      agencyName: 'Authorized Real Estate Consultants',
      rating: 4.8,
      reviewCount: 29
    },
    isInstallmentAvailable: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pk-feed-5',
    title: '5 Marla Triple Storey Commercial Plaza on Main Boulevard',
    description: `Prime investment opportunity: 5 Marla Triple Storey Commercial Plaza located directly on Main Boulevard, Gulberg Greens, Islamabad.

Currently tenanted with top corporate brands generating monthly rental income of PKR 450,000. Features modern glass facade, high speed capsule lift, and dedicated front parking.

Investment Breakdown:
- Monthly Rental Yield: PKR 450,000/month
- Triple Storey + Usable Lower Ground
- High Visibility Main Boulevard Exposure
- Modern Glass Facade & Corporate Finishing`,
    price: 65000000,
    purpose: 'Sale',
    propertyType: 'Commercial',
    society: 'Gulberg Greens',
    phase: 'Phase 1',
    block: 'Business Bay',
    city: 'Islamabad',
    landmark: 'Facing Main 150 Ft Boulevard, Opposite Bank Square',
    rentalIncome: 450000,
    totalFloors: 'Triple Storey + Lower Ground (4 Floors Total)',
    roadWidth: '150 Ft Main Boulevard',
    parkingCapacity: '15+ Dedicated Customer Spaces',
    powerBackup: '100% Dedicated 50kVA Generator',
    size: 5,
    sizeUnit: 'Marla',
    listedBy: 'agent',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=Gulberg+Greens+Islamabad',
    features: [
      'Main Boulevard Frontage',
      'Monthly Rental Income: 4.5 Lac',
      'Capsule Elevator',
      'Fire Fighting System',
      'Spacious Front Parking',
      'Corporate Glass Facade'
    ],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'Capital Estate Advisory',
      phone: '03129876543',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
      agencyName: 'Commercial Property Specialists',
      rating: 5.0,
      reviewCount: 42
    },
    isInstallmentAvailable: true,
    installmentDetails: {
      downPayment: 25000000,
      monthlyPayment: 1666666,
      durationMonths: 24
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pk-feed-6',
    title: '5 Marla Brand New Double Unit House Near Commercial Market',
    description: `Ready to move in 5 Marla double unit house located in Lake City Sector M-7, Lahore.

Features separate electricity meters for both units, ideal for rental income or joint family living. Built with A-plus grade bricks, steel, and sanitary fittings.

Specifications:
- 3 Spacious Bedrooms with En-suite Baths
- 2 Modern Kitchens with Granite Countertops
- 1 Car Porch & Terrace Sitting Area
- Lake City Golf Course & Commercial Plaza 2 minutes away`,
    price: 18500000,
    purpose: 'Sale',
    propertyType: 'House',
    society: 'Lake City',
    phase: 'Phase 1',
    block: 'Sector M-7',
    city: 'Lahore',
    landmark: '2 minutes from Golf Club & Ring Road Interchange',
    beds: 3,
    baths: 4,
    kitchens: 2,
    carParking: '1 SUV',
    size: 5,
    sizeUnit: 'Marla',
    listedBy: 'owner',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=Lake+City+Lahore',
    features: [
      'Double Unit Structure',
      'Separate Utility Meters',
      'Granite Kitchen Tops',
      'Gated Community Security',
      'Near Commercial & Parks',
      'A-Plus Construction Quality'
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'Muhammad Usman',
      phone: '03224455667',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      agencyName: 'Direct Property Owner'
    },
    isInstallmentAvailable: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pk-feed-7',
    title: '2 Kanal Executive Farmhouse with Swimming Pool & Fruit Orchard',
    description: `Luxurious 2 Kanal private farmhouse on Bedian Road, Lahore. 

Equipped with a large swimming pool, open air party lawn, lush green fruit orchard, 4 bedroom suite with rustic brick and woodwork finishes, 20kW solar power system with battery backup, and 24/7 security gate. Ideal for weekend retreats, family gatherings, or high-end Airbnb rental.`,
    price: 85000000,
    purpose: 'Sale',
    propertyType: 'Farmhouse',
    society: 'Bedian Road Farms',
    city: 'Lahore',
    landmark: 'Bedian Road, 10 mins from DHA Phase 5 / Ring Road',
    beds: 4,
    baths: 5,
    kitchens: 2,
    carParking: '6 Cars',
    solarCapacity: '20kW Hybrid Solar System',
    size: 2,
    sizeUnit: 'Kanal',
    listedBy: 'owner',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=Bedian+Road+Lahore',
    features: [
      'Private Swimming Pool',
      '20kW Solar System',
      'Fruit Orchard & Lawn',
      'BBQ Gazebo Deck',
      'Servant Quarters',
      'Secure Boundary Wall'
    ],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'Malik Zulfiqar',
      phone: '03019876543',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      agencyName: 'Direct Property Owner'
    },
    isInstallmentAvailable: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'pk-feed-8',
    title: '2 Bed Fully Furnished Luxury Penthouse with Arabian Sea View',
    description: `Executive 2 Bed Penthouse for rent in Clifton Block 4, Karachi.

Fully furnished with custom Italian furniture, Smart Home automated lighting and climate control, panoramic ocean view terrace, Italian kitchen, and 2 dedicated basement parking slots.`,
    price: 350000,
    purpose: 'Rent',
    propertyType: 'Penthouse',
    society: 'Clifton Block 4',
    city: 'Karachi',
    landmark: 'Near Sea View Beach & Bilawal House',
    beds: 2,
    baths: 3,
    kitchens: 1,
    floorLevel: '14th Floor Penthouse Suite',
    viewType: 'Arabian Sea Panoramic Front View',
    size: 2400,
    sizeUnit: 'Sq. Ft.',
    listedBy: 'agent',
    status: 'Active',
    mapUrl: 'https://maps.google.com/?q=Clifton+Block+4+Karachi',
    features: [
      'Panoramic Sea View',
      'Fully Furnished Italian Decor',
      'Smart Home Automation',
      'Standby Generator 24/7',
      '2 Covered Parking Slots',
      'Gym & Rooftop Infinity Pool'
    ],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop'
    ],
    creator: {
      name: 'Sindh Heritage Realtors',
      phone: '03332211445',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
      agencyName: 'Clifton & DHA Karachi Specialists',
      rating: 4.9,
      reviewCount: 31
    },
    isInstallmentAvailable: false,
    createdAt: new Date().toISOString()
  }
];

export const getMockListingById = (id) => {
  if (!id) return null;
  const directMatch = MOCK_PAKISTAN_LISTINGS.find((item) => item._id === id || String(item._id) === String(id));
  if (directMatch) return directMatch;

  // Alias mapping for landing page trending items
  const aliases = {
    'trend-1': 'pk-feed-1',
    'trend-2': 'pk-feed-2',
    'trend-3': 'pk-feed-3',
    'trend-4': 'pk-feed-5',
  };
  if (aliases[id]) {
    return MOCK_PAKISTAN_LISTINGS.find((item) => item._id === aliases[id]) || null;
  }

  // Fallback to first listing if test or sample
  return MOCK_PAKISTAN_LISTINGS[0] || null;
};
