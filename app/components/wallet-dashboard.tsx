"use client";

import { useState, useEffect, useCallback } from "react";

interface WalletDashboardProps {
  address: string;
  onSignMessage: (message: string) => Promise<string>;
}

async function fetchEthBalance(address: string): Promise<string> {
  const res = await fetch("https://eth.llamarpc.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address, "latest"],
      id: 1,
    }),
  });
  const { result } = await res.json();
  const eth = Number(BigInt(result)) / 1e18;
  return eth.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export default function WalletDashboard({
  address,
  onSignMessage,
}: WalletDashboardProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  const [copied, setCopied] = useState<"address" | "sig" | null>(null);

  const loadBalance = useCallback(async () => {
    setBalanceLoading(true);
    try {
      setBalance(await fetchEthBalance(address));
    } catch {
      setBalance("—");
    } finally {
      setBalanceLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  const copy = (text: string, key: "address" | "sig") => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSign = async () => {
    if (!message.trim()) return;
    setSigning(true);
    setSignError(null);
    setSignature(null);
    try {
      setSignature(await onSignMessage(message));
    } catch (e) {
      setSignError(e instanceof Error ? e.message : "Signing failed");
    } finally {
      setSigning(false);
    }
  };

  const shortAddress = `${address.slice(0, 10)}…${address.slice(-8)}`;

  return (
    <div className="space-y-4 w-full">
      {/* Address */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-1">
        <p className="text-xs opacity-40 uppercase tracking-wide">Address</p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-sm break-all">{shortAddress}</span>
          <button
            onClick={() => copy(address, "address")}
            className="shrink-0 text-xs opacity-50 hover:opacity-100 transition px-2 py-1 rounded border border-black/10 dark:border-white/10"
          >
            {copied === "address" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-xs opacity-40 uppercase tracking-wide">
            Balance · Ethereum Mainnet
          </p>
          <button
            onClick={loadBalance}
            disabled={balanceLoading}
            className="text-xs opacity-50 hover:opacity-100 transition disabled:opacity-30"
          >
            {balanceLoading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>
        <p className="text-2xl font-mono font-semibold">
          {balance === null ? (
            <span className="opacity-30 animate-pulse">—</span>
          ) : (
            `${balance} ETH`
          )}
        </p>
      </div>

      {/* Personal Sign */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-3">
        <p className="text-xs opacity-40 uppercase tracking-wide">
          Personal Sign
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message to sign…"
          rows={3}
          className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
        />
        <button
          onClick={handleSign}
          disabled={signing || !message.trim()}
          className="w-full py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
        >
          {signing ? "Signing…" : "Sign message"}
        </button>

        {signError && (
          <p className="text-xs text-red-500">{signError}</p>
        )}

        {signature && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs opacity-40">Signature</p>
              <button
                onClick={() => copy(signature, "sig")}
                className="text-xs opacity-50 hover:opacity-100 transition"
              >
                {copied === "sig" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="font-mono text-xs break-all opacity-60 bg-black/5 dark:bg-white/5 rounded-lg p-3">
              {signature}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
