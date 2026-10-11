import { NextRequest, NextResponse } from "next/server";
import {
  deleteTripInStore,
  getTripByIdForUser,
  upsertTripInStore,
} from "@/lib/server-db";
import { recalculateTripMetrics } from "@/lib/ai-engine";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-roamwise-demo";
    const { trip, unauthorized } = await getTripByIdForUser(params.id, userId);

    if (unauthorized) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "You do not have permission to view this private itinerary.",
        },
        { status: 403 }
      );
    }

    if (!trip) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Trip not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ trip });
  } catch (error) {
    return NextResponse.json(
      { error: "FAILED_TO_GET_TRIP", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const userId = body.userId || "user-roamwise-demo";
    const { trip: existing, unauthorized } = await getTripByIdForUser(
      params.id,
      userId
    );

    if (unauthorized) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "You cannot modify another user's private itinerary.",
        },
        { status: 403 }
      );
    }

    if (!existing) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Trip not found." },
        { status: 404 }
      );
    }

    const merged = {
      ...existing,
      ...body,
      id: existing.id,
    };

    const recalculated = body.skipRecalculate
      ? { ...merged, updatedAt: new Date().toISOString() }
      : recalculateTripMetrics(merged);

    const saved = await upsertTripInStore(recalculated);
    return NextResponse.json({ trip: saved });
  } catch (error) {
    return NextResponse.json(
      { error: "FAILED_TO_UPDATE_TRIP", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user-roamwise-demo";
    const deleted = await deleteTripInStore(params.id, userId);

    if (!deleted) {
      return NextResponse.json(
        {
          error: "NOT_FOUND_OR_UNAUTHORIZED",
          message: "Trip could not be deleted or access was denied.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ deleted: true, id: params.id });
  } catch (error) {
    return NextResponse.json(
      { error: "FAILED_TO_DELETE_TRIP", details: String(error) },
      { status: 500 }
    );
  }
}
