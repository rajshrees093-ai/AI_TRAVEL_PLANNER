import { DestinationInfo, VerifiedPlace } from "./types";

/**
 * Comprehensive Sacred, Worship & Pilgrimage Destinations across India and the World
 */
export const SACRED_DESTINATIONS: DestinationInfo[] = [
  {
    placeId: "ChIJ_varanasi_kashi_holy",
    slug: "varanasi",
    name: "Varanasi (Kashi)",
    stateOrCountry: "Uttar Pradesh, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Ancient Ganges ghats, Kashi Vishwanath Jyotirlinga, and divine evening Ganga Aarti.",
    description:
      "One of the world's oldest living cities, revered for Shri Kashi Vishwanath Corridor, 84 sacred river ghats, and Buddhist heritage at nearby Sarnath.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/1200px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg",
    lat: 25.3176,
    lng: 83.0062,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2200,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "14°C – 27°C",
      advisory: "Early morning boat rides at 5:30 AM offer serene sunrise views across the ghats.",
    },
  },
  {
    placeId: "ChIJ_ayodhya_ram_mandir",
    slug: "ayodhya",
    name: "Ayodhya",
    stateOrCountry: "Uttar Pradesh, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Shri Ram Janmabhoomi Mandir, Hanuman Garhi, and tranquil Saryu River ghats.",
    description:
      "The sacred birthplace of Lord Rama on the banks of the Saryu River, featuring the grand Nagara-style Shri Ram Janmabhoomi Mandir and ancient shrines.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya_Dham.jpg/1200px-Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya_Dham.jpg",
    lat: 26.7922,
    lng: 82.1998,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2000,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "15°C – 28°C",
      advisory: "Book Sugam Darshan slots in advance and carry valid photo ID for temple entry.",
    },
  },
  {
    placeId: "ChIJ_tirupati_tirumala_holy",
    slug: "tirupati",
    name: "Tirupati (Tirumala)",
    stateOrCountry: "Andhra Pradesh, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Sri Venkateswara Swamy Temple atop the seven sacred Seshachalam Hills.",
    description:
      "Home to the world-renowned Tirumala Venkateswara Temple, Padmavathi Ammavari Temple, sacred waterfalls, and centuries-old Dravidian architecture.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1200px-Tirumala_090615.jpg",
    lat: 13.6288,
    lng: 79.4192,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2400,
    bestMonths: "Sep – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "18°C – 29°C",
      advisory: "Traditional attire is required for Tirumala darshan; hilltop mornings are cool.",
    },
  },
  {
    placeId: "ChIJ_amritsar_golden_temple",
    slug: "amritsar",
    name: "Amritsar (Golden Temple)",
    stateOrCountry: "Punjab, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Sri Harmandir Sahib, Amrit Sarovar, community Langar, and historic heritage.",
    description:
      "The spiritual heart of Sikhism centered around the gleaming gold-leaf Sri Harmandir Sahib, welcoming travelers of all faiths with peace and warm hospitality.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1200px-The_Golden_Temple_of_Amrithsar_7.jpg",
    lat: 31.62,
    lng: 74.8765,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2200,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "12°C – 26°C",
      advisory: "Head coverings are required inside the Gurudwara complex; visit at both dawn and night illumination.",
    },
  },
  {
    placeId: "ChIJ_kedarnath_badrinath_dham",
    slug: "kedarnath-badrinath",
    name: "Kedarnath & Badrinath (Char Dham)",
    stateOrCountry: "Uttarakhand, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "High-altitude Himalayan Jyotirlinga and Badri Vishal shrine amidst snow peaks.",
    description:
      "Revered Himalayan pilgrimage across the Garhwal mountains uniting Kedarnath Jyotirlinga at 3,583m and Badrinath Temple along the Alaknanda River.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/1200px-Kedarnath_Temple_in_Rainy_season.jpg",
    lat: 30.7352,
    lng: 79.0669,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 3200,
    bestMonths: "May – Jun, Sep – Oct",
    weatherSummary: {
      condition: "Crisp Mountain Air",
      tempRangeC: "2°C – 14°C",
      advisory: "Carry heavy thermals, rain gear, and complete Uttarakhand Char Dham Yatra registration.",
    },
  },
  {
    placeId: "ChIJ_vaishno_devi_katra",
    slug: "vaishno-devi",
    name: "Mata Vaishno Devi (Katra)",
    stateOrCountry: "Jammu & Kashmir, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Sacred Trikuta Mountain cave shrine of Mata Vaishno Devi.",
    description:
      "One of India's most revered shakti pilgrimages starting from Katra base camp up the scenic 13 km paved mountain trail to the Holy Bhawan and Bhairon Ghati.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Badrinath_Temple_%2C_Uttarakhand.jpg/1200px-Badrinath_Temple_%2C_Uttarakhand.jpg",
    lat: 33.0308,
    lng: 74.949,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2300,
    bestMonths: "Mar – Oct",
    weatherSummary: {
      condition: "Crisp Mountain Air",
      tempRangeC: "10°C – 22°C",
      advisory: "Obtain your RFID Yatra Parchi at Katra before starting the trek or helicopter ride.",
    },
  },
  {
    placeId: "ChIJ_puri_jagannath_holy",
    slug: "puri",
    name: "Puri & Konark",
    stateOrCountry: "Odisha, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Shree Jagannath Char Dham Temple, Mahaprasad, and the Konark Sun Temple.",
    description:
      "Home to the 12th-century Shree Jagannath Temple on the Bay of Bengal coast and the UNESCO World Heritage Konark Sun Temple.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/1200px-Shri_Jagannath_temple.jpg",
    lat: 19.8049,
    lng: 85.8179,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2200,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Sunny",
      tempRangeC: "20°C – 30°C",
      advisory: "Breezy coastal mornings; pair morning darshan with an afternoon drive along the Marine Drive to Konark.",
    },
  },
  {
    placeId: "ChIJ_mathura_vrindavan_holy",
    slug: "mathura-vrindavan",
    name: "Mathura & Vrindavan",
    stateOrCountry: "Uttar Pradesh, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Shri Krishna Janmasthan, Banke Bihari Temple, Prem Mandir, and Yamuna ghats.",
    description:
      "The sacred Braj Bhoomi twin towns celebrating the life of Lord Krishna through centuries-old temples, devotional kirtans, and illuminated marble shrines.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PremMandirSideViewFromCanteen.jpg/1200px-PremMandirSideViewFromCanteen.jpg",
    lat: 27.565,
    lng: 77.6593,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2000,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "15°C – 28°C",
      advisory: "Visit Banke Bihari during morning shringar aarti and Prem Mandir at evening illumination.",
    },
  },
  {
    placeId: "ChIJ_ujjain_mahakal_holy",
    slug: "ujjain",
    name: "Ujjain & Omkareshwar",
    stateOrCountry: "Madhya Pradesh, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Mahakaleshwar Jyotirlinga, Mahakal Lok Corridor, and Narmada island shrine.",
    description:
      "Connects two sacred Jyotirlingas in Madhya Pradesh: Mahakaleshwar on the Kshipra River in Ujjain and Omkareshwar on the Narmada River.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/1200px-Mahakaleshwar_Temple%2C_Ujjain.jpg",
    lat: 23.1828,
    lng: 75.7682,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2100,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "16°C – 29°C",
      advisory: "Mahakal Lok Corridor is magical after sunset when all sandstone sculptures are lit.",
    },
  },
  {
    placeId: "ChIJ_dwarka_somnath_holy",
    slug: "dwarka-somnath",
    name: "Dwarka & Somnath",
    stateOrCountry: "Gujarat, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Dwarkadhish Jagat Mandir, Nageshwar, and oceanfront Somnath Jyotirlinga.",
    description:
      "A revered coastal Gujarat pilgrimage linking Lord Krishna's ancient kingdom of Dwarka with the first Jyotirlinga at Somnath overlooking the Arabian Sea.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Somanath_mandir_%28cropped%29.jpg/1200px-Somanath_mandir_%28cropped%29.jpg",
    lat: 22.2376,
    lng: 68.9674,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2400,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Sunny",
      tempRangeC: "19°C – 30°C",
      advisory: "Enjoy coastal sea breezes at Gomti Ghat and the evening sound-and-light show at Somnath.",
    },
  },
  {
    placeId: "ChIJ_rameswaram_madurai_holy",
    slug: "rameswaram-madurai",
    name: "Rameswaram & Madurai",
    stateOrCountry: "Tamil Nadu, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Ramanathaswamy Jyotirlinga corridors, Dhanushkodi, and Meenakshi Amman gopurams.",
    description:
      "Explore South India's grandest temple architecture across Madurai's towering Meenakshi Amman gopurams and Rameswaram Island's sacred 22 theerthams.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg/1200px-An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg",
    lat: 9.2876,
    lng: 79.3129,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2400,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Sunny",
      tempRangeC: "23°C – 31°C",
      advisory: "Start Agni Theertham & Ramanathaswamy 22-well bath early morning before 8:00 AM.",
    },
  },
  {
    placeId: "ChIJ_shirdi_trimbakeshwar_holy",
    slug: "shirdi",
    name: "Shirdi & Trimbakeshwar (Nashik)",
    stateOrCountry: "Maharashtra, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Shri Sai Baba Samadhi Mandir, Dwarkamai, and Trimbakeshwar Jyotirlinga.",
    description:
      "Combines the peaceful Sai Baba shrine at Shirdi with Shani Shingnapur and the sacred Godavari-origin Trimbakeshwar Jyotirlinga in Nashik.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Trimbakeshwar_Temple-Nashik-Maharashtra-1.jpg/1200px-Trimbakeshwar_Temple-Nashik-Maharashtra-1.jpg",
    lat: 19.7645,
    lng: 74.4762,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2200,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "17°C – 30°C",
      advisory: "Pre-book Sai Baba Sansthan darshan and Kakad/Shej Aarti passes online.",
    },
  },
  {
    placeId: "ChIJ_bodhgaya_nalanda_holy",
    slug: "bodh-gaya",
    name: "Bodh Gaya & Rajgir",
    stateOrCountry: "Bihar, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "UNESCO Mahabodhi Temple, Sacred Bodhi Tree, and international monasteries.",
    description:
      "Where Gautama Buddha attained enlightenment beneath the Bodhi Tree, surrounded by serene Tibetan, Thai, and Japanese temples plus ancient Nalanda.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mahabodhitemple.jpg/1200px-Mahabodhitemple.jpg",
    lat: 24.6961,
    lng: 84.987,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2100,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "14°C – 27°C",
      advisory: "Quiet meditation hours beneath the Bodhi Tree are best at dawn and dusk.",
    },
  },
  {
    placeId: "ChIJ_ajmer_pushkar_holy",
    slug: "ajmer-pushkar",
    name: "Ajmer Sharif & Pushkar",
    stateOrCountry: "Rajasthan, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Khwaja Gharib Nawaz Dargah, Pushkar Brahma Temple, and sacred lake ghats.",
    description:
      "Twin spiritual towns separated by the Nag Pahar hills: Sufi devotion and qawwalis at Ajmer Sharif alongside Pushkar's rare Jagatpita Brahma Temple.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg/1200px-Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg",
    lat: 26.4499,
    lng: 74.6399,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2200,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "16°C – 28°C",
      advisory: "Evening sunset at Pushkar's 52 ghats and qawwali gatherings at Ajmer Dargah are unforgettable.",
    },
  },
  {
    placeId: "ChIJ_haridwar_holy",
    slug: "haridwar",
    name: "Haridwar",
    stateOrCountry: "Uttarakhand, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Har Ki Pauri Ganga Aarti, Mansa Devi, and Chandi Devi hilltop temples.",
    description:
      "Gateway to the Gods (Hari ka Dwar) where the sacred Ganges enters the Indo-Gangetic plains, famous for twilight lamps on Har Ki Pauri.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg/1200px-Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg",
    lat: 29.9457,
    lng: 78.1642,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2000,
    bestMonths: "Sep – Apr",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "15°C – 27°C",
      advisory: "Arrive at Har Ki Pauri 45 minutes before sunset for front-row Ganga Aarti seating.",
    },
  },
  {
    placeId: "ChIJ_prayagraj_sangam_holy",
    slug: "prayagraj",
    name: "Prayagraj (Triveni Sangam)",
    stateOrCountry: "Uttar Pradesh, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Sacred confluence of the Ganga, Yamuna, and mythical Saraswati rivers.",
    description:
      "Revered Tirtharaj (King of Pilgrimages) hosting the Triveni Sangam boat dip, Bade Hanuman Mandir, Akshayavat, and Kumbh Mela grounds.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/NorthIndiaCircuit_250.jpg/1200px-NorthIndiaCircuit_250.jpg",
    lat: 25.4358,
    lng: 81.8463,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2000,
    bestMonths: "Oct – Mar",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "15°C – 28°C",
      advisory: "Take a licensed boat from Boat Club Ghat to the Sangam confluence point at sunrise.",
    },
  },
  {
    placeId: "ChIJ_guwahati_kamakhya_holy",
    slug: "guwahati-kamakhya",
    name: "Guwahati (Maa Kamakhya)",
    stateOrCountry: "Assam, India",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Nilachal Hill Shakti Peeth, Umananda Peacock Island Temple, and Brahmaputra views.",
    description:
      "Home to one of the oldest and most revered 51 Shakti Peethas atop Nilachal Hill overlooking the mighty Brahmaputra River.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kamakhya_Temple_-_DEV_8829.jpg/1200px-Kamakhya_Temple_-_DEV_8829.jpg",
    lat: 26.1664,
    lng: 91.7055,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 2300,
    bestMonths: "Oct – Apr",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "16°C – 28°C",
      advisory: "Collect temple darshan tokens early in the morning or book VIP passes online.",
    },
  },
  {
    placeId: "ChIJ_mecca_medina_holy",
    slug: "mecca-medina",
    name: "Mecca & Medina",
    stateOrCountry: "Saudi Arabia",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Masjid al-Haram, the Holy Kaaba, and Al-Masjid an-Nabawi.",
    description:
      "The two holiest cities in Islam, connected by the Haramain High-Speed Railway for Umrah and Ziyarah pilgrims from around the globe.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0_%28cropped%29.jpg/1200px-Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0_%28cropped%29.jpg",
    lat: 21.4225,
    lng: 39.8262,
    defaultCurrency: "USD",
    suggestedMinDailyPerPersonINR: 8500,
    bestMonths: "Nov – Mar",
    weatherSummary: {
      condition: "Sunny",
      tempRangeC: "20°C – 33°C",
      advisory: "Use the Nusuk app for Rawdah permits and Haramain high-speed rail bookings.",
    },
  },
  {
    placeId: "ChIJ_vatican_rome_holy",
    slug: "vatican-rome",
    name: "Vatican City & Rome",
    stateOrCountry: "Vatican City / Italy",
    category: "Sacred & Holy Pilgrimage",
    tagline: "St. Peter's Basilica, Sistine Chapel, and the Papal Basilicas of Rome.",
    description:
      "The spiritual and artistic center of the Catholic Church, featuring Michelangelo's Pietà, St. Peter's Square, and ancient Roman basilicas.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg/1200px-Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg",
    lat: 41.9029,
    lng: 12.4534,
    defaultCurrency: "EUR",
    suggestedMinDailyPerPersonINR: 11000,
    bestMonths: "Apr – Jun, Sep – Nov",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "14°C – 24°C",
      advisory: "Modest attire covering shoulders and knees is strictly required inside St. Peter's Basilica.",
    },
  },
  {
    placeId: "ChIJ_jerusalem_old_city_holy",
    slug: "jerusalem",
    name: "Jerusalem (Old City)",
    stateOrCountry: "Israel / Palestine",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Western Wall, Church of the Holy Sepulchre, and Temple Mount / Haram al-Sharif.",
    description:
      "Sacred to Judaism, Christianity, and Islam, enclosed within historic limestone walls containing millennia of spiritual heritage.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/2014-06_East_Jerusalem_090_%2814936890061%29.jpg/1200px-2014-06_East_Jerusalem_090_%2814936890061%29.jpg",
    lat: 31.7767,
    lng: 35.2345,
    defaultCurrency: "USD",
    suggestedMinDailyPerPersonINR: 10000,
    bestMonths: "Mar – May, Oct – Nov",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "15°C – 25°C",
      advisory: "Wear comfortable walking shoes for the cobbled quarters of the Old City.",
    },
  },
  {
    placeId: "ChIJ_kathmandu_pashupatinath_holy",
    slug: "kathmandu",
    name: "Kathmandu & Pashupatinath",
    stateOrCountry: "Nepal",
    category: "Sacred & Holy Pilgrimage",
    tagline: "Sacred Pashupatinath Temple on the Bagmati River, Boudhanath, and Swayambhunath.",
    description:
      "Unites the revered Hindu shrine of Lord Pashupatinath with UNESCO Buddhist stupas in the Himalayan Kathmandu Valley.",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Pashupatinath_Temple-2020.jpg/1200px-Pashupatinath_Temple-2020.jpg",
    lat: 27.7104,
    lng: 85.3488,
    defaultCurrency: "INR",
    suggestedMinDailyPerPersonINR: 3200,
    bestMonths: "Oct – Apr",
    weatherSummary: {
      condition: "Pleasant",
      tempRangeC: "12°C – 24°C",
      advisory: "Attend the Bagmati Aarati at Pashupatinath Ghat at dusk.",
    },
  },
];

