import { useState, useMemo } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { galleryItems } from '@/services/dataLoaders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { normalizeText } from '@/utils/text';

export function LearningGalleryPage() {
  const { t, language } = useI18n();
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('all');

  const topics = useMemo(() => {
    const set = new Set<string>();
    galleryItems.forEach((item) => set.add(item.topic[language]));
    return Array.from(set);
  }, [galleryItems, language]);

  const filtered = useMemo(() => {
    const normQuery = normalizeText(search);
    return galleryItems.filter((item) => {
      const matchesTopic = activeTopic === 'all' || item.topic[language] === activeTopic;
      if (!matchesTopic) return false;
      if (!normQuery) return true;
      return (
        normalizeText(item.title[language]).includes(normQuery) ||
        normalizeText(item.description[language]).includes(normQuery)
      );
    });
  }, [search, activeTopic, galleryItems, language]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('gallery.title')}</h1>
          <p className="text-muted text-sm">{t('gallery.subtitle')}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          name="gallery-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('gallery.searchPlaceholder')}
          className="flex-1"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTopic('all')}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTopic === 'all'
                ? 'bg-primary text-primary-fg border-primary'
                : 'bg-surface text-muted border-border-custom hover:text-fg'
            }`}
          >
            {t('gallery.allTopics')}
          </button>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTopic === topic
                  ? 'bg-primary text-primary-fg border-primary'
                  : 'bg-surface text-muted border-border-custom hover:text-fg'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {galleryItems.length === 0 ? (
        <EmptyState message={t('empty.gallery')} />
      ) : filtered.length === 0 ? (
        <EmptyState message={t('search.noResults')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} hoverable>
              <div className="aspect-video bg-bg rounded-xl mb-4 flex items-center justify-center">
                {item.assetPath ? (
                  <img src={item.assetPath} alt={item.title[language]} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <ImageIcon size={40} className="text-muted" strokeWidth={1.5} />
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{item.title[language]}</CardTitle>
                  <Badge variant="primary">{item.topic[language]}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm">{item.description[language]}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
