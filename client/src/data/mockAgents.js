export const MOCK_AGENTS = [
  {
    id: '1',
    slug: 'al-haram-realtors',
    name: 'Mian Ali Raza',
    agency: 'Al-Haram Real Estate & Builders',
    designation: 'Managing Director & Lead Property Advisor',
    city: 'Lahore',
    address: 'Commercial Plaza #14, Main Boulevard, DHA Phase 6, Lahore',
    phone: '03214567890',
    whatsapp: '03214567890',
    email: 'aliraza@alharamrealtors.pk',
    rating: 4.9,
    reviewsCount: 124,
    activeListingsCount: 45,
    volumeClosed: 'PKR 120+ Crore',
    experienceYears: '12 Years',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop',
    bio: `Assalam-o-Alaikum! I am Mian Ali Raza, founder of Al-Haram Real Estate. We specialize in luxury villas, residential possession plots, and high-yield commercial plazas across DHA Lahore (Phases 1-9) and Bahria Town.

We provide 100% transparent registry transfers, FBR tax advisory, and direct owner pricing without hidden commissions. Subscribe to our YouTube channel and TikTok for daily house tours!`,
    socialLinks: {
      tiktok: 'https://tiktok.com/@alharam_realtors',
      youtube: 'https://youtube.com/@alharamrealestatepk',
      instagram: 'https://instagram.com/alharam_properties',
      facebook: 'https://facebook.com/alharamrealtorspk'
    },
    verification: {
      isFbrVerified: true,
      ntnNumber: '7481920-4',
      dhaRegistrationNo: 'DHA-LHR-AG-4912',
      associationMember: 'Lahore Real Estate Association (LREA)'
    },
    videoTours: [
      {
        id: 'v1',
        title: '1 Kanal Ultra Modern Luxury Spanish Villa Tour | DHA Phase 6 Lahore',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '4:15 min',
        views: '45K views'
      },
      {
        id: 'v2',
        title: '10 Marla Brand New Designer House with Full Basement | Bahria Town',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '3:40 min',
        views: '28K views'
      }
    ]
  },
  {
    id: '2',
    slug: 'capital-estate-advisory',
    name: 'Sarah Ahmed & Partners',
    agency: 'Capital Estate Advisory',
    designation: 'Commercial Real Estate Specialist',
    city: 'Islamabad',
    address: 'Office 302, Business Bay, Main Boulevard, Gulberg Greens, Islamabad',
    phone: '03129876543',
    whatsapp: '03129876543',
    email: 'sarah@capitaladvisory.pk',
    rating: 5.0,
    reviewsCount: 89,
    activeListingsCount: 32,
    volumeClosed: 'PKR 85+ Crore',
    experienceYears: '8 Years',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=600&fit=crop',
    bio: `Capital Estate Advisory is Islamabad's leading commercial property consultancy. Specializing in high-yield corporate plazas, retail shops, and Margalla-view luxury apartments in Sectors F-7, F-10, and Gulberg Greens.`,
    socialLinks: {
      tiktok: 'https://tiktok.com/@capital_estate_isb',
      youtube: 'https://youtube.com/@capitalestateadvisory',
      instagram: 'https://instagram.com/capitalestatepk',
      facebook: 'https://facebook.com/capitalestateisb'
    },
    verification: {
      isFbrVerified: true,
      ntnNumber: '5829104-1',
      dhaRegistrationNo: 'CDA-ISB-LIC-3320',
      associationMember: 'Islamabad Estate Agents Association (IEAA)'
    },
    videoTours: [
      {
        id: 'v3',
        title: '5 Marla Triple Storey Commercial Plaza Tour | Gulberg Greens Islamabad',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '5:20 min',
        views: '62K views'
      }
    ]
  },
  {
    id: '3',
    slug: 'dha-premier-realtors',
    name: 'Omer Malik',
    agency: 'DHA Premier Realtors',
    designation: 'Senior Plot & Portfolio Consultant',
    city: 'Lahore',
    address: 'CCA Commercial, Phase 7, DHA Lahore',
    phone: '03001234567',
    whatsapp: '03001234567',
    email: 'omer@dhapremier.pk',
    rating: 4.8,
    reviewsCount: 210,
    activeListingsCount: 78,
    volumeClosed: 'PKR 180+ Crore',
    experienceYears: '15 Years',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&h=600&fit=crop',
    bio: `Top-rated DHA Lahore plots specialist. Immediate possession files, balloting verification, and direct registry transfer. Authorized consultant for DHA Phase 5, 6, 7, 8 & 9 Prism.`,
    socialLinks: {
      tiktok: 'https://tiktok.com/@dhapremierrealtors',
      youtube: 'https://youtube.com/@dhapremierpk',
      instagram: 'https://instagram.com/dhapremier',
      facebook: 'https://facebook.com/dhapremier'
    },
    verification: {
      isFbrVerified: true,
      ntnNumber: '8910471-2',
      dhaRegistrationNo: 'DHA-LHR-REG-1044',
      associationMember: 'Lahore Real Estate Association'
    },
    videoTours: []
  }
];

export const getMockAgentById = (idOrSlug) => {
  if (!idOrSlug) return MOCK_AGENTS[0];
  return MOCK_AGENTS.find((a) => a.id === idOrSlug || a.slug === idOrSlug || a._id === idOrSlug) || MOCK_AGENTS[0];
};
