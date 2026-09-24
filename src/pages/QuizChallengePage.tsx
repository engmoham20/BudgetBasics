import { useState, useEffect, useMemo } from 'react';
import { Brain, Check, X, RotateCcw, Trophy } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { quizzes } from '@/services/dataLoaders';
import { useBadges } from '@/hooks/useBadges';
import { useToast } from '@/components/ui/Toast';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';

type QuizState = 'select' | 'playing' | 'finished';

export function QuizChallengePage() {
  const { t, language } = useI18n();
  const { awardBadge } = useBadges();
  const { showToast } = useToast();
  const [quizId, setQuizId] = useState<string>('');
  const [state, setState] = useState<QuizState>('select');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = getItem<Record<string, number>>(STORAGE_KEYS.quizBestScores, {});
    if (stored && typeof stored === 'object') setBestScores(stored);
  }, []);

  const activeQuiz = useMemo(() => quizzes.find((q) => q.id === quizId) || null, [quizzes, quizId]);

  function startQuiz() {
    if (!activeQuiz) return;
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
    setState('playing');
  }

  function selectAnswer(index: number) {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    const correct = index === activeQuiz?.questions[currentQ].correctIndex;
    if (correct) {
      setScore((s) => s + 1);
    }
  }

  function nextQuestion() {
    if (!activeQuiz) return;
    setSelected(null);
    setShowFeedback(false);
    if (currentQ + 1 >= activeQuiz.questions.length) {
      const finalScore = score;
      setState('finished');
      awardBadge('first-quiz');
      if (finalScore === activeQuiz.questions.length) {
        awardBadge('perfect-score');
        showToast(t('quiz.perfectScore'), 'success');
      }
      const prevBest = bestScores[quizId] || 0;
      if (finalScore > prevBest) {
        const updated = { ...bestScores, [quizId]: finalScore };
        setBestScores(updated);
        setItem(STORAGE_KEYS.quizBestScores, updated);
      }
    } else {
      setCurrentQ((q) => q + 1);
    }
  }

  function restart() {
    setState('select');
    setQuizId('');
    setSelected(null);
    setShowFeedback(false);
  }

  if (quizzes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Brain size={28} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-fg">{t('quiz.title')}</h1>
            <p className="text-muted text-sm">{t('quiz.subtitle')}</p>
          </div>
        </div>
        <EmptyState message={t('empty.quizzes')} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Brain size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('quiz.title')}</h1>
          <p className="text-muted text-sm">{t('quiz.subtitle')}</p>
        </div>
      </div>

      {state === 'select' && (
        <Card>
          <CardContent className="flex flex-col gap-4">
            <Select
              label={t('quiz.selectQuiz')}
              options={quizzes.map((q) => ({ value: q.id, label: q.title[language] }))}
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
            />
            {quizId && bestScores[quizId] !== undefined && (
              <Badge variant="primary">
                <Trophy size={12} />
                {t('quiz.bestScore')}: {bestScores[quizId]}/{quizzes.find((q) => q.id === quizId)?.questions.length}
              </Badge>
            )}
            <Button variant="primary" onClick={startQuiz} disabled={!quizId}>
              {t('quiz.start')}
            </Button>
          </CardContent>
        </Card>
      )}

      {state === 'playing' && activeQuiz && (
        <Card>
          <div className="mb-4">
            <ProgressBar
              value={currentQ}
              max={activeQuiz.questions.length}
              label={`${t('quiz.question')} ${currentQ + 1} ${t('quiz.of')} ${activeQuiz.questions.length}`}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="primary">{t('quiz.score')}: {score}</Badge>
          </div>

          <div className="py-4">
            <h2 className="text-lg font-semibold text-fg mb-6">
              {activeQuiz.questions[currentQ].question[language]}
            </h2>
            <div className="flex flex-col gap-2">
              {activeQuiz.questions[currentQ].options.map((option, i) => {
                const correctIndex = activeQuiz.questions[currentQ].correctIndex;
                const isSelected = selected === i;
                const isCorrect = i === correctIndex;
                let className = 'border-border-custom hover:bg-bg text-fg';
                if (showFeedback) {
                  if (isCorrect) className = 'border-success bg-success/10 text-success';
                  else if (isSelected) className = 'border-danger bg-danger/10 text-danger';
                  else className = 'border-border-custom text-muted';
                }
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    disabled={showFeedback}
                    className={`flex items-center justify-between p-3 rounded-xl border text-start text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
                  >
                    <span>{option[language]}</span>
                    {showFeedback && isCorrect && <Check size={18} />}
                    {showFeedback && isSelected && !isCorrect && <X size={18} />}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="mt-4 p-4 bg-bg rounded-xl border border-border-custom">
                <p className="text-xs font-semibold text-muted uppercase mb-1">
                  {t('quiz.explanation')}
                </p>
                <p className="text-sm text-fg">
                  {activeQuiz.questions[currentQ].explanation[language]}
                </p>
                <div className="mt-4">
                  <Button variant="primary" onClick={nextQuestion}>
                    {currentQ + 1 >= activeQuiz.questions.length
                      ? t('quiz.finish')
                      : t('quiz.next')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {state === 'finished' && activeQuiz && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Trophy size={48} className="text-tip" />
            <h2 className="text-xl font-bold text-fg">{t('quiz.result')}</h2>
            <p className="text-3xl font-bold text-primary">{score} / {activeQuiz.questions.length}</p>
            {score === activeQuiz.questions.length && (
              <Badge variant="success">{t('quiz.perfectScore')}</Badge>
            )}
            <Button variant="primary" onClick={restart}>
              <RotateCcw size={16} />
              {t('quiz.restart')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
