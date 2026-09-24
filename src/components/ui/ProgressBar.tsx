import clsx from 'clsx';

type ProgressBarProps = {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  showValue?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
};

const variantClasses = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  showValue = false,
  variant = 'primary',
}: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? (clampedValue / max) * 100 : 0;

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-fg">{label}</span>
          {showValue && <span className="text-muted">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className="w-full h-2.5 rounded-full bg-bg overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(clampedValue)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={clsx('h-full rounded-full transition-all motion-reduce:transition-none', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
