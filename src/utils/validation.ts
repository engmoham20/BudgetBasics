import type { Expense } from '@/types';
import { APP_CONFIG } from '@/config';

export type ImportValidationResult = {
  valid: boolean;
  errors: string[];
  data: Expense[];
};

export function validateExpenseImport(
  raw: unknown,
  fileSize: number = 0
): ImportValidationResult {
  const errors: string[] = [];

  if (fileSize > APP_CONFIG.maxImportSize) {
    errors.push('File size exceeds maximum of 1MB');
    return { valid: false, errors, data: [] };
  }

  if (!Array.isArray(raw)) {
    errors.push('Imported data must be an array of expense objects');
    return { valid: false, errors, data: [] };
  }

  if (raw.length > APP_CONFIG.maxImportRecords) {
    errors.push(`Maximum ${APP_CONFIG.maxImportRecords} records allowed`);
    return { valid: false, errors, data: [] };
  }

  const validExpenses: Expense[] = [];

  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    const prefix = `Record ${i + 1}:`;

    if (!item || typeof item !== 'object') {
      errors.push(`${prefix} must be an object`);
      continue;
    }

    const record = item as Record<string, unknown>;

    if (typeof record.id !== 'string' || !record.id) {
      errors.push(`${prefix} missing or invalid id`);
      continue;
    }

    if (typeof record.date !== 'string' || !record.date) {
      errors.push(`${prefix} missing or invalid date`);
      continue;
    }

    const dateCheck = new Date(record.date);
    if (isNaN(dateCheck.getTime())) {
      errors.push(`${prefix} invalid date format`);
      continue;
    }

    if (typeof record.category !== 'string' || !record.category) {
      errors.push(`${prefix} missing or invalid category`);
      continue;
    }

    if (record.classification !== 'need' && record.classification !== 'want') {
      errors.push(`${prefix} classification must be "need" or "want"`);
      continue;
    }

    if (typeof record.description !== 'string') {
      errors.push(`${prefix} description must be a string`);
      continue;
    }

    if (typeof record.amount !== 'number' || isNaN(record.amount)) {
      errors.push(`${prefix} amount must be a number`);
      continue;
    }

    if (record.amount < 0) {
      errors.push(`${prefix} amount cannot be negative`);
      continue;
    }

    if (record.amount > APP_CONFIG.maxExpenseAmount) {
      errors.push(`${prefix} amount exceeds maximum allowed`);
      continue;
    }

    validExpenses.push({
      id: record.id,
      date: record.date,
      category: record.category,
      classification: record.classification as 'need' | 'want',
      description: record.description,
      amount: record.amount,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    data: validExpenses,
  };
}

export function exportExpensesCSV(
  expenses: Expense[],
  locale: 'ar' | 'en' = 'en'
): string {
  const headers = locale === 'ar'
    ? ['التاريخ', 'الفئة', 'التصنيف', 'الوصف', 'المبلغ']
    : ['Date', 'Category', 'Classification', 'Description', 'Amount'];

  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.classification,
    e.description.replace(/"/g, '""'),
    String(e.amount),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((r) => r.map((c) => `"${c}"`).join(',')),
  ].join('\n');

  return '\uFEFF' + csv;
}

export function exportExpensesJSON(expenses: Expense[]): string {
  return JSON.stringify(expenses, null, 2);
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
