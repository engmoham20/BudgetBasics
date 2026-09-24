import { useState, useMemo, useCallback } from 'react';
import { Scale, Check, X, RotateCcw } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { needsWantsItems } from '@/services/dataLoaders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { useBadges } from '@/hooks/useBadges';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';

type GameState = 'idle' | 'playing' | 'finished';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function NeedsVsWantsPage() {
  const { t, language } = useI18n();
  const { awardBadge } = useBadges();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [items, setItems] = useState(shuffleArray(needsWantsItems));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const bestScore = useMemo(() => {
    return getItem<number>(STORAGE_KEYS.needsWantsProgress, 0);
  }, []);

  const startGame = useCallback(() => {
    setItems(shuffleArray(needsWantsItems));
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setShowExplanation(false);
    setGameState('playing');
  }, []);

  const classify = useCallback((choice: 'need' | 'want') => {
    if (gameState !== 'playing') return;
    const currentItem = items[currentIndex];
    if (!currentItem) return;

    if (choice === currentItem.category) {
      setScore((s) => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
    setShowExplanation(true);
  }, [gameState, items, currentIndex]);

  const nextItem = useCallback(() => {
    setFeedback(null);
    setShowExplanation(false);
    if (currentIndex + 1 >= items.length) {
      setGameState('finished');
      const finalScore = score;
      const stored = getItem<number>(STORAGE_KEYS.needsWantsProgress, 0);
      if (finalScore > stored) {
        setItem(STORAGE_KEYS.needsWantsProgress, finalScore);
      }
      awardBadge('needs-wants-completed');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, items.length, score, awardBadge]);

  if (needsWantsItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Scale size={28} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-fg">{t('needsWants.title')}</h1>
            <p className="text-muted text-sm">{t('needsWants.subtitle')}</p>
          </div>
        </div>
        <EmptyState message={t('needsWants.noItems')} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Scale size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('needsWants.title')}</h1>
          <p className="text-muted text-sm">{t('needsWants.subtitle')}</p>
        </div>
      </div>

      {gameState === 'idle' && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <p className="text-sm text-fg text-center max-w-md">{t('needsWants.instructions')}</p>
            {bestScore > 0 && (
              <Badge variant="primary">{t('needsWants.score')}: {bestScore}/{needsWantsItems.length}</Badge>
            )}
            <Button variant="primary" onClick={startGame}>
              {t('needsWants.start')}
            </Button>
          </CardContent>
        </Card>
      )}

      {gameState === 'playing' && items[currentIndex] && (
        <Card>
          <div className="mb-4">
            <ProgressBar
              value={currentIndex}
              max={items.length}
              label={`${t('needsWants.itemsRemaining')}: ${items.length - currentIndex}`}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="primary">{t('needsWants.score')}: {score}</Badge>
            <span className="text-xs text-muted">{currentIndex + 1} / {items.length}</span>
          </div>

          <div className="text-center py-8">
            <p className="text-2xl font-bold text-fg mb-6">{items[currentIndex].name[language]}</p>

            {!showExplanation && (
              <div className="flex justify-center gap-3">
                <Button variant="secondary" size="lg" onClick={() => classify('need')}>
                  {t('needsWants.need')}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => classify('want')}>
                  {t('needsWants.want')}
                </Button>
              </div>
            )}

            {showExplanation && (
              <div className="flex flex-col items-center gap-4">
                <div className={`flex items-center gap-2 ${feedback === 'correct' ? 'text-success' : 'text-danger'}`}>
                  {feedback === 'correct' ? <Check size={24} /> : <X size={24} />}
                  <span className="text-lg font-semibold">
                    {feedback === 'correct' ? t('needsWants.correct') : t('needsWants.incorrect')}
                  </span>
                </div>
                <div className="p-4 bg-bg rounded-xl border border-border-custom max-w-md">
                  <p className="text-xs font-semibold text-muted uppercase mb-1">
                    {t('needsWants.explanation')}
                  </p>
                  <p className="text-sm text-fg">{items[currentIndex].explanation[language]}</p>
                </div>
                <Button variant="primary" onClick={nextItem}>
                  {currentIndex + 1 >= items.length ? t('needsWants.finished') : t('common.next')}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {gameState === 'finished' && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <h2 className="text-xl font-bold text-fg">{t('needsWants.result')}</h2>
            <p className="text-3xl font-bold text-primary">{score} / {items.length}</p>
            {score === items.length && (
              <Badge variant="success">{t('needsWants.correct')}</Badge>
            )}
            <Button variant="primary" onClick={startGame}>
              <RotateCcw size={16} />
              {t('needsWants.restart')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
