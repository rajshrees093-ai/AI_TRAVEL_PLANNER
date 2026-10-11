import { NextRequest, NextResponse } from "next/server";
import { getTripByIdForUser, upsertTripInStore } from "@/lib/server-db";
import {
  proposeConversationalAdjustment,
  regenerateSingleDayInTrip,
} from "@/lib/ai-assistant";
import {
  applyAIBudgetRescue,
  generateCompleteTripItinerary,
} from "@/lib/ai-engine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const userId = body.userId || "user-roamwise-demo";
    const { trip, unauthorized } = await getTripByIdForUser(params.id, userId);

    if (unauthorized) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Unauthorized access." },
        { status: 403 }
      );
    }
    if (!trip) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Trip not found." },
        { status: 404 }
      );
    }

    // Mode 1: Single Day Regeneration
    if (typeof body.dayNumber === "number") {
      const updated = regenerateSingleDayInTrip(trip, body.dayNumber);
      await upsertTripInStore(updated);
      return NextResponse.json({
        trip: updated,
        message: `Day ${body.dayNumber} regenerated with fresh verified places.`,
      });
    }

    // Mode 2: AI Budget Rescue
    if (body.action === "BUDGET_RESCUE") {
      const rescue = applyAIBudgetRescue(trip);
      await upsertTripInStore(rescue.updatedTrip);
      return NextResponse.json({
        trip: rescue.updatedTrip,
        rescuedChanges: rescue.rescuedChanges,
        savedAmount: rescue.savedAmount,
      });
    }

    // Mode 3: Conversational AI Adjustment Proposal (Preview or Apply)
    if (typeof body.instruction === "string" && body.instruction.trim()) {
      const proposal = proposeConversationalAdjustment(
        trip,
        body.instruction.trim()
      );
      if (body.applyImmediately) {
        await upsertTripInStore(proposal.proposedTrip);
      }
      return NextResponse.json({
        proposal,
        trip: body.applyImmediately ? proposal.proposedTrip : trip,
      });
    }

    // Mode 4: Full Trip Regeneration
    const freshTrip = await generateCompleteTripItinerary(
      {
        destinationPlaceId: trip.destinationPlaceId,
        destinationName: trip.destinationName,
        destinationCountry: trip.destinationCountry,
        heroImage: trip.heroImage,
        startCity: trip.startCity,
        startDate: trip.startDate,
        endDate: trip.endDate,
        travelers: trip.travelers,
        travelType: trip.travelType,
        interests: trip.interests,
        travelPace: trip.travelPace,
        foodPreference: trip.foodPreference,
        specialInstructions: trip.specialInstructions,
        budgetAmount: trip.budget,
        budgetMode: "TOTAL",
        currency: trip.currency,
        travelTier: trip.travelTier,
        includedExpenses: trip.includedExpenses,
      },
      trip.userId
    );

    const preservedIdTrip = {
      ...freshTrip,
      id: trip.id,
      sharedLinks: trip.sharedLinks,
    };

    await upsertTripInStore(preservedIdTrip);
    return NextResponse.json({ trip: preservedIdTrip });
  } catch (error) {
    return NextResponse.json(
      { error: "REGENERATION_FAILED", details: String(error) },
      { status: 500 }
    );
  }
}
