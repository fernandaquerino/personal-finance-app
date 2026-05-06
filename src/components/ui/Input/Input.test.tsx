import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders without label', () => {
    render(<Input placeholder="Enter value" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('renders label and associates it with input', () => {
    render(<Input label="Amount" id="amount" />);
    const label = screen.getByText('Amount');
    const input = screen.getByLabelText('Amount');
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('generates id from label when id is not provided', () => {
    render(<Input label="Transaction Name" />);
    const input = screen.getByLabelText('Transaction Name');
    expect(input).toHaveAttribute('id', 'transaction-name');
  });

  it('renders helper text', () => {
    render(<Input label="Amount" helperText="Max $9999.99" />);
    expect(screen.getByText('Max $9999.99')).toBeInTheDocument();
  });

  it('renders error message and sets aria-invalid', () => {
    render(<Input label="Amount" error="This field is required" />);
    const input = screen.getByLabelText('Amount');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not render helper text when error is present', () => {
    render(<Input label="Amount" helperText="Some hint" error="Required" />);
    expect(screen.queryByText('Some hint')).not.toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('error message has role="alert"', () => {
    render(<Input label="Amount" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('renders prefix text', () => {
    render(<Input label="Amount" prefix="$" />);
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const icon = <svg data-testid="icon" />;
    render(<Input label="Search" icon={icon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Input label="Amount" disabled />);
    expect(screen.getByLabelText('Amount')).toBeDisabled();
  });

  it('passes through native input props', () => {
    render(<Input label="Amount" type="number" min={0} max={100} data-testid="input" />);
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('aria-describedby points to error id when error is present', () => {
    render(<Input label="Amount" id="amount" error="Required" />);
    expect(screen.getByLabelText('Amount')).toHaveAttribute('aria-describedby', 'amount-error');
  });

  it('aria-describedby points to helper id when only helperText is present', () => {
    render(<Input label="Amount" id="amount" helperText="Hint" />);
    expect(screen.getByLabelText('Amount')).toHaveAttribute('aria-describedby', 'amount-helper');
  });

  it('applies border-red class when error is present', () => {
    render(<Input label="Amount" error="Required" data-testid="input" />);
    expect(screen.getByTestId('input')).toHaveClass('border-red');
  });
});
