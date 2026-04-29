"use client";

import { useState, useEffect, useCallback } from "react";
import { saveRecord } from "../lib/leaderboard";

export interface TxParams {
  to: string;
  value: string;
}

interface WalletDashboardProps {
  providerName: string;
  address: string;
  onSignMessage: (message: string) => Promise<string>;
  onSignTransaction?: (tx: TxParams) => Promise<string>;
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
  providerName,
  address,
  onSignMessage,
  onSignTransaction,
}: WalletDashboardProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);
  const [signDuration, setSignDuration] = useState<number | null>(null);

  const [txTo, setTxTo] = useState("");
  const [txValue, setTxValue] = useState("0");
  const [txResult, setTxResult] = useState<string | null>(null);
  const [txSigning, setTxSigning] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txDuration, setTxDuration] = useState<number | null>(null);

  const [copied, setCopied] = useState<"address" | "sig" | "tx" | null>(null);

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

  const copy = (text: string, key: "address" | "sig" | "tx") => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleSign = async () => {
    if (!message.trim()) return;
    setSigning(true);
    setSignError(null);
    setSignature(null);
    setSignDuration(null);
    const t0 = performance.now();
    try {
      setSignature(await onSignMessage(message));
      const d = performance.now() - t0;
      setSignDuration(d);
      saveRecord({ provider: providerName, type: "personal", duration: d });
    } catch (e) {
      setSignError(e instanceof Error ? e.message : "Signing failed");
    } finally {
      setSigning(false);
    }
  };

  const handleSignTx = async () => {
    if (!txTo.trim() || !onSignTransaction) return;
    setTxSigning(true);
    setTxError(null);
    setTxResult(null);
    setTxDuration(null);
    const t0 = performance.now();
    try {
      setTxResult(await onSignTransaction({ to: txTo.trim(), value: txValue || "0" }));
      const d = performance.now() - t0;
      setTxDuration(d);
      saveRecord({ provider: providerName, type: "transaction", duration: d });
    } catch (e) {
      setTxError(e instanceof Error ? e.message : "Transaction signing failed");
    } finally {
      setTxSigning(false);
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
              <div className="flex items-center gap-2">
                <p className="text-xs opacity-40">Signature</p>
                {signDuration !== null && (
                  <span className="text-xs font-mono text-green-600 dark:text-green-400">
                    {signDuration < 1000
                      ? `${Math.round(signDuration)}ms`
                      : `${(signDuration / 1000).toFixed(2)}s`}
                  </span>
                )}
              </div>
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

      {/* Sign Transaction */}
      {onSignTransaction && (
        <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs opacity-40 uppercase tracking-wide">
              Sign Transaction
            </p>
            <span className="text-xs opacity-30">nonce 0 · demo only</span>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              value={txTo}
              onChange={(e) => setTxTo(e.target.value)}
              placeholder="To address (0x…)"
              className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={txValue}
                onChange={(e) => setTxValue(e.target.value)}
                placeholder="0"
                min="0"
                step="0.001"
                className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
              />
              <span className="text-sm opacity-40 shrink-0">ETH</span>
            </div>
          </div>

          <button
            onClick={handleSignTx}
            disabled={txSigning || !txTo.trim()}
            className="w-full py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
          >
            {txSigning ? "Signing…" : "Sign transaction"}
          </button>

          {txError && (
            <p className="text-xs text-red-500">{txError}</p>
          )}

          {txResult && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs opacity-40">Signed transaction</p>
                  {txDuration !== null && (
                    <span className="text-xs font-mono text-green-600 dark:text-green-400">
                      {txDuration < 1000
                        ? `${Math.round(txDuration)}ms`
                        : `${(txDuration / 1000).toFixed(2)}s`}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => copy(txResult, "tx")}
                  className="text-xs opacity-50 hover:opacity-100 transition"
                >
                  {copied === "tx" ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="font-mono text-xs break-all opacity-60 bg-black/5 dark:bg-white/5 rounded-lg p-3">
                {txResult}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
