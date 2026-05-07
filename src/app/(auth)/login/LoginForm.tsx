'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EyeIcon } from '@/components/ui/icons/EyeIcon';
import { EyeOffIcon } from '@/components/ui/icons/EyeOffIcon';
import { GitHubIcon } from '@/components/ui/icons/GitHubIcon';
import { loginWithCredentials, loginWithGitHub } from './actions';

const schema = z.object({
  email: z.string().check(z.email({ message: 'Please enter a valid email.' })),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type FormValues = z.infer<typeof schema>;

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
          href="/signup"
          className="text-preset-4-bold text-grey-900 underline underline-offset-2"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
