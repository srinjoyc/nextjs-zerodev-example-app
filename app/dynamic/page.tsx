"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import DynamicAuthButton from "./auth-button";
import WalletDashboard from "../components/wallet-dashboard";
import { setSession, clearSession } from "../lib/session";

export default function DynamicPage() {
  const { sdkHasLoaded, primaryWallet, user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const address = primaryWallet?.address;

  useEffect(() => {
    if (isLoggedIn && user) {
      const displayName =
        (user.firstName
          ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
          : undefined) ??
        user.email ??
        "User";
      setSession({
        provider: "Dynamic",
        providerHref: "/dynamic",
        address: address ?? "",
        displayName,
      });
    } else if (sdkHasLoaded && !isLoggedIn) {
      clearSession();
    }
  }, [isLoggedIn, sdkHasLoaded, user, address]);

  const signMessage = async (message: string): Promise<string> => {
    if (!primaryWallet) throw new Error("No wallet found");
    const sig = await primaryWallet.signMessage(message);
    return sig as string;
  };

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
          <DynamicAuthButton />
        </div>

        <div className="text-center space-y-2">
          <div className="inline-block h-2 w-2 rounded-full bg-[#4F46E5] mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">Dynamic</h1>
          <p className="text-sm opacity-50">
            Email and social login with embedded wallet provisioning.
          </p>
        </div>

        {!sdkHasLoaded || !isLoggedIn ? (
          <div className="text-center py-12">
            <p className="text-base opacity-50">Sign in to view your wallet.</p>
          </div>
        ) : address ? (
          <WalletDashboard address={address} onSignMessage={signMessage} />
        ) : (
          <div className="text-center py-12">
            <p className="text-base opacity-50">Creating your wallet…</p>
          </div>
        )}
      </div>
    </main>
  );
}
