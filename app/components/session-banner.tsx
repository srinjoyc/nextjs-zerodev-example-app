"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getSession, clearSessionForProvider, type ProviderSession } from "../lib/session";

export default function SessionBanner() {
  const [session, setSession] = useState<ProviderSession | null>(null);

  const refresh = useCallback(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!session) return null;

  const shortAddress = session.address
    ? `${session.address.slice(0, 6)}…${session.address.slice(-4)}`
    : null;

  const handleSignOut = () => {
    clearSessionForProvider(session.provider);
    setSession(null);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="font-medium">{session.provider}</span>
        <span className="opacity-30">·</span>
        <span className="opacity-60">{session.displayName}</span>
        {shortAddress && (
          <>
            <span className="opacity-30">·</span>
            <span className="font-mono opacity-40 text-xs">{shortAddress}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={session.providerHref}
          className="text-xs font-medium opacity-60 hover:opacity-100 transition"
        >
          Return →
        </Link>
        <button
          onClick={handleSignOut}
          className="text-xs opacity-40 hover:opacity-80 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
