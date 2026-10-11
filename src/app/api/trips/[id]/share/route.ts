import { NextRequest, NextResponse } from "next/server";
import {
  createOrGetShareLink,
  resolveSharedTripByToken,
  revokeShareToken,
} from "@/lib/server-db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    if (body.action === "REVOKE" && body.token) {
      const revoked = await revokeShareToken(params.id, body.token);
      return NextResponse.json({ revoked, token: body.token });
    }

    const includeBudget =
      typeof body.includeBudget === "boolean" ? body.includeBudget : true;
    const expirationDate = body.expirationDate || undefined;

    const link = await createOrGetShareLink(
      params.id,
      includeBudget,
      expirationDate
    );

    if (!link) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Trip not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ shareLink: link });
  } catch (error) {
    return NextResponse.json(
      { error: "SHARE_ERROR", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || "";
    if (!token) {
      return NextResponse.json(
        { error: "TOKEN_REQUIRED", message: "Share token is required." },
        { status: 400 }
      );
    }

    const result = await resolveSharedTripByToken(token);
    if (!result.trip || !result.link) {
      return NextResponse.json(
        {
          error: result.reason || "NOT_FOUND",
          message:
            result.reason === "REVOKED"
              ? "This shared itinerary link has been revoked by the owner."
              : result.reason === "EXPIRED"
              ? "This shared itinerary link has expired."
              : "Shared itinerary link not found.",
        },
        { status: 404 }
      );
    }

    // Sanitize private fields before returning public shared view
    const sanitizedTrip = {
      ...result.trip,
      userId: "shared-readonly",
      specialInstructions: undefined,
      budgetItems: result.link.includeBudget ? result.trip.budgetItems : [],
    };

    return NextResponse.json({
      trip: sanitizedTrip,
      shareConfig: {
        includeBudget: result.link.includeBudget,
        allowCollaboration: result.link.allowCollaboration,
        expirationDate: result.link.expirationDate,
        createdAt: result.link.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "FAILED_TO_RESOLVE_SHARE", details: String(error) },
      { status: 500 }
    );
  }
}
