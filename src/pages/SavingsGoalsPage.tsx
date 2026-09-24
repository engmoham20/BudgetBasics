import { useState, useEffect, useMemo } from 'react';
import { Target, Plus, Edit2, Trash2, CheckCircle, Calendar } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { useBadges } from '@/hooks/useBadges';
import { useToast } from '@/components/ui/Toast';
import {
  calculateSavingsProgress,
  calculateRemainingAmount,
  calculateMonthsRemaining,
  calculateExpectedDate,
  formatCurrency,
  isValidAmount,
} from '@/utils/finance';
import { CURRENCIES, type CurrencyCode } from '@/config';
import type { SavingsGoal } from '@/types';

export function SavingsGoalsPage() {
  const { t, language } = useI18n();
  const { goals, addGoal, updateGoal, deleteGoal } = useSavingsGoals();
  const { awardBadge } = useBadges();
  const { showToast } = useToast();
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetStr, setTargetStr] = useState('');
  const [currentStr, setCurrentStr] = useState('');
  const [monthlyStr, setMonthlyStr] = useState('');
  const [errors, setErrors] = useState<{ name?: string; amounts?: string }>({});

  const currencyOptions = Object.values(CURRENCIES).map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol})`,
  }));

  function openAdd() {
    setEditingGoal(null);
    setName('');
    setTargetStr('');
    setCurrentStr('');
    setMonthlyStr('');
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(goal: SavingsGoal) {
    setEditingGoal(goal);
    setName(goal.name);
    setTargetStr(String(goal.targetAmount));
    setCurrentStr(String(goal.currentAmount));
    setMonthlyStr(String(goal.monthlyContribution));
    setErrors({});
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { name?: string; amounts?: string } = {};
    if (!name.trim()) newErrors.name = t('savings.nameRequired');
    if (!isValidAmount(targetStr)) newErrors.amounts = t('savings.invalidAmount');
    if (currentStr && !isValidAmount(currentStr)) newErrors.amounts = t('savings.invalidAmount');
    if (monthlyStr && !isValidAmount(monthlyStr)) newErrors.amounts = t('savings.invalidAmount');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const target = Number(targetStr);
    const current = currentStr ? Number(currentStr) : 0;
    const monthly = monthlyStr ? Number(monthlyStr) : 0;

    if (editingGoal) {
      updateGoal(editingGoal.id, { name: name.trim(), targetAmount: target, currentAmount: current, monthlyContribution: monthly });
    } else {
      addGoal({ name: name.trim(), targetAmount: target, currentAmount: current, monthlyContribution: monthly });
      awardBadge('first-savings-goal');
    }

    if (current >= target && target > 0) {
      awardBadge('goal-completed');
      showToast(t('savings.completed'), 'success');
    }

    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteId) {
      deleteGoal(deleteId);
      setDeleteId(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Target size={28} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-fg">{t('savings.title')}</h1>
            <p className="text-muted text-sm">{t('savings.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="px-2 py-1.5 rounded-xl border border-border-custom bg-surface text-fg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t('budgetRule.currency')}
          >
            {currencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={openAdd}>
            <Plus size={16} />
            {t('savings.add')}
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <EmptyState message={t('savings.noGoals')} icon={<Target size={48} className="text-muted" strokeWidth={1.5} />} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const progress = calculateSavingsProgress(goal.currentAmount, goal.targetAmount);
            const remaining = calculateRemainingAmount(goal.currentAmount, goal.targetAmount);
            const monthsRemaining = calculateMonthsRemaining(remaining, goal.monthlyContribution);
            const expectedDate = calculateExpectedDate(monthsRemaining);
            const isCompleted = goal.currentAmount >= goal.targetAmount && goal.targetAmount > 0;

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{goal.name}</CardTitle>
                      {isCompleted && (
                        <Badge variant="success" className="mt-1">
                          <CheckCircle size={12} />
                          {t('savings.completed')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(goal)}
                        className="p-1.5 text-muted hover:text-fg rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={t('common.edit')}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(goal.id)}
                        className="p-1.5 text-muted hover:text-danger rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={t('common.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ProgressBar value={progress} showValue variant={isCompleted ? 'success' : 'primary'} />
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">{t('savings.targetAmount')}</span>
                      <span className="text-fg font-medium">{formatCurrency(goal.targetAmount, currency, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{t('savings.currentAmount')}</span>
                      <span className="text-fg font-medium">{formatCurrency(goal.currentAmount, currency, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{t('savings.remaining')}</span>
                      <span className="text-fg font-medium">{formatCurrency(remaining, currency, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{t('savings.monthlyContribution')}</span>
                      <span className="text-fg font-medium">{formatCurrency(goal.monthlyContribution, currency, language)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">{t('savings.monthsRemaining')}</span>
                      <span className="text-fg font-medium">
                        {goal.monthlyContribution > 0
                          ? (monthsRemaining ?? t('savings.noMonths'))
                          : t('savings.setContribution')}
                      </span>
                    </div>
                    {expectedDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted">{t('savings.expectedDate')}</span>
                        <span className="text-fg font-medium flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(expectedDate).toLocaleDateString(language === 'ar' ? 'ar' : 'en')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingGoal ? t('savings.edit') : t('savings.add')}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={t('savings.name')}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label={t('savings.targetAmount')}
            type="text"
            inputMode="numeric"
            value={targetStr}
            onChange={(e) => setTargetStr(e.target.value)}
            error={errors.amounts}
            placeholder="0"
          />
          <Input
            label={t('savings.currentAmount')}
            type="text"
            inputMode="numeric"
            value={currentStr}
            onChange={(e) => setCurrentStr(e.target.value)}
            placeholder="0"
          />
          <Input
            label={t('savings.monthlyContribution')}
            type="text"
            inputMode="numeric"
            value={monthlyStr}
            onChange={(e) => setMonthlyStr(e.target.value)}
            placeholder="0"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {editingGoal ? t('savings.update') : t('savings.create')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        title={t('common.delete')}
        message={t('savings.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
