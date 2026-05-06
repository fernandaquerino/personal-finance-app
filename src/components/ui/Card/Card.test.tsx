import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Card } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders title', () => {
      render(
        <Card title="Pots">
          <div>content</div>
        </Card>
      );

      expect(screen.getByRole('heading', { name: 'Pots' })).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <Card title="Budgets">
          <div>card content</div>
        </Card>
      );

      expect(screen.getByText('card content')).toBeInTheDocument();
    });

    it('renders action button when action is provided', () => {
      render(
        <Card
          title="Transactions"
          action={{
            label: 'See Details',
          }}
        >
          <div>content</div>
        </Card>
      );

      expect(
        screen.getByRole('button', {
          name: 'See Details',
        })
      ).toBeInTheDocument();
    });

    it('does not render action button when action is not provided', () => {
      render(
        <Card title="Transactions">
          <div>content</div>
        </Card>
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('merges custom className', () => {
      render(
        <Card title="Custom Card" className="w-full">
          <div>content</div>
        </Card>
      );

      expect(screen.getByRole('region')).toHaveClass('w-full');
    });

    it('applies default card styles', () => {
      render(
        <Card title="Styled Card">
          <div>content</div>
        </Card>
      );

      expect(screen.getByRole('region')).toHaveClass('rounded-xl', 'bg-white', 'p-800');
    });
  });

  describe('interaction', () => {
    it('fires action onClick when action button is clicked', async () => {
      const onClick = vi.fn();

      render(
        <Card
          title="Pots"
          action={{
            label: 'See Details',
            onClick,
          }}
        >
          <div>content</div>
        </Card>
      );

      await userEvent.click(
        screen.getByRole('button', {
          name: 'See Details',
        })
      );

      expect(onClick).toHaveBeenCalledOnce();
    });

    it('allows action button to receive focus', () => {
      render(
        <Card
          title="Budgets"
          action={{
            label: 'See Details',
          }}
        >
          <div>content</div>
        </Card>
      );

      const button = screen.getByRole('button');

      button.focus();

      expect(button).toHaveFocus();
    });
  });

  describe('accessibility', () => {
    it('renders section landmark', () => {
      render(
        <Card title="Accessible Card">
          <div>content</div>
        </Card>
      );

      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('renders heading with correct title', () => {
      render(
        <Card title="Recurring Bills">
          <div>content</div>
        </Card>
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Recurring Bills',
        })
      ).toBeInTheDocument();
    });
  });
});
