import { useState, useEffect, useCallback } from 'react';
import type { Expense } from '@/types';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';
import { generateId } from '@/utils/text';
import { safeNumber } from '@/utils/finance';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const stored = getItem<Expense[]>(STORAGE_KEYS.expenses, []);
    if (Array.isArray(stored)) {
      setExpenses(stored);
    }
  }, []);

  const persist = useCallback((items: Expense[]) => {
    setExpenses(items);
    setItem(STORAGE_KEYS.expenses, items);
  }, []);

  const addExpense = useCallback((data: Omit<Expense, 'id'>) => {
    const expense: Expense = { ...data, id: generateId() };
    setExpenses((prev) => {
      const next = [...prev, expense];
      setItem(STORAGE_KEYS.expenses, next);
      return next;
    });
    return expense;
  }, []);

  const updateExpense = useCallback((id: string, data: Omit<Expense, 'id'>) => {
    setExpenses((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...data, id } : e));
      setItem(STORAGE_KEYS.expenses, next);
      return next;
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => {
      const next = prev.filter((e) => e.id !== id);
      setItem(STORAGE_KEYS.expenses, next);
      return next;
    });
  }, []);

  const mergeExpenses = useCallback((newExpenses: Expense[]) => {
    setExpenses((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const toAdd = newExpenses.filter((e) => !existingIds.has(e.id));
      const next = [...prev, ...toAdd];
      setItem(STORAGE_KEYS.expenses, next);
      return next;
    });
  }, []);

  const replaceExpenses = useCallback((newExpenses: Expense[]) => {
    const sanitized = newExpenses.map((e) => ({
      ...e,
      amount: safeNumber(e.amount),
    }));
    setExpenses(sanitized);
    setItem(STORAGE_KEYS.expenses, sanitized);
  }, []);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    mergeExpenses,
    replaceExpenses,
  };
}
