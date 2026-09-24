import {
  Home, BookOpen, Scale, Calculator, Target, Receipt,
  AlertTriangle, Brain, Image, Info, MessageSquare, Mail,
  type LucideIcon
} from 'lucide-react';
import type { TranslationKey } from '@/i18n/useI18n';

export type NavItem = {
  path: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  group: 'learning' | 'tools' | 'support';
};

export const NAV_ITEMS: NavItem[] = [
  { path: '/', labelKey: 'nav.home', icon: Home, group: 'learning' },
  { path: '/budgeting', labelKey: 'nav.budgeting', icon: BookOpen, group: 'learning' },
  { path: '/needs-wants', labelKey: 'nav.needs-wants', icon: Scale, group: 'learning' },
  { path: '/money-mistakes', labelKey: 'nav.money-mistakes', icon: AlertTriangle, group: 'learning' },
  { path: '/gallery', labelKey: 'nav.gallery', icon: Image, group: 'learning' },
  { path: '/budget-rule', labelKey: 'nav.budget-rule', icon: Calculator, group: 'tools' },
  { path: '/savings-goals', labelKey: 'nav.savings-goals', icon: Target, group: 'tools' },
  { path: '/expenses', labelKey: 'nav.expenses', icon: Receipt, group: 'tools' },
  { path: '/quiz', labelKey: 'nav.quiz', icon: Brain, group: 'tools' },
  { path: '/about', labelKey: 'nav.about', icon: Info, group: 'support' },
  { path: '/feedback', labelKey: 'nav.feedback', icon: MessageSquare, group: 'support' },
  { path: '/contact', labelKey: 'nav.contact', icon: Mail, group: 'support' },
];
