import Image from 'next/image';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <main className="bg-beige-100 flex min-h-screen items-center justify-center p-500">
      <div className="grid w-full max-w-[75rem] grid-cols-2 items-center gap-[140]">
        {/* Left panel — taller than the form card */}
        <div
          className="hidden h-[40rem] flex-1 flex-col justify-between overflow-hidden rounded-2xl p-600 lg:flex"
          style={{
            backgroundImage: 'url(/images/login-illustration.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Image src="/images/logo.png" alt="finance" width={120} height={22} />

          <div className="space-y-300">
            <h2 className="text-preset-1 text-white">
              Keep track of your money
              <br />
              and save for your future
            </h2>
            <p className="text-preset-4 text-white">
              Personal finance app puts you in control of your spending. Track transactions, set
              budgets, and add to savings pots easily.
            </p>
          </div>
        </div>

        {/* Right panel — form card, ~half the left panel */}
        <div className="w-full shrink-0 rounded-2xl bg-white px-500 py-600 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
