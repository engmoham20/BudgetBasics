import { describe, it, expect } from 'vitest';
import {
  calculateBudgetDistribution,
  calculateSavingsProgress,
  calculateRemainingAmount,
  calculateMonthsRemaining,
  calculateExpenseTotal,
  calculateRemainingIncome,
  safeNumber,
  clamp,
  isValidAmount,
  parseAmount,
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '@/utils/finance';

describe('calculateBudgetDistribution', () => {
  it('distributes income correctly', () => {
    const result = calculateBudgetDistribution(1000);
    expect(result.needs).toBe(500);
    expect(result.wants).toBe(300);
    expect(result.savings).toBe(200);
  });

  it('handles zero income', () => {
    const result = calculateBudgetDistribution(0);
    expect(result.needs).toBe(0);
    expect(result.wants).toBe(0);
    expect(result.savings).toBe(0);
  });

  it('handles invalid input', () => {
    const result = calculateBudgetDistribution(NaN);
    expect(result.needs).toBe(0);
    expect(result.wants).toBe(0);
    expect(result.savings).toBe(0);
  });

  it('handles negative input', () => {
    const result = calculateBudgetDistribution(-100);
    expect(result.needs).toBe(-50);
    expect(result.wants).toBe(-30);
    expect(result.savings).toBe(-20);
  });
});

describe('calculateSavingsProgress', () => {
  it('calculates progress correctly', () => {
    expect(calculateSavingsProgress(50, 100)).toBe(50);
    expect(calculateSavingsProgress(75, 100)).toBe(75);
  });

  it('clamps to 100 when exceeding target', () => {
    expect(calculateSavingsProgress(150, 100)).toBe(100);
  });

  it('clamps to 0 for negative values', () => {
    expect(calculateSavingsProgress(-10, 100)).toBe(0);
  });

  it('returns 0 when target is 0', () => {
    expect(calculateSavingsProgress(50, 0)).toBe(0);
  });

  it('returns 0 for NaN input', () => {
    expect(calculateSavingsProgress(NaN, 100)).toBe(0);
  });
});

describe('calculateRemainingAmount', () => {
  it('calculates remaining correctly', () => {
    expect(calculateRemainingAmount(30, 100)).toBe(70);
  });

  it('returns 0 when current exceeds target', () => {
    expect(calculateRemainingAmount(150, 100)).toBe(0);
  });

  it('handles zero values', () => {
    expect(calculateRemainingAmount(0, 0)).toBe(0);
  });
});

describe('calculateMonthsRemaining', () => {
  it('calculates months correctly', () => {
    expect(calculateMonthsRemaining(100, 25)).toBe(4);
  });

  it('returns null when monthly contribution is 0', () => {
    expect(calculateMonthsRemaining(100, 0)).toBeNull();
  });

  it('returns null for negative contribution', () => {
    expect(calculateMonthsRemaining(100, -10)).toBeNull();
  });

  it('handles zero remaining', () => {
    expect(calculateMonthsRemaining(0, 100)).toBe(0);
  });
});

describe('calculateExpenseTotal', () => {
  it('sums expenses correctly', () => {
    expect(calculateExpenseTotal([{ amount: 10 }, { amount: 20 }, { amount: 30 }])).toBe(60);
  });

  it('handles empty array', () => {
    expect(calculateExpenseTotal([])).toBe(0);
  });

  it('handles invalid entries', () => {
    expect(calculateExpenseTotal([{ amount: NaN }, { amount: 10 }])).toBe(10);
  });

  it('handles non-array input', () => {
    expect(calculateExpenseTotal(null as unknown as { amount: number }[])).toBe(0);
  });
});

describe('calculateRemainingIncome', () => {
  it('calculates remaining income correctly', () => {
    expect(calculateRemainingIncome(1000, 600)).toBe(400);
  });

  it('handles zero income', () => {
    expect(calculateRemainingIncome(0, 100)).toBe(-100);
  });

  it('handles NaN input', () => {
    expect(calculateRemainingIncome(NaN, 100)).toBe(-100);
  });
});

describe('safeNumber', () => {
  it('returns valid number', () => {
    expect(safeNumber(42)).toBe(42);
  });

  it('returns 0 for NaN', () => {
    expect(safeNumber(NaN)).toBe(0);
  });

  it('returns 0 for Infinity', () => {
    expect(safeNumber(Infinity)).toBe(0);
  });

  it('returns 0 for non-number types', () => {
    expect(safeNumber('abc')).toBe(0);
    expect(safeNumber(null)).toBe(0);
    expect(safeNumber(undefined)).toBe(0);
  });
});

describe('clamp', () => {
  it('clamps above max', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('clamps below min', () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  it('returns value within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('handles NaN', () => {
    expect(clamp(NaN, 0, 100)).toBe(0);
  });
});

describe('isValidAmount', () => {
  it('accepts valid positive numbers', () => {
    expect(isValidAmount('100')).toBe(true);
    expect(isValidAmount('0')).toBe(true);
    expect(isValidAmount('99.99')).toBe(true);
  });

  it('rejects negative numbers', () => {
    expect(isValidAmount('-50')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidAmount('')).toBe(false);
    expect(isValidAmount('  ')).toBe(false);
  });

  it('rejects scientific notation', () => {
    expect(isValidAmount('1e9')).toBe(false);
    expect(isValidAmount('1E5')).toBe(false);
  });

  it('rejects values over 1e9', () => {
    expect(isValidAmount('1000000001')).toBe(false);
  });

  it('accepts exactly 1e9', () => {
    expect(isValidAmount('1000000000')).toBe(true);
  });

  it('rejects non-numeric strings', () => {
    expect(isValidAmount('abc')).toBe(false);
  });
});

describe('parseAmount', () => {
  it('parses valid amounts', () => {
    expect(parseAmount('100')).toBe(100);
    expect(parseAmount('0')).toBe(0);
  });

  it('returns null for invalid amounts', () => {
    expect(parseAmount('-1')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('')).toBeNull();
  });
});

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    const result = formatCurrency(100, 'USD', 'en');
    expect(result).toContain('100');
    expect(result).toContain('$');
  });

  it('formats with Arabic locale using Western digits', () => {
    const result = formatCurrency(100, 'USD', 'ar');
    expect(result).toContain('100');
  });

  it('handles zero', () => {
    const result = formatCurrency(0, 'USD', 'en');
    expect(result).toContain('0');
  });

  it('handles NaN', () => {
    const result = formatCurrency(NaN, 'USD', 'en');
    expect(result).toContain('0');
  });
});

describe('formatNumber', () => {
  it('formats numbers correctly', () => {
    expect(formatNumber(1000, 'en')).toBe('1,000');
  });

  it('handles zero', () => {
    expect(formatNumber(0, 'en')).toBe('0');
  });
});

describe('formatPercentage', () => {
  it('formats percentages correctly', () => {
    const result = formatPercentage(50, 'en');
    expect(result).toBe('50%');
  });

  it('handles decimals', () => {
    const result = formatPercentage(33.33, 'en');
    expect(result).toContain('33.3%');
  });
});
