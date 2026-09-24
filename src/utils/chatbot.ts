import type { ChatbotRule, LocalizedText } from '@/types';
import { normalizeText } from '@/utils/text';
import { APP_CONFIG } from '@/config';

export type ChatbotMatch = {
  rule: ChatbotRule;
  score: number;
};

const ARABIC_CHARS = /[\u0600-\u06FF]/;

/**
 * Removes the Arabic definite article and attached prepositions from the start
 * of each Arabic word (ال، لل، بال، وال، فال، كال) so "للمصاريف" and "المصاريف"
 * both reduce to "مصاريف". Applied to the query and the keywords alike.
 */
function stripArabicPrefixes(text: string): string {
  return text
    .split(' ')
    .map((word) => (ARABIC_CHARS.test(word) ? word.replace(/^(?:وال|فال|بال|كال|لل|ال)(?=.{2,})/, '') : word))
    .join(' ');
}

function prepare(text: string): string {
  return stripArabicPrefixes(normalizeText(text));
}

function countWords(text: string): number {
  return text.split(' ').filter(Boolean).length;
}

/**
 * Arabic keywords match anywhere in the text so that attached prefixes
 * (e.g. "ال", "لل", "بال") do not break a match. Latin keywords match at
 * the start of a word so "expense" also matches "expenses".
 */
function keywordMatches(paddedQuery: string, keyword: string): boolean {
  if (ARABIC_CHARS.test(keyword)) {
    return paddedQuery.includes(keyword);
  }
  return paddedQuery.includes(` ${keyword}`);
}

function scoreRule(normalizedQuery: string, rule: ChatbotRule): { score: number; longest: number } {
  const padded = ` ${normalizedQuery}`;
  let score = 0;
  let longest = 0;
  const seen = new Set<string>();

  for (const raw of [...rule.keywordsAr, ...rule.keywordsEn]) {
    const keyword = prepare(raw);
    if (!keyword || seen.has(keyword)) continue;
    seen.add(keyword);
    if (keywordMatches(padded, keyword)) {
      score += countWords(keyword);
      longest = Math.max(longest, keyword.length);
    }
  }
  return { score, longest };
}

/**
 * Local keyword matching against the chatbot knowledge base.
 * Returns the best rule, or null when nothing reaches the minimum score.
 * A keyword made of several words counts for more than a single word.
 */
export function findChatbotAnswer(query: string, rules: ChatbotRule[]): ChatbotMatch | null {
  const normalizedQuery = prepare(query);
  if (!normalizedQuery) return null;

  let best: { rule: ChatbotRule; score: number; longest: number } | null = null;

  for (const rule of rules) {
    const { score, longest } = scoreRule(normalizedQuery, rule);
    if (score < APP_CONFIG.chatbotMinScore) continue;
    if (!best || score > best.score || (score === best.score && longest > best.longest)) {
      best = { rule, score, longest };
    }
  }

  return best ? { rule: best.rule, score: best.score } : null;
}

/**
 * Picks a small, evenly spread set of suggested questions from the
 * knowledge base (taken from the rules' related questions).
 */
export function getSuggestedQuestions(rules: ChatbotRule[], count: number): LocalizedText[] {
  const pool: LocalizedText[] = [];
  const seen = new Set<string>();
  for (const rule of rules) {
    for (const question of rule.relatedQuestions) {
      if (seen.has(question.en)) continue;
      seen.add(question.en);
      pool.push(question);
    }
  }
  if (pool.length <= count) return pool;

  const step = pool.length / count;
  return Array.from({ length: count }, (_, i) => pool[Math.floor(i * step)]);
}
