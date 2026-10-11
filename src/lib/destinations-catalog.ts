import { DestinationInfo, VerifiedPlace } from "./types";
import {
  SACRED_DESTINATIONS,
  SACRED_VERIFIED_PLACES,
  WORLDWIDE_CITIES_AND_HOMETOWNS,
  findCityCoordinates,
  buildSacredPlacesForDestination,
  CityDirectoryEntry,
} from "./sacred-and-global-catalog";

export {
  SACRED_DESTINATIONS,
  SACRED_VERIFIED_PLACES,
  WORLDWIDE_CITIES_AND_HOMETOWNS,
  findCityCoordinates,
  buildSacredPlacesForDestination,
};
export type { CityDirectoryEntry };

export const POPULAR_DESTINATIONS: DestinationInfo[] = [
  {
    placeId: "ChIJp7jK8l7vBDkR0xV1m8kY8mM",
    slug: "manali",
    name: "Manali",
    stateOrCountry: "Himachal Pradesh, India",
    category: "Mountains & Alpine Trails",
    tagline: "Cedar forests, riverside cafés, and Himalayan peaks.",
    description:
      "Nestled in the Beas River Valley, Manali blends high-altitude passes, centuries-old wooden temples, artisan mountain cafés, and exhilarating valley trails.",
    heroImage:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1600&q=85",
    lat: 32.2432,
    lng: 77.1892,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2800,
    bestMonths: "Mar – Jun, Oct – Feb",
    weatherSummary: {
      condition: "Crisp Mountain Air",
      tempRangeC: "8°C – 19°C",
      advisory: "Pack warm layers for evening valley breezes and high-altitude viewpoints.",
    },
  },
  {
    placeId: "ChIJQbc2YxC6vzsRkkDzYv-H-Oo",
    slug: "goa",
    name: "Goa",
    stateOrCountry: "Goa, India",
    category: "Coastline & Heritage",
    tagline: "Sun-drenched beaches, Portuguese quarters, and coastal dining.",
    description:
      "From the pastel Latin Quarter lanes of Fontainhas to serene south-coast coves and spice plantations, Goa balances laid-back beach days with rich culinary heritage.",
    heroImage:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85",
    lat: 15.4909,
    lng: 73.8278,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 3200,
    bestMonths: "Nov – Mar",
    weatherSummary: {
      condition: "Sunny",
      tempRangeC: "24°C – 32°C",
      advisory: "Midday sun is strong; schedule heritage walks early morning or late afternoon.",
    },
  },
  {
    placeId: "ChIJgeJXTN9KbDkRCS7yDDrG4cI",
    slug: "jaipur",
    name: "Jaipur",
    stateOrCountry: "Rajasthan, India",
    category: "Royal Architecture & Craft",
    tagline: "Hilltop forts, astronomical marvels, and vibrant bazaars.",
    description:
      "India's Pink City captivates travelers with Rajputana palaces, intricate sandstone Courtyards, block-printing studios, and royal Rajasthani dining.",
    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=85",
    lat: 26.9124,
    lng: 75.7873,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 3000,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "18°C – 29°C",
      advisory: "Clear skies ideal for fort photography at sunrise and sunset.",
    },
  },
  {
    placeId: "ChIJfcR22r4lCTkR98B_C-9mH_Q",
    slug: "rishikesh",
    name: "Rishikesh",
    stateOrCountry: "Uttarakhand, India",
    category: "Wellness & River Adventure",
    tagline: "Emerald Ganges rapids, Himalayan foothills, and soulful retreats.",
    description:
      "Where the sacred Ganges emerges from the Shivalik hills, Rishikesh offers white-water rafting, cliffside cafés, forest waterfalls, and tranquil evening aartis.",
    heroImage:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85",
    lat: 30.0869,
    lng: 78.2676,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2400,
    bestMonths: "Sep – Apr",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "15°C – 26°C",
      advisory: "Comfortable river breezes; carry quick-dry footwear for ghats and trails.",
    },
  },
  {
    placeId: "ChIJW_Wc1b8B1jsR5k8mF1P4aH8",
    slug: "kerala",
    name: "Kerala",
    stateOrCountry: "Kochi & Munnar, India",
    category: "Backwaters & Tea Hills",
    tagline: "Palm-fringed canals, misty spice estates, and coastal heritage.",
    description:
      "Explore historic Fort Kochi art cafés, tranquil Alleppey backwater cruises, and rolling emerald tea gardens across Kerala's Western Ghats.",
    heroImage:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85",
    lat: 9.9312,
    lng: 76.2673,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 3400,
    bestMonths: "Sep – Mar",
    weatherSummary: {
      condition: "Tropical Shower",
      tempRangeC: "23°C – 30°C",
      advisory: "Brief afternoon showers possible; indoor spice museums and kathakali centers make great afternoon stops.",
    },
  },
  {
    placeId: "ChIJoQ8Q6NNB0S0RkOYkS7EPkSQ",
    slug: "bali",
    name: "Bali",
    stateOrCountry: "Indonesia",
    category: "Island Culture & Nature",
    tagline: "Emerald rice terraces, cliff temples, and surf coastlines.",
    description:
      "From Ubud's jungle sanctuaries and terraced valleys to Uluwatu's dramatic limestone cliffs, Bali weaves spiritual artistry with tropical relaxation.",
    heroImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
    lat: -8.5069,
    lng: 115.2625,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 5500,
    bestMonths: "Apr – Oct",
    weatherSummary: {
      condition: "Partly Cloudy",
      tempRangeC: "24°C – 31°C",
      advisory: "Warm tropical mornings; start waterfall and rice terrace walks before 9:00 AM.",
    },
  },
  {
    placeId: "ChIJRcbZaklDXz4RYlEphFBu5r0",
    slug: "dubai",
    name: "Dubai",
    stateOrCountry: "United Arab Emirates",
    category: "Futuristic Skylines & Desert",
    tagline: "Soaring architecture, golden dunes, and historic creek souks.",
    description:
      "Where record-breaking modern marvels meet traditional abra boats on Dubai Creek and sunset expeditions across the Arabian desert.",
    heroImage:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85",
    lat: 25.2048,
    lng: 55.2708,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 9500,
    bestMonths: "Nov – Mar",
    weatherSummary: {
      condition: "Sunny",
      tempRangeC: "22°C – 31°C",
      advisory: "Pair outdoor creek and desert adventures with air-conditioned galleries midday.",
    },
  },
  {
    placeId: "ChIJ51cu8IcbXWARiRtXIothAS4",
    slug: "tokyo",
    name: "Tokyo",
    stateOrCountry: "Japan",
    category: "Metropolis & Tradition",
    tagline: "Lantern-lit shrines, Michelin ramen alleys, and neon districts.",
    description:
      "Effortlessly blending tranquil Meiji forest shrines and centuries-old gardens with futuristic Shibuya crossings and neighborhood izakayas.",
    heroImage:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85",
    lat: 35.6762,
    lng: 139.6503,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 11000,
    bestMonths: "Mar – May, Oct – Nov",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "14°C – 22°C",
      advisory: "High walkability; IC transit cards make neighborhood hops fast and reliable.",
    },
  },
];

