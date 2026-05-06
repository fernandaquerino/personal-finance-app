'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { cn } from '@/lib/cn';

interface DialogProps extends RadixDialog.DialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
}

type DialogContentProps = ComponentPropsWithoutRef<typeof RadixDialog.Content>;
type DialogCloseProps = ComponentPropsWithoutRef<typeof RadixDialog.Close>;

export function Dialog({
  trigger,
  title,
  description,
  children,
  footer,
  contentClassName,
  ...props
}: DialogProps) {
  return (
    <RadixDialog.Root {...props}>
      <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <RadixDialog.Title className="text-preset-2 text-grey-900 pr-800">
            {title}
          </RadixDialog.Title>
          {description && (
            <RadixDialog.Description className="text-preset-4 text-grey-500">
              {description}
            </RadixDialog.Description>
          )}
        </DialogHeader>

        <DialogBody>{children}</DialogBody>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </RadixDialog.Root>
  );
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay
        data-testid="dialog-overlay"
        className={cn(
          'bg-grey-900/45 fixed inset-0 z-50 [will-change:opacity]',
          'data-[state=open]:animate-[dialog-overlay-show_150ms_ease-out]',
          'data-[state=closed]:animate-[dialog-overlay-hide_150ms_ease-in]'
        )}
      />
      <RadixDialog.Content
        aria-modal="true"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-[35rem]',
          'max-h-[calc(100vh-2rem)] [translate:-50%_-50%] overflow-hidden',
          'rounded-lg bg-white shadow-xl focus:outline-none',
          '[will-change:opacity,translate,scale]',
          'data-[state=open]:animate-[dialog-content-show_180ms_ease-out]',
          'data-[state=closed]:animate-[dialog-content-hide_150ms_ease-in]',
          className
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute top-500 right-500" aria-label="Close dialog">
          <CloseIcon />
        </DialogClose>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentPropsWithoutRef<'header'>) {
  return <header className={cn('flex flex-col gap-200 p-600 pb-500', className)} {...props} />;
}

export function DialogBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('text-preset-4 text-grey-500 max-h-[50vh] overflow-y-auto px-600', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentPropsWithoutRef<'footer'>) {
  return <footer className={cn('flex flex-col-reverse gap-300 p-600', className)} {...props} />;
}

export function DialogClose({ className, ...props }: DialogCloseProps) {
  return (
    <RadixDialog.Close
      className={cn(
        'text-grey-500 hover:text-grey-900 inline-flex cursor-pointer items-center justify-center',
        'rounded-lg transition-colors duration-150',
        'focus-visible:ring-grey-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className
      )}
      {...props}
    />
  );
}
