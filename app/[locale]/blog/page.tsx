import { Locale } from "@/i18n-config"; // Import locale type for internationalization
import { getEntries } from "@/lib/contentful"; // Function to fetch data from Contentful
import ContentfulLandingPage from "@/features/contentful/components/contentful-landing-page"; // Component to render the landing page
import { ILandingPage, LandingPageSkeleton } from "@/features/contentful/type"; // Types for Contentful landing page entries
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

// Get the homepage slug from environment variables
const PAGE_SLUG = "blog";
const INCLUDES_COUNT = 6;

type Props = {
  params: Promise<{ locale: Locale; slug: string }>; // Extract locale from the URL params
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Extract preview from the URL search params

  // searchParams: { preview?: string };
};

export default async function IndexPage({ params }: Props) {
  const { locale } = await params;

  // Fetch landing page data from Contentful based on the slug and locale
  const entries = await getEntries<LandingPageSkeleton>({
    content_type: "landingPage",
    "fields.slug": PAGE_SLUG,
    include: INCLUDES_COUNT,
    locale,
  });

  // Get the first entry and cast it to ILandingPage type
  const pageEntry = entries[0] as ILandingPage;

  if (!pageEntry) {
    notFound();
  }

  return (
    <div>
      {/* Render the landing page component with the fetched data */}
      <ContentfulLandingPage entry={pageEntry} />
    </div>
  );
}

// metadata for SEO
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { preview: isPreviewEnabled } = await searchParams;
  const { locale } = await params;

  // Fetch landing page data from Contentful based on the slug and locale
  const entries = await getEntries<LandingPageSkeleton>(
    {
      content_type: "landingPage",
      "fields.slug": PAGE_SLUG,
      include: INCLUDES_COUNT,
      locale,
    },
    !!isPreviewEnabled
  );

  // Get the first entry and cast it to ILandingPage type
  const pageEntry = entries[0] as ILandingPage;
  const previousImages = (await parent).openGraph?.images || [];
  const pageTitle = `${pageEntry?.fields?.title} | Contentful Site`;

  return {
    title: pageTitle,
    openGraph: {
      images: [...previousImages],
    },
  };
}
