"use client";

import React from "react";
import Link from "next/link";
import { Check, MapPin, Calendar, Sliders, Wallet, ClipboardCheck, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoamWise } from "@/context/RoamWiseContext";

const STEPS = [
  { step: 1, label: "Destination", href: "/create-trip/destination", icon: MapPin },
  { step: 2, label: "Dates", href: "/create-trip/dates", icon: Calendar },
  { step: 3, label: "Preferences", href: "/create-trip/preferences", icon: Sliders },
  { step: 4, label: "Budget", href: "/create-trip/budget", icon: Wallet },
  { step: 5, label: "Review", href: "/create-trip/review", icon: ClipboardCheck },
];

export function WizardProgressStepper({ currentStep }: { currentStep: number }) {
  const { activeDraft, saveDraftToContinueList } = useRoamWise();

  return (
    <div className="mb-8">
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <ol className="flex items-center justify-between md:justify-start gap-2 sm:gap-4 overflow-x-auto">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = s.step < currentStep;
            const isActive = s.step === currentStep;
            const canNavigate =
              s.step <= currentStep || Boolean(activeDraft.destinationPlaceId);

            const content = (
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                    isCompleted
                      ? "bg-success text-white"
                      : isActive
                      ? "bg-primary text-white ring-4 ring-primary/15"
                      : "bg-background border border-border text-muted"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold",
                    isActive
                      ? "text-heading"
                      : isCompleted
                      ? "text-success"
                      : "text-muted"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );

            return (
              <li key={s.step} className="flex items-center gap-2 sm:gap-4">
                {canNavigate ? (
                  <Link href={s.href} className="hover:opacity-85 transition-opacity">
                    {content}
                  </Link>
                ) : (
                  <div className="opacity-60 cursor-not-allowed">{content}</div>
                )}
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "hidden sm:block w-8 h-0.5 rounded-full",
                      isCompleted ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {activeDraft.destinationName && (
          <button
            type="button"
            onClick={saveDraftToContinueList}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-sand/40 text-xs font-semibold text-heading transition-colors shrink-0"
          >
            <Bookmark className="w-3.5 h-3.5 text-primary" />
            <span>Save Draft</span>
          </button>
        )}
      </div>
    </div>
  );
}
