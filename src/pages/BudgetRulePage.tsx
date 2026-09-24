import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CURRENCIES, type CurrencyCode } from '@/config';
import { calculateBudgetDistribution, formatCurrency, isValidAmount, safeNumber } from '@/utils/finance';

export function BudgetRulePage() {
  const { t, language } = useI18n();
  const [incomeStr, setIncomeStr] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [actualNeedsStr, setActualNeedsStr] = useState('');
  const [actualWantsStr, setActualWantsStr] = useState('');
  const [actualSavingsStr, setActualSavingsStr] = useState('');

  const incomeValid = isValidAmount(incomeStr);
  const income = incomeValid ? Number(incomeStr) : 0;
  const distribution = useMemo(() => calculateBudgetDistribution(income), [income]);

  const actualNeeds = isValidAmount(actualNeedsStr) ? Number(actualNeedsStr) : 0;
  const actualWants = isValidAmount(actualWantsStr) ? Number(actualWantsStr) : 0;
  const actualSavings = isValidAmount(actualSavingsStr) ? Number(actualSavingsStr) : 0;

  const pieData = useMemo(() => [
    { name: t('budgetRule.needs'), value: distribution.needs, color: 'var(--primary)' },
    { name: t('budgetRule.wants'), value: distribution.wants, color: 'var(--warning)' },
    { name: t('budgetRule.savings'), value: distribution.savings, color: 'var(--success)' },
  ], [distribution, t]);

  const comparisonData = useMemo(() => [
    {
      name: t('budgetRule.needs'),
      ideal: safeNumber(distribution.needs),
      actual: actualNeeds,
    },
    {
      name: t('budgetRule.wants'),
      ideal: safeNumber(distribution.wants),
      actual: actualWants,
    },
    {
      name: t('budgetRule.savings'),
      ideal: safeNumber(distribution.savings),
      actual: actualSavings,
    },
  ], [distribution, actualNeeds, actualWants, actualSavings, t]);

  const currencyOptions = Object.values(CURRENCIES).map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol})`,
  }));

  const incomeError = incomeStr && !incomeValid ? t('budgetRule.invalidAmount') : undefined;

  function getComparison(ideal: number, actual: number) {
    const diff = actual - ideal;
    const percentDiff = ideal > 0 ? (diff / ideal) * 100 : 0;
    const isOver = diff > 0;
    const isOnTrack = diff === 0;
    return { diff: Math.abs(diff), percentDiff: Math.abs(percentDiff), isOver, isOnTrack };
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calculator size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('budgetRule.title')}</h1>
          <p className="text-muted text-sm">{t('budgetRule.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('budgetRule.income')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Select
              label={t('budgetRule.currency')}
              options={currencyOptions}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            />
            <Input
              label={t('budgetRule.income')}
              type="text"
              inputMode="numeric"
              value={incomeStr}
              onChange={(e) => setIncomeStr(e.target.value)}
              error={incomeError}
              placeholder="0"
              aria-describedby="income-help"
            />
            {!incomeStr && (
              <p id="income-help" className="text-xs text-muted">{t('budgetRule.enterIncome')}</p>
            )}
          </CardContent>
        </Card>

        {incomeValid && income > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('budgetRule.distribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div dir="ltr" className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(entry) => entry.name}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-fg">{t('budgetRule.needs')}</span>
                  <span className="font-semibold text-fg">{formatCurrency(distribution.needs, currency, language)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fg">{t('budgetRule.wants')}</span>
                  <span className="font-semibold text-fg">{formatCurrency(distribution.wants, currency, language)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-fg">{t('budgetRule.savings')}</span>
                  <span className="font-semibold text-fg">{formatCurrency(distribution.savings, currency, language)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {incomeValid && income > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('budgetRule.actual')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={t('budgetRule.actualNeeds')}
                type="text"
                inputMode="numeric"
                value={actualNeedsStr}
                onChange={(e) => setActualNeedsStr(e.target.value)}
                placeholder="0"
              />
              <Input
                label={t('budgetRule.actualWants')}
                type="text"
                inputMode="numeric"
                value={actualWantsStr}
                onChange={(e) => setActualWantsStr(e.target.value)}
                placeholder="0"
              />
              <Input
                label={t('budgetRule.actualSavings')}
                type="text"
                inputMode="numeric"
                value={actualSavingsStr}
                onChange={(e) => setActualSavingsStr(e.target.value)}
                placeholder="0"
              />
            </div>

            {(actualNeeds > 0 || actualWants > 0 || actualSavings > 0) && (
              <>
                <div dir="ltr" className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted)" />
                      <YAxis stroke="var(--muted)" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="ideal" name="Ideal" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" name="Actual" fill="var(--warning)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-3">
                  {[t('budgetRule.needs'), t('budgetRule.wants'), t('budgetRule.savings')].map((label, i) => {
                    const ideal = [distribution.needs, distribution.wants, distribution.savings][i];
                    const actual = [actualNeeds, actualWants, actualSavings][i];
                    const comp = getComparison(ideal, actual);
                    return (
                      <div key={i} className="flex items-center justify-between p-3 bg-bg rounded-xl border border-border-custom">
                        <span className="text-sm font-medium text-fg">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted">
                            {t('budgetRule.difference')}: {formatCurrency(comp.diff, currency, language)}
                          </span>
                          {comp.isOnTrack ? (
                            <Minus size={16} className="text-muted" />
                          ) : comp.isOver ? (
                            <TrendingUp size={16} className="text-danger" />
                          ) : (
                            <TrendingDown size={16} className="text-success" />
                          )}
                          <span className={`text-xs font-medium ${
                            comp.isOnTrack ? 'text-muted' : comp.isOver ? 'text-danger' : 'text-success'
                          }`}>
                            {comp.isOnTrack
                              ? t('budgetRule.onTrack')
                              : comp.isOver
                              ? t('budgetRule.over')
                              : t('budgetRule.under')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
