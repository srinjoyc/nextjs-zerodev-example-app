"use client";

import { useState, useEffect } from "react";
import {
  getLeaderboard,
  clearRecords,
  subscribeToUpdates,
  type ProviderStats,
  type SignType,
} from "../lib/leaderboard";

const PROVIDER_COLORS: Record<string, string> = {
  Privy: "#FF4D00",
  Dynamic: "#4F46E5",
  ZeroDev: "#16A34A",
  Turnkey: "#6366F1",
};

function fmt(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
}

function Medal({ rank }: { rank: number }) {
  if (rank === 0) return <span className="text-yellow-500 text-sm">🥇</span>;
  if (rank === 1) return <span className="text-slate-400 text-sm">🥈</span>;
  if (rank === 2) return <span className="text-amber-600 text-sm">🥉</span>;
  return (
    <span className="text-xs opacity-30 w-5 text-center font-mono">
      {rank + 1}
    </span>
  );
}

function Section({
  title,
  entries,
}: {
  title: string;
  entries: ProviderStats[];
}) {
  if (entries.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium opacity-50 uppercase tracking-wide">
          {title}
        </p>
        <p className="text-xs opacity-30 py-4 text-center">No data yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium opacity-50 uppercase tracking-wide">
        {title}
      </p>
      <div className="space-y-1">
        {entries.map((entry, i) => {
          const color = PROVIDER_COLORS[entry.provider] ?? "#888";
          return (
            <div
              key={entry.provider}
              className="rounded-lg border border-black/10 dark:border-white/10 px-3 py-2.5"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Medal rank={i} />
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span className="text-sm font-medium flex-1">
                  {entry.provider}
                </span>
                <span className="text-sm font-mono font-semibold">
                  {fmt(entry.avg)}
                </span>
                <span className="text-xs opacity-40">avg</span>
              </div>
              <div className="flex gap-3 pl-9 text-xs font-mono opacity-40">
                <span>{entry.runs} run{entry.runs !== 1 ? "s" : ""}</span>
                <span>best {fmt(entry.best)}</span>
                <span>worst {fmt(entry.worst)}</span>
                <span>p50 {fmt(entry.median)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [personal, setPersonal] = useState<ProviderStats[]>([]);
  const [transaction, setTransaction] = useState<ProviderStats[]>([]);

  const refresh = () => {
    setPersonal(getLeaderboard("personal"));
    setTransaction(getLeaderboard("transaction"));
  };

  useEffect(() => {
    refresh();
    return subscribeToUpdates(refresh);
  }, []);

  const hasData = personal.length > 0 || transaction.length > 0;

  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Signing Leaderboard</p>
        {hasData && (
          <button
            onClick={clearRecords}
            className="text-xs opacity-30 hover:opacity-70 transition"
          >
            Clear
          </button>
        )}
      </div>

      <Section title="Personal Sign" entries={personal} />
      <Section title="Transaction Sign" entries={transaction} />
    </div>
  );
}