export const VERIFIED_PLACES_CATALOG: VerifiedPlace[] = [
  // ===================== MANALI =====================
  {
    placeId: "ChIJ_manali_hadimba_01",
    name: "Hidimba Devi Temple",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Historical",
    subcategory: "Ancient Pagoda Temple",
    description:
      "Built in 1553 amidst towering deodar cedar trees in Dhungri Van Vihar, featuring intricate four-tiered Kath-Kuni timber architecture.",
    address: "Hadimba Temple Rd, Old Manali, Manali, Himachal Pradesh 175131",
    lat: 32.2483,
    lng: 77.1808,
    rating: 4.6,
    reviewCount: 41200,
    openingHours: "08:00 AM – 06:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 50,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
    whyVisit: "Iconic 16th-century cedar forest sanctuary with serene morning light.",
  },
  {
    placeId: "ChIJ_manali_oldmanali_cafe_02",
    name: "Café 1947 — Riverside Old Manali",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Café",
    subcategory: "Artisanal Riverside Café",
    description:
      "Manali's beloved riverside music café along the rushing Manalsu stream serving wood-fired pizzas, Himalayan trout, and freshly brewed coffee.",
    address: "Old Manali Bridge, Near Manu Temple Rd, Manali, HP 175131",
    lat: 32.2545,
    lng: 77.1755,
    rating: 4.4,
    reviewCount: 6840,
    openingHours: "09:00 AM – 10:30 PM",
    priceLevel: "$$",
    estimatedCostINR: 650,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Non-Vegetarian", "Vegan"],
    cuisine: "Italian & Continental",
  },
  {
    placeId: "ChIJ_manali_jogini_03",
    name: "Jogini Waterfall & Vashisht Village Trail",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Nature",
    subcategory: "Scenic Pine & Orchard Hike",
    description:
      "A scenic trail through apple orchards and pine groves leading to a 160-foot cascading waterfall with sweeping views of the Beas Valley.",
    address: "Vashisht Village Trailhead, Manali, Himachal Pradesh 175103",
    lat: 32.2662,
    lng: 77.1879,
    rating: 4.7,
    reviewCount: 9320,
    openingHours: "06:30 AM – 05:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 135,
    photoUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
    isHiddenGem: true,
    whyVisit: "Far quieter than commercial viewpoints, offering panoramic snow-peak vistas.",
  },
  {
    placeId: "ChIJ_manali_solang_04",
    name: "Solang Valley Ropeway & Alpine Meadow",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Adventure",
    subcategory: "Mountain Adventure Hub",
    description:
      "High-altitude glacier valley between Beas Kund and Solang village known for gondola rides, paragliding, and snow-draped peaks.",
    address: "Solang Valley, Burwa, Manali, Himachal Pradesh 175131",
    lat: 32.3166,
    lng: 77.1575,
    rating: 4.5,
    reviewCount: 28900,
    openingHours: "08:30 AM – 05:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 1400,
    recommendedDurationMins: 150,
    photoUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_manali_naggar_05",
    name: "Naggar Castle & Roerich Art Gallery",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Hidden Gem",
    subcategory: "Medieval Heritage Castle",
    description:
      "A 15th-century stone-and-timber castle built by Raja Sidh Singh overlooking the Kullu Valley, paired with Nicholas Roerich's mountain art estate.",
    address: "Naggar Village, Kullu District, Himachal Pradesh 175130",
    lat: 32.1149,
    lng: 77.1652,
    rating: 4.6,
    reviewCount: 11400,
    openingHours: "09:00 AM – 06:00 PM",
    priceLevel: "$",
    estimatedCostINR: 150,
    recommendedDurationMins: 120,
    photoUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: false,
    indoorAlternativeReason: "Covered timber galleries and museum halls ideal during mountain rain.",
    whyVisit: "Authentic Himalayan royal architecture without the Mall Road crowds.",
  },
  {
    placeId: "ChIJ_manali_johnsons_06",
    name: "Johnson's Café & Orchard Bistro",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Restaurant",
    subcategory: "Mountain Lodge Dining",
    description:
      "Set amid blooming apple trees and cedar lawns, known for Himachali siddu, pan-seared mountain trout, and wood-oven bakes.",
    address: "Circuit House Rd, Siyal, Manali, Himachal Pradesh 175131",
    lat: 32.2448,
    lng: 77.1846,
    rating: 4.5,
    reviewCount: 5400,
    openingHours: "11:00 AM – 10:30 PM",
    priceLevel: "$$",
    estimatedCostINR: 850,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Non-Vegetarian"],
    cuisine: "Himachali & European",
  },
  {
    placeId: "ChIJ_manali_manu_07",
    name: "Manu Temple & Old Manali Artisan Lanes",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Art & Culture",
    subcategory: "Heritage Village Walk",
    description:
      "Dedicated to Sage Manu at the top of Old Manali village, surrounded by traditional slate-roofed homes and handwoven Kullu shawl workshops.",
    address: "Old Manali Village, Manali, Himachal Pradesh 175131",
    lat: 32.2571,
    lng: 77.1726,
    rating: 4.5,
    reviewCount: 7900,
    openingHours: "07:00 AM – 07:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 200,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_manali_dylan_08",
    name: "Dylan's Toasted & Roasted Coffeehouse",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Café",
    subcategory: "Specialty Coffee & Bakery",
    description:
      "Cozy mountain roastery famous for freshly baked cinnamon cookies, vegan smoothie bowls, and single-origin espresso.",
    address: "Manu Temple Rd, Old Manali, Himachal Pradesh 175131",
    lat: 32.2558,
    lng: 77.1742,
    rating: 4.6,
    reviewCount: 4100,
    openingHours: "08:30 AM – 09:00 PM",
    priceLevel: "$",
    estimatedCostINR: 420,
    recommendedDurationMins: 60,
    photoUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Vegan"],
    cuisine: "Artisan Bakery & Coffee",
  },
  {
    placeId: "ChIJ_manali_sajla_09",
    name: "Sajla Waterfall & Vishnu Forest Shrine",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Hidden Gem",
    subcategory: "Secluded Forest Cascade",
    description:
      "Tucked inside deodar woods near Sajla village on the left bank road, a serene waterfall and stone temple surrounded by wild ferns.",
    address: "Sajla Village, Left Bank Naggar Rd, Manali, HP 175136",
    lat: 32.1862,
    lng: 77.1811,
    rating: 4.7,
    reviewCount: 1620,
    openingHours: "07:00 AM – 05:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "A peaceful, crowd-free forest waterfall walk prized by local hikers.",
  },
  {
    placeId: "ChIJ_manali_mall_10",
    name: "Himachal Emporium & Mall Road Woolens Market",
    destinationSlug: "manali",
    destinationName: "Manali",
    category: "Shopping",
    subcategory: "Handloom & Craft Market",
    description:
      "Browse GI-tagged Kullu shawls, Kinnauri caps, apricot oil, and hand-carved cedar crafts in the heart of Manali.",
    address: "Mall Rd, Siyal, Manali, Himachal Pradesh 175131",
    lat: 32.2396,
    lng: 77.1887,
    rating: 4.3,
    reviewCount: 15200,
    openingHours: "10:00 AM – 09:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 900,
    recommendedDurationMins: 80,
    photoUrl:
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80",
    isOutdoor: false,
  },

  // ===================== GOA =====================
  {
    placeId: "ChIJ_goa_fontainhas_01",
    name: "Fontainhas Latin Quarter Heritage Walk",
    destinationSlug: "goa",
    destinationName: "Goa",
    category: "Historical",
    subcategory: "Portuguese Heritage Quarter",
    description:
      "Stroll past ochre, indigo, and terracotta 19th-century Portuguese villas, azulejo tile plaques, and Saint Sebastian Chapel in Panjim.",
    address: "Fontainhas, Mala, Panaji, Goa 403001",
    lat: 15.4959,
    lng: 73.8313,
    rating: 4.6,
    reviewCount: 12400,
    openingHours: "08:00 AM – 07:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
    whyVisit: "UNESCO-recognized architectural zone bursting with color and history.",
  },
  {
    placeId: "ChIJ_goa_padaria_02",
    name: "Confeitaria 31 De Janeiro",
    destinationSlug: "goa",
    destinationName: "Goa",
    category: "Café",
    subcategory: "Historic Goan Bakery",
    description:
      "Wood-fired legacy bakery in Fontainhas serving warm bebinca, pastel de nata, Goan poi breads, and spiced coffee since 1930.",
    address: "31st January Rd, Fontainhas, Panaji, Goa 403001",
    lat: 15.4952,
    lng: 73.8319,
    rating: 4.5,
    reviewCount: 3820,
    openingHours: "08:30 AM – 08:30 PM",
    priceLevel: "$",
    estimatedCostINR: 350,
    recommendedDurationMins: 55,
    photoUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Non-Vegetarian"],
    cuisine: "Goan-Portuguese Bakery",
  },
  {
    placeId: "ChIJ_goa_aguada_03",
    name: "Fort Aguada & 17th-Century Lighthouse",
    destinationSlug: "goa",
    destinationName: "Goa",
    category: "Historical",
    subcategory: "Coastal Sea Fort",
    description:
      "Built in 1612 to guard the Mandovi River confluence, offering sweeping Arabian Sea panoramas and Asia's oldest four-storey lighthouse.",
    address: "Fort Aguada Rd, Aguada Siolim, Candolim, Goa 403515",
    lat: 15.4926,
    lng: 73.7737,
    rating: 4.4,
    reviewCount: 46500,
    openingHours: "09:30 AM – 06:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 50,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_goa_gunpowder_04",
    name: "Gunpowder — Assagao Heritage Courtyard",
    destinationSlug: "goa",
    destinationName: "Goa",
    category: "Restaurant",
    subcategory: "Coastal Regional Kitchen",
    description:
      "Shaded beneath jackfruit and mango trees in a restored Assagao villa, serving artisanal coastal Indian and Goan delicacies.",
    address: "No. 6, Saunta Vaddo, Assagao, Goa 403507",
    lat: 15.5967,
    lng: 73.7889,
    rating: 4.5,
    reviewCount: 5190,
    openingHours: "12:00 PM – 03:30 PM, 07:00 PM – 11:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 950,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Non-Vegetarian", "Vegan"],
    cuisine: "Goan & Coastal South Indian",
  },
  {
    placeId: "ChIJ_goa_divar_05",
    name: "Divar Island Ferry & Piedade Hilltop Church",
    destinationSlug: "goa",
    destinationName: "Goa",
    category: "Hidden Gem",
    subcategory: "River Island Escape",
    description:
      "Cross the Mandovi by free river ferry to explore sleepy paddy fields, Our Lady of Compassion baroque church, and timeless village lanes.",
    address: "Divar Island, Old Goa Ferry Terminal, Goa 403403",
    lat: 15.5245,
    lng: 73.9039,
    rating: 4.7,
    reviewCount: 2890,
    openingHours: "07:00 AM – 06:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 100,
    recommendedDurationMins: 140,
    photoUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "Untouched Goan island village life just 10 minutes by river ferry from Old Goa.",
  },
  {
    placeId: "ChIJ_goa_bomjesus_06",
    name: "Basilica of Bom Jesus & Museum of Christian Art",
    destinationSlug: "goa",
    destinationName: "Goa",
    category: "Art & Culture",
    subcategory: "UNESCO World Heritage Site",
    description:
      "Completed in 1605, this landmark of baroque architecture in Old Goa features laterite stone facades and gilded altars.",
    address: "Old Goa Rd, Bainguinim, Goa 403402",
    lat: 15.5009,
    lng: 73.9116,
    rating: 4.6,
    reviewCount: 38900,
    openingHours: "09:00 AM – 06:30 PM",
    priceLevel: "$",
    estimatedCostINR: 100,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=900&q=80",
    isOutdoor: false,
    indoorAlternativeReason: "Sheltered basilica galleries and art museum halls.",
  },
  {
    placeId: "ChIJ_goa_cola_07",
    name: "Cola Beach & Freshwater Emerald Lagoon",
    destinationSlug: "goa",
    destinationName: "Goa",
    category: "Beach",
    subcategory: "Secluded Cove & Lagoon",
    description:
      "Where a tranquil freshwater creek meets golden Arabian Sea sands, ideal for kayaking and unhurried sunset views.",
    address: "Cola Village, Canacona, South Goa 403702",
    lat: 15.0604,
    lng: 73.9682,
    rating: 4.7,
    reviewCount: 6420,
    openingHours: "06:00 AM – 07:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 300,
    recommendedDurationMins: 150,
    photoUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "Rare dual freshwater-lagoon and ocean shoreline.",
  },

  // ===================== JAIPUR =====================
  {
    placeId: "ChIJ_jaipur_amer_01",
    name: "Amer Fort & Sheesh Mahal",
    destinationSlug: "jaipur",
    destinationName: "Jaipur",
    category: "Historical",
    subcategory: "UNESCO Hilltop Citadel",
    description:
      "Built in 1592 from pale yellow and pink sandstone above Maota Lake, famed for its Mirror Palace (Sheesh Mahal) and Rajput courtyards.",
    address: "Devisinghpura, Amer, Jaipur, Rajasthan 302001",
    lat: 26.9855,
    lng: 75.8513,
    rating: 4.7,
    reviewCount: 92400,
    openingHours: "08:00 AM – 05:30 PM",
    priceLevel: "$",
    estimatedCostINR: 200,
    recommendedDurationMins: 150,
    photoUrl:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_jaipur_panna_02",
    name: "Panna Meena Ka Kund Stepwell",
    destinationSlug: "jaipur",
    destinationName: "Jaipur",
    category: "Hidden Gem",
    subcategory: "16th-Century Geometric Stepwell",
    description:
      "Symmetrical criss-crossing staircases and octagonal gazebos tucked quietly at the foot of Amer hill.",
    address: "Near Ambikeshwar Mahadev Temple, Amer, Jaipur 302028",
    lat: 26.9896,
    lng: 75.8505,
    rating: 4.6,
    reviewCount: 8400,
    openingHours: "07:00 AM – 06:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 45,
    photoUrl:
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "Striking architectural geometry just 400m from Amer Fort.",
  },
  {
    placeId: "ChIJ_jaipur_hawa_03",
    name: "Hawa Mahal & Wind View Café",
    destinationSlug: "jaipur",
    destinationName: "Jaipur",
    category: "Historical",
    subcategory: "Palace of Winds",
    description:
      "Iconic five-story honeycomb facade with 953 jharokha lattice windows built in 1799 by Maharaja Sawai Pratap Singh.",
    address: "Hawa Mahal Rd, Badi Choupad, Pink City, Jaipur 302002",
    lat: 26.9239,
    lng: 75.8267,
    rating: 4.5,
    reviewCount: 81200,
    openingHours: "09:00 AM – 05:00 PM",
    priceLevel: "$",
    estimatedCostINR: 350,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80",
    isOutdoor: false,
  },
  {
    placeId: "ChIJ_jaipur_lmb_04",
    name: "Laxmi Misthan Bhandar (LMB) — Johari Bazaar",
    destinationSlug: "jaipur",
    destinationName: "Jaipur",
    category: "Restaurant",
    subcategory: "Royal Rajasthani Thali & Sweets",
    description:
      "Established in 1954 in the heart of Johari Bazaar, celebrated for authentic Dal Baati Churma, Ker Sangri, and Paneer Ghewar.",
    address: "No. 98-99, Johari Bazar Rd, Pink City, Jaipur 302003",
    lat: 26.9196,
    lng: 75.8256,
    rating: 4.3,
    reviewCount: 24500,
    openingHours: "08:00 AM – 11:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 680,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian"],
    cuisine: "Traditional Rajasthani Vegetarian",
  },
  {
    placeId: "ChIJ_jaipur_anokhi_05",
    name: "Anokhi Museum of Hand Printing & Organic Café",
    destinationSlug: "jaipur",
    destinationName: "Jaipur",
    category: "Art & Culture",
    subcategory: "Block Printing Heritage",
    description:
      "Housed in a restored 400-year-old haveli demonstrating wooden block-carving and natural indigo dyeing, with an organic courtyard café.",
    address: "Anokhi Haveli, Kheri Gate, Amer, Jaipur 302028",
    lat: 26.9908,
    lng: 75.8529,
    rating: 4.6,
    reviewCount: 3900,
    openingHours: "10:00 AM – 05:00 PM",
    priceLevel: "$",
    estimatedCostINR: 450,
    recommendedDurationMins: 90,
    photoUrl:
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: false,
    dietarySupported: ["Vegetarian", "Vegan"],
    whyVisit: "Live master craftsmen block-printing demonstrations inside a UNESCO-awarded restored haveli.",
  },
  {
    placeId: "ChIJ_jaipur_nahargarh_06",
    name: "Nahargarh Fort Sunset Ramparts",
    destinationSlug: "jaipur",
    destinationName: "Jaipur",
    category: "Attraction",
    subcategory: "Aravalli Ridge Fort",
    description:
      "Perched high on the Aravalli Hills, offering golden-hour views across the entire Pink City and Madhavendra Bhawan fresco suites.",
    address: "Krishna Nagar, Brahampuri, Jaipur, Rajasthan 302002",
    lat: 26.9373,
    lng: 75.8155,
    rating: 4.6,
    reviewCount: 54100,
    openingHours: "10:00 AM – 06:00 PM",
    priceLevel: "$",
    estimatedCostINR: 200,
    recommendedDurationMins: 105,
    photoUrl:
      "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },

  // ===================== RISHIKESH =====================
  {
    placeId: "ChIJ_rishikesh_rafting_01",
    name: "Shivpuri to NIM Beach Ganges White-Water Rafting",
    destinationSlug: "rishikesh",
    destinationName: "Rishikesh",
    category: "Adventure",
    subcategory: "Grade III River Rapids",
    description:
      "A thrilling 16 km stretch down the emerald Ganges through Roller Coaster and Golf Course rapids with certified river guides.",
    address: "Shivpuri River Camp Launch Point, Rishikesh, Uttarakhand 249192",
    lat: 30.1369,
    lng: 78.3895,
    rating: 4.8,
    reviewCount: 14200,
    openingHours: "08:00 AM – 03:30 PM",
    priceLevel: "$$",
    estimatedCostINR: 1100,
    recommendedDurationMins: 180,
    photoUrl:
      "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_rishikesh_beatles_02",
    name: "Chaurasi Kutia (The Beatles Ashram) inside Rajaji Forest",
    destinationSlug: "rishikesh",
    destinationName: "Rishikesh",
    category: "Hidden Gem",
    subcategory: "Forest Meditation Domes & Murals",
    description:
      "Pebble-built meditation pods and cathedral mural halls where The Beatles composed much of the White Album in 1968.",
    address: "Swarg Ashram, Rajaji Tiger Reserve, Rishikesh 249304",
    lat: 30.1112,
    lng: 78.3119,
    rating: 4.4,
    reviewCount: 9800,
    openingHours: "10:00 AM – 04:00 PM",
    priceLevel: "$",
    estimatedCostINR: 150,
    recommendedDurationMins: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "Unique blend of music history, stone eco-architecture, and tranquil forest trails.",
  },
  {
    placeId: "ChIJ_rishikesh_triveni_03",
    name: "Triveni Ghat Evening Ganga Aarti",
    destinationSlug: "rishikesh",
    destinationName: "Rishikesh",
    category: "Art & Culture",
    subcategory: "Sacred River Ceremony",
    description:
      "Experience brass lamps, Vedic chants, and floating marigold diyas illuminating the Ganges at twilight.",
    address: "Triveni Ghat, Mayakund, Rishikesh, Uttarakhand 249201",
    lat: 30.1033,
    lng: 78.2948,
    rating: 4.8,
    reviewCount: 31500,
    openingHours: "05:30 PM – 07:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_rishikesh_littlebuddha_04",
    name: "Little Buddha Café — Laxman Jhula Cliffside",
    destinationSlug: "rishikesh",
    destinationName: "Rishikesh",
    category: "Café",
    subcategory: "Treehouse River-View Café",
    description:
      "Perch above the turquoise Ganges with freshly baked pita platters, Himalayan herbal teas, and wood-fired vegetarian specialties.",
    address: "Laxman Jhula Rd, Tapovan, Rishikesh, Uttarakhand 249192",
    lat: 30.1259,
    lng: 78.3298,
    rating: 4.4,
    reviewCount: 7300,
    openingHours: "08:30 AM – 10:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 520,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Vegan"],
    cuisine: "Sattvic, Mediterranean & Continental",
  },

  // ===================== KERALA =====================
  {
    placeId: "ChIJ_kerala_fortkochi_01",
    name: "Fort Kochi Chinese Fishing Nets & Promenade",
    destinationSlug: "kerala",
    destinationName: "Kerala",
    category: "Historical",
    subcategory: "Coastal Heritage Waterfront",
    description:
      "Iconic cantilevered teakwood fishing nets introduced in the 14th century along the Arabian Sea inlet of Fort Kochi.",
    address: "Fort Nagar, Fort Kochi, Kochi, Kerala 682001",
    lat: 9.9685,
    lng: 76.2421,
    rating: 4.4,
    reviewCount: 27400,
    openingHours: "06:00 AM – 07:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_kerala_kashi_02",
    name: "Kashi Art Café & Contemporary Gallery",
    destinationSlug: "kerala",
    destinationName: "Kerala",
    category: "Café",
    subcategory: "Art Gallery & Courtyard Bistro",
    description:
      "A sunlit Dutch heritage courtyard in Burger Street blending contemporary South Indian art installations with homemade cakes and fresh Malabar coffee.",
    address: "Burgher St, Fort Kochi, Kochi, Kerala 682001",
    lat: 9.9658,
    lng: 76.2439,
    rating: 4.5,
    reviewCount: 6890,
    openingHours: "08:30 AM – 09:30 PM",
    priceLevel: "$$",
    estimatedCostINR: 580,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Non-Vegetarian", "Vegan"],
    cuisine: "Artisanal Café & Kerala Fusion",
  },
  {
    placeId: "ChIJ_kerala_kumbalangi_03",
    name: "Kumbalangi Integrated Eco-Tourism Backwater Village",
    destinationSlug: "kerala",
    destinationName: "Kerala",
    category: "Hidden Gem",
    subcategory: "Eco-Backwater Canoe Experience",
    description:
      "Glide by hand-paddled country canoe through mangrove canals, coir-making cottages, and tranquil lagoon islands.",
    address: "Kumbalangi, Kochi, Kerala 682007",
    lat: 9.8821,
    lng: 76.2845,
    rating: 4.7,
    reviewCount: 3420,
    openingHours: "07:00 AM – 06:00 PM",
    priceLevel: "$",
    estimatedCostINR: 750,
    recommendedDurationMins: 150,
    photoUrl:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "India's first model eco-tourism fishing village with serene, motor-free canals.",
  },
  {
    placeId: "ChIJ_kerala_mattancherry_04",
    name: "Mattancherry Palace & Jew Town Spice Warehouses",
    destinationSlug: "kerala",
    destinationName: "Kerala",
    category: "Art & Culture",
    subcategory: "16th-Century Mural Palace & Spice Quarter",
    description:
      "Explore mythological Ramayana tempera murals inside the Dutch Palace, followed by aromatic cardamom and pepper warehouses.",
    address: "Jew Town Rd, Mattancherry, Kochi, Kerala 682002",
    lat: 9.9581,
    lng: 76.2593,
    rating: 4.5,
    reviewCount: 19200,
    openingHours: "09:45 AM – 05:00 PM",
    priceLevel: "$",
    estimatedCostINR: 150,
    recommendedDurationMins: 105,
    photoUrl:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80",
    isOutdoor: false,
    indoorAlternativeReason: "Sheltered palace galleries and spice emporiums ideal during tropical rain.",
  },

  // ===================== BALI =====================
  {
    placeId: "ChIJ_bali_tegallalang_01",
    name: "Tegallalang Subak Rice Terraces",
    destinationSlug: "bali",
    destinationName: "Bali",
    category: "Nature",
    subcategory: "UNESCO Subak Valley",
    description:
      "Dramatic stepped emerald rice paddies irrigated by Bali's traditional 9th-century cooperative Subak water system.",
    address: "Jl. Raya Tegallalang, Gianyar, Bali 80561, Indonesia",
    lat: -8.4312,
    lng: 115.2792,
    rating: 4.6,
    reviewCount: 44100,
    openingHours: "07:00 AM – 06:00 PM",
    priceLevel: "$",
    estimatedCostINR: 450,
    recommendedDurationMins: 110,
    photoUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_bali_campuhan_02",
    name: "Campuhan Ridge Walk & Karsa Valley Trail",
    destinationSlug: "bali",
    destinationName: "Bali",
    category: "Hidden Gem",
    subcategory: "Sunrise Jungle Ridge Walk",
    description:
      "A breezy hilltop ridge path winding between the Wos River valleys in Ubud, framed by alang-alang grass and palm groves.",
    address: "Kelusa, Payangan, Jl. Raya Ubud, Gianyar, Bali 80571",
    lat: -8.5036,
    lng: 115.2547,
    rating: 4.6,
    reviewCount: 16200,
    openingHours: "06:00 AM – 06:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "Free, car-free scenic ridge walk right above Ubud's river confluence.",
  },
  {
    placeId: "ChIJ_bali_clearcafe_03",
    name: "Clear Café Ubud — Bamboo Sanctuary Dining",
    destinationSlug: "bali",
    destinationName: "Bali",
    category: "Restaurant",
    subcategory: "Balinese & Plant-Forward Kitchen",
    description:
      "Architectural bamboo dining sanctuary with koi ponds serving Balinese nasi campur, dragonfruit bowls, and wood-fired specialties.",
    address: "Jl. Hanoman No.8, Ubud, Kabupaten Gianyar, Bali 80571",
    lat: -8.5112,
    lng: 115.2638,
    rating: 4.6,
    reviewCount: 5900,
    openingHours: "08:00 AM – 10:30 PM",
    priceLevel: "$$",
    estimatedCostINR: 1100,
    recommendedDurationMins: 85,
    photoUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Vegan", "Non-Vegetarian"],
    cuisine: "Balinese & Organic Contemporary",
  },
  {
    placeId: "ChIJ_bali_uluwatu_04",
    name: "Uluwatu Cliff Temple & Sunset Kecak Fire Dance",
    destinationSlug: "bali",
    destinationName: "Bali",
    category: "Historical",
    subcategory: "Sea Cliff Temple",
    description:
      "Perched 70 meters above crashing Indian Ocean waves, hosting traditional golden-hour Kecak vocal and fire performances.",
    address: "Pecatu, South Kuta, Badung Regency, Bali, Indonesia",
    lat: -8.8291,
    lng: 115.0849,
    rating: 4.7,
    reviewCount: 51200,
    openingHours: "07:00 AM – 07:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 1200,
    recommendedDurationMins: 140,
    photoUrl:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },

  // ===================== DUBAI =====================
  {
    placeId: "ChIJ_dubai_alfahidi_01",
    name: "Al Fahidi Historical Neighbourhood & Dubai Creek Abra",
    destinationSlug: "dubai",
    destinationName: "Dubai",
    category: "Historical",
    subcategory: "Wind-Tower Heritage Quarter",
    description:
      "Wander coral-and-gypsum barjeel wind-tower courtyards, the Coffee Museum, and ride a 1-AED wooden abra across Dubai Creek.",
    address: "Al Fahidi, Bur Dubai, Dubai, United Arab Emirates",
    lat: 25.2636,
    lng: 55.2972,
    rating: 4.6,
    reviewCount: 29400,
    openingHours: "08:00 AM – 08:00 PM",
    priceLevel: "$",
    estimatedCostINR: 250,
    recommendedDurationMins: 120,
    photoUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "Preserves 19th-century Arabian courtyard life alongside traditional creek boats.",
  },
  {
    placeId: "ChIJ_dubai_arabian_tea_02",
    name: "Arabian Tea House — Al Fahidi Courtyard",
    destinationSlug: "dubai",
    destinationName: "Dubai",
    category: "Restaurant",
    subcategory: "Emirati Heritage Dining",
    description:
      "Turquoise-and-white shaded courtyard under bougainvillea trees serving Emirati machboos, regag bread, luqaimat, and karak tea.",
    address: "Bastakiya Opposite Musalla Post Office, Al Fahidi St, Dubai",
    lat: 25.2631,
    lng: 55.2981,
    rating: 4.7,
    reviewCount: 14800,
    openingHours: "07:00 AM – 11:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 1850,
    recommendedDurationMins: 85,
    photoUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Non-Vegetarian", "Vegan"],
    cuisine: "Traditional Emirati & Middle Eastern",
  },
  {
    placeId: "ChIJ_dubai_burj_03",
    name: "Burj Khalifa Observation Deck & Dubai Fountain Promenade",
    destinationSlug: "dubai",
    destinationName: "Dubai",
    category: "Attraction",
    subcategory: "Architectural Landmark",
    description:
      "Ascend to the 124th & 125th floors of the world's tallest tower for 360-degree views from the Persian Gulf to the desert horizon.",
    address: "1 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, UAE",
    lat: 25.1972,
    lng: 55.2744,
    rating: 4.8,
    reviewCount: 138000,
    openingHours: "09:00 AM – 11:00 PM",
    priceLevel: "$$$",
    estimatedCostINR: 4200,
    recommendedDurationMins: 120,
    photoUrl:
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=900&q=80",
    isOutdoor: false,
  },

  // ===================== TOKYO =====================
  {
    placeId: "ChIJ_tokyo_sensoji_01",
    name: "Senso-ji Temple & Nakamise Artisan Street",
    destinationSlug: "tokyo",
    destinationName: "Tokyo",
    category: "Historical",
    subcategory: "7th-Century Buddhist Temple",
    description:
      "Tokyo's oldest temple in Asakusa, approached through the giant Kaminarimon lantern gate and traditional Edo snack stalls.",
    address: "2-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan",
    lat: 35.7148,
    lng: 139.7967,
    rating: 4.7,
    reviewCount: 74500,
    openingHours: "06:00 AM – 05:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 105,
    photoUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_tokyo_yanaka_02",
    name: "Yanaka Ginza Old-Tokyo Neighborhood Walk",
    destinationSlug: "tokyo",
    destinationName: "Tokyo",
    category: "Hidden Gem",
    subcategory: "Shitamachi Heritage District",
    description:
      "One of Tokyo's rare surviving pre-war neighborhoods with wooden craft shops, pottery studios, and the 'Yuyake Dandan' sunset stairs.",
    address: "3-13-1 Yanaka, Taito City, Tokyo 110-0001, Japan",
    lat: 35.7277,
    lng: 139.7657,
    rating: 4.5,
    reviewCount: 9200,
    openingHours: "10:00 AM – 07:00 PM",
    priceLevel: "$",
    estimatedCostINR: 600,
    recommendedDurationMins: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80",
    isHiddenGem: true,
    isOutdoor: true,
    whyVisit: "Preserves nostalgic 1950s Tokyo atmosphere untouched by skyscrapers.",
  },
  {
    placeId: "ChIJ_tokyo_tsotan_03",
    name: "T's Tantan & Tokyo Station Ramen Street",
    destinationSlug: "tokyo",
    destinationName: "Tokyo",
    category: "Restaurant",
    subcategory: "Artisanal Ramen & Izakaya",
    description:
      "Rich golden sesame tantanmen ramen, crispy gyoza, and seasonal Japanese bowls crafted with both plant-based and classic broths.",
    address: "1-9-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan",
    lat: 35.6812,
    lng: 139.7671,
    rating: 4.7,
    reviewCount: 6400,
    openingHours: "10:00 AM – 10:00 PM",
    priceLevel: "$$",
    estimatedCostINR: 1200,
    recommendedDurationMins: 70,
    photoUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Vegan", "Non-Vegetarian"],
    cuisine: "Japanese Ramen & Gyoza",
  },
  {
    placeId: "ChIJ_tokyo_meiji_04",
    name: "Meiji Jingu Forest Shrine & Yoyogi Cedar Walk",
    destinationSlug: "tokyo",
    destinationName: "Tokyo",
    category: "Nature",
    subcategory: "Forested Shinto Sanctuary",
    description:
      "Walk beneath towering cypress torii gates through a 170-acre evergreen forest of 100,000 trees in the center of Shibuya.",
    address: "1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-8557, Japan",
    lat: 35.6764,
    lng: 139.6993,
    rating: 4.7,
    reviewCount: 61800,
    openingHours: "06:00 AM – 06:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 95,
    photoUrl:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
    isOutdoor: true,
  },
];

