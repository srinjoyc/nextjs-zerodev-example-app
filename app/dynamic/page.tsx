"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import type { UserProfile } from "@dynamic-labs/types";
import DynamicAuthButton from "./auth-button";
import { useDynamicSettings } from "./provider";
import WalletDashboard from "../components/wallet-dashboard";
import { setSession, clearSessionForProvider } from "../lib/session";

function DynamicProfile({ user }: { user: UserProfile }) {
  const oauthCred = user.verifiedCredentials?.find((c) => c.oauthProvider);
  const email =
    user.email ??
    oauthCred?.oauthEmails?.[0] ??
    oauthCred?.email;
  const name =
    oauthCred?.oauthDisplayName ??
    (user.firstName
      ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
      : undefined);
  const picture = oauthCred?.oauthAccountPhotos?.[0];

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-3">
      <p className="text-xs opacity-40 uppercase tracking-wide">Profile</p>
      <div className="flex items-center gap-3">
        {picture && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={picture} alt="avatar" className="h-10 w-10 rounded-full shrink-0" />
        )}
        <div className="space-y-0.5 min-w-0">
          {name && <p className="text-sm font-medium truncate">{name}</p>}
          {email && <p className="text-sm font-mono opacity-60 truncate">{email}</p>}
        </div>
      </div>
      {oauthCred && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {oauthCred.oauthProvider && (
            <>
              <span className="opacity-40">Provider</span>
              <span className="font-mono opacity-80 capitalize">{oauthCred.oauthProvider}</span>
            </>
          )}
          {oauthCred.oauthAccountId && (
            <>
              <span className="opacity-40">Subject</span>
              <span className="font-mono opacity-60 truncate">{oauthCred.oauthAccountId}</span>
            </>
          )}
          {oauthCred.oauthUsername && (
            <>
              <span className="opacity-40">Username</span>
              <span className="font-mono opacity-60 truncate">{oauthCred.oauthUsername}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function DynamicPage() {
  const { sdkHasLoaded, primaryWallet, user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const { txConfirmRequired, setTxConfirmRequired } = useDynamicSettings();

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
      clearSessionForProvider("Dynamic");
    }
  }, [isLoggedIn, sdkHasLoaded, user, address]);

  const getWalletClient = () => {
    const wc = (primaryWallet?.connector as any)?.getWalletClient?.();
    if (!wc) throw new Error("Wallet client unavailable");
    return wc;
  };

  const signMessage = async (message: string): Promise<string> => {
    if (!primaryWallet) throw new Error("No wallet found");
    if (txConfirmRequired) {
      // Goes through Dynamic's confirmation modal
      return (await primaryWallet.signMessage(message)) as string;
    }
    // Calls viem wallet client directly — no Dynamic UI
    return getWalletClient().signMessage({ message });
  };

  const signTransaction = async ({
    to,
    value,
  }: {
    to: string;
    value: string;
  }): Promise<string> => {
    if (!primaryWallet) throw new Error("No wallet found");
    const valueWei = BigInt(Math.round(parseFloat(value) * 1e18));
    return getWalletClient().signTransaction({
      to: to as `0x${string}`,
      value: valueWei,
      gas: BigInt(21000),
      maxFeePerGas: BigInt(20000000000),
      maxPriorityFeePerGas: BigInt(1000000000),
      nonce: 0,
      type: "eip1559",
      chainId: 421614,
    }) as Promise<string>;
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

        <div className="flex items-center justify-between rounded-xl border border-black/10 dark:border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Transaction confirmation UI</p>
            <p className="text-xs opacity-40">Show Dynamic's built-in confirmation modal before signing</p>
          </div>
          <button
            onClick={() => setTxConfirmRequired(!txConfirmRequired)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              txConfirmRequired ? "bg-[#4F46E5]" : "bg-black/20 dark:bg-white/20"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                txConfirmRequired ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {!sdkHasLoaded || !isLoggedIn ? (
          <div className="text-center py-12">
            <p className="text-base opacity-50">Sign in to view your wallet.</p>
          </div>
        ) : address ? (
          <>
            {user && <DynamicProfile user={user} />}
            <WalletDashboard
              providerName="Dynamic"
              address={address}
              onSignMessage={signMessage}
              onSignTransaction={signTransaction}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-base opacity-50">Creating your wallet…</p>
          </div>
        )}
      </div>
    </main>
  );
}
