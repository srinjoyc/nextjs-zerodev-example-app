import Link from "next/link";

export default function Web3AuthPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-6">
        <Link href="/" className="text-sm opacity-50 hover:opacity-100 transition">
          ← Back
        </Link>
        <div className="text-center space-y-2">
          <div className="inline-block h-2 w-2 rounded-full bg-[#0364FF] mb-2" />
          <h1 className="text-3xl font-bold tracking-tight">Web3Auth</h1>
          <p className="text-sm opacity-50">Coming soon.</p>
        </div>
      </div>
    </main>
  );
}
