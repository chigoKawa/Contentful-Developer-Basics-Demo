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
  let locales: ICtfLocale[] = [];
  try {
    // Try to parse and validate locales.json
    locales = localesJson as unknown as ICtfLocale[];
    if (!Array.isArray(locales) || locales.length === 0) {
      throw new Error("Locales array is empty or invalid");
    }
    // Basic validation: ensure each has a code
    for (const loc of locales) {
      if (!loc.code || typeof loc.code !== "string") {
        throw new Error("Invalid locale structure");
      }
    }
  } catch (error) {
    console.warn(
      "Warning: lib/locales.json is missing, empty, or invalid. Falling back to default locale 'en-US'. Re-run 'npm run build' to regenerate.",
      error
    );
    // Fallback to a safe default
    locales = [
      {
        code: "en-US",
        name: "English (United States)",
        default: true,
        fallbackCode: null,
        sys: {
          id: "fallback",
          type: "Locale",
          version: 1,
        },
      },
    ];
  }

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
