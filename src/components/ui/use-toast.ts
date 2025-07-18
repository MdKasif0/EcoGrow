'use client';

import * as React from "react"

import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast"

interface ToastOptions extends ToastProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
}

const ToastContext = React.createContext<{
  toast: (options: ToastOptions) => void
} | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { ToastContext };

// You may need to implement a ToastProvider wrapper in your app layout if not already present. 