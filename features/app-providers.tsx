"use client";
import { ReactNode, useEffect, useState, Suspense } from "react";
import {
  NinetailedProvider,
  useNinetailed,
} from "@ninetailed/experience.js-react";
import { usePathname, useSearchParams } from "next/navigation";
import { NinetailedInsightsPlugin } from "@ninetailed/experience.js-plugin-insights";
import { NinetailedPreviewPlugin } from "@ninetailed/experience.js-plugin-preview";
import {
  loadPreviewData,
  type PreviewData,
} from "@/features/personalization/preview-loader";

type Props = { children: ReactNode };

// const isPreviewEnv = process.env.NODE_ENV !== "production";

function PageEventOnMount() {
  const { page } = useNinetailed();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // fire a page event so the profile is up to date
    // Using schema-less call to avoid validation errors until payload is confirmed
    page?.({ path: pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pathname, searchParams?.toString()]);
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
    >
      <Suspense fallback={null}>
        <PageEventOnMount />
      </Suspense>
      {children}
    </NinetailedProvider>
  );
}
