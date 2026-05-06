import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-200 whitespace-nowrap rounded-lg',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-grey-900 text-white',
          'hover:bg-grey-900/80',
          'focus-visible:ring-grey-900',
          'disabled:bg-grey-500 disabled:text-grey-300',
        ],
        secondary: [
          'border border-grey-900 bg-transparent text-grey-900',
          'hover:bg-grey-900 hover:text-white',
          'focus-visible:ring-grey-900',
          'disabled:border-grey-300 disabled:text-grey-300',
        ],
        tertiary: [
          'bg-transparent text-grey-500',
          'hover:text-grey-900',
          'focus-visible:ring-grey-500',
          'disabled:text-grey-300',
        ],
        destructive: [
          'bg-red text-white',
          'hover:bg-red/80',
          'focus-visible:ring-red',
          'disabled:bg-red/50',
        ],
      },
      size: {
        sm: 'text-preset-5-bold py-300 px-400',
        md: 'text-preset-4-bold py-400 px-600',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

function Spinner() {
  return (
    <svg
      className="h-400 w-400 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
