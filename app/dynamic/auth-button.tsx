"use client";

import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { clearSession } from "../lib/session";

export default function DynamicAuthButton() {
  const { sdkHasLoaded, setShowAuthFlow, handleLogOut, user } =
    useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  if (!sdkHasLoaded) {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
    );
  }

  if (!isLoggedIn) {
    return (
      <button
        onClick={() => setShowAuthFlow(true)}
        className="px-5 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition text-sm font-medium"
      >
        Sign in
      </button>
    );
  }

  const displayName =
    (user?.firstName
      ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
      : undefined) ??
    user?.email ??
    "User";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm opacity-70">{displayName}</span>
      <button
        onClick={() => {
          clearSession();
          handleLogOut();
        }}
        className="px-4 py-2 rounded-md border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition text-sm"
      >
        Sign out
      </button>
    </div>
  );
}
