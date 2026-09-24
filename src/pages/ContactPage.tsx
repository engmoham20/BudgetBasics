import { Mail } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { APP_CONFIG } from '@/config';

export function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-fg mb-6">{t('contact.title')}</h1>
      <Card>
        <CardHeader className="flex items-center gap-3">
          <Mail size={24} className="text-primary" />
          <CardTitle>{t('contact.email')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t('contact.subtitle')}</p>
          <a href={`mailto:${APP_CONFIG.contactEmail}`}>
            <Button variant="primary">{APP_CONFIG.contactEmail}</Button>
          </a>
          <p className="text-xs text-muted mt-4">{t('contact.emailNote')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
