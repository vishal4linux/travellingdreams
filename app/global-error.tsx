"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#fdfcfa] p-6 font-sans">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-stone-600">
            If you just set up the site, confirm MySQL is running and run{" "}
            <code className="rounded bg-stone-100 px-1">npm run db:push</code> and{" "}
            <code className="rounded bg-stone-100 px-1">npm run db:seed</code>.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 rounded-xl bg-stone-800 px-5 py-2.5 text-sm text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
