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
import { signUpWithCredentials } from './actions';

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().check(z.email({ message: 'Please enter a valid email.' })),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  function onSubmit(data: FormValues) {
    setServerError(null);
    startTransition(async () => {
      try {
        const result = await signUpWithCredentials(data.name, data.email, data.password);
        if (result?.error) {
          setServerError(result.error);
        }
      } catch {
        setServerError('Something went wrong. Please try again.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-500">
      <h1 className="text-preset-1 text-grey-900">Sign Up</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-400" noValidate>
        <Input
          label="Name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          required
          aria-required="true"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          aria-required="true"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Create Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          aria-required="true"
          error={errors.password?.message}
          helperText={errors.password ? undefined : 'Passwords must be at least 8 characters.'}
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
          Create Account
        </Button>
      </form>

      <p className="text-preset-4 text-grey-500 text-center">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-preset-4-bold text-grey-900 underline underline-offset-2"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
