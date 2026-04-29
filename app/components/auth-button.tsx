"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function AuthButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="px-5 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition text-sm font-medium"
      >
        Sign in
      </button>
    );
  }

  const walletShort = user?.wallet?.address
    ? user.wallet.address.slice(0, 6) + "..."
    : undefined;
  const displayName =
    user?.google?.name ?? user?.email?.address ?? walletShort ?? "User";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm opacity-70">{displayName}</span>
      <button
        onClick={logout}
        className="px-4 py-2 rounded-md border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition text-sm"
      >
        Sign out
      </button>
    </div>
  );
}
