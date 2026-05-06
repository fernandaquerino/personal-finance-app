import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  helperText?: string;
  error?: string;
  prefix?: string;
  icon?: ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  prefix,
  icon,
  id,
  className,
  disabled,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = Boolean(error);

  return (
    <div className="flex w-full flex-col gap-100">
      {label && (
        <label
          htmlFor={inputId}
          className={cn('text-preset-5-bold', disabled ? 'text-grey-500' : 'text-grey-500')}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span
            aria-hidden="true"
            className={cn(
              'text-preset-4 pointer-events-none absolute left-300',
              disabled ? 'text-grey-300' : 'text-beige-500'
            )}
          >
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={cn(
            'text-preset-4 text-grey-900 w-full rounded-lg border bg-white px-300 py-300',
            'placeholder:text-beige-500',
            'transition-colors duration-150',
            'focus:border-grey-900 focus:outline-none',
            hasError ? 'border-red' : 'border-beige-500',
            disabled && 'border-beige-500 cursor-not-allowed bg-white opacity-50',
            prefix && 'pl-800',
            icon && 'pr-800',
            className
          )}
          {...props}
        />
        {icon && (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute right-300',
              disabled ? 'text-grey-300' : 'text-grey-500'
            )}
          >
            {icon}
          </span>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} role="alert" className="text-preset-5 text-red text-right">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${inputId}-helper`} className="text-preset-5 text-grey-500 text-right">
          {helperText}
        </span>
      )}
    </div>
  );
}
