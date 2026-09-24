import { I18nProvider } from '@/i18n/useI18n';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import type { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <ToastProvider>{children}</ToastProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
