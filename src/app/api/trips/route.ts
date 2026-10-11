import { NextRequest, NextResponse } from "next/server";
import { getTripsForUser, upsertTripInStore } from "@/lib/server-db";
import { recalculateTripMetrics } from "@/lib/ai-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "";
    const trips = await getTripsForUser(userId);
    return NextResponse.json({ trips });
  } catch (error) {
    return NextResponse.json(
      { error: "FAILED_TO_FETCH_TRIPS", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.id || !body.destinationName) {
      return NextResponse.json(
        { error: "INVALID_TRIP_PAYLOAD", message: "Trip ID and destination are required." },
        { status: 400 }
      );
    }

    const recalculated = recalculateTripMetrics({
      ...body,
      isSaved: true,
      updatedAt: new Date().toISOString(),
    });
    const saved = await upsertTripInStore(recalculated);
    return NextResponse.json({ trip: saved }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "FAILED_TO_SAVE_TRIP", details: String(error) },
      { status: 500 }
    );
  }
}
