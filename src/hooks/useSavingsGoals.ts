import { useState, useEffect, useCallback } from 'react';
import type { SavingsGoal } from '@/types';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';
import { generateId } from '@/utils/text';
import { safeNumber } from '@/utils/finance';

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);

  useEffect(() => {
    const stored = getItem<SavingsGoal[]>(STORAGE_KEYS.savingsGoals, []);
    if (Array.isArray(stored)) {
      setGoals(stored);
    }
  }, []);

  const addGoal = useCallback((data: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const goal: SavingsGoal = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => {
      const next = [...prev, goal];
      setItem(STORAGE_KEYS.savingsGoals, next);
      return next;
    });
    return goal;
  }, []);

  const updateGoal = useCallback((id: string, data: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    setGoals((prev) => {
      const next = prev.map((g) =>
        g.id === id ? { ...data, id, createdAt: g.createdAt } : g
      );
      setItem(STORAGE_KEYS.savingsGoals, next);
      return next;
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => {
      const next = prev.filter((g) => g.id !== id);
      setItem(STORAGE_KEYS.savingsGoals, next);
      return next;
    });
  }, []);

  return {
    goals,
    addGoal: (data: { name: string; targetAmount: number; currentAmount: number; monthlyContribution: number }) =>
      addGoal({
        name: data.name,
        targetAmount: safeNumber(data.targetAmount),
        currentAmount: safeNumber(data.currentAmount),
        monthlyContribution: safeNumber(data.monthlyContribution),
      }),
    updateGoal: (id: string, data: { name: string; targetAmount: number; currentAmount: number; monthlyContribution: number }) =>
      updateGoal(id, {
        name: data.name,
        targetAmount: safeNumber(data.targetAmount),
        currentAmount: safeNumber(data.currentAmount),
        monthlyContribution: safeNumber(data.monthlyContribution),
      }),
    deleteGoal,
  };
}
