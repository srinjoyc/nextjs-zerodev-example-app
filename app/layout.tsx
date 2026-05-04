import type { Metadata } from "next";
import "./globals.css";
import OAuthCallbackHandler from "./components/oauth-callback-handler";

export const metadata: Metadata = {
  title: "Wallet Provider Demo",
  description: "Compare embedded wallet and authentication providers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <OAuthCallbackHandler />
        {children}
      </body>
    </html>
  );
}
