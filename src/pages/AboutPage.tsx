import { Info, Users, ShieldAlert } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-fg mb-6">{t('about.title')}</h1>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex items-center gap-3">
            <Info size={24} className="text-primary" />
            <CardTitle>{t('about.purpose')}</CardTitle>
          </CardHeader>
          <CardContent>{t('about.purposeText')}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <Users size={24} className="text-primary" />
            <CardTitle>{t('about.audience')}</CardTitle>
          </CardHeader>
          <CardContent>{t('about.audienceText')}</CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center gap-3">
            <ShieldAlert size={24} className="text-warning" />
            <CardTitle>{t('about.disclaimer')}</CardTitle>
          </CardHeader>
          <CardContent>{t('about.disclaimerText')}</CardContent>
        </Card>
      </div>
    </div>
  );
}
