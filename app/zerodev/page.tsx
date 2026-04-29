"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { useAuthenticators } from "@zerodev/wallet-react";
import ZeroDevAuthButton from "./auth-button";
import WalletDashboard from "../components/wallet-dashboard";
import { setSession, clearSessionForProvider } from "../lib/session";

export default function ZeroDevPage() {
  const { address, isConnected, status } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { data: walletClient } = useWalletClient();
  const { data: authenticators } = useAuthenticators();

  const email = authenticators?.emailContacts?.[0]?.email;

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
      chainId: 11155111,
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
          <WalletDashboard
            providerName="ZeroDev"
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
