export type Language = 'ar' | 'en';

export type LocalizedText = {
  ar: string;
  en: string;
};

export type Lesson = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  content: LocalizedText[];
  table?: {
    headers: LocalizedText[];
    rows: LocalizedText[][];
  };
  example?: LocalizedText;
};

export type NeedsWantItem = {
  id: string;
  name: LocalizedText;
  category: 'need' | 'want';
  explanation: LocalizedText;
};

export type MoneyMistake = {
  id: string;
  scenario: LocalizedText;
  consequence: LocalizedText;
  solution: LocalizedText;
};

export type QuizQuestion = {
  id: string;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
};

export type Quiz = {
  id: string;
  title: LocalizedText;
  questions: QuizQuestion[];
};

export type ChallengeDay = {
  day: number;
  title: LocalizedText;
  description: LocalizedText;
};

export type Challenge = {
  id: string;
  title: LocalizedText;
  days: ChallengeDay[];
};

export type Badge = {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
};

export type Tip = {
  id: string;
  title: LocalizedText;
  content: LocalizedText;
  category: LocalizedText;
};

export type ChatbotRule = {
  id: string;
  keywordsAr: string[];
  keywordsEn: string[];
  answer: LocalizedText;
  relatedQuestions: LocalizedText[];
};

export type GalleryItem = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  topic: LocalizedText;
  assetPath?: string;
  type: 'image' | 'illustration' | 'infographic';
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  classification: 'need' | 'want';
  description: string;
  amount: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  createdAt: string;
};

export type Feedback = {
  id: string;
  rating: number;
  comment: string;
  date: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
};

export type SearchResult = {
  id: string;
  title: LocalizedText;
  type: 'lesson' | 'tip' | 'mistake' | 'tool' | 'gallery';
  description?: LocalizedText;
  route: string;
};
