"use client";

import { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./config";

const queryClient = new QueryClient();

const SUPPORTED_CHAIN_IDS = wagmiConfig.chains.map((c) => c.id);

function clearStaleZeroDevState() {
  try {
    const raw = localStorage.getItem("zerodev-wallet");
    if (!raw) return;
    const { state } = JSON.parse(raw) as { state?: { activeChainId?: number } };
    if (state?.activeChainId && !(SUPPORTED_CHAIN_IDS as number[]).includes(state.activeChainId)) {
      localStorage.removeItem("zerodev-wallet");
    }
  } catch {
    // ignore parse errors
  }
}

export default function ZeroDevProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    clearStaleZeroDevState();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
