import { Locale } from "@/i18n-config"; // Import locale type for internationalization
import { getEntries } from "@/lib/contentful"; // Function to fetch data from Contentful
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import {
  IBlogPostPage,
  BlogPostPageSkeleton,
} from "@/features/contentful/type";
import ContentfulBlogPage from "@/features/contentful/components/contentful-blog-page";
import { extractContentfulAssetUrl } from "@/lib/utils";

const INCLUDES_COUNT = 6;

type Props = {
  params: Promise<{ locale: Locale; blogSlug: string }>; // Extract locale from the URL params
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // Extract preview from the URL search params

  // searchParams: { preview?: string };
};

export default async function IndexPage({ params, searchParams }: Props) {
  // preview search param is used to enable preview mode e.g localhost:3000/de/home?preview=true
  const { preview: isPreviewEnabled } = await searchParams;
  const { locale, blogSlug } = await params;

  // Fetch landing page data from Contentful based on the slug and locale
  const entries = await getEntries<BlogPostPageSkeleton>(
    {
      content_type: "blogPost",
      "fields.slug": blogSlug,
      include: INCLUDES_COUNT,
      locale,
    },
    !!isPreviewEnabled
  );

  // Get the first entry and cast it to ILandingPage type
  const blogEntry = entries[0] as IBlogPostPage;

  if (!blogEntry) {
    notFound();
  }

  return (
    <div>
      {/* Render the blog page component with the fetched data */}
      <ContentfulBlogPage entry={blogEntry} />
    </div>
  );
}

// metadata for SEO
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { preview: isPreviewEnabled } = await searchParams;
  const { locale, blogSlug } = await params;

  // Fetch landing page data from Contentful based on the slug and locale
  const entries = await getEntries<BlogPostPageSkeleton>(
    {
      content_type: "blogPost",
      "fields.slug": blogSlug,
      include: INCLUDES_COUNT,
      locale,
    },
    !!isPreviewEnabled
  );

  // Get the first entry and cast it to ILandingPage type
  const blogEntry = entries[0] as IBlogPostPage;
  const previousImages = (await parent).openGraph?.images || [];
  const pageTitle = `${blogEntry?.fields?.title} | Contentful Site`;
  const seoTitle = blogEntry?.fields?.seoMetadata?.fields?.title || pageTitle;
  const seoDescription =
    blogEntry?.fields?.seoMetadata?.fields?.description || "";

  const seoOgImage = extractContentfulAssetUrl(
    blogEntry?.fields?.seoMetadata?.fields?.ogImage || null
  );

  const images = seoOgImage
    ? [`https${seoOgImage}`, ...previousImages]
    : [...previousImages];
  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      images: images,
    },
  };
}
