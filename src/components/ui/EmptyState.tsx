import { type ReactNode } from 'react';
import { Inbox } from 'lucide-react';

type EmptyStateProps = {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ message, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-3 text-muted">
        {icon || <Inbox size={48} strokeWidth={1.5} />}
      </div>
      <p className="text-muted text-sm mb-4">{message}</p>
      {action}
    </div>
  );
}
