import { describe, it, expect } from 'vitest';
import chatbotData from '@/data/chatbot.json';
import tipsData from '@/data/tips.json';
import galleryData from '@/data/gallery.json';
import type { ChatbotRule, Tip, GalleryItem, LocalizedText } from '@/types';
import { findChatbotAnswer, getSuggestedQuestions } from '@/utils/chatbot';

const rules = chatbotData as ChatbotRule[];
const tips = tipsData as Tip[];
const gallery = galleryData as GalleryItem[];

function isFilled(text: LocalizedText | undefined): boolean {
  return !!text && text.ar.trim().length > 0 && text.en.trim().length > 0;
}

describe('chatbot.json', () => {
  it('has exactly 40 rules with unique ids', () => {
    expect(rules).toHaveLength(40);
    expect(new Set(rules.map((r) => r.id)).size).toBe(40);
  });

  it('has complete bilingual answers, keywords and related questions', () => {
    for (const rule of rules) {
      expect(isFilled(rule.answer)).toBe(true);
      expect(rule.keywordsAr.length).toBeGreaterThan(0);
      expect(rule.keywordsEn.length).toBeGreaterThan(0);
      expect(rule.relatedQuestions.length).toBeGreaterThanOrEqual(2);
      rule.relatedQuestions.forEach((q) => expect(isFilled(q)).toBe(true));
    }
  });

  it('answers every suggested question with a rule', () => {
    const questions = new Map<string, LocalizedText>();
    rules.forEach((r) => r.relatedQuestions.forEach((q) => questions.set(q.en, q)));
    expect(questions.size).toBe(40);
    for (const q of questions.values()) {
      expect(findChatbotAnswer(q.ar, rules)).not.toBeNull();
      expect(findChatbotAnswer(q.en, rules)).not.toBeNull();
    }
  });

  it('matches natural questions in Arabic and English', () => {
    expect(findChatbotAnswer('اشرح لي قاعدة 50/30/20', rules)?.rule.id).toBe('kb-10');
    expect(findChatbotAnswer('explain the 50-30-20 rule', rules)?.rule.id).toBe('kb-10');
    expect(findChatbotAnswer('ما هو صندوق الطوارئ', rules)?.rule.id).toBe('kb-18');
    expect(findChatbotAnswer('how to stop impulse buying', rules)?.rule.id).toBe('kb-27');
    expect(findChatbotAnswer('صرفت أكثر من ميزانيتي', rules)?.rule.id).toBe('kb-33');
  });

  it('returns null for unrelated or empty input', () => {
    expect(findChatbotAnswer('', rules)).toBeNull();
    expect(findChatbotAnswer('tell me a joke', rules)).toBeNull();
    expect(findChatbotAnswer('ما هو الطقس اليوم', rules)).toBeNull();
  });

  it('returns a bounded list of suggested questions', () => {
    expect(getSuggestedQuestions(rules, 4)).toHaveLength(4);
    expect(getSuggestedQuestions([], 4)).toHaveLength(0);
  });
});

describe('tips.json', () => {
  it('has exactly 60 tips with unique ids and titles', () => {
    expect(tips).toHaveLength(60);
    expect(new Set(tips.map((t) => t.id)).size).toBe(60);
    expect(new Set(tips.map((t) => t.title.en)).size).toBe(60);
    expect(new Set(tips.map((t) => t.title.ar)).size).toBe(60);
  });

  it('has complete bilingual fields', () => {
    for (const tip of tips) {
      expect(isFilled(tip.title)).toBe(true);
      expect(isFilled(tip.content)).toBe(true);
      expect(isFilled(tip.category)).toBe(true);
    }
  });
});

describe('gallery.json', () => {
  it('has exactly 10 items with unique ids', () => {
    expect(gallery).toHaveLength(10);
    expect(new Set(gallery.map((g) => g.id)).size).toBe(10);
  });

  it('is metadata only, with complete fields and no asset paths', () => {
    const allowedTypes = ['image', 'illustration', 'infographic'];
    for (const item of gallery) {
      expect(isFilled(item.title)).toBe(true);
      expect(isFilled(item.description)).toBe(true);
      expect(isFilled(item.topic)).toBe(true);
      expect(allowedTypes).toContain(item.type);
      expect(item.assetPath).toBeUndefined();
    }
  });
});
