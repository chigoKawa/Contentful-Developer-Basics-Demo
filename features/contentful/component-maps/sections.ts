import type { FC } from "react";
import type { Entry, EntrySkeletonType } from "contentful";
import PersonalizedHeroBanner from "../components/hero-banner/personalized-hero-banner";
import CtaWrapper from "../components/cta/cta-wrapper";
import RichContentBlockWrapper from "../components/rich-content-block/rich-content-block-wrapper";

// Centralized component map for landing page sections
// Maps contentType.sys.id -> React component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionsComponentMap: Record<string, FC<any>> = {
  heroBanner: PersonalizedHeroBanner,
  cta: CtaWrapper,
  richContentBlock: RichContentBlockWrapper,
} as const;

/**
 * Resolves a section entry to its corresponding React component.
 * Returns null for unknown content types (with a warning in dev).
 */
export function getSectionComponent(
  entry: Entry<EntrySkeletonType>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): FC<any> | null {
  const contentTypeId = entry?.sys?.contentType?.sys?.id;
  if (!contentTypeId) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sections] Entry missing contentType:", entry?.sys?.id);
    }
    return null;
  }

  const Component = sectionsComponentMap[contentTypeId];
  if (!Component) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[sections] Unknown section content type: "${contentTypeId}"`);
    }
    return null;
  }

  return Component;
}
