import type { SearchResult } from '@/types';
import { lessons, tips, moneyMistakes, galleryItems } from '@/services/dataLoaders';
import { NAV_ITEMS } from '@/components/layout/navConfig';
import { normalizeText } from '@/utils/text';

export function buildSearchData(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const lesson of lessons) {
    results.push({
      id: lesson.id,
      title: lesson.title,
      description: lesson.summary,
      type: 'lesson',
      route: '/budgeting',
    });
  }

  for (const tip of tips) {
    results.push({
      id: tip.id,
      title: tip.title,
      description: tip.content,
      type: 'tip',
      route: '/',
    });
  }

  for (const mistake of moneyMistakes) {
    results.push({
      id: mistake.id,
      title: mistake.scenario,
      description: mistake.consequence,
      type: 'mistake',
      route: '/money-mistakes',
    });
  }

  for (const item of galleryItems) {
    results.push({
      id: item.id,
      title: item.title,
      description: item.description,
      type: 'gallery',
      route: '/gallery',
    });
  }

  for (const navItem of NAV_ITEMS) {
    results.push({
      id: `tool-${navItem.path}`,
      title: { ar: navItem.path, en: navItem.path },
      type: 'tool',
      route: navItem.path,
    });
  }

  return results;
}

export function searchContent(
  query: string,
  data: SearchResult[],
  lang: 'ar' | 'en'
): SearchResult[] {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  const queryWords = normalizedQuery.split(' ').filter(Boolean);

  return data
    .map((item) => {
      const titleNorm = normalizeText(item.title[lang]);
      const descNorm = item.description ? normalizeText(item.description[lang]) : '';
      let score = 0;

      if (titleNorm.includes(normalizedQuery)) score += 3;
      if (descNorm.includes(normalizedQuery)) score += 2;

      for (const word of queryWords) {
        if (titleNorm.includes(word)) score += 1;
        if (descNorm.includes(word)) score += 1;
      }

      return { item, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