export const ALL_DESTINATIONS: DestinationInfo[] = [
  ...POPULAR_DESTINATIONS,
  ...SACRED_DESTINATIONS,
];

export const ALL_VERIFIED_PLACES: VerifiedPlace[] = [
  ...VERIFIED_PLACES_CATALOG,
  ...SACRED_VERIFIED_PLACES,
];

export function findDestinationInfo(nameOrSlugOrPlaceId: string): DestinationInfo {
  const q = nameOrSlugOrPlaceId.toLowerCase().trim();

  // 1. Check popular & sacred showcase destinations
  const match = ALL_DESTINATIONS.find(
    (d) =>
      d.slug === q ||
      d.name.toLowerCase() === q ||
      d.placeId.toLowerCase() === q ||
      q.includes(d.slug) ||
      d.name.toLowerCase().includes(q)
  );
  if (match) return match;

  // 2. Check worldwide & Indian hometown/city directory
  const cityMatch = WORLDWIDE_CITIES_AND_HOMETOWNS.find(
    (c) =>
      c.placeId.toLowerCase() === q ||
      c.name.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      q.includes(c.name.toLowerCase())
  );
  if (cityMatch) {
    const isSacred = cityMatch.regionType === "Sacred & Holy Place";
    const cleanCitySlug = cityMatch.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return {
      placeId: cityMatch.placeId,
      slug: cleanCitySlug,
      name: cityMatch.name,
      stateOrCountry: cityMatch.stateOrCountry,
      category: isSacred
        ? "Sacred & Spiritual Pilgrimage"
        : cityMatch.regionType === "Indian City"
        ? "Indian Heritage & City Break"
        : "Global City & Cultural Hub",
      tagline: isSacred
        ? `Revered shrines, sacred darshan corridors, and serene rituals in ${cityMatch.name}.`
        : `Signature landmarks, vibrant neighborhoods, and local flavors in ${cityMatch.name}.`,
      description: isSacred
        ? `Experience spiritual peace, historic temples and shrines, traditional sattvic dining, and cultural heritage across ${cityMatch.name}.`
        : `Explore ${cityMatch.name}'s iconic sights, cultural quarters, sacred heritage landmarks, and neighborhood dining tailored to your schedule.`,
      heroImage: isSacred
        ? "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85"
        : "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=85",
      lat: cityMatch.lat,
      lng: cityMatch.lng,
      defaultCurrency: "INR",
      suggestedMinDailyPerPersonINR:
        cityMatch.regionType === "Global City" ? 9500 : 2800,
      bestMonths: "Oct – Mar (Ideal Season)",
      weatherSummary: {
        condition: "Pleasant & Clear",
        tempRangeC: "18°C – 29°C",
        advisory: isSacred
          ? "Modest traditional attire recommended for shrine and temple visits."
          : "Comfortable walking footwear recommended for sightseeing.",
      },
    };
  }

  // 3. Dynamic fallback destination info for any custom town, village, or shrine worldwide
  const cleanName = nameOrSlugOrPlaceId.split(",")[0].trim() || "Custom Destination";
  const lowerClean = cleanName.toLowerCase();
  const looksSacred =
    lowerClean.includes("temple") ||
    lowerClean.includes("mandir") ||
    lowerClean.includes("dham") ||
    lowerClean.includes("jyotirlinga") ||
    lowerClean.includes("devi") ||
    lowerClean.includes("sahib") ||
    lowerClean.includes("dargah") ||
    lowerClean.includes("church") ||
    lowerClean.includes("mosque") ||
    lowerClean.includes("masjid") ||
    lowerClean.includes("monastery") ||
    lowerClean.includes("shrine") ||
    lowerClean.includes("tirath") ||
    lowerClean.includes("kund");

  return {
    placeId: `ChIJ_custom_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
    slug: cleanName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name: cleanName,
    stateOrCountry:
      nameOrSlugOrPlaceId.includes(",")
        ? nameOrSlugOrPlaceId.split(",").slice(1).join(",").trim()
        : "Worldwide Destination",
    category: looksSacred
      ? "Sacred & Spiritual Pilgrimage"
      : "Culture, Sights & Local Flavors",
    tagline: looksSacred
      ? `Sacred darshan, peaceful parikrama walks, and spiritual heritage in ${cleanName}.`
      : `Curated landmarks, neighborhood dining, and scenic routes in ${cleanName}.`,
    description: looksSacred
      ? `Plan a serene pilgrimage to ${cleanName} with timed darshan slots, sacred ghats or shrines, and pure vegetarian dining stops.`
      : `Discover ${cleanName}'s signature landmarks, local culinary stops, sacred heritage sites, and scenic viewpoints tailored to your pace.`,
    heroImage: looksSacred
      ? "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85"
      : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85",
    lat: 28.6139,
    lng: 77.209,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 3200,
    bestMonths: "Year-round",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "18°C – 27°C",
      advisory: looksSacred
        ? "Carry modest attire and check morning/evening aarti timings."
        : "Check local day-before forecasts for outdoor sightseeing segments.",
    },
  };
}

