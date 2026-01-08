import type { ILandingPage } from "@/features/contentful/type";

/**
 * Normalizes a Contentful entry to ensure it's serializable and safe for client components.
 * This avoids passing Contentful SDK objects directly across the server-client boundary.
 */
export function mapLandingPageToProps(entry: ILandingPage): ILandingPage {
  // Use JSON serialization to create a plain object copy
  // This strips any prototype methods and ensures serializability
  return JSON.parse(JSON.stringify(entry));
}
