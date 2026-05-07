import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SignUpForm } from './SignUpForm';
import * as actions from './actions';

vi.mock('./actions', () => ({
  signUpWithCredentials: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockSignUp = vi.mocked(actions.signUpWithCredentials);

const VALID_NAME = 'Jane Doe';
const VALID_EMAIL = 'jane@example.com';
const VALID_PASSWORD = 'secret123';

async function fillAndSubmit(name = VALID_NAME, email = VALID_EMAIL, password = VALID_PASSWORD) {
  await userEvent.type(screen.getByLabelText('Name'), name);
  await userEvent.type(screen.getByLabelText('Email'), email);
  await userEvent.type(screen.getByLabelText('Create Password'), password);
  await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
}

describe('SignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignUp.mockResolvedValue(undefined);
  });

  describe('rendering', () => {
    it('renders the sign up heading', () => {
      render(<SignUpForm />);
      expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    });

    it('renders name, email and password fields', () => {
      render(<SignUpForm />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Create Password')).toBeInTheDocument();
    });

    it('renders the create account submit button', () => {
      render(<SignUpForm />);
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('renders the login link pointing to /login', () => {
      render(<SignUpForm />);
      expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login');
    });

    it('shows the password helper text by default', () => {
      render(<SignUpForm />);
      expect(screen.getByText('Passwords must be at least 8 characters.')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('name field has aria-required', () => {
      render(<SignUpForm />);
      expect(screen.getByLabelText('Name')).toHaveAttribute('aria-required', 'true');
    });

    it('email field has aria-required', () => {
      render(<SignUpForm />);
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-required', 'true');
    });

    it('password field has aria-required', () => {
      render(<SignUpForm />);
      expect(screen.getByLabelText('Create Password')).toHaveAttribute('aria-required', 'true');
    });

    it('email field has type email', () => {
      render(<SignUpForm />);
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    it('password toggle has a descriptive aria-label', () => {
      render(<SignUpForm />);
      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('server error uses role alert', async () => {
      mockSignUp.mockResolvedValue({ error: 'An account with this email already exists.' });
      render(<SignUpForm />);
      await fillAndSubmit();
      expect(await screen.findByRole('alert')).toBeInTheDocument();
    });

    it('validation errors use role alert', async () => {
      render(<SignUpForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      const alerts = await screen.findAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  describe('password toggle', () => {
    it('renders password field as type password by default', () => {
      render(<SignUpForm />);
      expect(screen.getByLabelText('Create Password')).toHaveAttribute('type', 'password');
    });

    it('shows password when toggle is clicked', async () => {
      render(<SignUpForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(screen.getByLabelText('Create Password')).toHaveAttribute('type', 'text');
    });

    it('updates toggle aria-label after reveal', async () => {
      render(<SignUpForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });

    it('hides password again on second click', async () => {
      render(<SignUpForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
      expect(screen.getByLabelText('Create Password')).toHaveAttribute('type', 'password');
    });
  });

  describe('validation', () => {
    it('shows error when name is empty on submit', async () => {
      render(<SignUpForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    });

    it('shows error for empty email on submit', async () => {
      render(<SignUpForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      expect(await screen.findByText('Please enter a valid email.')).toBeInTheDocument();
    });

    it('shows error for malformed email', async () => {
      render(<SignUpForm />);
      await userEvent.type(screen.getByLabelText('Email'), 'notanemail');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      expect(await screen.findByText('Please enter a valid email.')).toBeInTheDocument();
    });

    it('shows error for password shorter than 8 characters', async () => {
      render(<SignUpForm />);
      await userEvent.type(screen.getByLabelText('Name'), VALID_NAME);
      await userEvent.type(screen.getByLabelText('Email'), VALID_EMAIL);
      await userEvent.type(screen.getByLabelText('Create Password'), 'short');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      expect(
        await screen.findByText('Password must be at least 8 characters.')
      ).toBeInTheDocument();
    });

    it('hides helper text and shows error when password is too short', async () => {
      render(<SignUpForm />);
      await userEvent.type(screen.getByLabelText('Create Password'), 'short');
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await screen.findByText('Password must be at least 8 characters.');
      expect(
        screen.queryByText('Passwords must be at least 8 characters.')
      ).not.toBeInTheDocument();
    });

    it('does not call signUpWithCredentials when form is invalid', async () => {
      render(<SignUpForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      expect(mockSignUp).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('calls signUpWithCredentials with name, email and password', async () => {
      render(<SignUpForm />);
      await fillAndSubmit();
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(VALID_NAME, VALID_EMAIL, VALID_PASSWORD);
      });
    });

    it('calls signUpWithCredentials exactly once per submit', async () => {
      render(<SignUpForm />);
      await fillAndSubmit();
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledOnce();
      });
    });

    it('shows server error when email is already registered', async () => {
      mockSignUp.mockResolvedValue({ error: 'An account with this email already exists.' });
      render(<SignUpForm />);
      await fillAndSubmit();
      expect(await screen.findByRole('alert')).toHaveTextContent(
        'An account with this email already exists.'
      );
    });

    it('clears server error before each new submission', async () => {
      mockSignUp
        .mockResolvedValueOnce({ error: 'An account with this email already exists.' })
        .mockResolvedValueOnce(undefined);

      render(<SignUpForm />);
      await fillAndSubmit();
      await screen.findByRole('alert');

      await userEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });
});
