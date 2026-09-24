import { useState, useEffect } from 'react';
import { Star, Trash2, Download } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem, removeItem } from '@/services/storage';
import { generateId } from '@/utils/text';
import { downloadFile } from '@/utils/validation';
import type { Feedback } from '@/types';
import clsx from 'clsx';

export function FeedbackPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [clearAll, setClearAll] = useState(false);

  useEffect(() => {
    const stored = getItem<Feedback[]>(STORAGE_KEYS.feedback, []);
    if (Array.isArray(stored)) setFeedbackList(stored);
  }, []);

  function persist(items: Feedback[]) {
    setFeedbackList(items);
    setItem(STORAGE_KEYS.feedback, items);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: Feedback = {
      id: generateId(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };
    persist([entry, ...feedbackList]);
    setComment('');
    setRating(5);
    showToast(t('feedback.thankYou'), 'success');
  }

  function handleDelete(id: string) {
    persist(feedbackList.filter((f) => f.id !== id));
    setDeleteId(null);
  }

  function handleClearAll() {
    persist([]);
    removeItem(STORAGE_KEYS.feedback);
    setClearAll(false);
  }

  function handleExport() {
    downloadFile(
      JSON.stringify(feedbackList, null, 2),
      'budgetbasics-feedback.json',
      'application/json'
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-fg mb-2">{t('feedback.title')}</h1>
      <p className="text-muted text-sm mb-6">{t('feedback.subtitle')}</p>

      <Card className="mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-fg mb-2 block">
              {t('feedback.rating')}
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                  aria-label={`${star} stars`}
                  aria-pressed={rating === star}
                >
                  <Star
                    size={28}
                    className={clsx(
                      'transition-colors',
                      star <= rating ? 'fill-tip text-tip' : 'text-muted'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comment" className="text-sm font-medium text-fg">
              {t('feedback.comment')}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('feedback.commentPlaceholder')}
              rows={4}
              aria-describedby="comment-hint"
              className="px-3 py-2 rounded-xl border border-border-custom bg-surface text-fg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary motion-reduce:transition-none"
            />
            <p id="comment-hint" className="text-xs text-muted">{t('common.sensitiveWarning')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary">{t('feedback.submit')}</Button>
          </div>
          <p className="text-xs text-muted">{t('feedback.note')}</p>
        </form>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-fg">{t('feedback.title')}</h2>
        {feedbackList.length > 0 && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download size={16} />
              {t('feedback.export')}
            </Button>
            <Button variant="danger" size="sm" onClick={() => setClearAll(true)}>
              <Trash2 size={16} />
              {t('feedback.clear')}
            </Button>
          </div>
        )}
      </div>

      {feedbackList.length === 0 ? (
        <EmptyState message={t('feedback.noFeedback')} />
      ) : (
        <div className="flex flex-col gap-3">
          {feedbackList.map((f) => (
            <Card key={f.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={s <= f.rating ? 'fill-tip text-tip' : 'text-muted'}
                      />
                    ))}
                  </div>
                  {f.comment && <p className="text-sm text-fg">{f.comment}</p>}
                  <p className="text-xs text-muted mt-2">
                    {new Date(f.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteId(f.id)}
                  className="p-1 text-muted hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                  aria-label={t('common.delete')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title={t('common.delete')}
        message={t('feedback.deleteConfirm')}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
      <ConfirmDialog
        open={clearAll}
        title={t('feedback.clear')}
        message={t('feedback.deleteConfirm')}
        onConfirm={handleClearAll}
        onCancel={() => setClearAll(false)}
      />
    </div>
  );
}
