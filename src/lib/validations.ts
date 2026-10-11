import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[0-9]/, "Include at least one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const destinationStepSchema = z.object({
  destinationPlaceId: z.string().min(3, "Please select a valid destination from autocomplete or popular destinations."),
  destinationName: z.string().min(2, "Destination name is required."),
  destinationCountry: z.string().min(2, "Country or state is required."),
});

export const datesStepSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    startCity: z.string().min(2, "Starting city is required."),
    travelers: z.number().int().min(1, "Traveler count must be at least 1.").max(30, "Maximum 30 travelers supported."),
    travelType: z.enum(["Solo", "Couple", "Friends", "Family"]),
    sightseeingWindow: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
      return end.getTime() >= start.getTime();
    },
    {
      message: "End date must be on or after the start date.",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days >= 1 && days <= 14;
    },
    {
      message: "Trip duration must be between 1 and 14 days for accurate daily planning.",
      path: ["endDate"],
    }
  );

export const preferencesStepSchema = z.object({
  interests: z.array(z.string()).min(1, "Select at least one travel interest."),
  travelPace: z.enum(["Relaxed", "Balanced", "Packed"]),
  foodPreference: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"]),
  dietaryRestrictions: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
  specialInstructions: z.string().max(500, "Keep special notes under 500 characters.").optional(),
});

export const budgetStepSchema = z.object({
  budgetAmount: z.number().positive("Budget must be greater than zero."),
  budgetMode: z.enum(["TOTAL", "PER_PERSON"]),
  currency: z.string().min(3).max(3),
  travelTier: z.enum(["Economy", "Comfort", "Premium"]),
  includedExpenses: z.array(z.string()).min(1, "Select at least one expense category to cover."),
});

export const tripGenerationInputSchema = z
  .object({
    destinationPlaceId: z.string().min(3),
    destinationName: z.string().min(2),
    destinationCountry: z.string().optional(),
    heroImage: z.string().optional(),
    startCity: z.string().min(2),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    travelers: z.number().int().min(1).max(30),
    travelType: z.enum(["Solo", "Couple", "Friends", "Family"]),
    sightseeingWindow: z.string().optional(),
    interests: z.array(z.string()).min(1),
    travelPace: z.enum(["Relaxed", "Balanced", "Packed"]),
    foodPreference: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "No Preference"]),
    dietaryRestrictions: z.string().optional(),
    accessibilityNeeds: z.string().optional(),
    specialInstructions: z.string().optional(),
    budgetAmount: z.number().positive(),
    budgetMode: z.enum(["TOTAL", "PER_PERSON"]).default("TOTAL"),
    currency: z.string().default("INR"),
    travelTier: z.enum(["Economy", "Comfort", "Premium"]).default("Comfort"),
    includedExpenses: z.array(z.string()).min(1),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
      const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return end.getTime() >= start.getTime() && days >= 1 && days <= 14;
    },
    {
      message: "End date must be on or after start date (1 to 14 days max).",
      path: ["endDate"],
    }
  );

export const structuredAIItinerarySchema = z.object({
  tripTitle: z.string(),
  themeTagline: z.string(),
  tripSummary: z.string(),
  totalEstimatedCost: z.number(),
  currency: z.string(),
  dailyPlans: z.array(
    z.object({
      dayNumber: z.number(),
      date: z.string(),
      title: z.string(),
      summary: z.string(),
      weatherNote: z.string().optional(),
      activities: z.array(
        z.object({
          placeId: z.string(),
          placeName: z.string(),
          activityType: z.string(),
          startTime: z.string(),
          endTime: z.string(),
          visitDurationMinutes: z.number(),
          estimatedCost: z.number(),
          description: z.string(),
          travelNote: z.string().optional(),
          uncertaintyLabel: z.string().optional(),
        })
      ),
    })
  ),
});

export type TripGenerationInput = z.infer<typeof tripGenerationInputSchema>;
export type StructuredAIItinerary = z.infer<typeof structuredAIItinerarySchema>;
