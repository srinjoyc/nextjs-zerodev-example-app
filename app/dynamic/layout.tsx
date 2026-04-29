import DynamicProvider from "./provider";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DynamicProvider>{children}</DynamicProvider>;
}
