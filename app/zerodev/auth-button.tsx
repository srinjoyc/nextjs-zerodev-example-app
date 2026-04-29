"use client";

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import {
  useSendOTP,
  useVerifyOTP,
  useAuthenticateOAuth,
  OAUTH_PROVIDERS,
} from "@zerodev/wallet-react";
import { clearSession } from "../lib/session";

export default function ZeroDevAuthButton() {
  const { address, isConnected, status } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const [showPanel, setShowPanel] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [otpId, setOtpId] = useState<string | null>(null);

  const sendOTP = useSendOTP();
  const verifyOTP = useVerifyOTP();
  const authenticateOAuth = useAuthenticateOAuth();

  const resetPanel = () => {
    setShowPanel(false);
    setOtpId(null);
    setEmail("");
    setCode("");
  };

  const handleSendOTP = async () => {
    const result = await sendOTP.mutateAsync({ email });
    setOtpId(result.otpId);
  };

  const handleVerifyOTP = async () => {
    await verifyOTP.mutateAsync({ otpId: otpId!, code });
    resetPanel();
  };

  const handleGoogle = async () => {
    await authenticateOAuth.mutateAsync({ provider: OAUTH_PROVIDERS.GOOGLE });
    resetPanel();
  };

  if (status === "reconnecting" || status === "connecting") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-70 font-mono">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <button
          onClick={() => { clearSession(); disconnectAsync(); }}
          className="px-4 py-2 rounded-md border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition text-sm"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="px-5 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition text-sm font-medium"
      >
        Sign in
      </button>
    );
  }

  const anyError =
    sendOTP.error?.message ??
    verifyOTP.error?.message ??
    authenticateOAuth.error?.message;

  return (
    <div className="relative">
      <div className="absolute right-0 top-2 z-50 w-72 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 shadow-xl p-4 space-y-3">
        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={authenticateOAuth.isPending}
          className="w-full py-2 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition text-sm disabled:opacity-40"
        >
          {authenticateOAuth.isPending ? "Signing in…" : "Continue with Google"}
        </button>

        <div className="flex items-center gap-2 text-xs opacity-30">
          <div className="flex-1 h-px bg-current" />
          or
          <div className="flex-1 h-px bg-current" />
        </div>

        {/* Email OTP */}
        {!otpId ? (
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && email.trim() && handleSendOTP()}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
            />
            <button
              onClick={handleSendOTP}
              disabled={sendOTP.isPending || !email.trim()}
              className="w-full py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              {sendOTP.isPending ? "Sending…" : "Send code"}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs opacity-50">Code sent to {email}</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && code.trim() && handleVerifyOTP()}
              placeholder="Enter code"
              autoFocus
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={verifyOTP.isPending || !code.trim()}
              className="w-full py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              {verifyOTP.isPending ? "Verifying…" : "Verify"}
            </button>
            <button
              onClick={() => setOtpId(null)}
              className="w-full text-xs opacity-40 hover:opacity-80 transition"
            >
              ← Change email
            </button>
          </div>
        )}

        {anyError && <p className="text-xs text-red-500">{anyError}</p>}

        <button
          onClick={resetPanel}
          className="w-full text-xs opacity-30 hover:opacity-60 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
