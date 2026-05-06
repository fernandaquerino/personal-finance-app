import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import type { SelectOption } from './Select';

const colorOptions: SelectOption[] = [
  { value: 'green', label: 'Green', color: '#277c78' },
  { value: 'yellow', label: 'Yellow', color: '#f2cdac' },
  { value: 'cyan', label: 'Cyan', color: '#82c9d7' },
  { value: 'navy', label: 'Navy', color: '#626070' },
  { value: 'red', label: 'Red', color: '#c94736', alreadyUsed: true },
  { value: 'purple', label: 'Purple', color: '#826cb0', alreadyUsed: true },
  { value: 'turquoise', label: 'Turquoise', color: '#597c7c' },
  { value: 'brown', label: 'Brown', color: '#93674f' },
];

const sortOptions: SelectOption[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
];

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Category',
    placeholder: 'Select a category',
    options: sortOptions,
  },
};

export const WithColorDots: Story = {
  args: {
    label: 'Theme Color',
    placeholder: 'Select a color',
    options: colorOptions,
  },
};

export const WithSelectedValue: Story = {
  args: {
    label: 'Theme Color',
    options: colorOptions,
    value: 'green',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Sort By',
    placeholder: 'Select order',
    options: sortOptions,
    helperText: 'Affects the order of results',
  },
};

export const Error: Story = {
  args: {
    label: 'Category',
    placeholder: 'Select a category',
    options: sortOptions,
    error: 'Please select a category',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Category',
    placeholder: 'Select a category',
    options: sortOptions,
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '360px' }}>
      <Select label="Default" placeholder="Select an option" options={sortOptions} />
      <Select label="With Color Dots" placeholder="Select a color" options={colorOptions} />
      <Select label="With Value" options={colorOptions} value="green" />
      <Select
        label="Error"
        placeholder="Select an option"
        options={sortOptions}
        error="This field is required"
      />
      <Select label="Disabled" placeholder="Select an option" options={sortOptions} disabled />
    </div>
  ),
};
