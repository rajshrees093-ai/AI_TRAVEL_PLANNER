import { NextRequest, NextResponse } from "next/server";
import { getServerStore } from "@/lib/server-db";

const STEP_MESSAGES = [
  "Discovering amazing places...",
  "Finding restaurants that match your taste...",
  "Organizing your daily adventures...",
  "Checking travel distances...",
  "Balancing your trip budget...",
  "Putting the finishing touches on your itinerary...",
];

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    const store = await getServerStore();
    const job = store.jobs.find((j) => j.id === jobId);

    if (!job) {
      return NextResponse.json(
        { error: "JOB_NOT_FOUND", message: "Generation job not found." },
        { status: 404 }
      );
    }

    const trip = job.tripId
      ? store.trips.find((t) => t.id === job.tripId) || null
      : null;

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      stepIndex: job.stepIndex,
      stepMessage: job.stepMessage,
      allSteps: STEP_MESSAGES,
      tripId: job.tripId,
      trip,
      errorCode: job.errorCode,
      errorMessage: job.errorMessage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "FAILED_TO_POLL_JOB", details: String(error) },
      { status: 500 }
    );
  }
}
