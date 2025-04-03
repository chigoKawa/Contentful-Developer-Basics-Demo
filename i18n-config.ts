// import localesJson from "./lib/locales.json"; // could use this local copy also

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
// Load environment variables
const CONTENTFUL_SPACE_ID = process.env.NEXT_PUBLIC_CTF_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.NEXT_PUBLIC_CTF_DELIVERY_TOKEN;
const CONTENTFUL_ENVIRONMENT_ID =
  process.env.CONTENTFUL_ENVIRONMENT_ID || "master"; // Default to "master" if not provided

export const getI18nConfig = async () => {
  const locales: ICtfLocale[] = await getLocales();

  const localeCodes = locales.map((locale: ICtfLocale) => locale.code);

  return {
    defaultLocale: localeCodes.includes("en-US") ? "en" : localeCodes[0],
    locales: localeCodes,
  } as const;
};

export type Locale = Awaited<
  ReturnType<typeof getI18nConfig>
>["locales"][number];

async function getLocales() {
  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT_ID}/locales?access_token=${CONTENTFUL_ACCESS_TOKEN}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch locales: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}
