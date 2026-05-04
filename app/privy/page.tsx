"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import AuthButton from "./auth-button";
import WalletDashboard from "../components/wallet-dashboard";
import { setSession, clearSessionForProvider } from "../lib/session";

export default function PrivyPage() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  const privyWallet = wallets.find((w) => w.walletClientType === "privy");
  const address = user?.wallet?.address;

  useEffect(() => {
    if (authenticated && user) {
      const displayName =
        user.google?.name ?? user.email?.address ?? "User";
      setSession({
        provider: "Privy",
        providerHref: "/privy",
        address: address ?? "",
        displayName,
      });
    } else if (ready && !authenticated) {
      clearSessionForProvider("Privy");
    }
  }, [authenticated, ready, user, address]);

  const signMessage = async (message: string): Promise<string> => {
    if (!privyWallet) throw new Error("No wallet found");
    const provider = await privyWallet.getEthereumProvider();
    const sig = await provider.request({
      method: "personal_sign",
      params: [message, privyWallet.address],
    });
    return sig as string;
  };

  const signTransaction = async ({
    to,
    value,
  }: {
    to: string;
    value: string;
  }): Promise<string> => {
    if (!privyWallet || !address) throw new Error("No wallet found");
    const provider = await privyWallet.getEthereumProvider();
    const valueHex = `0x${BigInt(Math.round(parseFloat(value) * 1e18)).toString(16)}`;
    const result = await provider.request({
      method: "eth_signTransaction",
      params: [
        {
          from: address,
          to,
          value: valueHex,
          gas: "0x5208",
          maxFeePerGas: "0x4A817C800",
          maxPriorityFeePerGas: "0x3B9ACA00",
          nonce: "0x0",
          type: "0x2",
          chainId: "0x66EEE",
        },
      ],
    });
    return result as string;
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
          <div className="text-center py-12">
            <p className="text-base opacity-50">Sign in to view your wallet.</p>
          </div>
        ) : address ? (
          <WalletDashboard
            providerName="Privy"
            address={address}
            onSignMessage={signMessage}
            onSignTransaction={signTransaction}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-base opacity-50">Creating your wallet…</p>
          </div>
        )}
      </div>
    </main>
  );
}
