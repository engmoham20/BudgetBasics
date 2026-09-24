import { describe, it, expect } from 'vitest';
import { normalizeText } from '@/utils/text';

describe('normalizeText', () => {
  it('lowercases English text', () => {
    expect(normalizeText('Hello World')).toBe('hello world');
  });

  it('removes Arabic diacritics', () => {
    expect(normalizeText('مَرْحَباً')).toBe('مرحبا');
  });

  it('removes tatweel', () => {
    expect(normalizeText('الـــــسلام')).toBe('السلام');
  });

  it('normalizes Arabic Alef variants', () => {
    expect(normalizeText('أحمد')).toBe(normalizeText('احمد'));
    expect(normalizeText('إبراهيم')).toBe(normalizeText('ابراهيم'));
    expect(normalizeText('آمنة')).toBe(normalizeText('امنة'));
  });

  it('normalizes ى to ي', () => {
    expect(normalizeText('علي')).toBe(normalizeText('علي'));
    const normalized = normalizeText('مصطفي');
    expect(normalized).toContain('ي');
  });

  it('normalizes ة to ه', () => {
    const result = normalizeText('مدرسة');
    expect(result).toContain('ه');
    expect(result).not.toContain('ة');
  });

  it('converts Arabic-Indic digits to Western digits', () => {
    expect(normalizeText('١٢٣')).toBe('123');
    expect(normalizeText('٤٥٦')).toBe('456');
  });

  it('removes punctuation', () => {
    expect(normalizeText('hello, world!')).toBe('hello world');
    expect(normalizeText('test... value')).toBe('test value');
  });

  it('normalizes whitespace', () => {
    expect(normalizeText('hello    world')).toBe('hello world');
    expect(normalizeText('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(normalizeText('')).toBe('');
  });

  it('handles mixed Arabic and English', () => {
    const result = normalizeText('Hello مرحبا');
    expect(result).toBe('hello مرحبا');
  });

  it('handles Persian digits', () => {
    expect(normalizeText('۱۲۳')).toBe('123');
  });
});
