import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useI18n, type TranslationKey } from '@/i18n/useI18n';
import { buildSearchData, searchContent } from './searchData';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { APP_CONFIG } from '@/config';
import type { SearchResult } from '@/types';

type SearchModalProps = {
  open: boolean;
  onClose: () => void;
};

const typeLabelKeys: Record<SearchResult['type'], TranslationKey> = {
  lesson: 'search.type.lesson',
  tip: 'search.type.tip',
  mistake: 'search.type.mistake',
  tool: 'search.type.tool',
  gallery: 'search.type.gallery',
};

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const allData = useMemo(() => buildSearchData(), []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setDebouncedQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, APP_CONFIG.searchDebounceMs);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    return searchContent(debouncedQuery, allData, language);
  }, [debouncedQuery, allData, language]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      navigate(results[activeIndex].route);
      onClose();
    }
  }

  function handleResultClick(route: string) {
    navigate(route);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={t('search.title')} size="lg">
      <div className="flex flex-col gap-4">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('search.placeholder')}
          autoFocus
        />

        <div ref={resultsRef} className="max-h-96 overflow-y-auto" role="listbox">
          {!debouncedQuery && (
            <EmptyState message={t('search.empty')} />
          )}
          {debouncedQuery && results.length === 0 && (
            <EmptyState message={t('search.noResults')} />
          )}
          {results.length > 0 && (
            <ul className="flex flex-col gap-1">
              {results.map((result, index) => {
                const typeKey = typeLabelKeys[result.type];
                return (
                  <li key={`${result.type}-${result.id}`}>
                    <button
                      onClick={() => handleResultClick(result.route)}
                      className={`w-full text-start p-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        index === activeIndex ? 'bg-primary/10' : 'hover:bg-bg'
                      }`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted font-medium uppercase">
                          {t(typeKey)}
                        </span>
                      </div>
                      <p className="text-sm text-fg font-medium mt-1">
                        {result.title[language]}
                      </p>
                      {result.description && (
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">
                          {result.description[language]}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
