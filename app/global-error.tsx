"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen grid place-items-center bg-background text-foreground p-6">
          <div className="max-w-lg w-full rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-semibold">Something went wrong</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                An unexpected error occurred while rendering this page.
              </p>
            </div>

            <div className="rounded-md bg-muted/40 p-4 text-xs text-muted-foreground overflow-auto">
              <pre className="whitespace-pre-wrap break-words">
                {error?.message || "Unknown error"}
                {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
              </pre>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 justify-center">
              <Button onClick={() => reset()} variant="default">
                Try again
              </Button>
              <Button onClick={() => window.location.reload()} variant="secondary">
                Reload page
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </div>

          <p className="sr-only">Global error boundary</p>
        </div>
      </body>
    </html>
  );
}
