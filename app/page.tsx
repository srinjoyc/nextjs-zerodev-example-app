import Counter from "./counter";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Next.js Counter Demo
        </h1>
        <p className="text-base opacity-70">
          A minimal starter built with the App Router, TypeScript, and Tailwind
          CSS. Click the buttons below to update the count.
        </p>
        <Counter />
        <p className="text-xs opacity-50">
          Edit{" "}
          <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10">
            app/page.tsx
          </code>{" "}
          to get started.
        </p>
      </div>
    </main>
  );
}
