import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('applies primary variant by default', () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-grey-900');
    });

    it('applies secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'border-grey-900', 'bg-transparent');
    });

    it('applies tertiary variant classes', () => {
      render(<Button variant="tertiary">Tertiary</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-grey-500');
    });

    it('applies destructive variant classes', () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red');
    });

    it('applies sm size classes', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-preset-5-bold');
    });

    it('applies md size classes by default', () => {
      render(<Button>Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-preset-4-bold');
    });

    it('merges custom className', () => {
      render(<Button className="w-full">Full width</Button>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is passed', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not fire onClick when disabled', async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Disabled
        </Button>
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('is disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('sets aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('shows spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
    });

    it('does not show spinner when not loading', () => {
      render(<Button>Not loading</Button>);
      expect(screen.getByRole('button').querySelector('svg')).not.toBeInTheDocument();
    });

    it('does not fire onClick when loading', async () => {
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Loading
        </Button>
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('interaction', () => {
    it('fires onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click me</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('can be activated with Enter key', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Enter</Button>);
      screen.getByRole('button').focus();
      await userEvent.keyboard('{Enter}');
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('can be activated with Space key', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Press Space</Button>);
      screen.getByRole('button').focus();
      await userEvent.keyboard(' ');
      expect(onClick).toHaveBeenCalledOnce();
    });

    it('can receive focus', () => {
      render(<Button>Focusable</Button>);
      screen.getByRole('button').focus();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  describe('accessibility', () => {
    it('has button role', () => {
      render(<Button>Accessible</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('supports type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('supports aria-label', () => {
      render(<Button aria-label="Close dialog">X</Button>);
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    });
  });
});