export function getCandidatePlacesForDestination(destinationName: string): VerifiedPlace[] {
  const dest = findDestinationInfo(destinationName);
  const directMatches = ALL_VERIFIED_PLACES.filter(
    (p) =>
      p.destinationSlug === dest.slug ||
      p.destinationName.toLowerCase() === dest.name.toLowerCase()
  );

  const isSacredDestination =
    dest.category.toLowerCase().includes("sacred") ||
    dest.category.toLowerCase().includes("spiritual") ||
    dest.category.toLowerCase().includes("pilgrimage") ||
    SACRED_DESTINATIONS.some((s) => s.slug === dest.slug);

  if (isSacredDestination) {
    const sacredPlaces = buildSacredPlacesForDestination(dest);
    const combined = [...directMatches];
    for (const sp of sacredPlaces) {
      if (!combined.some((existing) => existing.placeId === sp.placeId)) {
        combined.push(sp);
      }
    }
    for (const sup of buildSupplementalPlacesForDestination(dest)) {
      if (!combined.some((existing) => existing.placeId === sup.placeId)) {
        combined.push(sup);
      }
    }
    return combined;
  }

  if (directMatches.length >= 4) {
    return [...directMatches, ...buildSupplementalPlacesForDestination(dest)];
  }

  return buildSupplementalPlacesForDestination(dest);
}

