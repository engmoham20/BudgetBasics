import { type HTMLAttributes, type ThHTMLAttributes, type TdHTMLAttributes } from 'react';
import clsx from 'clsx';

type TableProps = HTMLAttributes<HTMLTableElement> & {
  caption?: string;
};

export function Table({ caption, className, children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('w-full text-sm border-collapse', className)} {...props}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function TableHead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={clsx('bg-bg', className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={clsx('divide-y divide-border-custom', className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={clsx('hover:bg-bg transition-colors motion-reduce:transition-none', className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ className, scope = 'col', children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope={scope}
      className={clsx('px-4 py-3 text-start font-semibold text-fg border-b border-border-custom', className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={clsx('px-4 py-3 text-fg border-b border-border-custom', className)} {...props}>
      {children}
    </td>
  );
}
