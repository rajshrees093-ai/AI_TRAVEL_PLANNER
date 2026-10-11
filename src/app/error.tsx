"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-3xl max-w-md w-full p-8 text-center shadow-soft">
        <div className="w-14 h-14 rounded-2xl bg-warning/15 text-warning flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-heading font-bold text-heading">
          Something unexpected happened
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
          {error?.message ||
            "We encountered a temporary issue loading this screen. Your saved trips remain safe."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl border border-border text-heading text-xs font-semibold"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
