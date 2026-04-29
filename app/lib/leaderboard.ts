export type SignType = "personal" | "transaction";

export interface SignRecord {
  provider: string;
  type: SignType;
  duration: number; // ms
  timestamp: number;
}

const KEY = "wallet_demo_leaderboard";
const UPDATE_EVENT = "wallet_demo_leaderboard_update";

export function getRecords(): SignRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as SignRecord[];
  } catch {
    return [];
  }
}

export function saveRecord(record: Omit<SignRecord, "timestamp">): void {
  const records = getRecords();
  records.push({ ...record, timestamp: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function clearRecords(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function subscribeToUpdates(cb: () => void): () => void {
  window.addEventListener(UPDATE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(UPDATE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export interface ProviderStats {
  provider: string;
  runs: number;
  avg: number;
  best: number;
  worst: number;
  median: number;
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function getLeaderboard(type: SignType): ProviderStats[] {
  const records = getRecords().filter((r) => r.type === type);
  const byProvider = new Map<string, number[]>();

  for (const r of records) {
    const arr = byProvider.get(r.provider) ?? [];
    arr.push(r.duration);
    byProvider.set(r.provider, arr);
  }

  return Array.from(byProvider.entries())
    .map(([provider, durations]) => {
      const sorted = [...durations].sort((a, b) => a - b);
      const avg = durations.reduce((s, d) => s + d, 0) / durations.length;
      return {
        provider,
        runs: durations.length,
        avg,
        best: sorted[0],
        worst: sorted[sorted.length - 1],
        median: median(sorted),
      };
    })
    .sort((a, b) => a.avg - b.avg);
}
