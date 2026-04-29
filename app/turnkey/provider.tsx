"use client";

import { TurnkeyProvider, type TurnkeyProviderConfig } from "@turnkey/react-wallet-kit";

const config: TurnkeyProviderConfig = {
  organizationId: process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID!,
  authProxyConfigId: process.env.NEXT_PUBLIC_TURNKEY_AUTH_PROXY_CONFIG_ID,
  auth: {
    methods: {
      emailOtpAuthEnabled: true,
      googleOauthEnabled: true,
    },
    oauthConfig: {
      oauthRedirectUri:
        typeof window !== "undefined"
          ? `${window.location.origin}/turnkey`
          : undefined,
    },
  },
};

export default function TurnkeyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TurnkeyProvider config={config} callbacks={{ onError: console.error }}>
      {children}
    </TurnkeyProvider>
  );
}
