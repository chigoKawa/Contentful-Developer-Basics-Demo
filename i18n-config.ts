import localesJson from "./lib/locales.json"; // Edge-safe static locales

interface ICtfLocale {
  code: string;
  name: string;
  default: boolean;
  fallbackCode: null;
  sys: {
    id: string;
    type: string;
    version: number;
  };
}

export const getI18nConfig = async () => {
  const locales: ICtfLocale[] = localesJson as unknown as ICtfLocale[];

  const localeCodes = locales.map((locale: ICtfLocale) => locale.code);

  return {
    defaultLocale: localeCodes.includes("en-US") ? "en-US" : localeCodes[0],
    locales: localeCodes,
  } as const;
};

export type Locale = Awaited<
  ReturnType<typeof getI18nConfig>
>["locales"][number];

// Note: middleware runs on Edge Runtime; avoid importing the Contentful SDK here.
