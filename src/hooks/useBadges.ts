import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';
import { useToast } from '@/components/ui/Toast';
import { badgeDefinitions } from '@/services/dataLoaders';
import { useI18n } from '@/i18n/useI18n';

export function useBadges() {
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const { showToast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    const stored = getItem<string[]>(STORAGE_KEYS.badges, []);
    if (Array.isArray(stored)) {
      setEarnedBadges(stored);
    }
  }, []);

  const awardBadge = useCallback((badgeId: string) => {
    setEarnedBadges((prev) => {
      if (prev.includes(badgeId)) return prev;
      const next = [...prev, badgeId];
      setItem(STORAGE_KEYS.badges, next);
      const badge = badgeDefinitions.find((b) => b.id === badgeId);
      if (badge) {
        showToast(t('badges.awarded') + ' ' + badge.name.en, 'success');
      }
      return next;
    });
  }, [showToast, t]);

  const hasBadge = useCallback((badgeId: string) => {
    return earnedBadges.includes(badgeId);
  }, [earnedBadges]);

  return { earnedBadges, awardBadge, hasBadge };
}
