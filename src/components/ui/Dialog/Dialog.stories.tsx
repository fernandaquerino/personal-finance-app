import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Dialog, DialogClose } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { backgrounds: { default: 'light' } },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <div className="p-600">
      <Dialog
        trigger={<Button type="button">Open dialog</Button>}
        title="Add transaction"
        description="Create a new transaction for your personal finance overview."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save transaction</Button>
          </>
        }
      >
        <div className="grid gap-400">
          <Input label="Transaction name" placeholder="e.g. Grocery shopping" />
          <Input label="Amount" prefix="$" placeholder="0.00" inputMode="decimal" />
        </div>
      </Dialog>
    </div>
  ),
};

export const Destructive: Story = {
  render: () => (
    <div className="p-600">
      <Dialog
        trigger={
          <Button type="button" variant="destructive">
            Delete budget
          </Button>
        }
        title="Delete budget?"
        description="This action cannot be undone."
        footer={
          <>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive">
              Delete
            </Button>
          </>
        }
      >
        <p>
          Removing this budget will keep existing transactions, but the budget tracking card will
          disappear from your dashboard.
        </p>
      </Dialog>
    </div>
  ),
};
