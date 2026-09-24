import { setStorageFallbackCallback, isUsingMemoryFallback } from '@/services/storage';
import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/useI18n';

export function useStorageFallback() {
  const { t } = useI18n();
  const [showWarning, setShowWarning] = useState(isUsingMemoryFallback());

  useEffect(() => {
    setStorageFallbackCallback(() => {
      setShowWarning(true);
    });
  }, []);

  return { showWarning, message: t('storage.warning') };
}
