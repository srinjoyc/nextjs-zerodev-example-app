"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import Counter from "../counter";
import AuthButton from "../components/auth-button";

export default function PrivyPage() {
  const { ready, authenticated, user } = usePrivy();
  const walletAddress = user?.wallet?.address;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm opacity-50 hover:opacity-100 transition"
          >
            ← Back
          </Link>
          <AuthButton />
        </div>

        <div className="text-center space-y-2">
          <div className="inline-block h-2 w-2 rounded-full bg-[#FF4D00] mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">Privy</h1>
          <p className="text-sm opacity-50">
            Email and social login with embedded wallet provisioning.
          </p>
        </div>

        {!ready || !authenticated ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-base opacity-50">Sign in to use the counter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Counter />
            {walletAddress && (
              <p className="text-center text-xs opacity-40 font-mono break-all">
                {walletAddress}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
