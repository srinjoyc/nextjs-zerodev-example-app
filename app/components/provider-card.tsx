import Link from "next/link";

interface ProviderCardProps {
  name: string;
  description: string;
  href: string;
  status: "live" | "coming-soon";
  accentColor: string;
}

export default function ProviderCard({
  name,
  description,
  href,
  status,
  accentColor,
}: ProviderCardProps) {
  const isLive = status === "live";

  const card = (
    <div
      className={`relative flex flex-col gap-3 rounded-xl border p-6 transition-all ${
        isLive
          ? "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md cursor-pointer"
          : "border-black/5 dark:border-white/5 opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        {isLive ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Live
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 opacity-60">
            Coming soon
          </span>
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm opacity-50 mt-1">{description}</p>
      </div>
      {isLive && (
        <span
          className="mt-auto text-sm font-medium"
          style={{ color: accentColor }}
        >
          Try it →
        </span>
      )}
    </div>
  );

  return isLive ? <Link href={href}>{card}</Link> : card;
}
