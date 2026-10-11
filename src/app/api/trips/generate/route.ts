import { NextRequest, NextResponse } from "next/server";
import { tripGenerationInputSchema } from "@/lib/validations";
import { generateCompleteTripItinerary } from "@/lib/ai-engine";
import {
  checkRateLimit,
  getServerStore,
  saveServerStore,
  upsertTripInStore,
} from "@/lib/server-db";
import { GenerationJob } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || "user-roamwise-demo";
    const draftId = body.draftId || `draft-${Date.now()}`;

    if (!checkRateLimit(userId, 12)) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message:
            "Too many itinerary generation requests. Please wait a minute before generating again.",
        },
        { status: 429 }
      );
    }

    const parsed = tripGenerationInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message:
            parsed.error.issues[0]?.message ||
            "Invalid trip generation parameters.",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const store = await getServerStore();

    // Prevent duplicate active generation job for same draft within 8 seconds
    const existingActiveJob = store.jobs.find(
      (j) =>
        j.userId === userId &&
        j.tripDraftId === draftId &&
        j.status !== "COMPLETED" &&
        j.status !== "FAILED" &&
        Date.now() - new Date(j.createdAt).getTime() < 8000
    );
    if (existingActiveJob) {
      return NextResponse.json({
        jobId: existingActiveJob.id,
        tripId: existingActiveJob.tripId,
        status: existingActiveJob.status,
        deduplicated: true,
      });
    }

    const jobId = `job-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const nowIso = new Date().toISOString();

    const job: GenerationJob = {
      id: jobId,
      userId,
      tripDraftId: draftId,
      status: "DISCOVERING_PLACES",
      stepIndex: 1,
      stepMessage: "Discovering amazing places...",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    store.jobs.unshift(job);
    saveServerStore(store);

    // Generate complete verified itinerary
    const generatedTrip = await generateCompleteTripItinerary(
      parsed.data,
      userId
    );
    await upsertTripInStore(generatedTrip);

    job.tripId = generatedTrip.id;
    job.status = "COMPLETED";
    job.stepIndex = 5;
    job.stepMessage = "Putting the finishing touches on your itinerary...";
    job.updatedAt = new Date().toISOString();
    saveServerStore(store);

    return NextResponse.json({
      jobId: job.id,
      tripId: generatedTrip.id,
      status: job.status,
      trip: generatedTrip,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "GENERATION_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate itinerary. Please try again.",
      },
      { status: 500 }
    );
  }
}
