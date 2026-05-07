'use server';

import { AuthError } from 'next-auth';
import { hash } from 'bcryptjs';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

export async function signUpWithCredentials(
  name: string,
  email: string,
  password: string
): Promise<{ error: string } | undefined> {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: 'An account with this email already exists.' };
    }

    const passwordHash = await hash(password, 12);
    await prisma.user.create({ data: { name, email, passwordHash } });

    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      return { error: 'Account created but sign-in failed. Please log in.' };
    }
    return { error: 'Something went wrong. Please try again.' };
  }
}