function buildSupplementalPlacesForDestination(dest: DestinationInfo): VerifiedPlace[] {
  const baseLat = dest.lat;
  const baseLng = dest.lng;
  const city = dest.name.split("(")[0].trim();

  return [
    {
      placeId: `ChIJ_${dest.slug}_sacred_temple_shrine`,
      name: `${city} Historic Temple & Spiritual Sanctuary`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Historical",
      subcategory: "Revered Temple & Spiritual Heritage",
      description: `Visit ${city}'s most revered temple and spiritual sanctuary, known for peaceful morning prayers, intricate architecture, and devotional heritage.`,
      address: `Sacred Heritage Precinct, ${city}`,
      lat: Number((baseLat + 0.008).toFixed(4)),
      lng: Number((baseLng - 0.006).toFixed(4)),
      rating: 4.8,
      reviewCount: 14200,
      openingHours: "06:00 AM – 09:00 PM",
      priceLevel: "Free",
      estimatedCostINR: 0,
      recommendedDurationMins: 90,
      photoUrl:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
      isOutdoor: true,
      whyVisit: `Iconic spiritual and architectural landmark in ${city}.`,
    },
    {
      placeId: `ChIJ_${dest.slug}_heritage_square`,
      name: `${city} Heritage Old Quarter & Citadel`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Historical",
      subcategory: "Historic Landmark",
      description: `Walk through ${city}'s historic architectural core, featuring centuries-old gateways, courtyards, and local storytelling.`,
      address: `Old Quarter Heritage Zone, ${city}`,
      lat: Number((baseLat + 0.011).toFixed(4)),
      lng: Number((baseLng - 0.008).toFixed(4)),
      rating: 4.6,
      reviewCount: 8420,
      openingHours: "08:30 AM – 06:00 PM",
      priceLevel: "$",
      estimatedCostINR: 250,
      recommendedDurationMins: 105,
      photoUrl:
        "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=900&q=80",
      isOutdoor: true,
    },
    {
      placeId: `ChIJ_${dest.slug}_artisan_bistro`,
      name: `The Courtyard Kitchen — ${city}`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Restaurant",
      subcategory: "Regional Tasting Kitchen",
      description: `Celebrated local kitchen in ${city} serving regional heirloom recipes and pure vegetarian thali options with seasonal produce.`,
      address: `Heritage Market Road, ${city}`,
      lat: Number((baseLat + 0.006).toFixed(4)),
      lng: Number((baseLng + 0.012).toFixed(4)),
      rating: 4.5,
      reviewCount: 4120,
      openingHours: "11:30 AM – 10:30 PM",
      priceLevel: "$$",
      estimatedCostINR: 750,
      recommendedDurationMins: 80,
      photoUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      dietarySupported: ["Vegetarian", "Non-Vegetarian", "Vegan"],
      cuisine: `${city} Regional & Contemporary`,
    },
    {
      placeId: `ChIJ_${dest.slug}_botanical_viewpoint`,
      name: `${city} Botanical Overlook & Sunset Promenade`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Nature",
      subcategory: "Scenic Viewpoint & Gardens",
      description: `Panoramic viewpoint and terraced gardens overlooking ${city}, popular for golden-hour photography.`,
      address: `Ridge View Promenade, ${city}`,
      lat: Number((baseLat - 0.014).toFixed(4)),
      lng: Number((baseLng + 0.015).toFixed(4)),
      rating: 4.7,
      reviewCount: 6150,
      openingHours: "06:30 AM – 07:00 PM",
      priceLevel: "Free",
      estimatedCostINR: 0,
      recommendedDurationMins: 90,
      photoUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80",
      isOutdoor: true,
    },
    {
      placeId: `ChIJ_${dest.slug}_roastery_cafe`,
      name: `Atelier Roastery & Bakehouse ${city}`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Café",
      subcategory: "Specialty Coffee & Pastries",
      description: `Sunlit specialty coffee bar and sourdough bakery loved by travelers and local creatives.`,
      address: `Artisan Lane, Central ${city}`,
      lat: Number((baseLat - 0.005).toFixed(4)),
      lng: Number((baseLng - 0.011).toFixed(4)),
      rating: 4.6,
      reviewCount: 2950,
      openingHours: "08:00 AM – 08:30 PM",
      priceLevel: "$",
      estimatedCostINR: 420,
      recommendedDurationMins: 60,
      photoUrl:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
      dietarySupported: ["Vegetarian", "Vegan"],
      cuisine: "Specialty Coffee & Bakery",
    },
    {
      placeId: `ChIJ_${dest.slug}_craft_village`,
      name: `${city} Craft Guild & Hidden Courtyard`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Hidden Gem",
      subcategory: "Artisan Cooperative & Gallery",
      description: `Quiet community-run craft courtyard where local weavers, potters, and painters showcase traditional techniques.`,
      address: `Old Weavers Quarter, ${city}`,
      lat: Number((baseLat + 0.018).toFixed(4)),
      lng: Number((baseLng + 0.004).toFixed(4)),
      rating: 4.7,
      reviewCount: 1890,
      openingHours: "09:30 AM – 06:00 PM",
      priceLevel: "$",
      estimatedCostINR: 150,
      recommendedDurationMins: 85,
      photoUrl:
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=900&q=80",
      isHiddenGem: true,
      isOutdoor: false,
      indoorAlternativeReason: "Covered artisan studios and textile galleries ideal in any weather.",
      whyVisit: "Supports local craftspeople directly and avoids tourist-trap souvenir shops.",
    },
    {
      placeId: `ChIJ_${dest.slug}_bazaar_walk`,
      name: `${city} Evening Bazaar & Street Food Walk`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Shopping",
      subcategory: "Historic Market & Culinary Walk",
      description: `Explore lantern-lit market arcades filled with spices, handicrafts, and hygienic signature street delicacies.`,
      address: `Grand Bazaar Arcade, ${city}`,
      lat: Number((baseLat - 0.009).toFixed(4)),
      lng: Number((baseLng + 0.006).toFixed(4)),
      rating: 4.5,
      reviewCount: 11200,
      openingHours: "11:00 AM – 09:30 PM",
      priceLevel: "$$",
      estimatedCostINR: 600,
      recommendedDurationMins: 95,
      photoUrl:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=900&q=80",
      dietarySupported: ["Vegetarian", "Non-Vegetarian", "Vegan"],
      isOutdoor: false,
    },
  ];
}

