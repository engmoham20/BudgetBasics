import { useState, useMemo, useRef } from 'react';
import { Receipt, Plus, Edit2, Trash2, Download, Upload, Printer } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { useExpenses } from '@/hooks/useExpenses';
import { useBadges } from '@/hooks/useBadges';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/Toast';
import { STORAGE_KEYS, CURRENCIES, type CurrencyCode } from '@/config';
import {
  calculateExpenseTotal,
  calculateRemainingIncome,
  formatCurrency,
  isValidAmount,
  safeNumber,
} from '@/utils/finance';
import {
  exportExpensesCSV,
  exportExpensesJSON,
  downloadFile,
  validateExpenseImport,
} from '@/utils/validation';
import { generateId } from '@/utils/text';
import type { Expense } from '@/types';

export function ExpensePlannerPage() {
  const { t, language } = useI18n();
  const { expenses, addExpense, updateExpense, deleteExpense, mergeExpenses, replaceExpenses } = useExpenses();
  const { awardBadge } = useBadges();
  const { showToast } = useToast();
  const [monthlyIncomeStr, setMonthlyIncomeStr] = useLocalStorage<string>(STORAGE_KEYS.monthlyIncome, '');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    category: '',
    classification: 'need' as 'need' | 'want',
    description: '',
    amount: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const currencyOptions = Object.values(CURRENCIES).map((c) => ({
    value: c.code,
    label: `${c.code} (${c.symbol})`,
  }));

  const months = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => {
      const d = e.date.slice(0, 7);
      if (d) set.add(d);
    });
    return Array.from(set).sort().reverse();
  }, [expenses]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => set.add(e.category));
    return Array.from(set);
  }, [expenses]);

  const [filterMonth, setFilterMonth] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filterMonth !== 'all' && !e.date.startsWith(filterMonth)) return false;
      if (filterCategory !== 'all' && e.category !== filterCategory) return false;
      return true;
    });
  }, [expenses, filterMonth, filterCategory]);

  const total = calculateExpenseTotal(filtered);
  const monthlyIncome = isValidAmount(monthlyIncomeStr) ? Number(monthlyIncomeStr) : 0;
  const remaining = calculateRemainingIncome(monthlyIncome, total);

  function openAdd() {
    setEditingId(null);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      category: '',
      classification: 'need',
      description: '',
      amount: '',
    });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditingId(expense.id);
    setForm({
      date: expense.date,
      category: expense.category,
      classification: expense.classification,
      description: expense.description,
      amount: String(expense.amount),
    });
    setFormError(null);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category.trim()) {
      setFormError(t('expense.category'));
      return;
    }
    if (!isValidAmount(form.amount)) {
      setFormError(t('expense.amount'));
      return;
    }

    const data = {
      date: form.date,
      category: form.category.trim(),
      classification: form.classification,
      description: form.description.trim(),
      amount: Number(form.amount),
    };

    if (editingId) {
      updateExpense(editingId, data);
    } else {
      addExpense(data);
      awardBadge('first-expense');
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteId) {
      deleteExpense(deleteId);
      setDeleteId(null);
    }
  }

  function handleExportCSV() {
    downloadFile(
      exportExpensesCSV(filtered, language),
      'expenses.csv',
      'text/csv;charset=utf-8'
    );
  }

  function handleExportJSON() {
    downloadFile(
      exportExpensesJSON(filtered),
      'expenses.json',
      'application/json'
    );
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        const result = validateExpenseImport(raw, file.size);
        if (!result.valid) {
          showToast(result.errors.join('\n'), 'danger');
          return;
        }
        if (importMode === 'merge') {
          mergeExpenses(result.data);
        } else {
          replaceExpenses(result.data);
        }
        showToast(t('expense.importSuccess'), 'success');
        setImportOpen(false);
      } catch {
        showToast(t('expense.importError'), 'danger');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Receipt size={28} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-fg">{t('expense.title')}</h1>
            <p className="text-muted text-sm">{t('expense.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="px-2 py-1.5 rounded-xl border border-border-custom bg-surface text-fg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={t('budgetRule.currency')}
          >
            {currencyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={openAdd}>
            <Plus size={16} />
            {t('expense.add')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex flex-col">
            <span className="text-xs text-muted uppercase">{t('expense.monthlyIncome')}</span>
            <Input
              type="text"
              inputMode="numeric"
              value={monthlyIncomeStr}
              onChange={(e) => setMonthlyIncomeStr(e.target.value)}
              placeholder="0"
              className="mt-1"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col">
            <span className="text-xs text-muted uppercase">{t('expense.total')}</span>
            <span className="text-xl font-bold text-fg mt-1">{formatCurrency(total, currency, language)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col">
            <span className="text-xs text-muted uppercase">{t('expense.remainingIncome')}</span>
            <span className={`text-xl font-bold mt-1 ${remaining >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(remaining, currency, language)}
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4 no-print">
        <Select
          options={[{ value: 'all', label: t('expense.allMonths') }, ...months.map((m) => ({ value: m, label: m }))]}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="flex-1"
        />
        <Select
          options={[{ value: 'all', label: t('expense.allCategories') }, ...categories.map((c) => ({ value: c, label: c }))]}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4 no-print">
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download size={14} /> {t('expense.exportCSV')}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleExportJSON}>
          <Download size={14} /> {t('expense.exportJSON')}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setImportOpen(true)}>
          <Upload size={14} /> {t('expense.importJSON')}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          <Printer size={14} /> {t('expense.printReport')}
        </Button>
      </div>

      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />

      {expenses.length === 0 ? (
        <EmptyState message={t('expense.noExpenses')} />
      ) : filtered.length === 0 ? (
        <EmptyState message={t('search.noResults')} />
      ) : (
        <Card className="overflow-x-auto">
          <Table caption={t('expense.title')}>
            <TableHead>
              <TableRow>
                <TableHeader>{t('expense.date')}</TableHeader>
                <TableHeader>{t('expense.category')}</TableHeader>
                <TableHeader>{t('expense.classification')}</TableHeader>
                <TableHeader>{t('expense.description')}</TableHeader>
                <TableHeader>{t('expense.amount')}</TableHeader>
                <TableHeader className="no-print">{t('common.edit')}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    <Badge variant={expense.classification === 'need' ? 'primary' : 'warning'}>
                      {expense.classification === 'need' ? t('expense.need') : t('expense.want')}
                    </Badge>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{formatCurrency(expense.amount, currency, language)}</TableCell>
                  <TableCell className="no-print">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(expense)} className="p-1 text-muted hover:text-fg rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('common.edit')}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(expense.id)} className="p-1 text-muted hover:text-danger rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('common.delete')}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? t('expense.edit') : t('expense.add')}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label={t('expense.date')} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label={t('expense.category')} type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Select
            label={t('expense.classification')}
            options={[
              { value: 'need', label: t('expense.need') },
              { value: 'want', label: t('expense.want') },
            ]}
            value={form.classification}
            onChange={(e) => setForm({ ...form, classification: e.target.value as 'need' | 'want' })}
          />
          <Input
            label={t('expense.description')}
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder={t('expense.descriptionPlaceholder')}
            hint={t('common.sensitiveWarning')}
          />
          <Input
            label={t('expense.amount')}
            type="text"
            inputMode="numeric"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="0"
          />
          {formError && <p className="text-xs text-danger">{formError}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
            <Button type="submit" variant="primary">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={importOpen} onClose={() => setImportOpen(false)} title={t('expense.importJSON')} size="sm">
        <div className="flex flex-col gap-4">
          <Select
            label={t('expense.importMode')}
            options={[
              { value: 'merge', label: t('common.merge') },
              { value: 'replace', label: t('common.replace') },
            ]}
            value={importMode}
            onChange={(e) => setImportMode(e.target.value as 'merge' | 'replace')}
          />
          <Button variant="primary" onClick={handleImportClick}>
            <Upload size={16} />
            {t('common.import')}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        title={t('common.delete')}
        message={t('expense.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
