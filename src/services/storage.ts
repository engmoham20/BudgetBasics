const memoryStore = new Map<string, string>();
let useMemoryFallback = false;
let fallbackWarningShown = false;

type FallbackCallback = () => void;
let fallbackCallback: FallbackCallback | null = null;

export function setStorageFallbackCallback(cb: FallbackCallback): void {
  fallbackCallback = cb;
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__bb_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

if (!isLocalStorageAvailable()) {
  useMemoryFallback = true;
}

function notifyFallback(): void {
  if (!fallbackWarningShown && fallbackCallback) {
    fallbackWarningShown = true;
    fallbackCallback();
  }
}

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    let raw: string | null;
    if (useMemoryFallback) {
      raw = memoryStore.has(key) ? memoryStore.get(key)! : null;
    } else {
      raw = localStorage.getItem(key);
    }
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (useMemoryFallback) {
      memoryStore.set(key, serialized);
    } else {
      localStorage.setItem(key, serialized);
    }
  } catch {
    if (!useMemoryFallback) {
      useMemoryFallback = true;
      notifyFallback();
    }
    try {
      memoryStore.set(key, JSON.stringify(value));
    } catch {
      // Last resort - silently ignore
    }
  }
}

export function removeItem(key: string): void {
  try {
    if (useMemoryFallback) {
      memoryStore.delete(key);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    memoryStore.delete(key);
  }
}

export function isUsingMemoryFallback(): boolean {
  return useMemoryFallback;
}
