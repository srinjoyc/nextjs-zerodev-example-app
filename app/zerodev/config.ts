import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { zeroDevWallet } from "@zerodev/wallet-react";

const projectId = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID!;

export const wagmiConfig = createConfig({
  connectors: [
    zeroDevWallet({ projectId, chains: [sepolia] }),
  ],
  chains: [sepolia],
  // Use ZeroDev's bundler as the RPC transport — it handles both ERC-4337
  // and standard eth_ calls, avoiding wagmi's thirdweb fallback.
  transports: {
    [sepolia.id]: http(
      `https://rpc.zerodev.app/api/v2/bundler/${projectId}`
    ),
  },
  ssr: true,
});
