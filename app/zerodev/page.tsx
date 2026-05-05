"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAccount, useSignMessage, useWalletClient, useSendTransaction } from "wagmi";
import { useAuthenticators } from "@zerodev/wallet-react";
import { isAddress } from "viem";
import ZeroDevAuthButton from "./auth-button";
import WalletDashboard from "../components/wallet-dashboard";
import { setSession, clearSessionForProvider } from "../lib/session";

interface AuthenticatorsData {
  emailContacts?: Array<{ email?: string; [key: string]: unknown }>;
  oauths?: Array<{ provider?: string; clientId?: string; subject?: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

const HEADER_KEYS = new Set(["provider", "clientId", "subject", "picture", "avatar_url", "name", "given_name"]);

function OAuthProfile({ authenticators }: { authenticators: AuthenticatorsData }) {
  const oauth = authenticators.oauths?.[0];

  const allOAuthEntries = oauth
    ? Object.entries(oauth).filter(([, v]) => v !== null && v !== undefined && v !== "")
    : [];

  const emailContact = authenticators.emailContacts?.[0]?.email;
  const emailFromOAuth = allOAuthEntries.find(([k]) =>
    k === "email" || k === "email_address" || k === "emailAddress"
  )?.[1] as string | undefined;
  const email = emailContact ?? emailFromOAuth;

  const extraFields = allOAuthEntries.filter(([k]) => !HEADER_KEYS.has(k) && k !== "email" && k !== "email_address" && k !== "emailAddress");

  const picture =
    (oauth?.picture as string | undefined) ??
    (allOAuthEntries.find(([k]) => k === "avatar_url")?.[1] as string | undefined);

  const name =
    (oauth?.name as string | undefined) ??
    (oauth?.given_name as string | undefined);

  if (!oauth && !email) return null;

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-3">
      <p className="text-xs opacity-40 uppercase tracking-wide">OAuth Profile</p>
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
      {oauth && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {oauth.provider && (
            <>
              <span className="opacity-40">Provider</span>
              <span className="font-mono opacity-80 capitalize">{oauth.provider}</span>
            </>
          )}
          {oauth.subject && (
            <>
              <span className="opacity-40">Subject</span>
              <span className="font-mono opacity-60 truncate">{oauth.subject as string}</span>
            </>
          )}
          {extraFields
            .filter(([k]) => !["name", "given_name", "picture", "avatar_url"].includes(k))
            .slice(0, 6)
            .map(([k, v]) => (
              <React.Fragment key={k}>
                <span className="opacity-40">{k}</span>
                <span className="font-mono opacity-60 truncate">{String(v)}</span>
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
}

export default function ZeroDevPage() {
  const { address, isConnected, status } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: walletClient } = useWalletClient();
  const { sendTransactionAsync } = useSendTransaction();
  const { data: authenticators } = useAuthenticators();

  const oauthEntry = authenticators?.oauths?.[0];
  const email =
    authenticators?.emailContacts?.[0]?.email ??
    (oauthEntry?.email as string | undefined);

  useEffect(() => {
    if (isConnected && address) {
      setSession({
        provider: "ZeroDev",
        providerHref: "/zerodev",
        address,
        displayName: email ?? `${address.slice(0, 6)}…${address.slice(-4)}`,
      });
    } else if (status === "disconnected") {
      clearSessionForProvider("ZeroDev");
    }
  }, [isConnected, status, address, email]);

  const signMessage = (message: string) => signMessageAsync({ message });

  const sendGaslessTransaction = async ({
    to,
    value,
  }: {
    to: string;
    value: string;
  }): Promise<string> => {
    if (!isAddress(to)) throw new Error("Invalid recipient address");
    const valueWei = BigInt(Math.round(parseFloat(value) * 1e18));
    return sendTransactionAsync({ to: to as `0x${string}`, value: valueWei });
  };

  const signTransaction = async ({
    to,
    value,
  }: {
    to: string;
    value: string;
  }): Promise<string> => {
    if (!walletClient) throw new Error("Wallet client unavailable");
    const valueWei = BigInt(Math.round(parseFloat(value) * 1e18));
    const result = await walletClient.signTransaction({
      to: to as `0x${string}`,
      value: valueWei,
      gas: BigInt(21000),
      maxFeePerGas: BigInt(20000000000),
      maxPriorityFeePerGas: BigInt(1000000000),
      nonce: 0,
      type: "eip1559",
      chainId: 421614,
    });
    return result;
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
          <ZeroDevAuthButton />
        </div>

        <div className="text-center space-y-2">
          <div className="inline-block h-2 w-2 rounded-full bg-[#16A34A] mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">ZeroDev</h1>
          <p className="text-sm opacity-50">
            Smart account wallet with email OTP and social login.
          </p>
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <p className="text-base opacity-50">Sign in to view your wallet.</p>
          </div>
        ) : address ? (
          <>
            {authenticators && (
              <OAuthProfile authenticators={authenticators as AuthenticatorsData} />
            )}
            <WalletDashboard
              providerName="ZeroDev"
              address={address}
              onSignMessage={signMessage}
              onSignTransaction={signTransaction}
              onSendGaslessTransaction={sendGaslessTransaction}
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