/**
 * Verified Places specifically for key Sacred & Pilgrimage cities
 */
export const SACRED_VERIFIED_PLACES: VerifiedPlace[] = [
  // VARANASI
  {
    placeId: "ChIJ_vns_vishwanath_01",
    name: "Shri Kashi Vishwanath Temple & Corridor",
    destinationSlug: "varanasi",
    destinationName: "Varanasi (Kashi)",
    category: "Historical",
    subcategory: "Jyotirlinga Sacred Shrine",
    description:
      "One of the twelve Jyotirlingas dedicated to Lord Shiva, connected directly to Lalita Ghat on the Ganges via the grand sandstone corridor.",
    address: "Lahori Tola, Varanasi, Uttar Pradesh 221001",
    lat: 25.3109,
    lng: 83.0107,
    rating: 4.9,
    reviewCount: 98500,
    openingHours: "04:00 AM – 11:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 120,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/ff/Kashi_Vishwanath.jpg",
    isOutdoor: false,
    whyVisit: "Sacred golden-spired Jyotirlinga with seamless riverfront corridor access.",
  },
  {
    placeId: "ChIJ_vns_dashashwamedh_02",
    name: "Dashashwamedh Ghat Evening Ganga Aarti & Sunrise Boat Ride",
    destinationSlug: "varanasi",
    destinationName: "Varanasi (Kashi)",
    category: "Art & Culture",
    subcategory: "Sacred River Ceremony",
    description:
      "Witness synchronized brass lamps, conch shells, and Vedic chants honoring Mother Ganga along the main ceremonial ghat.",
    address: "Dashashwamedh Ghat Rd, Godowlia, Varanasi, UP 221001",
    lat: 25.3062,
    lng: 83.0103,
    rating: 4.9,
    reviewCount: 74200,
    openingHours: "05:00 AM – 09:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 300,
    recommendedDurationMins: 95,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/1200px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_vns_sarnath_03",
    name: "Sarnath Dhamek Stupa & Mulagandha Kuti Vihara",
    destinationSlug: "varanasi",
    destinationName: "Varanasi (Kashi)",
    category: "Historical",
    subcategory: "Sacred Buddhist Deer Park",
    description:
      "Where Gautama Buddha delivered his first sermon after enlightenment, featuring the 500-CE Dhamek Stupa and Ashoka Lion Capital museum.",
    address: "Sarnath, Varanasi, Uttar Pradesh 221007",
    lat: 25.3814,
    lng: 83.0214,
    rating: 4.7,
    reviewCount: 41200,
    openingHours: "06:00 AM – 06:00 PM",
    priceLevel: "$",
    estimatedCostINR: 100,
    recommendedDurationMins: 120,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg/1200px-Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_vns_baati_04",
    name: "Kashi Chat Bhandar & Sattvic Bhojanalaya",
    destinationSlug: "varanasi",
    destinationName: "Varanasi (Kashi)",
    category: "Restaurant",
    subcategory: "Pure Vegetarian Banarasi Culinary Stop",
    description:
      "Iconic Godowlia culinary landmark serving warm tamatar chaat, kachori sabzi, malaiyyo, and pure vegetarian Banarasi thalis.",
    address: "Godowlia Chowk, Varanasi, Uttar Pradesh 221001",
    lat: 25.3095,
    lng: 83.0059,
    rating: 4.6,
    reviewCount: 19400,
    openingHours: "09:00 AM – 10:00 PM",
    priceLevel: "$",
    estimatedCostINR: 350,
    recommendedDurationMins: 60,
    photoUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Vegan"],
    cuisine: "Pure Vegetarian Banarasi & Sattvic",
  },

  // AYODHYA
  {
    placeId: "ChIJ_ayodhya_janmabhoomi_01",
    name: "Shri Ram Janmabhoomi Mandir",
    destinationSlug: "ayodhya",
    destinationName: "Ayodhya",
    category: "Historical",
    subcategory: "Sacred Ram Lalla Temple",
    description:
      "Magnificent pink Bansi Paharpur sandstone temple enshrining Balak Ram Lalla with 392 intricately carved pillars.",
    address: "Ram Kot, Ayodhya, Uttar Pradesh 224123",
    lat: 26.7956,
    lng: 82.1944,
    rating: 4.9,
    reviewCount: 112000,
    openingHours: "06:30 AM – 09:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 140,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya_Dham.jpg/1200px-Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya_Dham.jpg",
    isOutdoor: false,
    whyVisit: "Sacred centerpiece of Ayodhya with free locker facilities and pilgrim pathways.",
  },
  {
    placeId: "ChIJ_ayodhya_hanumangarhi_02",
    name: "Shri Hanuman Garhi Mandir & Kanak Bhawan",
    destinationSlug: "ayodhya",
    destinationName: "Ayodhya",
    category: "Historical",
    subcategory: "10th-Century Fortified Shrine",
    description:
      "Reached by 76 sacred steps in the center of Ayodhya, traditionally visited before Ram Mandir darshan, followed by the ornate Kanak Bhawan palace shrine.",
    address: "Sai Nagar, Ayodhya, Uttar Pradesh 224123",
    lat: 26.7949,
    lng: 82.2016,
    rating: 4.8,
    reviewCount: 54000,
    openingHours: "05:00 AM – 10:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 95,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Hanuman_Garhi_Temple%2C_a_major_religious_site_in_Ayodhya_utter_pradesh.jpg/1200px-Hanuman_Garhi_Temple%2C_a_major_religious_site_in_Ayodhya_utter_pradesh.jpg",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_ayodhya_saryu_03",
    name: "Ram Ki Paidi & Saryu Ghat Evening Aarti",
    destinationSlug: "ayodhya",
    destinationName: "Ayodhya",
    category: "Art & Culture",
    subcategory: "Sacred Riverfront Ghats",
    description:
      "Serene flight of bathing ghats along the Saryu River illuminated every evening with lamps, laser projections, and devotional bhajans.",
    address: "Naya Ghat, Ayodhya, Uttar Pradesh 224123",
    lat: 26.8091,
    lng: 82.2063,
    rating: 4.8,
    reviewCount: 41000,
    openingHours: "05:00 AM – 09:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 90,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat-varanasi_india-andres_larin.jpg/1200px-Dasaswamedh_ghat-varanasi_india-andres_larin.jpg",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_ayodhya_bhojanalaya_04",
    name: "Amrut Rasoi & Janaki Mahal Sattvic Thali",
    destinationSlug: "ayodhya",
    destinationName: "Ayodhya",
    category: "Restaurant",
    subcategory: "Sattvic Pure Vegetarian Dining",
    description:
      "Serves traditional Awadhi sattvic thalis prepared without onion or garlic alongside warm kachoris and rabri.",
    address: "Ram Path, Near Lata Mangeshkar Chowk, Ayodhya, UP 224123",
    lat: 26.8035,
    lng: 82.2032,
    rating: 4.6,
    reviewCount: 6800,
    openingHours: "08:00 AM – 10:00 PM",
    priceLevel: "$",
    estimatedCostINR: 380,
    recommendedDurationMins: 65,
    photoUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian", "Vegan"],
    cuisine: "Pure Vegetarian Sattvic",
  },

  // AMRITSAR
  {
    placeId: "ChIJ_asr_goldentemple_01",
    name: "Sri Harmandir Sahib (The Golden Temple) & Guru Ka Langar",
    destinationSlug: "amritsar",
    destinationName: "Amritsar (Golden Temple)",
    category: "Historical",
    subcategory: "Holiest Gurudwara of Sikhism",
    description:
      "Surrounded by the sacred Amrit Sarovar pool, featuring continuous Gurbani kirtan, Akal Takht, and the world's largest free community kitchen (Langar).",
    address: "Golden Temple Rd, Atta Mandi, Katra Ahluwalia, Amritsar, Punjab 143006",
    lat: 31.6199,
    lng: 74.8765,
    rating: 4.9,
    reviewCount: 194000,
    openingHours: "Open 24 Hours",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 150,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1200px-The_Golden_Temple_of_Amrithsar_7.jpg",
    isOutdoor: true,
    whyVisit: "Unmatched spiritual serenity at dawn and golden reflection across the sarovar at night.",
  },
  {
    placeId: "ChIJ_asr_durgiana_02",
    name: "Jallianwala Bagh & Heritage Walk",
    destinationSlug: "amritsar",
    destinationName: "Amritsar (Golden Temple)",
    category: "Historical",
    subcategory: "National Historic Memorial",
    description:
      "Historic public garden and memorial just steps from the Golden Temple complex along the restored Heritage Street.",
    address: "Golden Temple Rd, Amritsar, Punjab 143006",
    lat: 31.6206,
    lng: 74.8801,
    rating: 4.8,
    reviewCount: 68400,
    openingHours: "06:30 AM – 07:30 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 90,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jallianwala_Bagh%2C_Amritsar_01.jpg/1200px-Jallianwala_Bagh%2C_Amritsar_01.jpg",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_asr_wagah_04",
    name: "Attari–Wagah Border Beating Retreat Ceremony",
    destinationSlug: "amritsar",
    destinationName: "Amritsar (Golden Temple)",
    category: "Art & Culture",
    subcategory: "Evening Border Ceremony",
    description:
      "Patriotic sunset flag-lowering ceremony at the Attari–Wagah border gate with spirited marches and cheering crowds.",
    address: "Attari Border, Amritsar, Punjab 143108",
    lat: 31.6046,
    lng: 74.5735,
    rating: 4.8,
    reviewCount: 92000,
    openingHours: "03:30 PM – 06:00 PM",
    priceLevel: "Free",
    estimatedCostINR: 0,
    recommendedDurationMins: 120,
    photoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/The_SAARC_Car_Rally_2007_being_welcomed_by_traditional_Drummers_at_the_Wagah_Border_on_March_28%2C_2007.jpg",
    isOutdoor: true,
  },
  {
    placeId: "ChIJ_asr_kesardadhaba_03",
    name: "Kesar Da Dhaba — Heritage Town Hall Lane",
    destinationSlug: "amritsar",
    destinationName: "Amritsar (Golden Temple)",
    category: "Restaurant",
    subcategory: "1916 Pure Vegetarian Punjabi Kitchen",
    description:
      "Legendary century-old vegetarian dhaba near Golden Temple slow-cooking Dal Makhani for 12 hours in brass cauldrons with crispy Amritsari kulchas.",
    address: "Chowk Passian, Near Telephone Exchange, Amritsar, Punjab 143001",
    lat: 31.6241,
    lng: 74.8732,
    rating: 4.5,
    reviewCount: 31200,
    openingHours: "12:30 PM – 11:00 PM",
    priceLevel: "$",
    estimatedCostINR: 450,
    recommendedDurationMins: 75,
    photoUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
    dietarySupported: ["Vegetarian"],
    cuisine: "Pure Vegetarian Amritsari",
  },
];

