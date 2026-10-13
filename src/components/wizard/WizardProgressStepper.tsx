"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bookmark, Check, Compass } from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";

const STEPS = [
  {
    step: 1,
    label: "Destination",
    href: "/create-trip/destination",
    heading: "Where would you like to explore?",
    subhead: "Start with a place, then make the plan your own.",
  },
  {
    step: 2,
    label: "Dates",
    href: "/create-trip/dates",
    heading: "When does your adventure begin?",
    subhead: "A good itinerary starts with a comfortable amount of time.",
  },
  {
    step: 3,
    label: "Preferences",
    href: "/create-trip/preferences",
    heading: "What kind of traveler are you?",
    subhead: "Tell us what you love so the days feel like yours.",
  },
  {
    step: 4,
    label: "Budget",
    href: "/create-trip/budget",
    heading: "Let’s make every rupee count.",
    subhead: "A first estimate helps you know where the money may go.",
  },
  {
    step: 5,
    label: "Review",
    href: "/create-trip/review",
    heading: "Your adventure is almost ready!",
    subhead: "Review your choices. You can still change any section.",
  },
];

export function WizardProgressStepper({ currentStep }: { currentStep: number }) {
  const router = useRouter();
  const { activeDraft, updateActiveDraft, saveDraftToContinueList } = useRoamWise();
  const currentMeta = STEPS[currentStep - 1] || STEPS[0];
  const prevStep = currentStep > 1 ? STEPS[currentStep - 2] : null;

  const handleStepClick = (targetStep: (typeof STEPS)[number]) => {
    if (targetStep.step > 1 && !activeDraft.destinationPlaceId) {
      updateActiveDraft({
        destinationPlaceId: "ChIJP9A_F1H0BDkR0GZ2K4e5_2M",
        destinationName: "Manali",
        destinationCountry: "Himachal Pradesh, India",
        heroImage: "/places/manali-solang-valley.jpg",
        currentStep: targetStep.step,
      });
    } else {
      updateActiveDraft({
        currentStep: Math.max(activeDraft.currentStep, targetStep.step),
      });
    }
    router.push(targetStep.href);
  };

  return (
    <>
      <div className="wizard-top">
        <div>
          <button
            type="button"
            className="back-link"
            onClick={() =>
              router.push(prevStep ? prevStep.href : "/dashboard")
            }
          >
            <ArrowLeft size={15} />{" "}
            {prevStep ? "Back" : "Back to dashboard"}
          </button>
          <span className="eyebrow">LET’S PLAN SOMETHING AMAZING</span>
          <h1>{currentMeta.heading}</h1>
          <p>{currentMeta.subhead}</p>
        </div>
        <div className="flex items-center gap-3">
          {activeDraft.destinationName && (
            <button
              type="button"
              onClick={saveDraftToContinueList}
              className="button button-outline button-small"
            >
              <Bookmark size={13} />
              <span>Save draft</span>
            </button>
          )}
          <span className="wizard-side-note">
            YOUR TRIP, YOUR PACE <Compass size={21} />
          </span>
        </div>
      </div>

      <div className="stepper" aria-label="Trip planning progress">
        {STEPS.map((s, idx) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <button
              key={s.label}
              type="button"
              className={`stepper-item ${isCurrent ? "current" : ""} ${
                isCompleted ? "completed" : ""
              }`}
              onClick={() => handleStepClick(s)}
            >
              <span className="stepper-dot">
                {isCompleted ? <Check size={13} /> : `0${idx + 1}`}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
