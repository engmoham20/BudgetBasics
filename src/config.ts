export const APP_CONFIG = {
  appName: 'BudgetBasics',
  contactEmail: 'contact@budgetbasics.app',
  storageVersion: 'v1',
  maxExpenseAmount: 1e9,
  maxSavingsTarget: 1e9,
  maxImportSize: 1024 * 1024,
  maxImportRecords: 5000,
  searchDebounceMs: 200,
  chatbotMinScore: 1,
  challengeDays: 30,
} as const;

export const STORAGE_KEYS = {
  theme: 'bb:v1:theme',
  language: 'bb:v1:language',
  visitCount: 'bb:v1:visit-count',
  onboardingComplete: 'bb:v1:onboarding-complete',
  savingsGoals: 'bb:v1:savings-goals',
  expenses: 'bb:v1:expenses',
  monthlyIncome: 'bb:v1:monthly-income',
  quizBestScores: 'bb:v1:quiz-best-scores',
  badges: 'bb:v1:badges',
  challengeProgress: 'bb:v1:challenge-progress',
  lessonProgress: 'bb:v1:lesson-progress',
  needsWantsProgress: 'bb:v1:needs-wants-progress',
  chatbotHistory: 'bb:v1:chatbot-history',
  feedback: 'bb:v1:feedback',
} as const;

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', decimalPlaces: 2 },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', decimalPlaces: 2 },
  SAR: { code: 'SAR', symbol: 'ر.س', label: 'Saudi Riyal', decimalPlaces: 2 },
  YER: { code: 'YER', symbol: '﷼', label: 'Yemeni Rial', decimalPlaces: 0 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
