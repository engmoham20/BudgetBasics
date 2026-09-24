import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useI18n } from '@/i18n/useI18n';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle size={48} className="text-danger mb-3" strokeWidth={1.5} />
      <p className="text-fg text-sm mb-4">{message || t('error.message')}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {t('error.reset')}
        </Button>
      )}
    </div>
  );
}
