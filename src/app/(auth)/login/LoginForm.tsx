'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginWithCredentials, loginWithGitHub } from './actions';

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type FormValues = z.infer<typeof schema>;

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="8"
        cy="8"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 2l12 12M6.5 6.5A2 2 0 0 0 10 10M5.2 4.2C3.5 5.1 2 7 2 8s2 4 6 4c1.3 0 2.4-.3 3.3-.8M12 5.5C13.3 6.5 14 8 14 8s-2 4-6 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: FormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await loginWithCredentials(data.email, data.password);
      if (result?.error) {
        setServerError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-500">
      <h1 className="text-preset-1 text-grey-900">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-400" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          icon={
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((v) => !v)}
              className="text-grey-500 hover:text-grey-900 flex cursor-pointer items-center"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          {...register('password')}
        />

        {serverError && (
          <p role="alert" className="text-preset-5 text-red -mt-100">
            {serverError}
          </p>
        )}

        <Button type="submit" loading={isPending} className="mt-100">
          Login
        </Button>
      </form>

      <div className="flex items-center gap-300">
        <div className="bg-grey-300 h-px flex-1" />
        <span className="text-preset-5 text-grey-500">or</span>
        <div className="bg-grey-300 h-px flex-1" />
      </div>

      <form action={loginWithGitHub}>
        <Button type="submit" variant="secondary">
          <GitHubIcon />
          Continue with GitHub
        </Button>
      </form>

      <p className="text-preset-4 text-grey-500 text-center">
        Need to create an account?{' '}
        <Link
          href="/register"
          className="text-preset-4-bold text-grey-900 underline underline-offset-2"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
