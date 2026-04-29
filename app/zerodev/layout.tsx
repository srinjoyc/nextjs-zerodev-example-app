import ZeroDevProvider from "./provider";

export default function ZeroDevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ZeroDevProvider>{children}</ZeroDevProvider>;
}
