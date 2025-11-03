import * as React from "react";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
};

interface ToastContextValue {
  toasts: Array<ToastProps & { id: string }>;
  setToasts: React.Dispatch<React.SetStateAction<Array<ToastProps & { id: string }>>>;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const randomId = () => Math.random().toString(36).slice(2, 9);

export const ToastProviderContext = ({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([]);

  return <ToastContext.Provider value={{ toasts, setToasts }}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProviderContext");
  }

  const toast = (props: ToastProps) => {
    const id = randomId();
    context.setToasts((current) => [...current, { ...props, id }]);
    if (props.duration !== 0) {
      const timeout = window.setTimeout(() => {
        context.setToasts((current) => current.filter((item) => item.id !== id));
      }, props.duration ?? 4000);
      return () => window.clearTimeout(timeout);
    }
    return () => context.setToasts((current) => current.filter((item) => item.id !== id));
  };

  const dismiss = (id: string) => {
    context.setToasts((current) => current.filter((item) => item.id !== id));
  };

  return { toast, dismiss, toasts: context.toasts };
};
