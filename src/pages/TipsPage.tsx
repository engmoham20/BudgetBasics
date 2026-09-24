import { useState, useMemo } from 'react';
import { Lightbulb } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { tips } from '@/services/dataLoaders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { normalizeText } from '@/utils/text';

const chipBase =
  'px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
const chipActive = 'bg-primary text-primary-fg border-primary';
const chipIdle = 'bg-surface text-muted border-border-custom hover:text-fg';

export function TipsPage() {
  const { t, language } = useI18n();
  const [search, setSearch] = useState('');
  // Categories are tracked by their English label so the filter survives a language switch.
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    tips.forEach((tip) => {
      if (!map.has(tip.category.en)) map.set(tip.category.en, tip.category[language]);
    });
    return Array.from(map, ([key, label]) => ({ key, label }));
  }, [language]);

  const filtered = useMemo(() => {
    const normQuery = normalizeText(search);
    return tips.filter((tip) => {
      if (activeCategory !== 'all' && tip.category.en !== activeCategory) return false;
      if (!normQuery) return true;
      return (
        normalizeText(tip.title[language]).includes(normQuery) ||
        normalizeText(tip.content[language]).includes(normQuery)
      );
    });
  }, [search, activeCategory, language]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb size={28} className="text-tip" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('tips.title')}</h1>
          <p className="text-muted text-sm">{t('tips.subtitle')}</p>
        </div>
      </div>

      {tips.length === 0 ? (
        <EmptyState
          message={t('empty.tips')}
          icon={<Lightbulb size={48} className="text-muted" strokeWidth={1.5} />}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            <Input
              type="text"
              name="tips-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('tips.searchPlaceholder')}
              aria-label={t('tips.searchPlaceholder')}
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                aria-pressed={activeCategory === 'all'}
                className={`${chipBase} ${activeCategory === 'all' ? chipActive : chipIdle}`}
              >
                {t('tips.allCategories')}
              </button>
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key)}
                  aria-pressed={activeCategory === category.key}
                  className={`${chipBase} ${activeCategory === category.key ? chipActive : chipIdle}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted" aria-live="polite">
              {t('tips.showing')} {filtered.length} / {tips.length}
            </p>
          </div>

          {filtered.length === 0 ? (
            <EmptyState message={t('search.noResults')} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((tip) => (
                <Card key={tip.id} hoverable className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-2 mb-2">
                      <Lightbulb size={18} className="text-tip shrink-0 mt-0.5" />
                      <CardTitle className="text-base">{tip.title[language]}</CardTitle>
                    </div>
                    <Badge variant="warning">{tip.category[language]}</Badge>
                  </CardHeader>
                  <CardContent className="text-sm">{tip.content[language]}</CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
