import { Routes, Route } from 'react-router-dom';
import { useI18n } from '@/i18n/useI18n';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { BudgetingBasicsPage } from '@/pages/BudgetingBasicsPage';
import { NeedsVsWantsPage } from '@/pages/NeedsVsWantsPage';
import { BudgetRulePage } from '@/pages/BudgetRulePage';
import { SavingsGoalsPage } from '@/pages/SavingsGoalsPage';
import { ExpensePlannerPage } from '@/pages/ExpensePlannerPage';
import { MoneyMistakesPage } from '@/pages/MoneyMistakesPage';
import { QuizChallengePage } from '@/pages/QuizChallengePage';
import { LearningGalleryPage } from '@/pages/LearningGalleryPage';
import { AboutPage } from '@/pages/AboutPage';
import { FeedbackPage } from '@/pages/FeedbackPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRouter() {
  const { t } = useI18n();
  return (
    <Layout>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-[100] focus:bg-surface focus:text-fg focus:px-4 focus:py-2 focus:rounded-xl focus:border focus:border-border-custom"
      >
        {t('a11y.skipToContent')}
      </a>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/budgeting" element={<BudgetingBasicsPage />} />
        <Route path="/needs-wants" element={<NeedsVsWantsPage />} />
        <Route path="/budget-rule" element={<BudgetRulePage />} />
        <Route path="/savings-goals" element={<SavingsGoalsPage />} />
        <Route path="/expenses" element={<ExpensePlannerPage />} />
        <Route path="/money-mistakes" element={<MoneyMistakesPage />} />
        <Route path="/quiz" element={<QuizChallengePage />} />
        <Route path="/gallery" element={<LearningGalleryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
