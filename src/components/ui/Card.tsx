import { type HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-surface border border-border-custom rounded-xl p-6',
          hoverable && 'transition-shadow hover:shadow-md motion-reduce:transition-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx('text-lg font-semibold text-fg', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('text-muted', className)} {...props}>
      {children}
    </div>
  );
}
