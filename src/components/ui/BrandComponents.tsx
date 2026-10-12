import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function RouteBloomMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer subtle compass ring */}
      <circle
        cx="20"
        cy="20"
        r="15.5"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.35"
        strokeDasharray="2.5 2.5"
      />
      {/* 4 Blooming Cardinal Petals */}
      <path
        d="M20 4.5C22.9 10.1 22.9 14.8 20 18.4C17.1 14.8 17.1 10.1 20 4.5Z"
        fill="currentColor"
      />
      <path
        d="M35.5 20C29.9 22.9 25.2 22.9 21.6 20C25.2 17.1 29.9 17.1 35.5 20Z"
        fill="currentColor"
        fillOpacity="0.88"
      />
      <path
        d="M20 35.5C17.1 29.9 17.1 25.2 20 21.6C22.9 25.2 22.9 29.9 20 35.5Z"
        fill="currentColor"
        fillOpacity="0.72"
      />
      <path
        d="M4.5 20C10.1 17.1 14.8 17.1 18.4 20C14.8 22.9 10.1 22.9 4.5 20Z"
        fill="currentColor"
        fillOpacity="0.72"
      />
      {/* Diagonal Coral Route Needle & Bloom Petal */}
      <path
        d="M30.2 9.8L22.6 22.6L9.8 30.2L17.4 17.4L30.2 9.8Z"
        fill="#FF8066"
      />
      {/* Center Pin */}
      <circle cx="20" cy="20" r="3.1" fill="#FFFFFF" />
      <circle cx="20" cy="20" r="1.4" fill="#087F8C" />
    </svg>
  );
}

export function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={`brand-lockup ${light ? "brand-light" : ""} ${compact ? "brand-compact" : ""}`}
      aria-label="RouteBloom"
    >
      <span className="brand-symbol">
        <RouteBloomMark size={24} />
        <i />
      </span>
      {!compact && (
        <span className="brand-name">
          route<span>bloom</span>
        </span>
      )}
    </span>
  );
}

export function RoamWiseLogo({
  lightText = false,
  size = "md",
  compact = false,
}: {
  lightText?: boolean;
  size?: "sm" | "md" | "lg";
  compact?: boolean;
}) {
  return (
    <Link href="/" className="brand-anchor">
      <Brand light={lightText} compact={compact || size === "sm"} />
    </Link>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: {
    id: string;
    title: string;
    description?: string;
    type: "success" | "warning" | "error" | "info";
  }[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  const latest = toasts[toasts.length - 1];
  const Icon =
    latest.type === "success"
      ? CheckCircle2
      : latest.type === "warning"
      ? AlertTriangle
      : latest.type === "error"
      ? XCircle
      : Info;

  return (
    <div className="toast no-print" role="status" aria-live="polite">
      <Icon size={17} />
      <span>
        {latest.title}
        {latest.description ? ` — ${latest.description}` : ""}
      </span>
      <button
        type="button"
        className="toast-close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(latest.id)}
      >
        <X size={15} />
      </button>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-elevated">
        <h3
          id="confirm-dialog-title"
          className="text-lg font-heading font-bold text-heading"
        >
          {title}
        </h3>
        <p className="text-sm text-muted mt-2 leading-relaxed">{description}</p>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="button button-quiet button-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "button button-sm",
              variant === "danger" ? "button-danger" : "button-primary"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
