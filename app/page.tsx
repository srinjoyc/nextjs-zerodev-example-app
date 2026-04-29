import ProviderCard from "./components/provider-card";
import SessionBanner from "./components/session-banner";

const providers = [
  {
    name: "Privy",
    description: "Email and social login with embedded wallet provisioning.",
    href: "/privy",
    status: "live" as const,
    accentColor: "#FF4D00",
  },
  {
    name: "Dynamic",
    description: "Email and social login with embedded wallet provisioning.",
    href: "/dynamic",
    status: "live" as const,
    accentColor: "#4F46E5",
  },
  {
    name: "Magic",
    description: "Passwordless login via magic links and OAuth.",
    href: "/magic",
    status: "coming-soon" as const,
    accentColor: "#7C3AED",
  },
  {
    name: "Web3Auth",
    description: "MPC-based key management with social login.",
    href: "/web3auth",
    status: "coming-soon" as const,
    accentColor: "#0364FF",
  },
  {
    name: "ZeroDev",
    description: "Smart account wallet with email OTP and social login.",
    href: "/zerodev",
    status: "live" as const,
    accentColor: "#16A34A",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <SessionBanner />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Wallet Provider Demo
          </h1>
          <p className="text-base opacity-60">
            Compare embedded wallet and authentication providers. Sign in with
            each to explore the experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {providers.map((p) => (
            <ProviderCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </main>
  );
}
