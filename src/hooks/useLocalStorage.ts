import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/services/storage';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    setValue(getItem<T>(key, defaultValue));
  }, [key]);

  const update = useCallback((newValue: T) => {
    setValue(newValue);
    setItem(key, newValue);
  }, [key]);

  return [value, update] as const;
}
