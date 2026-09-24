import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Scale, Calculator, Target, Receipt, Brain,
  AlertTriangle, Image, Lightbulb, Calendar, Eye, RotateCcw,
  TrendingUp, Award, ArrowRight,
} from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useVisitCounter } from '@/hooks/useVisitCounter';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { useExpenses } from '@/hooks/useExpenses';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOnboarding, OnboardingTour } from '@/components/common/OnboardingTour';
import { lessons, tips, getDailyTip, badgeDefinitions } from '@/services/dataLoaders';
import { useBadges } from '@/hooks/useBadges';
import { STORAGE_KEYS, CURRENCIES, type CurrencyCode } from '@/config';
import { getItem } from '@/services/storage';
import {
  calculateSavingsProgress,
  calculateExpenseTotal,
  formatCurrency,
} from '@/utils/finance';

const moduleLinks = [
  { path: '/budgeting', icon: BookOpen, labelKey: 'nav.budgeting' as const },
  { path: '/needs-wants', icon: Scale, labelKey: 'nav.needs-wants' as const },
  { path: '/money-mistakes', icon: AlertTriangle, labelKey: 'nav.money-mistakes' as const },
  { path: '/gallery', icon: Image, labelKey: 'nav.gallery' as const },
  { path: '/budget-rule', icon: Calculator, labelKey: 'nav.budget-rule' as const },
  { path: '/savings-goals', icon: Target, labelKey: 'nav.savings-goals' as const },
  { path: '/expenses', icon: Receipt, labelKey: 'nav.expenses' as const },
  { path: '/quiz', icon: Brain, labelKey: 'nav.quiz' as const },
];

export function HomePage() {
  const { t, language } = useI18n();
  const { visitCount } = useVisitCounter();
  const { goals } = useSavingsGoals();
  const { expenses } = useExpenses();
  const { earnedBadges } = useBadges();
  const [monthlyIncomeStr] = useLocalStorage<string>(STORAGE_KEYS.monthlyIncome, '');
  const { showOnboarding, completeOnboarding, restartOnboarding } = useOnboarding();
  const [currency] = useState<CurrencyCode>('USD');

  const dailyTip = useMemo(() => getDailyTip(tips), [tips]);
  const completedLessons = getItem<string[]>(STORAGE_KEYS.lessonProgress, []);
  const lessonProgress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  const totalExpenses = calculateExpenseTotal(expenses);
  const monthlyIncome = monthlyIncomeStr && !isNaN(Number(monthlyIncomeStr)) ? Number(monthlyIncomeStr) : 0;
  const currencySymbol = CURRENCIES[currency].symbol;

  const currentDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-u-nu-latn' : 'en', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto">
      {showOnboarding && <OnboardingTour onComplete={completeOnboarding} />}

      {/* Hero */}
      <Card className="mb-6 bg-surface">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-fg mb-1">{t('home.welcome')}</h1>
            <p className="text-muted text-sm">{t('home.subtitle')}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-muted text-sm">
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted text-sm">
              <Eye size={16} />
              <span>{t('home.visitCount')}: {visitCount}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-fg mb-3">{t('home.quickActions')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moduleLinks.slice(0, 4).map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.path} to={mod.path}>
                <Card hoverable className="flex flex-col items-center gap-2 py-4 cursor-pointer h-full">
                  <Icon size={28} className="text-primary" />
                  <span className="text-xs font-medium text-fg text-center">{t(mod.labelKey)}</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                {t('home.learningProgress')}
              </CardTitle>
              {showOnboarding === false && (
                <button onClick={restartOnboarding} className="text-muted hover:text-fg p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Restart onboarding">
                  <RotateCcw size={14} />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <EmptyState message={t('empty.lessons')} />
            ) : (
              <ProgressBar value={lessonProgress} showValue label={`${completedLessons.length}/${lessons.length}`} variant="primary" />
            )}
          </CardContent>
        </Card>

        {/* Budget Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt size={20} className="text-primary" />
              {t('home.budgetSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <EmptyState message={t('home.noExpenses')} />
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">{t('expense.total')}</span>
                  <span className="font-semibold text-fg">{formatCurrency(totalExpenses, currency, language)}</span>
                </div>
                {monthlyIncome > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{t('expense.remainingIncome')}</span>
                    <span className={`font-semibold ${monthlyIncome - totalExpenses >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(monthlyIncome - totalExpenses, currency, language)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              {t('home.savingsProgress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <EmptyState message={t('home.noGoals')} />
            ) : (
              <div className="flex flex-col gap-3">
                {goals.slice(0, 3).map((goal) => {
                  const progress = calculateSavingsProgress(goal.currentAmount, goal.targetAmount);
                  return (
                    <div key={goal.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-fg">{goal.name}</span>
                        <span className="text-muted">{Math.round(progress)}%</span>
                      </div>
                      <ProgressBar value={progress} variant={progress >= 100 ? 'success' : 'primary'} />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Tip */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb size={20} className="text-tip" />
              {t('home.dailyTip')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyTip ? (
              <div>
                <p className="text-sm font-medium text-fg mb-1">{dailyTip.title[language]}</p>
                <p className="text-sm text-muted">{dailyTip.content[language]}</p>
                <Badge variant="warning" className="mt-2">{dailyTip.category[language]}</Badge>
              </div>
            ) : (
              <EmptyState message={t('home.noTip')} icon={<Lightbulb size={48} className="text-muted" strokeWidth={1.5} />} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award size={20} className="text-primary" />
              {t('badges.earned')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((badgeId) => {
                const badge = badgeDefinitions.find((b) => b.id === badgeId);
                if (!badge) return null;
                return (
                  <Badge key={badgeId} variant="success">
                    <Award size={12} />
                    {badge.name[language]}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Modules */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-fg mb-3">{t('home.modules')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {moduleLinks.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.path} to={mod.path}>
                <Card hoverable className="flex items-center gap-3 py-4 cursor-pointer h-full">
                  <Icon size={24} className="text-primary shrink-0" />
                  <span className="text-sm font-medium text-fg">{t(mod.labelKey)}</span>
                  <ArrowRight size={16} className="text-muted ms-auto rtl:rotate-180" />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
