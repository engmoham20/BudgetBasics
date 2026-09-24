import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, 'aria-describedby': ariaDescribedby, ...props }, ref) => {
    const inputId = id || props.name;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [ariaDescribedby, hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-fg">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={clsx(
            'px-3 py-2 rounded-xl border bg-surface text-fg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary motion-reduce:transition-none',
            error ? 'border-danger' : 'border-border-custom',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="text-xs text-muted">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
