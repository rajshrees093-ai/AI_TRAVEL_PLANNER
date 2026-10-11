export type TravelGroupType = "Solo" | "Couple" | "Friends" | "Family";
export type TravelPace = "Relaxed" | "Balanced" | "Packed";
export type FoodPreference = "Vegetarian" | "Non-Vegetarian" | "Vegan" | "No Preference";
export type TravelStyleTier = "Economy" | "Comfort" | "Premium";
export type TripStatus = "DRAFT" | "PLANNED" | "UPCOMING" | "COMPLETED";

export type PlaceCategory =
  | "Attraction"
  | "Restaurant"
  | "Café"
  | "Nature"
  | "Adventure"
  | "Historical"
  | "Shopping"
  | "Hidden Gem"
  | "Beach"
  | "Art & Culture";

export interface VerifiedPlace {
  placeId: string;
  name: string;
  destinationSlug: string;
  destinationName: string;
  category: PlaceCategory;
  subcategory: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  priceLevel?: "Free" | "$" | "$$" | "$$$";
  estimatedCostINR: number;
  recommendedDurationMins: number;
  photoUrl: string;
  isHiddenGem?: boolean;
  isOutdoor?: boolean;
  indoorAlternativeReason?: string;
  dietarySupported?: FoodPreference[];
  cuisine?: string;
  whyVisit?: string;
}

export interface DestinationInfo {
  placeId: string;
  slug: string;
  name: string;
  stateOrCountry: string;
  category: string;
  tagline: string;
  description: string;
  heroImage: string;
  lat: number;
  lng: number;
  defaultCurrency: string;
  suggestedMinDailyPerPersonINR: number;
  bestMonths: string;
  weatherSummary: {
    condition:
      | "Sunny"
      | "Pleasant"
      | "Pleasant & Clear"
      | "Partly Cloudy"
      | "Tropical Shower"
      | "Crisp Mountain Air"
      | string;
    tempRangeC: string;
    advisory: string;
  };
}

export interface TripWizardDraft {
  id: string;
  updatedAt: string;
  currentStep: number;
  destinationPlaceId: string;
  destinationName: string;
  destinationCountry: string;
  heroImage: string;
  startCity: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: number;
  travelType: TravelGroupType;
  sightseeingWindow: string;
  interests: string[];
  travelPace: TravelPace;
  foodPreference: FoodPreference;
  dietaryRestrictions: string;
  accessibilityNeeds: string;
  specialInstructions: string;
  budgetAmount: number;
  budgetMode: "TOTAL" | "PER_PERSON";
  currency: string;
  travelTier: TravelStyleTier;
  includedExpenses: string[];
}

export interface TripActivity {
  id: string;
  tripDayId: string;
  placeId: string;
  title: string;
  category: PlaceCategory;
  startTime: string;
  endTime: string;
  expectedDuration: number; // minutes
  estimatedCost: number;
  position: number;
  description: string;
  notes?: string;
  lat: number;
  lng: number;
  address: string;
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  photoUrl: string;
  travelTimeToNext?: number; // minutes
  distanceToNextKm?: number;
  isHiddenGem?: boolean;
  isOutdoor?: boolean;
  dietarySupported?: FoodPreference[];
  cuisine?: string;
  uncertaintyLabel?: string;
}

export interface TripDayPlan {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  title: string;
  summary: string;
  weatherNote?: string;
  weatherCondition?: string;
  activities: TripActivity[];
}

export type BudgetCategoryType =
  | "Accommodation"
  | "Food"
  | "Transport"
  | "Activities"
  | "Other"
  | "Contingency";

export interface TripBudgetItem {
  id: string;
  tripId: string;
  category: BudgetCategoryType;
  title: string;
  dayNumber?: number;
  estimatedAmount: number;
  currency: string;
  sourceLabel: "Verified Place Estimate" | "Regional Benchmark Estimate" | "User Adjusted";
}

export interface CollaboratorComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  dayNumber?: number;
  upvotes: number;
  createdAt: string;
}

export interface SharedTripLink {
  id: string;
  tripId: string;
  token: string;
  accessTokenHash: string;
  includeBudget: boolean;
  allowCollaboration: boolean;
  isRevoked: boolean;
  expirationDate?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  destinationPlaceId: string;
  destinationName: string;
  destinationCountry: string;
  heroImage: string;
  title: string;
  themeTagline: string;
  startCity: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: number;
  travelType: TravelGroupType;
  budget: number; // total trip budget in trip currency
  currency: string;
  travelTier: TravelStyleTier;
  includedExpenses: string[];
  interests: string[];
  travelPace: TravelPace;
  foodPreference: FoodPreference;
  specialInstructions?: string;
  aiSummary: string;
  status: TripStatus;
  isSaved: boolean;
  isDemoData: boolean;
  days: TripDayPlan[];
  budgetItems: TripBudgetItem[];
  validationWarnings: string[];
  sharedLinks: SharedTripLink[];
  comments: CollaboratorComment[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerationJob {
  id: string;
  userId: string;
  tripDraftId?: string;
  tripId?: string;
  status:
    | "QUEUED"
    | "DISCOVERING_PLACES"
    | "CRAFTING_ITINERARY"
    | "CALCULATING_ROUTES"
    | "VALIDATING_BUDGET"
    | "COMPLETED"
    | "FAILED";
  stepIndex: number;
  stepMessage: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  homeCity: string;
  preferredCurrency: string;
  preferences: {
    favoriteCategories: string[];
    preferredPace: TravelPace;
    foodPreference: FoodPreference;
    accessibilityRequirements: string;
    defaultBudgetINR: number;
    defaultTravelTier: TravelStyleTier;
  };
  createdAt: string;
}
