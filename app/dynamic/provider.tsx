"use client";

import { createContext, useContext, useState } from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

interface DynamicSettingsCtx {
  txConfirmRequired: boolean;
  setTxConfirmRequired: (v: boolean) => void;
}

const DynamicSettingsContext = createContext<DynamicSettingsCtx>({
  txConfirmRequired: false,
  setTxConfirmRequired: () => {},
});

export const useDynamicSettings = () => useContext(DynamicSettingsContext);

export default function DynamicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [txConfirmRequired, setTxConfirmRequired] = useState(false);

  return (
    <DynamicSettingsContext.Provider value={{ txConfirmRequired, setTxConfirmRequired }}>
      <DynamicContextProvider
        settings={{
          environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
          walletConnectors: [EthereumWalletConnectors],
          transactionConfirmation: { required: false },
        }}
      >
        {children}
      </DynamicContextProvider>
    </DynamicSettingsContext.Provider>
  );
}
