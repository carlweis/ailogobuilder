import * as React from "react";

import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast";
import { ToastProviderContext, useToast } from "./use-toast";

export { useToast } from "./use-toast";

export function Toaster(): JSX.Element {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast key={toast.id} onOpenChange={(open) => !open && dismiss(toast.id)}>
          {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
          {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
          {toast.action ? <ToastAction altText="Dismiss">{toast.action}</ToastAction> : null}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export function ToastSystemProvider({ children }: React.PropsWithChildren): JSX.Element {
  return (
    <ToastProviderContext>
      {children}
      <Toaster />
    </ToastProviderContext>
  );
}
