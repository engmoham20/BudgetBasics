import type { CurrencyCode } from '@/config';
import { CURRENCIES } from '@/config';

export function safeNumber(value: unknown): number {
  if (typeof value !== 'number' || !isFinite(value) || isNaN(value)) {
    return 0;
  }
  return value;
}

export function clamp(value: number, min: number, max: number): number {
  if (isNaN(value) || !isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function calculateBudgetDistribution(income: number): {
  needs: number;
  wants: number;
  savings: number;
} {
  const safeIncome = safeNumber(income);
  return {
    needs: safeIncome * 0.5,
    wants: safeIncome * 0.3,
    savings: safeIncome * 0.2,
  };
}

export function calculateSavingsProgress(
  current: number,
  target: number
): number {
  const safeCurrent = safeNumber(current);
  const safeTarget = safeNumber(target);
  if (safeTarget <= 0) return 0;
  return clamp((safeCurrent / safeTarget) * 100, 0, 100);
}

export function calculateRemainingAmount(
  current: number,
  target: number
): number {
  const safeCurrent = safeNumber(current);
  const safeTarget = safeNumber(target);
  return Math.max(0, safeTarget - safeCurrent);
}

export function calculateMonthsRemaining(
  remaining: number,
  monthlyContribution: number
): number | null {
  const safeRemaining = safeNumber(remaining);
  const safeMonthly = safeNumber(monthlyContribution);
  if (safeMonthly <= 0) return null;
  return Math.ceil(safeRemaining / safeMonthly);
}

export function calculateExpectedDate(
  monthsRemaining: number | null
): string | null {
  if (monthsRemaining === null || monthsRemaining <= 0) return null;
  const date = new Date();
  date.setMonth(date.getMonth() + monthsRemaining);
  return date.toISOString();
}

export function calculateExpenseTotal(
  expenses: { amount: number }[]
): number {
  if (!Array.isArray(expenses)) return 0;
  return expenses.reduce((sum, e) => sum + safeNumber(e.amount), 0);
}

export function calculateRemainingIncome(
  income: number,
  totalExpenses: number
): number {
  return safeNumber(income) - safeNumber(totalExpenses);
}

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  locale: string = 'en'
): string {
  const currency = CURRENCIES[currencyCode];
  const safeAmount = safeNumber(amount);
  const numberLocale = locale === 'ar' ? 'ar-u-nu-latn' : 'en';
  const formatted = new Intl.NumberFormat(numberLocale, {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  }).format(safeAmount);
  return `${formatted} ${currency.symbol}`;
}

export function formatNumber(value: number, locale: string = 'en'): string {
  const safeValue = safeNumber(value);
  const numberLocale = locale === 'ar' ? 'ar-u-nu-latn' : 'en';
  return new Intl.NumberFormat(numberLocale).format(safeValue);
}

export function formatPercentage(value: number, locale: string = 'en'): string {
  const safeValue = safeNumber(value);
  const numberLocale = locale === 'ar' ? 'ar-u-nu-latn' : 'en';
  return new Intl.NumberFormat(numberLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(safeValue) + '%';
}

export function isValidAmount(value: string): boolean {
  if (value.trim() === '') return false;
  if (/[eE]/.test(value)) return false;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return false;
  if (num < 0) return false;
  if (num > 1e9) return false;
  return true;
}

export function parseAmount(value: string): number | null {
  if (!isValidAmount(value)) return null;
  return Number(value);
}
