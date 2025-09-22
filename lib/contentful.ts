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
  environment: process.env.NEXT_PUBLIC_CTF_ENVIRONMENT || "master",
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

export const getAllPageSlugs = async <T extends EntrySkeletonType>(
  options: Record<string, unknown>,
  isPreviewEnabled: boolean = false
): Promise<string[]> => {
  try {
    const allSlugs: string[] = [];
    const clientInstance = isPreviewEnabled ? previewClient : client;

    const entries: EntryCollection<T> = await clientInstance.getEntries<T>(
      options
    );
    const totalPages = entries?.total;
    const limit = entries.limit as number;
    const numberOfPages = Math.ceil(totalPages / limit);
    for (let page = 0; page < numberOfPages; page++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const slugs = await clientInstance.getEntries<T>({
        ...options,
        skip: page * entries.limit,
        limit: entries.limit,
        select: "fields.slug",
      });

      const slugValues = slugs.items.map((item) => item.fields.slug as string);

      allSlugs.push(...slugValues);
    }

    return allSlugs;
  } catch (error) {
    console.error("Error fetching entries from Contentful:", error);
    return [];
  }
};
