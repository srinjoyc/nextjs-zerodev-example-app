import { createConfig, http, createStorage, noopStorage } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { zeroDevWallet } from "@zerodev/wallet-react";

const projectId = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID!;

export const wagmiConfig = createConfig({
  connectors: [
    zeroDevWallet({ projectId, chains: [arbitrumSepolia] }),
  ],
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
  // Versioned key busts any persisted state from previous chain (Sepolia).
  storage: createStorage({
    key: "zerodev.arb-sep.v1",
    storage: typeof window !== "undefined" ? localStorage : noopStorage,
  }),
  ssr: true,
});