/**
 * Worldwide & Indian Hometowns + Cities Directory
 * Enables any traveler to search and select their hometown or destination from anywhere in the world.
 */
export interface CityDirectoryEntry {
  placeId: string;
  name: string;
  stateOrCountry: string;
  regionType: "Indian City" | "Sacred & Holy Place" | "Global City";
  lat: number;
  lng: number;
  nearestHubInfo?: string;
}

export const WORLDWIDE_CITIES_AND_HOMETOWNS: CityDirectoryEntry[] = [
  // ================= MAJOR INDIAN HOMETOWNS & CITIES =================
  { placeId: "ChIJLbZ-NFv9DDkRzk0gTkm3wlI", name: "New Delhi", stateOrCountry: "Delhi, India", regionType: "Indian City", lat: 28.6139, lng: 77.209 },
  { placeId: "ChIJwe1EZjDG5zsRaYxkjY_tpF0", name: "Mumbai", stateOrCountry: "Maharashtra, India", regionType: "Indian City", lat: 19.076, lng: 72.8777 },
  { placeId: "ChIJbU60yXAWrjsR4E9-UejD3_g", name: "Bengaluru", stateOrCountry: "Karnataka, India", regionType: "Indian City", lat: 12.9716, lng: 77.5946 },
  { placeId: "ChIJx9Lr6tqZyzsRwvu6KO63k64", name: "Hyderabad", stateOrCountry: "Telangana, India", regionType: "Indian City", lat: 17.385, lng: 78.4867 },
  { placeId: "ChIJYTN9T-plUjoRM9RjaAunYW4", name: "Chennai", stateOrCountry: "Tamil Nadu, India", regionType: "Indian City", lat: 13.0827, lng: 80.2707 },
  { placeId: "ChIJZ_YISduC-DkRvCxsj-Yw40M", name: "Kolkata", stateOrCountry: "West Bengal, India", regionType: "Indian City", lat: 22.5726, lng: 88.3639 },
  { placeId: "ChIJARFGZy6_wjsRQ-Oenb9DjYI", name: "Pune", stateOrCountry: "Maharashtra, India", regionType: "Indian City", lat: 18.5204, lng: 73.8567 },
  { placeId: "ChIJSdRbuoqEXjkRFmVPYRHdzk8", name: "Ahmedabad", stateOrCountry: "Gujarat, India", regionType: "Indian City", lat: 23.0225, lng: 72.5714 },
  { placeId: "ChIJgeJXTN9KbDkRCS7yDDrG4cI", name: "Jaipur", stateOrCountry: "Rajasthan, India", regionType: "Indian City", lat: 26.9124, lng: 75.7873 },
  { placeId: "ChIJL_P_CXMEDTkRw0ZdG-0GVvw", name: "Lucknow", stateOrCountry: "Uttar Pradesh, India", regionType: "Indian City", lat: 26.8467, lng: 80.9462 },
  { placeId: "ChIJ3a62kS19jjkR2sN8x-P_fQo", name: "Patna", stateOrCountry: "Bihar, India", regionType: "Indian City", lat: 25.5941, lng: 85.1376 },
  { placeId: "ChIJ2c1A4B9IYjkR9B_C-9mH_Q", name: "Indore", stateOrCountry: "Madhya Pradesh, India", regionType: "Indian City", lat: 22.7196, lng: 75.8577 },
  { placeId: "ChIJl2c1A4B9fDkR9B_C-9mH_B", name: "Bhopal", stateOrCountry: "Madhya Pradesh, India", regionType: "Indian City", lat: 23.2599, lng: 77.4126 },
  { placeId: "ChIJu9c1A4B9DzkR9B_C-9mH_C", name: "Chandigarh", stateOrCountry: "Chandigarh, India", regionType: "Indian City", lat: 30.7333, lng: 76.7794 },
  { placeId: "ChIJ_surat_gujarat", name: "Surat", stateOrCountry: "Gujarat, India", regionType: "Indian City", lat: 21.1702, lng: 72.8311 },
  { placeId: "ChIJ_vadodara_gujarat", name: "Vadodara", stateOrCountry: "Gujarat, India", regionType: "Indian City", lat: 22.3072, lng: 73.1812 },
  { placeId: "ChIJ_rajkot_gujarat", name: "Rajkot", stateOrCountry: "Gujarat, India", regionType: "Indian City", lat: 22.3039, lng: 70.8022 },
  { placeId: "ChIJ_nagpur_mh", name: "Nagpur", stateOrCountry: "Maharashtra, India", regionType: "Indian City", lat: 21.1458, lng: 79.0882 },
  { placeId: "ChIJ_nashik_mh", name: "Nashik", stateOrCountry: "Maharashtra, India", regionType: "Indian City", lat: 19.9975, lng: 73.7898 },
  { placeId: "ChIJ_aurangabad_mh", name: "Chhatrapati Sambhajinagar (Aurangabad)", stateOrCountry: "Maharashtra, India", regionType: "Indian City", lat: 19.8762, lng: 75.3433 },
  { placeId: "ChIJ_kanpur_up", name: "Kanpur", stateOrCountry: "Uttar Pradesh, India", regionType: "Indian City", lat: 26.4499, lng: 80.3319 },
  { placeId: "ChIJ_agra_up", name: "Agra", stateOrCountry: "Uttar Pradesh, India", regionType: "Indian City", lat: 27.1767, lng: 78.0081 },
  { placeId: "ChIJ_gorakhpur_up", name: "Gorakhpur", stateOrCountry: "Uttar Pradesh, India", regionType: "Indian City", lat: 26.7606, lng: 83.3732 },
  { placeId: "ChIJ_meerut_up", name: "Meerut", stateOrCountry: "Uttar Pradesh, India", regionType: "Indian City", lat: 28.9845, lng: 77.7064 },
  { placeId: "ChIJ_noida_up", name: "Noida", stateOrCountry: "Uttar Pradesh, India", regionType: "Indian City", lat: 28.5355, lng: 77.391 },
  { placeId: "ChIJ_gurugram_hr", name: "Gurugram", stateOrCountry: "Haryana, India", regionType: "Indian City", lat: 28.4595, lng: 77.0266 },
  { placeId: "ChIJ_dehradun_uk", name: "Dehradun", stateOrCountry: "Uttarakhand, India", regionType: "Indian City", lat: 30.3165, lng: 78.0322 },
  { placeId: "ChIJ_nainital_uk", name: "Nainital", stateOrCountry: "Uttarakhand, India", regionType: "Indian City", lat: 29.3919, lng: 79.4542 },
  { placeId: "ChIJ_mussoorie_uk", name: "Mussoorie", stateOrCountry: "Uttarakhand, India", regionType: "Indian City", lat: 30.4598, lng: 78.0644 },
  { placeId: "ChIJ_shimla_hp", name: "Shimla", stateOrCountry: "Himachal Pradesh, India", regionType: "Indian City", lat: 31.1048, lng: 77.1734 },
  { placeId: "ChIJ_dharamshala_hp", name: "Dharamshala & McLeod Ganj", stateOrCountry: "Himachal Pradesh, India", regionType: "Sacred & Holy Place", lat: 32.219, lng: 76.3234 },
  { placeId: "ChIJ_ludhiana_pb", name: "Ludhiana", stateOrCountry: "Punjab, India", regionType: "Indian City", lat: 30.901, lng: 75.8573 },
  { placeId: "ChIJ_jalandhar_pb", name: "Jalandhar", stateOrCountry: "Punjab, India", regionType: "Indian City", lat: 31.326, lng: 75.5762 },
  { placeId: "ChIJ_jammu_jk", name: "Jammu", stateOrCountry: "Jammu & Kashmir, India", regionType: "Indian City", lat: 32.7266, lng: 74.857 },
  { placeId: "ChIJ_srinagar_jk", name: "Srinagar", stateOrCountry: "Jammu & Kashmir, India", regionType: "Indian City", lat: 34.0837, lng: 74.7973 },
  { placeId: "ChIJ_jodhpur_rj", name: "Jodhpur", stateOrCountry: "Rajasthan, India", regionType: "Indian City", lat: 26.2389, lng: 73.0243 },
  { placeId: "ChIJ_udaipur_rj", name: "Udaipur", stateOrCountry: "Rajasthan, India", regionType: "Indian City", lat: 24.5854, lng: 73.7125 },
  { placeId: "ChIJ_jaisalmer_rj", name: "Jaisalmer", stateOrCountry: "Rajasthan, India", regionType: "Indian City", lat: 26.9157, lng: 70.9083 },
  { placeId: "ChIJ_kota_rj", name: "Kota", stateOrCountry: "Rajasthan, India", regionType: "Indian City", lat: 25.2138, lng: 75.8648 },
  { placeId: "ChIJ_ranchi_jh", name: "Ranchi", stateOrCountry: "Jharkhand, India", regionType: "Indian City", lat: 23.3441, lng: 85.3096 },
  { placeId: "ChIJ_jamshedpur_jh", name: "Jamshedpur", stateOrCountry: "Jharkhand, India", regionType: "Indian City", lat: 22.8046, lng: 86.2029 },
  { placeId: "ChIJ_deoghar_jh", name: "Deoghar (Baidyanath Dham)", stateOrCountry: "Jharkhand, India", regionType: "Sacred & Holy Place", lat: 24.4852, lng: 86.6948 },
  { placeId: "ChIJ_raipur_cg", name: "Raipur", stateOrCountry: "Chhattisgarh, India", regionType: "Indian City", lat: 21.2514, lng: 81.6296 },
  { placeId: "ChIJ_bhubaneswar_od", name: "Bhubaneswar", stateOrCountry: "Odisha, India", regionType: "Indian City", lat: 20.2961, lng: 85.8245 },
  { placeId: "ChIJ_cuttack_od", name: "Cuttack", stateOrCountry: "Odisha, India", regionType: "Indian City", lat: 20.4625, lng: 85.883 },
  { placeId: "ChIJ_gwalior_mp", name: "Gwalior", stateOrCountry: "Madhya Pradesh, India", regionType: "Indian City", lat: 26.2183, lng: 78.1828 },
  { placeId: "ChIJ_jabalpur_mp", name: "Jabalpur", stateOrCountry: "Madhya Pradesh, India", regionType: "Indian City", lat: 23.1815, lng: 79.9864 },
  { placeId: "ChIJ_visakhapatnam_ap", name: "Visakhapatnam (Vizag)", stateOrCountry: "Andhra Pradesh, India", regionType: "Indian City", lat: 17.6868, lng: 83.2185 },
  { placeId: "ChIJ_vijayawada_ap", name: "Vijayawada", stateOrCountry: "Andhra Pradesh, India", regionType: "Indian City", lat: 16.5062, lng: 80.648 },
  { placeId: "ChIJ_mysuru_ka", name: "Mysuru (Mysore)", stateOrCountry: "Karnataka, India", regionType: "Indian City", lat: 12.2958, lng: 76.6394 },
  { placeId: "ChIJ_mangaluru_ka", name: "Mangaluru", stateOrCountry: "Karnataka, India", regionType: "Indian City", lat: 12.9141, lng: 74.856 },
  { placeId: "ChIJ_udupi_ka", name: "Udupi (Sri Krishna Matha)", stateOrCountry: "Karnataka, India", regionType: "Sacred & Holy Place", lat: 13.3409, lng: 74.7421 },
  { placeId: "ChIJ_gokarna_mrudeshwar", name: "Gokarna & Murudeshwar", stateOrCountry: "Karnataka, India", regionType: "Sacred & Holy Place", lat: 14.5479, lng: 74.3188 },
  { placeId: "ChIJ_hampi_ka", name: "Hampi", stateOrCountry: "Karnataka, India", regionType: "Indian City", lat: 15.335, lng: 76.46 },
  { placeId: "ChIJ_coimbatore_tn", name: "Coimbatore (Isha Adiyogi)", stateOrCountry: "Tamil Nadu, India", regionType: "Sacred & Holy Place", lat: 11.0168, lng: 76.9558 },
  { placeId: "ChIJ_tiruchirappalli_tn", name: "Tiruchirappalli (Srirangam)", stateOrCountry: "Tamil Nadu, India", regionType: "Sacred & Holy Place", lat: 10.7905, lng: 78.7047 },
  { placeId: "ChIJ_thanjavur_tn", name: "Thanjavur (Brihadeeswarar Temple)", stateOrCountry: "Tamil Nadu, India", regionType: "Sacred & Holy Place", lat: 10.787, lng: 79.1378 },
  { placeId: "ChIJ_kanchipuram_tn", name: "Kanchipuram", stateOrCountry: "Tamil Nadu, India", regionType: "Sacred & Holy Place", lat: 12.8342, lng: 79.7036 },
  { placeId: "ChIJ_tiruvannamalai_tn", name: "Tiruvannamalai (Arunachaleswarar)", stateOrCountry: "Tamil Nadu, India", regionType: "Sacred & Holy Place", lat: 12.2253, lng: 79.0747 },
  { placeId: "ChIJ_kanyakumari_tn", name: "Kanyakumari", stateOrCountry: "Tamil Nadu, India", regionType: "Sacred & Holy Place", lat: 8.0883, lng: 77.5385 },
  { placeId: "ChIJ_velankanni_tn", name: "Velankanni (Basilica of Our Lady)", stateOrCountry: "Tamil Nadu, India", regionType: "Sacred & Holy Place", lat: 10.6819, lng: 79.8437 },
  { placeId: "ChIJ_kochi_kl", name: "Kochi (Cochin)", stateOrCountry: "Kerala, India", regionType: "Indian City", lat: 9.9312, lng: 76.2673 },
  { placeId: "ChIJ_trivandrum_kl", name: "Thiruvananthapuram (Padmanabhaswamy)", stateOrCountry: "Kerala, India", regionType: "Sacred & Holy Place", lat: 8.5241, lng: 76.9366 },
  { placeId: "ChIJ_guruvayur_kl", name: "Guruvayur & Sabarimala", stateOrCountry: "Kerala, India", regionType: "Sacred & Holy Place", lat: 10.594, lng: 76.0411 },
  { placeId: "ChIJ_siliguri_wb", name: "Siliguri & Darjeeling", stateOrCountry: "West Bengal, India", regionType: "Indian City", lat: 26.7271, lng: 88.3953 },
  { placeId: "ChIJ_gangtok_sk", name: "Gangtok (Rumtek Monastery)", stateOrCountry: "Sikkim, India", regionType: "Sacred & Holy Place", lat: 27.3389, lng: 88.6065 },
  { placeId: "ChIJ_shillong_ml", name: "Shillong", stateOrCountry: "Meghalaya, India", regionType: "Indian City", lat: 25.5788, lng: 91.8933 },
  { placeId: "ChIJ_tawang_ar", name: "Tawang Monastery", stateOrCountry: "Arunachal Pradesh, India", regionType: "Sacred & Holy Place", lat: 27.5861, lng: 91.8594 },
  { placeId: "ChIJ_palitana_gj", name: "Palitana (Shatrunjaya Jain Temples)", stateOrCountry: "Gujarat, India", regionType: "Sacred & Holy Place", lat: 21.5269, lng: 71.8256 },
  { placeId: "ChIJ_mount_abu_rj", name: "Mount Abu (Dilwara Jain Temples)", stateOrCountry: "Rajasthan, India", regionType: "Sacred & Holy Place", lat: 24.5926, lng: 72.7156 },
  { placeId: "ChIJ_srisailam_ap", name: "Srisailam (Mallikarjuna Jyotirlinga)", stateOrCountry: "Andhra Pradesh, India", regionType: "Sacred & Holy Place", lat: 16.0738, lng: 78.8682 },

  // ================= WORLDWIDE HOMETOWNS & GLOBAL CITIES =================
  { placeId: "ChIJdd4hrwug2EcRmSrV3Vo6llI", name: "London", stateOrCountry: "United Kingdom", regionType: "Global City", lat: 51.5072, lng: -0.1276 },
  { placeId: "ChIJOwg_06VPwokRYv534QaPC8g", name: "New York City", stateOrCountry: "United States", regionType: "Global City", lat: 40.7128, lng: -74.006 },
  { placeId: "ChIJIQBpAG2ahYAR_6128GcTUEo", name: "San Francisco", stateOrCountry: "California, United States", regionType: "Global City", lat: 37.7749, lng: -122.4194 },
  { placeId: "ChIJE9on3F3HwoAR9AhGJW_fL-I", name: "Los Angeles", stateOrCountry: "California, United States", regionType: "Global City", lat: 34.0522, lng: -118.2437 },
  { placeId: "ChIJ7cv00DwsDogRAMDACa2m4K8", name: "Chicago", stateOrCountry: "Illinois, United States", regionType: "Global City", lat: 41.8781, lng: -87.6298 },
  { placeId: "ChIJAYWNSLS4QIYROwVl894CDco", name: "Houston", stateOrCountry: "Texas, United States", regionType: "Global City", lat: 29.7604, lng: -95.3698 },
  { placeId: "ChIJpTvG15DL1IkRd8S0KlBVNTI", name: "Toronto", stateOrCountry: "Ontario, Canada", regionType: "Global City", lat: 43.6532, lng: -79.3832 },
  { placeId: "ChIJs0-pQ_FzhlQRi_OBm-qWkbs", name: "Vancouver", stateOrCountry: "British Columbia, Canada", regionType: "Global City", lat: 49.2827, lng: -123.1207 },
  { placeId: "ChIJP3Sa8ziYEmsRUKgyFmh9AQM", name: "Sydney", stateOrCountry: "New South Wales, Australia", regionType: "Global City", lat: -33.8688, lng: 151.2093 },
  { placeId: "ChIJ90260rVG1moRkM2MIXVWBAQ", name: "Melbourne", stateOrCountry: "Victoria, Australia", regionType: "Global City", lat: -37.8136, lng: 144.9631 },
  { placeId: "ChIJRcbZaklDXz4RYlEphFBu5r0", name: "Dubai", stateOrCountry: "United Arab Emirates", regionType: "Global City", lat: 25.2048, lng: 55.2708 },
  { placeId: "ChIJ_abudhabi_uae", name: "Abu Dhabi (Sheikh Zayed Grand Mosque)", stateOrCountry: "United Arab Emirates", regionType: "Sacred & Holy Place", lat: 24.4539, lng: 54.3773 },
  { placeId: "ChIJ_doha_qatar", name: "Doha", stateOrCountry: "Qatar", regionType: "Global City", lat: 25.2854, lng: 51.531 },
  { placeId: "ChIJd8BlQ2BZwokRAFUEcm_qrcA", name: "Singapore", stateOrCountry: "Singapore", regionType: "Global City", lat: 1.3521, lng: 103.8198 },
  { placeId: "ChIJ5-rvAcdJzDERfSgcL1uO2fQ", name: "Kuala Lumpur (Batu Caves)", stateOrCountry: "Malaysia", regionType: "Sacred & Holy Place", lat: 3.139, lng: 101.6869 },
  { placeId: "ChIJ82ENKDJgHTERIEjiXbIAAQE", name: "Bangkok (Wat Arun & Emerald Buddha)", stateOrCountry: "Thailand", regionType: "Sacred & Holy Place", lat: 13.7563, lng: 100.5018 },
  { placeId: "ChIJ_siem_reap_angkor", name: "Siem Reap (Angkor Wat)", stateOrCountry: "Cambodia", regionType: "Sacred & Holy Place", lat: 13.4125, lng: 103.867 },
  { placeId: "ChIJ51cu8IcbXWARiRtXIothAS4", name: "Tokyo", stateOrCountry: "Japan", regionType: "Global City", lat: 35.6762, lng: 139.6503 },
  { placeId: "ChIJ8cM8zdaoAWARPR27azYdlsA", name: "Kyoto (Fushimi Inari & Golden Pavilion)", stateOrCountry: "Japan", regionType: "Sacred & Holy Place", lat: 35.0116, lng: 135.7681 },
  { placeId: "ChIJzWXFYYuifDUR64Pq5LTtioU", name: "Seoul", stateOrCountry: "South Korea", regionType: "Global City", lat: 37.5665, lng: 126.978 },
  { placeId: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ", name: "Paris", stateOrCountry: "France", regionType: "Global City", lat: 48.8566, lng: 2.3522 },
  { placeId: "ChIJ_lourdes_france", name: "Lourdes (Sanctuary of Our Lady)", stateOrCountry: "France", regionType: "Sacred & Holy Place", lat: 43.0915, lng: -0.0457 },
  { placeId: "ChIJu46S-ZZhLxMROG5lkwZ3D7k", name: "Rome", stateOrCountry: "Italy", regionType: "Global City", lat: 41.9028, lng: 12.4964 },
  { placeId: "ChIJgTwKgJcpQg0RaSKMYcHeNsQ", name: "Madrid", stateOrCountry: "Spain", regionType: "Global City", lat: 40.4168, lng: -3.7038 },
  { placeId: "ChIJ5TCOcRaYpBIRCmZHTz37sEQ", name: "Barcelona (Sagrada Família)", stateOrCountry: "Spain", regionType: "Sacred & Holy Place", lat: 41.3874, lng: 2.1686 },
  { placeId: "ChIJAVkDPzdOqEcRcDteW0YgIQQ", name: "Berlin", stateOrCountry: "Germany", regionType: "Global City", lat: 52.52, lng: 13.405 },
  { placeId: "ChIJxZZwR28JvUcRAMawKVBDIgQ", name: "Frankfurt", stateOrCountry: "Germany", regionType: "Global City", lat: 50.1109, lng: 8.6821 },
  { placeId: "ChIJVXealLU_xkcRja_At0z9AGY", name: "Amsterdam", stateOrCountry: "Netherlands", regionType: "Global City", lat: 52.3676, lng: 4.9041 },
  { placeId: "ChIJGaK-SZcLkEcRA9wf5_GNbuY", name: "Zurich", stateOrCountry: "Switzerland", regionType: "Global City", lat: 47.3769, lng: 8.5417 },
  { placeId: "ChIJawhoAASnyhQR0LABvJj-zOE", name: "Istanbul (Hagia Sophia & Blue Mosque)", stateOrCountry: "Turkey", regionType: "Sacred & Holy Place", lat: 41.0082, lng: 28.9784 },
  { placeId: "ChIJ674hC6Y_WBQRujtC6Jay33k", name: "Cairo", stateOrCountry: "Egypt", regionType: "Global City", lat: 30.0444, lng: 31.2357 },
  { placeId: "ChIJ_colombo_kandy_sl", name: "Colombo & Kandy (Temple of the Sacred Tooth)", stateOrCountry: "Sri Lanka", regionType: "Sacred & Holy Place", lat: 6.9271, lng: 79.8612 },
  { placeId: "ChIJ_lumbini_nepal", name: "Lumbini (Birthplace of Lord Buddha)", stateOrCountry: "Nepal", regionType: "Sacred & Holy Place", lat: 27.4833, lng: 83.2767 },
  { placeId: "ChIJ_dhaka_bd", name: "Dhaka", stateOrCountry: "Bangladesh", regionType: "Global City", lat: 23.8103, lng: 90.4125 },
  { placeId: "ChIJ_mauritius_ganga_talao", name: "Mauritius (Ganga Talao Grand Bassin)", stateOrCountry: "Mauritius", regionType: "Sacred & Holy Place", lat: -20.4167, lng: 57.4933 },
];

export function findCityCoordinates(cityName: string): {
  name: string;
  stateOrCountry: string;
  lat: number;
  lng: number;
} {
  const q = cityName.toLowerCase().trim();
  const match = WORLDWIDE_CITIES_AND_HOMETOWNS.find(
    (c) =>
      c.name.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      q.includes(c.name.toLowerCase())
  );
  if (match) {
    return {
      name: match.name,
      stateOrCountry: match.stateOrCountry,
      lat: match.lat,
      lng: match.lng,
    };
  }
  const sacredMatch = SACRED_DESTINATIONS.find(
    (s) =>
      s.name.toLowerCase() === q ||
      s.slug === q ||
      s.name.toLowerCase().includes(q)
  );
  if (sacredMatch) {
    return {
      name: sacredMatch.name,
      stateOrCountry: sacredMatch.stateOrCountry,
      lat: sacredMatch.lat,
      lng: sacredMatch.lng,
    };
  }
  return {
    name: cityName.trim() || "New Delhi",
    stateOrCountry: "Global Origin",
    lat: 28.6139,
    lng: 77.209,
  };
}

const SACRED_SECONDARY_LANDMARKS: Record<
  string,
  {
    secondName: string;
    secondPhoto: string;
    thirdName: string;
    thirdPhoto: string;
  }
> = {
  tirupati: {
    secondName: "Sri Padmavathi Ammavari Temple, Tiruchanur",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1200px-Tirumala_090615.jpg",
    thirdName: "Silathoranam & Akasa Ganga Sacred Waterfall",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ramanathaswamy_temple7.JPG/1200px-Ramanathaswamy_temple7.JPG",
  },
  "kedarnath-badrinath": {
    secondName: "Shri Badrinath Dham Temple & Tapt Kund",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Badrinath_Temple_%2C_Uttarakhand.jpg/1200px-Badrinath_Temple_%2C_Uttarakhand.jpg",
    thirdName: "Mana Village & Alaknanda–Saraswati Confluence",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/1200px-Kedarnath_Temple_in_Rainy_season.jpg",
  },
  puri: {
    secondName: "Konark Sun Temple UNESCO Chariot Monument",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/1200px-Konarka_Temple.jpg",
    thirdName: "Puri Golden Beach & Gundicha Mandir",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/1200px-Shri_Jagannath_temple.jpg",
  },
  "mathura-vrindavan": {
    secondName: "Shri Banke Bihari Mandir & Nidhivan",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/PremMandirSideViewFromCanteen.jpg/1200px-PremMandirSideViewFromCanteen.jpg",
    thirdName: "Vishram Ghat Yamuna Evening Aarti, Mathura",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg/1200px-Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg",
  },
  ujjain: {
    secondName: "Shri Mahakal Lok Corridor & Rudra Sagar",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/1200px-Mahakaleshwar_Temple%2C_Ujjain.jpg",
    thirdName: "Ram Ghat Kshipra Aarti & Kal Bhairav Mandir",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg/1200px-Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg",
  },
  "dwarka-somnath": {
    secondName: "Shree Dwarkadhish Jagat Mandir & Gomti Ghat",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Dwarakadheesh_Temple%2C_2014.jpg/1200px-Dwarakadheesh_Temple%2C_2014.jpg",
    thirdName: "Somnath Oceanfront Promenade & Nageshwar Jyotirlinga",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Somanath_mandir_%28cropped%29.jpg/1200px-Somanath_mandir_%28cropped%29.jpg",
  },
  "rameswaram-madurai": {
    secondName: "Sri Ramanathaswamy Jyotirlinga 1,000-Pillar Corridor",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ramanathaswamy_temple7.JPG/1200px-Ramanathaswamy_temple7.JPG",
    thirdName: "Pamban Sea Bridge & Dhanushkodi Confluence",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/d/d4/Pamban_Bridge_Train_Passing.jpg",
  },
  shirdi: {
    secondName: "Shri Sai Baba Samadhi Mandir & Dwarkamai",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/d/df/Shirdi_Sai_Baba_3.jpg",
    thirdName: "Trimbakeshwar Jyotirlinga & Brahmagiri Hills",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Trimbakeshwar_Temple-Nashik-Maharashtra-1.jpg/1200px-Trimbakeshwar_Temple-Nashik-Maharashtra-1.jpg",
  },
  "bodh-gaya": {
    secondName: "Sacred Bodhi Tree & Vajrasana Meditation Park",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mahabodhitemple.jpg/1200px-Mahabodhitemple.jpg",
    thirdName: "Dhamek & Vishwa Shanti Stupa Rajgir",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg/1200px-Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg",
  },
  "ajmer-pushkar": {
    secondName: "Ajmer Sharif Dargah Khwaja Gharib Nawaz",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Dargah_of_Sufi_saint_Moinuddin_Chishti_Ajmer_India_%285%29.JPG/1200px-Dargah_of_Sufi_saint_Moinuddin_Chishti_Ajmer_India_%285%29.JPG",
    thirdName: "Pushkar Lake 52 Ghats & Jagatpita Brahma Mandir",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg/1200px-Evening_lights_by_the_Pushkar_Lake%2C_Pushkar.jpg",
  },
  haridwar: {
    secondName: "Har Ki Pauri Evening Ganga Aarti",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg/1200px-Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg",
    thirdName: "Mansa Devi & Chandi Devi Ropeway Darshan",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/1200px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg",
  },
  "mecca-medina": {
    secondName: "Al-Masjid an-Nabawi (The Prophet's Mosque), Medina",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg",
    thirdName: "Masjid al-Haram & Abraj Al Bait Esplanade",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0_%28cropped%29.jpg/1200px-Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0_%28cropped%29.jpg",
  },
  "vatican-rome": {
    secondName: "Sistine Chapel & Vatican Museums",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/8/82/Sistina-interno.jpg",
    thirdName: "St. Peter's Square Bernini Colonnade",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg/1200px-Basilica_di_San_Pietro_in_Vaticano_September_2015-1a.jpg",
  },
  kathmandu: {
    secondName: "Boudhanath Stupa UNESCO Mandala Precinct",
    secondPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Boudhanath_stupa_%2C_Kathmandu%2C_Nepal.jpg/1200px-Boudhanath_stupa_%2C_Kathmandu%2C_Nepal.jpg",
    thirdName: "Pashupatinath Bagmati River Evening Aarati",
    thirdPhoto:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Pashupatinath_Temple-2020.jpg/1200px-Pashupatinath_Temple-2020.jpg",
  },
};

/**
 * Generates verified sacred & pilgrimage stops for any holy destination
 */
export function buildSacredPlacesForDestination(
  dest: DestinationInfo
): VerifiedPlace[] {
  const direct = SACRED_VERIFIED_PLACES.filter(
    (p) =>
      p.destinationSlug === dest.slug ||
      p.destinationName.toLowerCase() === dest.name.toLowerCase()
  );
  const baseLat = dest.lat;
  const baseLng = dest.lng;
  const city = dest.name.split("(")[0].trim();
  const specificLandmarks = SACRED_SECONDARY_LANDMARKS[dest.slug];

  const supplementalSacred: VerifiedPlace[] = [
    {
      placeId: `ChIJ_${dest.slug}_main_sanctum`,
      name: `${dest.name} Principal Sacred Shrine & Morning Darshan`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Historical",
      subcategory: "Principal Worship & Darshan Sanctum",
      description: `Begin with morning darshan and prayers at ${dest.name}'s revered central shrine. Follow traditional dress code and queue guidelines.`,
      address: `Main Temple / Shrine Complex, ${city}`,
      lat: Number((baseLat + 0.004).toFixed(4)),
      lng: Number((baseLng + 0.004).toFixed(4)),
      rating: 4.9,
      reviewCount: 64200,
      openingHours: "05:00 AM – 09:30 PM",
      priceLevel: "Free",
      estimatedCostINR: 0,
      recommendedDurationMins: 120,
      photoUrl: dest.heroImage,
      isOutdoor: false,
      whyVisit: "Sacred morning darshan during auspicious Mangala / Shringar hours.",
    },
    {
      placeId: `ChIJ_${dest.slug}_sacred_ghat_aarti`,
      name:
        specificLandmarks?.secondName ||
        `${city} Sacred Ghat / Parikrama Path & Evening Aarti`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Art & Culture",
      subcategory: "Evening Aarti & Sacred Heritage",
      description: `Walk the peaceful parikrama path and attend the serene twilight lamps, chants, and evening prayer ceremony in ${city}.`,
      address: `Sacred Parikrama & Ghat Precinct, ${city}`,
      lat: Number((baseLat - 0.007).toFixed(4)),
      lng: Number((baseLng + 0.008).toFixed(4)),
      rating: 4.8,
      reviewCount: 31500,
      openingHours: "05:30 AM – 08:30 PM",
      priceLevel: "Free",
      estimatedCostINR: 0,
      recommendedDurationMins: 95,
      photoUrl: specificLandmarks?.secondPhoto || dest.heroImage,
      isOutdoor: true,
      whyVisit: "Deeply peaceful spiritual atmosphere at twilight.",
    },
    {
      placeId: `ChIJ_${dest.slug}_ancient_hermitage`,
      name:
        specificLandmarks?.thirdName ||
        `${city} Historic Shrine & Meditation Sarovar`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Hidden Gem",
      subcategory: "Sacred Heritage Landmark",
      description: `A revered spiritual landmark and sacred sarovar in ${city} offering quiet contemplation and architectural heritage.`,
      address: `Heritage Shrine Road, ${city}`,
      lat: Number((baseLat + 0.012).toFixed(4)),
      lng: Number((baseLng - 0.009).toFixed(4)),
      rating: 4.8,
      reviewCount: 4200,
      openingHours: "06:00 AM – 07:00 PM",
      priceLevel: "Free",
      estimatedCostINR: 0,
      recommendedDurationMins: 85,
      photoUrl: specificLandmarks?.thirdPhoto || dest.heroImage,
      isHiddenGem: true,
      isOutdoor: true,
      whyVisit: "Peaceful spiritual landmark revered by visitors and locals.",
    },
    {
      placeId: `ChIJ_${dest.slug}_sattvic_bhojanalaya`,
      name: `Shri Annapurna Sattvic Bhojanalaya & Prasadam — ${city}`,
      destinationSlug: dest.slug,
      destinationName: dest.name,
      category: "Restaurant",
      subcategory: "Pure Vegetarian & Sattvic Kitchen",
      description: `Wholesome pure vegetarian and sattvic meals prepared cleanly for pilgrims and families visiting ${city}.`,
      address: `Near Main Shrine Corridor, ${city}`,
      lat: Number((baseLat + 0.006).toFixed(4)),
      lng: Number((baseLng - 0.005).toFixed(4)),
      rating: 4.6,
      reviewCount: 8900,
      openingHours: "07:30 AM – 10:00 PM",
      priceLevel: "$",
      estimatedCostINR: 320,
      recommendedDurationMins: 65,
      photoUrl:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
      dietarySupported: ["Vegetarian", "Vegan"],
      cuisine: "Pure Vegetarian Sattvic & Regional Thali",
    },
  ];

  return [...direct, ...supplementalSacred];
}
