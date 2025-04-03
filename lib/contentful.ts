import { createClient } from "contentful";
import type { EntryCollection, EntrySkeletonType, Entry } from "contentful";

const client = createClient({
  space: process.env.NEXT_PUBLIC_CTF_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CTF_DELIVERY_TOKEN!,
});

const previewClient = createClient({
  space: process.env.NEXT_PUBLIC_CTF_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CTF_PREVIEW_TOKEN!,
  host: "preview.contentful.com",
});

export const getEntries = async <T extends EntrySkeletonType>(
  options: Record<string, unknown>,
  isPreviewEnabled: boolean = false
): Promise<Entry<T>[]> => {
  try {
    const clientInstance = isPreviewEnabled ? previewClient : client;
    const entries: EntryCollection<T> = await clientInstance.getEntries<T>(
      options
    );
    return entries.items;
  } catch (error) {
    console.error("Error fetching entries from Contentful:", error);
    return [];
  }
};

/**
 * Fetches available locales from Contentful.
 * @returns An array of locales.
 */
export const getLocales = async () => {
  try {
    const response = await client.getLocales();

    return response.items.map((locale) => ({
      code: locale.code,
      name: locale.name,
      default: locale.default,
    }));
  } catch (error) {
    console.error("Error fetching locales:", error);
    return [];
  }
};
