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

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete account' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving...' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-400">
      <div className="flex items-center gap-400">
        <Button variant="primary">Primary</Button>
        <Button variant="primary" size="sm">
          Primary sm
        </Button>
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
      <div className="flex items-center gap-400">
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" size="sm">
          Secondary sm
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
      <div className="flex items-center gap-400">
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="tertiary" size="sm">
          Tertiary sm
        </Button>
        <Button variant="tertiary" disabled>
          Disabled
        </Button>
      </div>
      <div className="flex items-center gap-400">
        <Button variant="destructive">Destructive</Button>
        <Button variant="destructive" size="sm">
          Destructive sm
        </Button>
        <Button variant="destructive" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};
