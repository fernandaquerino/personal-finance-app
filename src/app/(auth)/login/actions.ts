'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/lib/auth/auth';

export async function loginWithCredentials(
  email: string,
  password: string
): Promise<{ error: string } | undefined> {
  try {
    await signIn('credentials', { email, password, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' };
    }
    throw error;
  }
}

export async function loginWithGitHub() {
  await signIn('github', { redirectTo: '/' });
}
