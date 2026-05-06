import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  [
    'inline-flex cursor-pointer items-center justify-center gap-200 whitespace-nowrap rounded-lg',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    'w-full',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-grey-900 text-white',
          'hover:bg-grey-900/80',
          'focus-visible:ring-grey-900',
          'disabled:bg-grey-500',
        ],
        secondary: [
          'border border-transparent bg-beige-100 text-grey-900',
          'hover:border-beige-500 hover:bg-white',
          'focus-visible:ring-grey-900',
          'disabled:border-grey-300 disabled:text-grey-300',
        ],
        tertiary: [
          'bg-transparent text-grey-500 gap-300',
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
        md: 'text-preset-4-bold p-400',
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

function ChevronRight() {
  return (
    <svg
      width="5"
      height="9"
      viewBox="0 0 5 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0.640312 0.109982L4.39031 3.85998C4.42518 3.89481 4.45284 3.93617 4.47171 3.98169C4.49058 4.02722 4.50029 4.07601 4.50029 4.1253C4.50029 4.17458 4.49058 4.22337 4.47171 4.2689C4.45284 4.31442 4.42518 4.35578 4.39031 4.39061L0.640313 8.14061C0.587867 8.19311 0.521022 8.22888 0.44824 8.24337C0.375458 8.25786 0.300012 8.25044 0.231454 8.22203C0.162895 8.19362 0.104307 8.14551 0.063105 8.08379C0.0219034 8.02207 -5.82985e-05 7.94951 9.97705e-08 7.8753L-2.28065e-07 0.375295C-5.86328e-05 0.301085 0.0219031 0.228524 0.0631046 0.166801C0.104306 0.105079 0.162895 0.0569696 0.231453 0.0285625C0.300012 0.000154482 0.375458 -0.00727178 0.44824 0.00722216C0.521022 0.0217161 0.587867 0.0574779 0.640312 0.109982Z"
        fill="currentColor"
      />
    </svg>
  );
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
      {variant === 'tertiary' && <ChevronRight />}
    </button>
  );
}
