import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type AccordionItemProps = {
  id: string;
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function AccordionItem({ id, header, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `${id}-content`;
  const buttonId = `${id}-button`;

  return (
    <div className="border-b border-border-custom">
      <button
        id={buttonId}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-start text-fg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl px-2"
      >
        <span>{header}</span>
        <ChevronDown
          size={20}
          className={clsx('shrink-0 text-muted transition-transform rtl:rotate-180', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div id={contentId} role="region" aria-labelledby={buttonId} className="pb-4 ps-2 pe-2 text-muted">
          {children}
        </div>
      )}
    </div>
  );
}

type AccordionProps = {
  children: ReactNode;
};

export function Accordion({ children }: AccordionProps) {
  return <div className="divide-y divide-border-custom">{children}</div>;
}
