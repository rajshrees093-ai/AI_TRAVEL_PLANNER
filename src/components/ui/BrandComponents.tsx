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

export function RoamWiseLogo({
  lightText = false,
  size = "md",
}: {
  lightText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const iconBoxSize =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-11 h-11" : "w-9 h-9";
  const textSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
    >
      <div
        className={cn(
          iconBoxSize,
          "rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-primary-dark transition-colors relative overflow-hidden"
        )}
      >
        <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
        <span className="sr-only">RoamWise Compass</span>
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-heading font-bold tracking-tight leading-none",
            textSize,
            lightText ? "text-white" : "text-heading"
          )}
        >
          Roam<span className="text-primary">Wise</span>
        </span>
      </div>
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

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 no-print"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === "success"
            ? CheckCircle2
            : toast.type === "warning"
            ? AlertTriangle
            : toast.type === "error"
            ? XCircle
            : Info;
        const iconColor =
          toast.type === "success"
            ? "text-success"
            : toast.type === "warning"
            ? "text-warning"
            : toast.type === "error"
            ? "text-red-600"
            : "text-primary";

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto bg-surface border border-border rounded-xl p-4 shadow-elevated flex items-start gap-3 transition-all duration-200"
          >
            <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", iconColor)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-heading">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="text-muted hover:text-heading p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
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
            className="px-4 py-2 text-sm font-medium rounded-xl border border-border text-heading hover:bg-sand/40 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-xl text-white transition-colors",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-primary hover:bg-primary-dark"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
