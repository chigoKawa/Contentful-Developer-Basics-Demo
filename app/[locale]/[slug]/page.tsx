import { Locale, getI18nConfig } from "@/i18n-config"; // Import locale type for internationalization
import { getEntries, getAllPageSlugs } from "@/lib/contentful"; // Function to fetch data from Contentful
import ContentfulLandingPage from "@/features/contentful/components/contentful-landing-page"; // Component to render the landing page
import { ILandingPage, LandingPageSkeleton } from "@/features/contentful/type"; // Types for Contentful landing page entries
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { extractContentfulAssetUrl } from "@/lib/utils";
import LivePreviewProviderWrapper from "@/features/contentful/live-preview-provider-wrapper";

const INCLUDES_COUNT = 6;

type Props = {
  params: Promise<{ locale: Locale; slug: string }>; // Extract locale from the URL params
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Extract preview from the URL search params

  // searchParams: { preview?: string };
};

export default async function IndexPage({ params, searchParams }: Props) {
  // App Router: treat presence of ?preview as enabled
  const isPreviewEnabled = Boolean((await searchParams)?.preview || false);

  const { locale, slug } = await params;

  // Fetch landing page data from Contentful based on the slug and locale
  const entries = await getEntries<LandingPageSkeleton>(
    {
      content_type: "landingPage",
      "fields.slug": slug,
      include: INCLUDES_COUNT,
      locale,
    },
    !!isPreviewEnabled
  );

  // Get the first entry and cast it to ILandingPage type
  const pageEntry = entries[0] as ILandingPage;

  if (!pageEntry) {
    notFound();
  }

  return (
    <div>
      {/* Render the landing page component with the fetched data */}
      <LivePreviewProviderWrapper
        locale={locale}
        isPreviewEnabled={!!isPreviewEnabled}
      >
        <ContentfulLandingPage entry={pageEntry} />
      </LivePreviewProviderWrapper>
    </div>
  );
}

// metadata for SEO
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { preview: isPreviewEnabled } = await searchParams;
  const { locale, slug } = await params;

  // Fetch landing page data from Contentful based on the slug and locale
  const entries = await getEntries<LandingPageSkeleton>(
    {
      content_type: "landingPage",
      "fields.slug": slug,
      include: INCLUDES_COUNT,
      locale,
    },
    !!isPreviewEnabled
  );

  // Get the first entry and cast it to ILandingPage type
  const pageEntry = entries[0] as ILandingPage;
  const previousImages = (await parent).openGraph?.images || [];
  const pageTitle = `${pageEntry?.fields?.title} | Contentful Site`;
  const seoTitle = pageEntry?.fields?.seoMetadata?.fields?.title || pageTitle;
  const seoDescription =
    pageEntry?.fields?.seoMetadata?.fields?.description || "";

  const seoOgImage = extractContentfulAssetUrl(
    pageEntry?.fields?.seoMetadata?.fields?.ogImage || null
  );

  const fullImageUrl = seoOgImage ? `https:${seoOgImage}?w=1200&h=630` : null;

  const images = fullImageUrl
    ? [fullImageUrl, ...previousImages]
    : [...previousImages];

  const seoNoIndex = pageEntry?.fields?.seoMetadata?.fields?.noIndex || false;
  const seoNoFollow = pageEntry?.fields?.seoMetadata?.fields?.noFollow || false;

  // Determine the metadata base URL (Vercel's URL or localhost for development)
  const metadataBase = process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL(
        process.env.NEXT_PUBLIC_SITE_URL ||
          `http://localhost:${process.env.PORT || 3000}`
      );

  // Build canonical URL: clean path for default locale, prefixed for others
  const { defaultLocale } = await getI18nConfig();
  const canonicalPath =
    locale === defaultLocale ? `/${slug}` : `/${locale}/${slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      images: images,
    },
    robots: {
      index: !seoNoIndex,
      follow: !seoNoFollow,
    },
    metadataBase,
    alternates: {
      canonical: canonicalPath,
    },
  };
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const allSlugs = getAllPageSlugs<LandingPageSkeleton>(
    {
      content_type: "landingPage",
      include: INCLUDES_COUNT,
    },
    false
  );

  return allSlugs;
}
