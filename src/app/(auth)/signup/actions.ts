'use server';

import { AuthError } from 'next-auth';
import { hash } from 'bcryptjs';
import { signIn } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/prisma';

export async function signUpWithCredentials(
  name: string,
  email: string,
  password: string
): Promise<{ error: string } | undefined> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'An account with this email already exists.' };
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account created but sign-in failed. Please log in.' };
    }
    throw error;
  }
}
