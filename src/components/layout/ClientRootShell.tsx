"use client";

import React from "react";
import { RoamWiseProvider, useRoamWise } from "@/context/RoamWiseContext";
import { ToastViewport } from "@/components/ui/BrandComponents";

function ToastBridge() {
  const { toasts, dismissToast } = useRoamWise();
  return <ToastViewport toasts={toasts} onDismiss={dismissToast} />;
}

export function ClientRootShell({ children }: { children: React.ReactNode }) {
  return (
    <RoamWiseProvider>
      {children}
      <ToastBridge />
    </RoamWiseProvider>
  );
}
