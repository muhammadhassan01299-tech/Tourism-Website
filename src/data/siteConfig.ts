// Shared, browser-safe defaults for the public site and the admin store.
// Runtime/admin data can override these values through SiteDataContext.

export type TravelMode = 'road' | 'air';
export type TravelSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type DestinationRegion = 'KPK & Hazara' | 'Gilgit-Baltistan' | 'Azad Kashmir';

export interface ItineraryItem {
  day: string;
  title: string;
  details: string;
}

export interface PriceTier {
  label: string;
  mode: TravelMode;
  pricePKR: number;
}

export interface DestinationItem {
  id: string;
  name: string;
  tagline: string;
  region: DestinationRegion;
  season: TravelSeason[];
  durationDays: number;
  durationLabel: string;
  basePricePKR: number;
  rating: number;
  reviewCount: number;
  modes: TravelMode[];
  bestTimeToVisit: string;
  imageKey: string;
  defaultImage: string;
  galleryImages: string[];
  highlights: string[];
  itinerary: ItineraryItem[];
  included: string[];
  excluded: string[];
  priceTiers: PriceTier[];
}

export interface TourPackage {
  id: string;
  destinationId: string;
  title: string;
  durationLabel: string;
  pricePKR: number;
  summary: string;
  imageKey: string;
  defaultImage: string;
  mode: TravelMode;
}

export interface AirClassOption {
  id: string;
  name: string;
  perPersonSurchargePKR: number;
  description: string;
  multiplier: number;
}

export interface RoadVehicleOption {
  id: string;
  name: string;
  capacity: string;
  capacityPassengers: number;
  dailySurchargePKR: number;
  description: string;
  multiplier: number;
}

export interface PricingConfig {
  roadVehicles: RoadVehicleOption[];
  airClasses: AirClassOption[];
  departureCities: string[];
}

const image = (file: string) => `/src/assets/images/${file}`;

export const DEFAULT_IMAGES = {
  heroNaran: image('naran_kaghan_hero_1795085596389.jpg'),
  hunza: image('hunza_valley_peaks_1795085595345.jpg'),
  skardu: image('skardu_shangrila_lake_1795085596875.jpg'),
  swat: image('swat_kalam_river_1795085595660.jpg'),
  fairyMeadows: image('fairy_meadows_nanga_1795085596008.jpg'),
  neelum: image('neelum_valley_kashmir_1795085596477.jpg'),
};

export const BRAND_CONFIG = {
  companyName: 'Pak Tourist', ownerName: 'Pak Tourist Travel Desk',
  tagline: 'Safe, unforgettable journeys across Pakistan',
  whatsappDisplay: '+92 313 1498344', whatsappLink: 'https://wa.me/923131498344',
  email: 'hello@paktourist.pk', headquarters: 'Islamabad', officeHours: 'Daily, 9 AM – 10 PM',
  logoUrl: '',
};

const destination = (
  id: string, name: string, region: DestinationRegion, imageKey: keyof typeof DEFAULT_IMAGES,
  durationDays: number, basePricePKR: number, modes: TravelMode[] = ['road', 'air']
): DestinationItem => ({
  id, name, tagline: `Explore the scenic beauty of ${name}`, region,
  season: ['Spring', 'Summer', 'Autumn'], durationDays,
  durationLabel: `${durationDays} Days / ${durationDays - 1} Nights`, basePricePKR,
  rating: 4.8, reviewCount: 120, modes, bestTimeToVisit: 'May to October',
  imageKey, defaultImage: DEFAULT_IMAGES[imageKey], galleryImages: [DEFAULT_IMAGES[imageKey]],
  highlights: ['Private guided valley transfers', 'Verified scenic hotel stays', '24/7 Pak Tourist support'],
  itinerary: [
    { day: 'Day 01', title: `Arrival in ${name}`, details: 'Scenic transfer, sightseeing stops, and comfortable hotel check-in.' },
    { day: 'Day 02', title: 'Guided Sightseeing', details: 'Explore local highlights with your Pak Tourist coordinator.' },
  ],
  included: ['Private AC transport with fuel & mountain driver', 'Verified hotel accommodation & daily breakfast', '24/7 WhatsApp assistance'],
  excluded: ['Lunch, dinner & personal snacks', 'Personal adventure tickets'],
  priceTiers: modes.map((mode) => ({ label: mode === 'air' ? 'By Air Package (Per Person)' : 'By Road Comfort (Per Person)', mode, pricePKR: mode === 'air' ? basePricePKR + 32000 : basePricePKR })),
});

export const DESTINATIONS: DestinationItem[] = [
  destination('naran-kaghan', 'Naran Kaghan & Saif-ul-Mulook', 'KPK & Hazara', 'heroNaran', 4, 28500),
  destination('hunza-valley', 'Hunza Valley', 'Gilgit-Baltistan', 'hunza', 5, 48000),
  destination('skardu-shangrila', 'Skardu & Shangrila', 'Gilgit-Baltistan', 'skardu', 5, 48000),
  destination('swat-kalam', 'Swat & Kalam', 'KPK & Hazara', 'swat', 4, 26000),
  destination('fairy-meadows', 'Fairy Meadows', 'Gilgit-Baltistan', 'fairyMeadows', 5, 45000),
  destination('neelum-valley', 'Neelum Valley', 'Azad Kashmir', 'neelum', 4, 30000),
];

