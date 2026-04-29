"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div
        className="text-7xl font-mono font-semibold tabular-nums"
        aria-live="polite"
      >
        {count}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setCount((c) => c - 1)}
          className="px-4 py-2 rounded-md border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition"
          aria-label="Decrement"
        >
          −1
        </button>
        <button
          onClick={() => setCount(0)}
          className="px-4 py-2 rounded-md border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          Reset
        </button>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
          aria-label="Increment"
        >
          +1
        </button>
      </div>
    </div>
  );
}
