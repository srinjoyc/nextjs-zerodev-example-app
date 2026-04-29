"use client";

import { useTurnkey } from "@turnkey/react-wallet-kit";
import { AuthState, ClientState } from "@turnkey/react-wallet-kit";

export default function AuthButton() {
  const { authState, clientState, handleLogin, user, logout } = useTurnkey();

  if (clientState === ClientState.Loading) {
    return (
      <div className="h-9 w-24 rounded-lg bg-black/[0.05] dark:bg-white/[0.05] animate-pulse" />
    );
  }

  if (authState === AuthState.Authenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-60">{user?.userName}</span>
        <button
          onClick={() => logout?.()}
          className="rounded-lg bg-black/[0.05] dark:bg-white/[0.05] px-4 py-2 text-sm font-medium hover:bg-black/10 dark:hover:bg-white/10 transition"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => handleLogin()}
      className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 transition dark:bg-white dark:text-black dark:hover:bg-white/80"
    >
      Sign in
    </button>
  );
}
