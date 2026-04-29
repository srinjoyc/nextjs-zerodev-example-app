import TurnkeyProviderWrapper from "./provider";

export default function TurnkeyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link rel="stylesheet" href="/turnkey-styles.css" />
      <TurnkeyProviderWrapper>{children}</TurnkeyProviderWrapper>
    </>
  );
}
