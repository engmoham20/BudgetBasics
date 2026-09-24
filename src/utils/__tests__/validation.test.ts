import { describe, it, expect } from 'vitest';
import { validateExpenseImport, exportExpensesCSV, exportExpensesJSON } from '@/utils/validation';
import type { Expense } from '@/types';

describe('validateExpenseImport', () => {
  it('accepts valid expense array', () => {
    const data = [
      { id: '1', date: '2024-01-01', category: 'Food', classification: 'need', description: 'Lunch', amount: 10 },
    ];
    const result = validateExpenseImport(data);
    expect(result.valid).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('rejects non-array input', () => {
    const result = validateExpenseImport({ foo: 'bar' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects negative amounts', () => {
    const data = [
      { id: '1', date: '2024-01-01', category: 'Food', classification: 'need', description: 'Test', amount: -5 },
    ];
    const result = validateExpenseImport(data);
    expect(result.valid).toBe(false);
  });

  it('rejects missing id', () => {
    const data = [
      { date: '2024-01-01', category: 'Food', classification: 'need', description: 'Test', amount: 5 },
    ];
    const result = validateExpenseImport(data);
    expect(result.valid).toBe(false);
  });

  it('rejects invalid classification', () => {
    const data = [
      { id: '1', date: '2024-01-01', category: 'Food', classification: 'invalid', description: 'Test', amount: 5 },
    ];
    const result = validateExpenseImport(data);
    expect(result.valid).toBe(false);
  });

  it('rejects invalid date', () => {
    const data = [
      { id: '1', date: 'not-a-date', category: 'Food', classification: 'need', description: 'Test', amount: 5 },
    ];
    const result = validateExpenseImport(data);
    expect(result.valid).toBe(false);
  });

  it('rejects amount exceeding maximum', () => {
    const data = [
      { id: '1', date: '2024-01-01', category: 'Food', classification: 'need', description: 'Test', amount: 2e9 },
    ];
    const result = validateExpenseImport(data);
    expect(result.valid).toBe(false);
  });

  it('handles empty array', () => {
    const result = validateExpenseImport([]);
    expect(result.valid).toBe(true);
    expect(result.data).toHaveLength(0);
  });
});

describe('exportExpensesCSV', () => {
  it('includes UTF-8 BOM', () => {
    const csv = exportExpensesCSV([]);
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
  });

  it('includes headers', () => {
    const csv = exportExpensesCSV([]);
    expect(csv).toContain('Date');
    expect(csv).toContain('Amount');
  });

  it('includes expense data', () => {
    const expenses: Expense[] = [
      { id: '1', date: '2024-01-01', category: 'Food', classification: 'need', description: 'Lunch', amount: 10 },
    ];
    const csv = exportExpensesCSV(expenses);
    expect(csv).toContain('Food');
    expect(csv).toContain('10');
  });
});

describe('exportExpensesJSON', () => {
  it('exports valid JSON', () => {
    const expenses: Expense[] = [
      { id: '1', date: '2024-01-01', category: 'Food', classification: 'need', description: 'Lunch', amount: 10 },
    ];
    const json = exportExpensesJSON(expenses);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('1');
  });
});
