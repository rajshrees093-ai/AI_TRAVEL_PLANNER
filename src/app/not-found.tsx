import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-3xl max-w-md w-full p-8 text-center shadow-soft">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          404 — Off the Map
        </span>
        <h1 className="text-2xl font-heading font-bold text-heading mt-1.5">
          We couldn&apos;t find this destination page
        </h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          The page or itinerary you&apos;re looking for may have moved or been
          removed. Let&apos;s get your journey back on course.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <Link
            href="/"
            className="flex-1 py-2.5 px-4 rounded-xl border border-border text-heading hover:bg-sand/40 text-xs font-semibold flex items-center justify-center transition-colors"
          >
            <span>Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
