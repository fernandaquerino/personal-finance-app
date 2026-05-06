import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'green', label: 'Green', color: '#277c78' },
  { value: 'red', label: 'Red', color: '#c94736' },
  { value: 'blue', label: 'Blue', color: '#3f82b2', alreadyUsed: true },
];

describe('Select', () => {
  it('renders trigger with placeholder', () => {
    render(<Select options={options} placeholder="Select a color" />);
    expect(screen.getByText('Select a color')).toBeInTheDocument();
  });

  it('renders label and associates it with trigger', () => {
    render(<Select label="Color" options={options} />);
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<Select options={options} helperText="Choose a theme color" />);
    expect(screen.getByText('Choose a theme color')).toBeInTheDocument();
  });

  it('renders error and sets aria-invalid', () => {
    render(<Select label="Color" id="color" options={options} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('error message has role="alert"', () => {
    render(<Select options={options} error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('does not render helper text when error is present', () => {
    render(<Select options={options} helperText="Hint" error="Required" />);
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('opens dropdown and shows options on click', async () => {
    render(<Select options={options} placeholder="Pick" />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => {
      expect(screen.getByText('Green')).toBeInTheDocument();
      expect(screen.getByText('Red')).toBeInTheDocument();
      expect(screen.getByText('Blue')).toBeInTheDocument();
    });
  });

  it('calls onValueChange when an option is selected', async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} placeholder="Pick" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => screen.getByText('Green'));
    fireEvent.click(screen.getByText('Green'));
    expect(onValueChange).toHaveBeenCalledWith('green');
  });

  it('shows "Already used" badge for used options', async () => {
    render(<Select options={options} placeholder="Pick" />);
    fireEvent.click(screen.getByRole('combobox'));
    await waitFor(() => screen.getByText('Already used'));
    expect(screen.getByText('Already used')).toBeInTheDocument();
  });

  it('shows selected value in trigger', () => {
    render(<Select options={options} value="green" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Green');
  });
});
