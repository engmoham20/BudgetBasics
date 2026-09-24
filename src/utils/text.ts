export function normalizeText(str: string): string {
  if (!str) return '';
  let result = str.toLowerCase();

  // Remove Arabic diacritics (tashkeel)
  result = result.replace(/[\u0617-\u061A\u064B-\u0652\u0670\u0640]/g, '');

  // Normalize Arabic Alef variants
  result = result.replace(/[\u0622\u0623\u0625\u0627\u0671]/g, '\u0627');

  // Normalize ى → ي
  result = result.replace(/\u0649/g, '\u064A');

  // Normalize ة → ه
  result = result.replace(/\u0629/g, '\u0647');

  // Convert Arabic-Indic digits to Western digits
  const arabicIndicDigits = /[\u0660-\u0669]/g;
  result = result.replace(arabicIndicDigits, (match) =>
    String(match.charCodeAt(0) - 0x0660)
  );

  // Convert Persian/Extended Arabic digits
  const extendedDigits = /[\u06F0-\u06F9]/g;
  result = result.replace(extendedDigits, (match) =>
    String(match.charCodeAt(0) - 0x06F0)
  );

  // Remove punctuation
  result = result.replace(/[^\w\s\u0600-\u06FF]/g, ' ');

  // Normalize whitespace
  result = result.replace(/\s+/g, ' ').trim();

  return result;
}

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
