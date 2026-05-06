import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { Input } from '../Input';
import { Dialog, DialogClose } from './Dialog';

function TestDialog({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <Dialog
      onOpenChange={onOpenChange}
      trigger={<Button type="button">Open dialog</Button>}
      title="Add transaction"
      description="Create a new transaction."
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Save</Button>
        </>
      }
    >
      <Input label="Transaction name" placeholder="e.g. Groceries" />
      <button type="button">Focusable action</button>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('renders trigger and opens dialog content', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(screen.getByRole('dialog', { name: 'Add transaction' })).toBeInTheDocument();
    expect(screen.getByText('Create a new transaction.')).toBeInTheDocument();
  });

  it('sets dialog accessibility attributes through Radix', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus to the first interactive element when opened', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Transaction name')).toHaveFocus();
    });
  });

  it('returns focus to the trigger when closed', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    await user.click(screen.getByTestId('dialog-overlay'));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('keeps focus trapped while open', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    await user.tab();
    await user.tab();
    await user.tab();

    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });

  it('calls onOpenChange when open state changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<TestDialog onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    await user.keyboard('{Escape}');

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
