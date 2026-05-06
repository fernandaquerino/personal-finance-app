import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';
import * as actions from './actions';

vi.mock('./actions', () => ({
  loginWithCredentials: vi.fn(),
  loginWithGitHub: vi.fn(),
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

const mockLoginWithCredentials = vi.mocked(actions.loginWithCredentials);

const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'secret123';

async function fillAndSubmit(email = VALID_EMAIL, password = VALID_PASSWORD) {
  await userEvent.type(screen.getByLabelText('Email'), email);
  await userEvent.type(screen.getByLabelText('Password'), password);
  await userEvent.click(screen.getByRole('button', { name: 'Login' }));
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoginWithCredentials.mockResolvedValue(undefined);
  });

  describe('rendering', () => {
    it('renders the login heading', () => {
      render(<LoginForm />);
      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders email and password fields', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders the login submit button', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('renders the GitHub button', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument();
    });

    it('renders the sign up link pointing to /register', () => {
      render(<LoginForm />);
      expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/register');
    });
  });

  describe('password toggle', () => {
    it('renders password field as type password by default', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('shows password when toggle is clicked', async () => {
      render(<LoginForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });

    it('updates toggle aria-label after reveal', async () => {
      render(<LoginForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
    });

    it('hides password again on second click', async () => {
      render(<LoginForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }));
      await userEvent.click(screen.getByRole('button', { name: 'Hide password' }));
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });
  });

  describe('validation', () => {
    it('shows error for empty email on submit', async () => {
      render(<LoginForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      expect(await screen.findByText('Please enter a valid email.')).toBeInTheDocument();
    });

    it('shows error for malformed email', async () => {
      render(<LoginForm />);
      await userEvent.type(screen.getByLabelText('Email'), 'notanemail');
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      expect(await screen.findByText('Please enter a valid email.')).toBeInTheDocument();
    });

    it('shows error for empty password on submit', async () => {
      render(<LoginForm />);
      await userEvent.type(screen.getByLabelText('Email'), VALID_EMAIL);
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      expect(await screen.findByText('Password is required.')).toBeInTheDocument();
    });

    it('does not call loginWithCredentials when form is invalid', async () => {
      render(<LoginForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      expect(mockLoginWithCredentials).not.toHaveBeenCalled();
    });
  });

  describe('submission', () => {
    it('calls loginWithCredentials with email and password', async () => {
      render(<LoginForm />);
      await fillAndSubmit();
      await waitFor(() => {
        expect(mockLoginWithCredentials).toHaveBeenCalledWith(VALID_EMAIL, VALID_PASSWORD);
      });
    });

    it('calls loginWithCredentials exactly once per submit', async () => {
      render(<LoginForm />);
      await fillAndSubmit();
      await waitFor(() => {
        expect(mockLoginWithCredentials).toHaveBeenCalledOnce();
      });
    });

    it('shows server error when credentials are invalid', async () => {
      mockLoginWithCredentials.mockResolvedValue({ error: 'Invalid email or password.' });
      render(<LoginForm />);
      await fillAndSubmit();
      expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.');
    });

    it('clears server error before each new submission', async () => {
      mockLoginWithCredentials
        .mockResolvedValueOnce({ error: 'Invalid email or password.' })
        .mockResolvedValueOnce(undefined);

      render(<LoginForm />);
      await fillAndSubmit();
      await screen.findByRole('alert');

      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('email field has type email', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    it('password toggle has a descriptive aria-label', () => {
      render(<LoginForm />);
      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('server error uses role alert so it is announced', async () => {
      mockLoginWithCredentials.mockResolvedValue({ error: 'Invalid email or password.' });
      render(<LoginForm />);
      await fillAndSubmit();
      expect(await screen.findByRole('alert')).toBeInTheDocument();
    });

    it('validation errors use role alert', async () => {
      render(<LoginForm />);
      await userEvent.click(screen.getByRole('button', { name: 'Login' }));
      const alerts = await screen.findAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('form fields are navigable by keyboard', async () => {
      render(<LoginForm />);
      screen.getByLabelText('Email').focus();
      await userEvent.tab();
      expect(screen.getByLabelText('Password')).toHaveFocus();
    });
  });
});
