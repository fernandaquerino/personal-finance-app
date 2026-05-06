import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <main className="bg-grey-900 flex min-h-screen items-center justify-center p-400 lg:p-800">
      <div className="flex w-full max-w-[90rem] overflow-hidden rounded-2xl shadow-2xl">
        {/* Left panel — hidden on mobile */}
        <div className="bg-grey-900 relative hidden flex-1 flex-col justify-between p-600 lg:flex">
          <span className="text-preset-3 text-white">finance</span>

          <div className="space-y-300">
            <h1 className="text-preset-1 text-white">
              Keep track of your money
              <br />
              and save for your future
            </h1>
            <p className="text-preset-4 text-grey-300">
              Personal finance app puts you in control of your spending. Track transactions, set
              budgets, and add to savings pots easily.
            </p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="w-full bg-white px-500 py-600 lg:w-[37.5rem] lg:px-800 lg:py-[4.5rem]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
