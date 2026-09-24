import { useState, useRef, useEffect, useMemo, type FormEvent } from 'react';
import { Bot, Send, Trash2, User, Info } from 'lucide-react';
import clsx from 'clsx';
import { useI18n } from '@/i18n/useI18n';
import { chatbotRules } from '@/services/dataLoaders';
import { findChatbotAnswer, getSuggestedQuestions } from '@/utils/chatbot';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/config';
import { generateId } from '@/utils/text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ChatMessage, LocalizedText } from '@/types';

const MAX_INPUT_LENGTH = 300;
const MAX_STORED_MESSAGES = 100;
const SUGGESTION_COUNT = 4;

function formatTime(iso: string, language: 'ar' | 'en'): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(language === 'ar' ? 'ar-u-nu-latn' : 'en', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ChatbotPage() {
  const { t, language } = useI18n();
  const [storedMessages, setStoredMessages] = useLocalStorage<ChatMessage[]>(STORAGE_KEYS.chatbotHistory, []);
  const messages = Array.isArray(storedMessages) ? storedMessages : [];

  const initialSuggestions = useMemo(() => getSuggestedQuestions(chatbotRules, SUGGESTION_COUNT), []);
  const [suggestions, setSuggestions] = useState<LocalizedText[]>(initialSuggestions);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages.length]);

  function ask(rawText: string) {
    const text = rawText.trim().slice(0, MAX_INPUT_LENGTH);
    if (!text) return;

    const match = findChatbotAnswer(text, chatbotRules);
    const now = new Date().toISOString();
    const userMessage: ChatMessage = { id: generateId(), role: 'user', text, timestamp: now };
    const botMessage: ChatMessage = {
      id: generateId(),
      role: 'bot',
      text: match ? match.rule.answer[language] : t('chatbot.fallback'),
      timestamp: now,
    };

    setStoredMessages([...messages, userMessage, botMessage].slice(-MAX_STORED_MESSAGES));
    setSuggestions(match ? match.rule.relatedQuestions : initialSuggestions);
    setInput('');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input);
  }

  function handleClear() {
    setStoredMessages([]);
    setSuggestions(initialSuggestions);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Bot size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('chatbot.title')}</h1>
          <p className="text-muted text-sm">{t('chatbot.subtitle')}</p>
        </div>
      </div>

      {chatbotRules.length === 0 ? (
        <EmptyState message={t('empty.chatbot')} icon={<Bot size={48} className="text-muted" strokeWidth={1.5} />} />
      ) : (
        <div className="bg-surface border border-border-custom rounded-xl flex flex-col h-[calc(100vh-15rem)] min-h-[440px]">
          <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border-custom">
            <p className="flex items-center gap-2 text-xs text-muted">
              <Info size={14} className="shrink-0" />
              <span>{t('chatbot.localNote')}</span>
            </p>
            <Button variant="ghost" size="sm" onClick={handleClear} disabled={messages.length === 0}>
              <Trash2 size={14} />
              {t('chatbot.clear')}
            </Button>
          </div>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label={t('chatbot.title')}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
          >
            <ChatBubble role="bot" text={t('chatbot.welcome')} label={t('chatbot.title')} />
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                role={message.role}
                text={message.text}
                label={message.role === 'user' ? t('chatbot.you') : t('chatbot.title')}
                time={formatTime(message.timestamp, language)}
              />
            ))}
          </div>

          {suggestions.length > 0 && (
            <div className="px-4 pb-3">
              <p className="text-xs font-semibold text-muted mb-2">{t('chatbot.suggested')}</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((question) => (
                  <button
                    key={question.en}
                    onClick={() => ask(question[language])}
                    className="px-3 py-1.5 rounded-xl text-sm text-start border bg-surface text-muted border-border-custom hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {question[language]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border-custom">
            <div className="flex-1">
              <Input
                type="text"
                name="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.placeholder')}
                aria-label={t('chatbot.inputLabel')}
                maxLength={MAX_INPUT_LENGTH}
                autoComplete="off"
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={!input.trim()} aria-label={t('chatbot.send')}>
              <Send size={16} className="rtl:-scale-x-100" />
              <span className="hidden sm:inline">{t('chatbot.send')}</span>
            </Button>
          </form>

          <p className="px-4 pb-3 text-xs text-muted">{t('chatbot.disclaimer')}</p>
        </div>
      )}
    </div>
  );
}

type ChatBubbleProps = {
  role: ChatMessage['role'];
  text: string;
  label: string;
  time?: string;
};

function ChatBubble({ role, text, label, time }: ChatBubbleProps) {
  const isUser = role === 'user';
  const Icon = isUser ? User : Bot;

  return (
    <div className={clsx('flex items-end gap-2', isUser && 'justify-end')}>
      {!isUser && (
        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0" aria-hidden="true">
          <Icon size={16} />
        </span>
      )}
      <div
        className={clsx(
          'max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-2.5 text-sm',
          isUser ? 'bg-primary text-primary-fg' : 'bg-bg text-fg border border-border-custom'
        )}
      >
        <p className="sr-only">{label}</p>
        <p className="whitespace-pre-line leading-relaxed">{text}</p>
        {time && <p className={clsx('text-[11px] mt-1', isUser ? 'opacity-80' : 'text-muted')}>{time}</p>}
      </div>
      {isUser && (
        <span className="w-8 h-8 rounded-full bg-bg border border-border-custom text-muted flex items-center justify-center shrink-0" aria-hidden="true">
          <Icon size={16} />
        </span>
      )}
    </div>
  );
}
