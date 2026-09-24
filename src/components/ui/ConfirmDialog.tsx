import { type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useI18n } from '@/i18n/useI18n';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary';
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  const { t } = useI18n();
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={24} className={variant === 'danger' ? 'text-danger shrink-0' : 'text-primary shrink-0'} />
          <p className="text-sm text-fg">{message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            {cancelLabel || t('common.cancel')}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>
            {confirmLabel || t('common.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
