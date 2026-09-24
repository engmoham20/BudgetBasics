import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle, Info, AlertCircle, XCircle, X } from 'lucide-react';
import clsx from 'clsx';

type ToastVariant = 'success' | 'info' | 'warning' | 'danger';

type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle; className: string }> = {
  success: { icon: CheckCircle, className: 'text-success' },
  info: { icon: Info, className: 'text-primary' },
  warning: { icon: AlertCircle, className: 'text-warning' },
  danger: { icon: XCircle, className: 'text-danger' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-4 end-4 z-[60] flex flex-col gap-2 max-w-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          const config = variantConfig[toast.variant];
          const Icon = config.icon;
          return (
            <div
              key={toast.id}
              className={clsx(
                'flex items-start gap-3 p-4 bg-surface border border-border-custom rounded-xl shadow-lg animate-[slideIn_0.2s_ease-out]'
              )}
              role="alert"
            >
              <Icon size={20} className={clsx('shrink-0', config.className)} />
              <p className="text-sm text-fg flex-1">{toast.message}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-muted hover:text-fg"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
