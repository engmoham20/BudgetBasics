import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';

export function useVisitCounter() {
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const current = getItem<number>(STORAGE_KEYS.visitCount, 0);
    const next = current + 1;
    setItem(STORAGE_KEYS.visitCount, next);
    setVisitCount(next);
  }, []);

  return { visitCount };
}