export const ROAD_VEHICLES: RoadVehicleOption[] = [
  { id: 'car', name: 'Executive Sedan', capacity: 'Up to 4 Travellers', capacityPassengers: 4, dailySurchargePKR: 6500, description: 'Comfortable for couples and small families.', multiplier: 1 },
  { id: 'hiace', name: 'Toyota Hiace', capacity: 'Up to 12 Travellers', capacityPassengers: 12, dailySurchargePKR: 11000, description: 'Ideal for family and friends groups.', multiplier: 1 },
  { id: 'coaster', name: 'Luxury Coaster', capacity: 'Up to 20 Travellers', capacityPassengers: 20, dailySurchargePKR: 15000, description: 'Spacious group travel with extra comfort.', multiplier: 1 },
];

export const AIR_CLASSES: AirClassOption[] = [
  { id: 'economy', name: 'Economy', perPersonSurchargePKR: 32000, description: 'Value flights with comfortable transfers.', multiplier: 1 },
  { id: 'flex', name: 'Flexible Economy', perPersonSurchargePKR: 30000, description: 'Flexible flight options for easier planning.', multiplier: 1.25 },
];

export const DEFAULT_PRICING: PricingConfig = {
  roadVehicles: ROAD_VEHICLES, airClasses: AIR_CLASSES,
  departureCities: ['Islamabad', 'Lahore', 'Karachi', 'Rawalpindi'],
};

export const FEATURED_PACKAGES: TourPackage[] = DESTINATIONS.slice(0, 4).map((d, i) => ({
  id: `package-${d.id}`, destinationId: d.id, title: `${d.name} Escape`, durationLabel: d.durationLabel,
  pricePKR: d.basePricePKR, summary: d.tagline, imageKey: d.imageKey, defaultImage: d.defaultImage,
  mode: i === 2 ? 'air' : 'road',
}));

export const SPECIAL_OFFER = { badge: 'Limited Seasonal Offer', title: 'Plan More, Save More', description: 'Save on your next northern adventure when you book with our travel desk.', discountPerPersonPKR: 5000, promoCode: 'NORTH5000' };
export const COMPANY_STATS = [{ value: 8, suffix: '+', label: 'Years of local experience' }, { value: 2500, suffix: '+', label: 'Travellers served' }, { value: 24, suffix: '/7', label: 'Support availability' }, { value: 98, suffix: '%', label: 'Happy trip feedback' }];
export const TEAM_MEMBERS = [
  { id: 'operations', name: 'Ahsan Khan', role: 'Operations Lead', bio: 'Coordinates vehicles, hotels, and local partners across every route.', experience: '12 years in northern tourism' },
  { id: 'guest-care', name: 'Sana Malik', role: 'Guest Care Manager', bio: 'Keeps every family informed before, during, and after their journey.', experience: '8 years in hospitality' },
  { id: 'mountain', name: 'Bilal Ahmed', role: 'Mountain Coordinator', bio: 'Our local expert for weather-aware routes and mountain logistics.', experience: '10 years on northern routes' },
];
export const TESTIMONIALS = [
  { id: 'hira', rating: 5, quote: 'Everything was organized beautifully and our driver knew every scenic stop.', name: 'Hira S.', city: 'Lahore', trip: 'Hunza Valley' },
  { id: 'usman', rating: 5, quote: 'A smooth family trip with transparent pricing and quick WhatsApp support.', name: 'Usman R.', city: 'Islamabad', trip: 'Naran Kaghan' },
  { id: 'mariam', rating: 5, quote: 'The team handled our group tour with real care from start to finish.', name: 'Mariam K.', city: 'Karachi', trip: 'Skardu' },
];

export type GalleryItem = { id: string; title: string; category: 'Mountains' | 'Lakes' | 'Valleys' | 'Culture' | 'Adventure'; location: string; imageKey: keyof typeof DEFAULT_IMAGES; defaultImage: string; };
export const GALLERY_ITEMS: GalleryItem[] = DESTINATIONS.map((d, i) => ({ id: `gallery-${d.id}`, title: d.name, category: (['Mountains', 'Lakes', 'Valleys', 'Culture', 'Adventure'] as const)[i % 5], location: d.region, imageKey: d.imageKey as keyof typeof DEFAULT_IMAGES, defaultImage: d.defaultImage }));
export const STORY_STEPS = [
  { id: 'dream', stepNumber: '01', keyword: 'Dream', title: 'Choose Your Escape', description: 'Tell us the valley, dates, and pace that feel right for you.', imageKey: 'hunza', defaultImage: DEFAULT_IMAGES.hunza },
  { id: 'plan', stepNumber: '02', keyword: 'Plan', title: 'We Handle the Details', description: 'Our desk matches your route with trusted vehicles and stays.', imageKey: 'skardu', defaultImage: DEFAULT_IMAGES.skardu },
  { id: 'journey', stepNumber: '03', keyword: 'Journey', title: 'Travel with Confidence', description: 'Enjoy a supported road or air journey across Pakistan.', imageKey: 'swat', defaultImage: DEFAULT_IMAGES.swat },
  { id: 'memories', stepNumber: '04', keyword: 'Memories', title: 'Return with Stories', description: 'Bring home photographs, calm moments, and memories for life.', imageKey: 'fairyMeadows', defaultImage: DEFAULT_IMAGES.fairyMeadows },
];
export const FAQS = [
  { id: 'booking', question: 'How far in advance should I book?', answer: 'For peak summer and Eid dates, two to four weeks is recommended. We can often help with shorter notice too.' },
  { id: 'air', question: 'Can you arrange By-Air trips?', answer: 'Yes. We arrange flight-friendly itineraries to Skardu and Gilgit with local transfers and backup planning.' },
  { id: 'custom', question: 'Can I request a custom itinerary?', answer: 'Absolutely. Send your group size, dates, and preferred destinations and our desk will tailor the plan.' },
];
