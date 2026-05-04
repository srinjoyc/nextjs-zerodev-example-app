"use client";

import { useEffect } from "react";
import { handleOAuthCallback } from "@zerodev/wallet-react";

export default function OAuthCallbackHandler() {
  useEffect(() => {
    // Only runs when this page is a popup and the URL has oauth_success params.
    // Relays the result back to the opener via postMessage then closes the popup.
    handleOAuthCallback();
  }, []);

  return null;
}
