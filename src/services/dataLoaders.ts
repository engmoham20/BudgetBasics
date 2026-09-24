import type {
  Lesson, NeedsWantItem, MoneyMistake, Quiz, Challenge,
  Badge, Tip, ChatbotRule, GalleryItem
} from '@/types';
import budgetingData from '@/data/budgeting.json';
import needsWantsData from '@/data/needs-wants.json';
import moneyMistakesData from '@/data/money-mistakes.json';
import quizzesData from '@/data/quizzes.json';
import challengesData from '@/data/challenges.json';
import chatbotData from '@/data/chatbot.json';
import tipsData from '@/data/tips.json';
import galleryData from '@/data/gallery.json';

export const lessons = budgetingData as Lesson[];
export const needsWantsItems = needsWantsData as NeedsWantItem[];
export const moneyMistakes = moneyMistakesData as MoneyMistake[];
export const quizzes = quizzesData as Quiz[];
export const challenge = challengesData as unknown as Challenge;
export const chatbotRules = chatbotData as ChatbotRule[];
export const tips = tipsData as Tip[];
export const galleryItems = galleryData as GalleryItem[];

export const badgeDefinitions: Badge[] = [
  { id: 'first-quiz', name: { ar: 'أول اختبار', en: 'First Quiz' }, description: { ar: 'أكملت أول اختبار', en: 'Completed your first quiz' }, icon: 'Award' },
  { id: 'perfect-score', name: { ar: 'نتيجة مثالية', en: 'Perfect Score' }, description: { ar: 'حققت نتيجة كاملة', en: 'Achieved a perfect score' }, icon: 'Star' },
  { id: 'first-savings-goal', name: { ar: 'أول هدف ادخار', en: 'First Savings Goal' }, description: { ar: 'أنشأت أول هدف ادخار', en: 'Created your first savings goal' }, icon: 'Target' },
  { id: 'goal-completed', name: { ar: 'هدف مكتمل', en: 'Goal Completed' }, description: { ar: 'أكملت هدفاً', en: 'Completed a savings goal' }, icon: 'CheckCircle' },
  { id: 'seven-day-streak', name: { ar: 'سلسلة سبعة أيام', en: 'Seven Day Streak' }, description: { ar: '7 أيام متتالية', en: '7 consecutive days' }, icon: 'Flame' },
  { id: 'challenge-completed', name: { ar: 'تحدي مكتمل', en: 'Challenge Completed' }, description: { ar: 'أكملت التحدي', en: 'Completed the challenge' }, icon: 'Trophy' },
  { id: 'first-expense', name: { ar: 'أول مصروف', en: 'First Expense' }, description: { ar: 'سجلت أول مصروف', en: 'Recorded your first expense' }, icon: 'Receipt' },
  { id: 'needs-wants-completed', name: { ar: 'محترف الاحتياجات والرغبات', en: 'Needs vs Wants Master' }, description: { ar: 'أكملت لعبة الاحتياجات والرغبات', en: 'Completed the needs vs wants game' }, icon: 'Brain' },
];

export function getDailyTip(tipsList: Tip[], dayOffset: number = 0): Tip | null {
  if (!tipsList || tipsList.length === 0) return null;
  const day = new Date().getDate() + dayOffset;
  return tipsList[day % tipsList.length];
}
