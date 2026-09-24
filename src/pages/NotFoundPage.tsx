import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Compass size={64} className="text-muted mb-4" strokeWidth={1.5} />
      <h1 className="text-2xl font-bold text-fg mb-2">{t('notFound.title')}</h1>
      <p className="text-muted text-sm mb-6">{t('notFound.message')}</p>
      <Link to="/">
        <Button variant="primary">{t('notFound.goHome')}</Button>
      </Link>
    </div>
  );
}
