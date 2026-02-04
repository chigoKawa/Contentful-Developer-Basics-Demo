"use client";
import { ReactNode, useEffect, useState, Suspense } from "react";
import {
  NinetailedProvider,
  useNinetailed,
} from "@ninetailed/experience.js-react";
import { usePathname } from "next/navigation";
import { NinetailedInsightsPlugin } from "@ninetailed/experience.js-plugin-insights";
import { NinetailedPreviewPlugin } from "@ninetailed/experience.js-plugin-preview";
import {
  loadPreviewData,
  type PreviewData,
} from "@/features/personalization/preview-loader";

type Props = { children: ReactNode };

/**
 * Tracks page views for Ninetailed profile updates.
 * Based on official Ninetailed Next.js App Router example.
 * @see https://github.com/ninetailed-inc/ninetailed-examples/blob/main/marketing-contentful-next-app/components/Client/TrackPage.tsx
 */
function TrackPage() {
  const pathname = usePathname();
  const { page } = useNinetailed();

  useEffect(() => {
    // Call page() on every route change - this is required for Experience components to work
    // The SDK handles profile creation/updates internally
    void page();
  }, [page, pathname]);

  return null;
}

export default function AppProviders({ children }: Props) {
  const [experiences, setExperiences] = useState<unknown[]>([]);
  const [audiences, setAudiences] = useState<unknown[]>([]);
  const [previewLoading, setPreviewLoading] = useState(
    process.env.NODE_ENV !== "production"
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    let mounted = true;

    loadPreviewData()
      .then((data: PreviewData) => {
        if (!mounted) return;
        setExperiences(data.experiences || []);
        setAudiences(data.audiences || []);
        setPreviewLoading(false);
      })
      .catch(() => {
        // dev-only helper; ignore errors
        setPreviewLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Avoid tight coupling to provider's internal plugin types; cast at usage site
  const plugins: unknown[] = [new NinetailedInsightsPlugin()];
  if (process.env.NODE_ENV !== "production") {
    plugins.push(
      new NinetailedPreviewPlugin({
        experiences: experiences as never,
        audiences: audiences as never,
      })
    );
  }

  // Dev-only: block initial render until preview data is ready to avoid empty sidebar
  if (process.env.NODE_ENV !== "production" && previewLoading) {
    return null;
  }

  // Error handler for Ninetailed SDK errors (e.g., profile 404s)
  const handleNinetailedError = (error: string | Error) => {
    // Non-fatal: log but don't crash. Profile errors are common during hydration.
    if (process.env.NODE_ENV !== "production") {
      const message = typeof error === "string" ? error : error.message;
      console.warn("[Ninetailed] SDK error (non-fatal):", message);
    }
  };

  return (
    <NinetailedProvider
      key={
        process.env.NODE_ENV !== "production"
          ? `nt-${experiences.length}-${audiences.length}`
          : undefined
      }
      clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID as string}
      environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT}
      // @ts-expect-error The provider's plugin prop types vary by package version; this array is correct at runtime.
      plugins={plugins}
      componentViewTrackingThreshold={2000}
      useSDKEvaluation={true}
      onError={handleNinetailedError}
    >
      <Suspense fallback={null}>
        <TrackPage />
      </Suspense>
      {children}
    </NinetailedProvider>
  );
}
