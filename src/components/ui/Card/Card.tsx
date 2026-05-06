import type { ReactNode } from 'react';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

type CardProps = {
  title: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
  };
  className?: string;
};

export function Card({ title, children, action, className = '' }: CardProps) {
  return (
    <section aria-label={title} className={`rounded-xl bg-white p-800 ${className}`}>
      <header className="mb-500 flex items-center justify-between">
        <h2 className="text-preset-2 text-grey-900">{title}</h2>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-preset-5 text-grey-500 hover:text-grey-900 flex cursor-pointer items-center gap-100 transition-colors"
          >
            {action.label}

            <ArrowRightIcon />
          </button>
        )}
      </header>

      {children}
    </section>
  );
}
