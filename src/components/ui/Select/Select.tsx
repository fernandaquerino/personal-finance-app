'use client';

import * as RadixSelect from '@radix-ui/react-select';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
  alreadyUsed?: boolean;
}

interface SelectProps {
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  icon?: ReactNode;
}

function CaretDown() {
  return (
    <svg
      width="11"
      height="6"
      viewBox="0 0 11 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10.8541 0.85375L5.85414 5.85375C5.80771 5.90024 5.75256 5.93712 5.69186 5.96228C5.63117 5.98744 5.5661 6.00039 5.50039 6.00039C5.43469 6.00039 5.36962 5.98744 5.30892 5.96228C5.24822 5.93712 5.19308 5.90024 5.14664 5.85375L0.146644 0.85375C0.0766381 0.783823 0.0289543 0.694696 0.00962914 0.597654C-0.00969606 0.500611 0.000206247 0.400016 0.0380825 0.308605C0.0759587 0.217193 0.140106 0.139075 0.222403 0.08414C0.3047 0.0292046 0.401446 -7.77138e-05 0.500394 1.549e-07L10.5004 1.549e-07C10.5993 -7.77138e-05 10.6961 0.0292046 10.7784 0.08414C10.8607 0.139075 10.9248 0.217193 10.9627 0.308605C11.0006 0.400016 11.0105 0.500611 10.9912 0.597654C10.9718 0.694696 10.9241 0.783823 10.8541 0.85375Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 6L5 9L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Select({
  label,
  helperText,
  error,
  placeholder,
  options,
  value,
  onValueChange,
  disabled,
  id,
  icon,
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = Boolean(error);

  return (
    <div className="flex w-full flex-col gap-100">
      {label && (
        <label
          htmlFor={selectId}
          className={cn('text-preset-5-bold', disabled ? 'text-grey-300' : 'text-grey-500')}
        >
          {label}
        </label>
      )}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          id={selectId}
          aria-invalid={hasError || undefined}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
          className={cn(
            'group flex w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-300 py-300',
            'text-preset-4 text-grey-900',
            'transition-colors duration-150',
            'focus:border-grey-900 focus:outline-none',
            'data-[placeholder]:text-grey-500',
            hasError ? 'border-red' : 'border-beige-500',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex items-center gap-200 overflow-hidden">
            {icon && <span className="text-grey-500 shrink-0">{icon}</span>}
            <RadixSelect.Value placeholder={placeholder} />
          </div>
          <RadixSelect.Icon className="text-grey-900 shrink-0 transition-transform duration-150 group-data-[state=open]:rotate-180">
            <CaretDown />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className={cn(
              'z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg bg-white shadow-lg',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
          >
            <RadixSelect.Viewport className="py-100">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-300 py-200 select-none',
                    'text-preset-4 text-grey-900 outline-none',
                    'border-grey-100 border-b last:border-b-0',
                    'data-[state=checked]:font-bold',
                    option.alreadyUsed && 'opacity-60'
                  )}
                >
                  <div className="flex items-center gap-200">
                    {option.color && (
                      <span
                        className="h-200 w-200 shrink-0 rounded-full"
                        style={{ backgroundColor: option.color }}
                        aria-hidden="true"
                      />
                    )}
                    <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  </div>
                  <div className="flex items-center gap-200">
                    {option.alreadyUsed && (
                      <span className="text-preset-5 text-grey-500">Already used</span>
                    )}
                    <RadixSelect.ItemIndicator className="text-grey-900">
                      <CheckIcon />
                    </RadixSelect.ItemIndicator>
                  </div>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && (
        <span id={`${selectId}-error`} role="alert" className="text-preset-5 text-red text-right">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${selectId}-helper`} className="text-preset-5 text-grey-500 text-right">
          {helperText}
        </span>
      )}
    </div>
  );
}
