import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { moneyMistakes } from '@/services/dataLoaders';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';

export function MoneyMistakesPage() {
  const { t, language } = useI18n();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle size={28} className="text-warning" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('mistakes.title')}</h1>
          <p className="text-muted text-sm">{t('mistakes.subtitle')}</p>
        </div>
      </div>

      {moneyMistakes.length === 0 ? (
        <EmptyState message={t('empty.mistakes')} />
      ) : (
        <Accordion>
          {moneyMistakes.map((mistake) => (
            <AccordionItem
              key={mistake.id}
              id={mistake.id}
              header={mistake.scenario[language]}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <Badge variant="danger">{t('mistakes.scenario')}</Badge>
                  <p className="text-sm text-fg mt-2">{mistake.scenario[language]}</p>
                </div>
                <div>
                  <Badge variant="warning">{t('mistakes.consequence')}</Badge>
                  <p className="text-sm text-fg mt-2">{mistake.consequence[language]}</p>
                </div>
                <div>
                  <Badge variant="success">{t('mistakes.solution')}</Badge>
                  <p className="text-sm text-fg mt-2">{mistake.solution[language]}</p>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
