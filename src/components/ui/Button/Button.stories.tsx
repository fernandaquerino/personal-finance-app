import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Variants ────────────────────────────────────────────────────

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
  parameters: { backgrounds: { default: 'white' } },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete account' },
};

// ── Sizes ───────────────────────────────────────────────────────

export const MediumSize: Story = {
  args: { size: 'md' },
};

export const SmallSize: Story = {
  args: { size: 'sm' },
};

// ── States ──────────────────────────────────────────────────────

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

// ── All variants ─────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-600">
      <span className="text-preset-5 text-grey-500 w-[5rem] text-right">{label}</span>
      <div className="flex items-center gap-400">{children}</div>
    </div>
  );
}

export const AllVariants: Story = {
  parameters: { backgrounds: { default: 'light' } },
  render: () => (
    <div className="flex flex-col gap-400 p-600">
      <Row label="primary">
        <Button variant="primary">Default</Button>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </Row>

      <Row label="secondary">
        <Button variant="secondary">Default</Button>
        <Button variant="secondary" size="sm">
          Small
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </Row>

      <Row label="tertiary">
        <Button variant="tertiary">See details</Button>
        <Button variant="tertiary" size="sm">
          See details
        </Button>
        <Button variant="tertiary" disabled>
          See details
        </Button>
      </Row>

      <Row label="destructive">
        <Button variant="destructive">Delete</Button>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
        <Button variant="destructive" disabled>
          Disabled
        </Button>
      </Row>
    </div>
  ),
};
