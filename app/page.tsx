"use client";

import { usePrivy } from "@privy-io/react-auth";
import Counter from "./counter";
import AuthButton from "./components/auth-button";

export default function Home() {
  const { ready, authenticated, user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="flex justify-end">
          <AuthButton />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          Next.js Counter Demo
        </h1>
        <p className="text-base opacity-70">
          A minimal starter built with the App Router, TypeScript, and Tailwind
          CSS. Click the buttons below to update the count.
        </p>

        {ready && !authenticated ? (
          <div className="py-10 space-y-3">
            <p className="text-lg opacity-60">Sign in to use the counter.</p>
          </div>
        ) : (
          <>
            <Counter />
            {walletAddress && (
              <p className="text-xs opacity-50 font-mono break-all">
                {walletAddress}
              </p>
            )}
          </>
        )}

        <p className="text-xs opacity-50">
          Edit{" "}
          <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10">
            app/page.tsx
          </code>{" "}
          to get started.
        </p>
      </div>
    </main>
  );
}