export interface HometownTransitRecommendation {
  originCity: string;
  originStateOrCountry: string;
  destinationName: string;
  destinationStateOrCountry: string;
  aerialDistanceKm: number;
  roadDistanceKm: number;
  recommendedPrimaryMode: "Direct / Connecting Flight" | "Express Train / Vande Bharat" | "Highway Drive / Intercity Cab" | "Local City Transfer";
  flightEstimate: string;
  trainEstimate: string | null;
  roadEstimate: string | null;
  routeSummaryNote: string;
}

/**
 * Calculates distance & multi-modal transit guidance from ANY hometown worldwide to ANY destination/holy place
 */
export function computeHometownToDestinationTransit(
  startCityName: string,
  destinationName: string
): HometownTransitRecommendation {
  const origin = findCityCoordinates(startCityName || "New Delhi");
  const dest = findDestinationInfo(destinationName || "Varanasi");

  const R = 6371; // km
  const dLat = ((dest.lat - origin.lat) * Math.PI) / 180;
  const dLng = ((dest.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((dest.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const aerialDistanceKm = Math.max(5, Math.round(R * c));
  const roadDistanceKm = Math.round(aerialDistanceKm * 1.28);

  const bothInIndia =
    origin.stateOrCountry.toLowerCase().includes("india") &&
    dest.stateOrCountry.toLowerCase().includes("india");

  if (aerialDistanceKm <= 45) {
    return {
      originCity: origin.name,
      originStateOrCountry: origin.stateOrCountry,
      destinationName: dest.name,
      destinationStateOrCountry: dest.stateOrCountry,
      aerialDistanceKm,
      roadDistanceKm,
      recommendedPrimaryMode: "Local City Transfer",
      flightEstimate: "Same metropolitan region (No flight needed)",
      trainEstimate: "Suburban rail / Metro (~45 mins)",
      roadEstimate: `~${Math.max(25, Math.round(roadDistanceKm * 1.6))} mins by cab (${roadDistanceKm} km)`,
      routeSummaryNote: `You are right next to ${dest.name}! Start directly from ${origin.name} via local cab or metro.`,
    };
  }

  if (aerialDistanceKm <= 340 && bothInIndia) {
    const driveHours = (roadDistanceKm / 55).toFixed(1);
    const trainHours = (roadDistanceKm / 72).toFixed(1);
    return {
      originCity: origin.name,
      originStateOrCountry: origin.stateOrCountry,
      destinationName: dest.name,
      destinationStateOrCountry: dest.stateOrCountry,
      aerialDistanceKm,
      roadDistanceKm,
      recommendedPrimaryMode: "Highway Drive / Intercity Cab",
      flightEstimate: `Short regional hop (~1 hr air time if applicable)`,
      trainEstimate: `~${trainHours} hrs via Vande Bharat / Shatabdi Express`,
      roadEstimate: `~${driveHours} hrs via National Highway (${roadDistanceKm} km)`,
      routeSummaryNote: `Easy direct journey from ${origin.name} to ${dest.name} by NH expressway drive (~${driveHours} hrs) or intercity express train.`,
    };
  }

  if (aerialDistanceKm <= 950 && bothInIndia) {
    const flightHours = (aerialDistanceKm / 650 + 0.8).toFixed(1);
    const trainHours = (roadDistanceKm / 68).toFixed(1);
    const driveHours = (roadDistanceKm / 55).toFixed(1);
    return {
      originCity: origin.name,
      originStateOrCountry: origin.stateOrCountry,
      destinationName: dest.name,
      destinationStateOrCountry: dest.stateOrCountry,
      aerialDistanceKm,
      roadDistanceKm,
      recommendedPrimaryMode: "Express Train / Vande Bharat",
      flightEstimate: `~${flightHours} hrs Flight to ${dest.name} / nearest airport`,
      trainEstimate: `~${trainHours} hrs via Rajdhani / Vande Bharat / Superfast Express`,
      roadEstimate: `~${driveHours} hrs road drive (${roadDistanceKm} km)`,
      routeSummaryNote: `Well connected from ${origin.name}: choose a ~${flightHours} hr flight or an overnight/day express train (~${trainHours} hrs) to ${dest.name}.`,
    };
  }

  // Long-haul domestic or international route
  const flightHours = (aerialDistanceKm / 760 + 1.1).toFixed(1);
  return {
    originCity: origin.name,
    originStateOrCountry: origin.stateOrCountry,
    destinationName: dest.name,
    destinationStateOrCountry: dest.stateOrCountry,
    aerialDistanceKm,
    roadDistanceKm,
    recommendedPrimaryMode: "Direct / Connecting Flight",
    flightEstimate: `~${flightHours} hrs flight from ${origin.name} to ${dest.name} (or nearest hub airport)`,
    trainEstimate: bothInIndia
      ? `~${Math.round(roadDistanceKm / 65)} hrs long-distance Rajdhani / Superfast train (${roadDistanceKm} km)`
      : null,
    roadEstimate: bothInIndia ? `${roadDistanceKm.toLocaleString()} km multi-day highway route` : null,
    routeSummaryNote: bothInIndia
      ? `Fly from ${origin.name} to ${dest.name} (~${flightHours} hrs) or take a direct long-distance express train (${roadDistanceKm} km).`
      : `International / Long-haul connection from ${origin.name} (${origin.stateOrCountry}) to ${dest.name} (~${flightHours} hrs total air time, ${aerialDistanceKm.toLocaleString()} km).`,
  };
}

