import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  tags: ['autodocs'],
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Pots',
    children: <div className="text-grey-500">Card content</div>,
  },
};

export const WithAction: Story = {
  args: {
    title: 'Budgets',
    action: {
      label: 'See Details',
    },
    children: <div className="text-grey-500">Budget content</div>,
  },
};
