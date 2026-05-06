import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'light' },
  },
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    prefix: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Transaction Name',
    placeholder: 'e.g. Urban Services Hub',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Amount',
    placeholder: '0.00',
    helperText: 'Max $9999.99',
  },
};

export const WithPrefix: Story = {
  args: {
    label: 'Amount',
    prefix: '$',
    placeholder: '0.00',
    helperText: 'Max $9999.99',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search transactions',
    icon: <SearchIcon />,
  },
};

export const Error: Story = {
  args: {
    label: 'Transaction Name',
    placeholder: 'e.g. Urban Services Hub',
    error: 'This field is required',
  },
};

export const ErrorWithPrefix: Story = {
  args: {
    label: 'Amount',
    prefix: '$',
    placeholder: '0.00',
    error: 'Amount must be greater than 0',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Transaction Name',
    placeholder: 'e.g. Urban Services Hub',
    disabled: true,
  },
};

export const DisabledWithPrefix: Story = {
  args: {
    label: 'Amount',
    prefix: '$',
    placeholder: '0.00',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '360px' }}>
      <Input label="Default" placeholder="e.g. Urban Services Hub" />
      <Input label="With Helper" placeholder="0.00" prefix="$" helperText="Max $9999.99" />
      <Input label="With Icon" placeholder="Search transactions" icon={<SearchIcon />} />
      <Input label="Error" placeholder="e.g. Urban Services Hub" error="This field is required" />
      <Input label="Disabled" placeholder="e.g. Urban Services Hub" disabled />
    </div>
  ),
};
