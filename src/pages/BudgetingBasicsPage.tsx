import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { lessons } from '@/services/dataLoaders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { STORAGE_KEYS } from '@/config';
import { getItem, setItem } from '@/services/storage';

export function BudgetingBasicsPage() {
  const { t, language } = useI18n();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  useEffect(() => {
    const stored = getItem<string[]>(STORAGE_KEYS.lessonProgress, []);
    if (Array.isArray(stored)) setCompletedLessons(stored);
  }, []);

  function toggleComplete(lessonId: string) {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(updated);
    setItem(STORAGE_KEYS.lessonProgress, updated);
  }

  const progress = lessons.length > 0
    ? (completedLessons.length / lessons.length) * 100
    : 0;

  const active = lessons.find((l) => l.id === activeLesson);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-fg">{t('budgeting.title')}</h1>
          <p className="text-muted text-sm">{t('budgeting.subtitle')}</p>
        </div>
      </div>

      {lessons.length === 0 ? (
        <EmptyState message={t('empty.lessons')} />
      ) : (
        <>
          <div className="mb-6">
            <ProgressBar value={progress} label={t('budgeting.progress')} showValue variant="primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 flex flex-col gap-2">
              {lessons.map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson.id)}
                    className={`text-start p-3 rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      activeLesson === lesson.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border-custom hover:bg-bg'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-fg">{lesson.title[language]}</span>
                      {isCompleted && <CheckCircle size={16} className="text-success shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="md:col-span-2">
              {active ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{active.title[language]}</CardTitle>
                      {completedLessons.includes(active.id) && (
                        <Badge variant="success">
                          <CheckCircle size={12} />
                          {t('budgeting.completed')}
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted text-sm mt-1">{active.summary[language]}</p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {active.content.map((paragraph, i) => (
                      <p key={i} className="text-sm text-fg leading-relaxed">{paragraph[language]}</p>
                    ))}

                    {active.table && (
                      <Table caption={active.title[language]}>
                        <TableHead>
                          <TableRow>
                            {active.table.headers.map((header, i) => (
                              <TableHeader key={i}>{header[language]}</TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {active.table.rows.map((row, i) => (
                            <TableRow key={i}>
                              {row.map((cell, j) => (
                                <TableCell key={j}>{cell[language]}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}

                    {active.example && (
                      <div className="p-4 bg-bg rounded-xl border border-border-custom">
                        <p className="text-xs font-semibold text-muted uppercase mb-1">
                          {t('budgeting.example')}
                        </p>
                        <p className="text-sm text-fg">{active.example[language]}</p>
                      </div>
                    )}

                    <div>
                      <Button
                        variant={completedLessons.includes(active.id) ? 'secondary' : 'success'}
                        onClick={() => toggleComplete(active.id)}
                      >
                        <CheckCircle size={16} />
                        {completedLessons.includes(active.id)
                          ? t('budgeting.completed')
                          : t('budgeting.complete')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen size={48} className="text-muted mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-muted text-sm">{t('budgeting.subtitle')}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
