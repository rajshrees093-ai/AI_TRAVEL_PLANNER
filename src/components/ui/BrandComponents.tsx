import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Compass,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      aria-label="RoamWise"
    >
      <span className="brand-symbol">
        <Compass size={21} strokeWidth={1.8} aria-hidden="true" />
        <i />
      </span>
      {!compact && (
        <span className="brand-name">
          roam<span>wise</span>
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
            className="button button-outline button-small"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "button button-small",
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "button-primary"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
