"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTurnkey } from "@turnkey/react-wallet-kit";
import { AuthState } from "@turnkey/react-wallet-kit";
import { serializeTransaction } from "viem";
import AuthButton from "./auth-button";
import WalletDashboard from "../components/wallet-dashboard";
import { setSession, clearSessionForProvider } from "../lib/session";

export default function TurnkeyPage() {
  const { authState, user, wallets, signMessage, signTransaction, createWallet } = useTurnkey();

  const walletAccount = wallets[0]?.accounts[0];
  const address = walletAccount?.address;

  useEffect(() => {
    if (authState === AuthState.Authenticated && wallets.length === 0) {
      createWallet({
        walletName: "Default",
        accounts: ["ADDRESS_FORMAT_ETHEREUM"],
      }).catch(console.error);
    }
  }, [authState, wallets.length]);

  useEffect(() => {
    if (authState === AuthState.Authenticated && user) {
      setSession({
        provider: "Turnkey",
        providerHref: "/turnkey",
        address: address ?? "",
        displayName: user.userName ?? "User",
      });
    } else if (authState === AuthState.Unauthenticated) {
      clearSessionForProvider("Turnkey");
    }
  }, [authState, user, address]);

  const handleSignTransaction = async ({
    to,
    value,
  }: {
    to: string;
    value: string;
  }): Promise<string> => {
    if (!walletAccount) throw new Error("No wallet found");
    const valueWei = BigInt(Math.round(parseFloat(value) * 1e18));
    const unsignedHex = serializeTransaction({
      to: to as `0x${string}`,
      value: valueWei,
      gas: BigInt(21000),
      maxFeePerGas: BigInt(20000000000),
      maxPriorityFeePerGas: BigInt(1000000000),
      nonce: 0,
      type: "eip1559",
      chainId: 1,
    });
    const result = await signTransaction({
      unsignedTransaction: unsignedHex.slice(2),
      transactionType: "TRANSACTION_TYPE_ETHEREUM",
      walletAccount,
    });
    return result.startsWith("0x") ? result : `0x${result}`;
  };

  const handleSignMessage = async (message: string): Promise<string> => {
    if (!walletAccount) throw new Error("No wallet found");
    const result = await signMessage({ message, walletAccount, addEthereumPrefix: true });
    const r = result.r.replace("0x", "").padStart(64, "0");
    const s = result.s.replace("0x", "").padStart(64, "0");
    const vNum = parseInt(result.v, 16);
    const v = (vNum < 27 ? vNum + 27 : vNum).toString(16).padStart(2, "0");
    return `0x${r}${s}${v}`;
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
          <div className="inline-block h-2 w-2 rounded-full bg-[#6366F1] mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">Turnkey</h1>
          <p className="text-sm opacity-50">
            Secure embedded wallets with email OTP and social login.
          </p>
        </div>

        {authState !== AuthState.Authenticated ? (
          <div className="text-center py-12">
            <p className="text-base opacity-50">Sign in to view your wallet.</p>
          </div>
        ) : address ? (
          <WalletDashboard
            providerName="Turnkey"
            address={address}
            onSignMessage={handleSignMessage}
            onSignTransaction={handleSignTransaction}
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
