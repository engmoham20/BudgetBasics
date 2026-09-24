import { Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted">
      <Loader2 size={32} className="animate-spin mb-2" aria-hidden="true" />
      <p className="text-sm">{message || t('common.loading')}</p>
    </div>
  );
}
