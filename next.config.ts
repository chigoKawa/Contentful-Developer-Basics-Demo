import type { NextConfig } from "next";
import { getLocales } from "@/lib/contentful";

// Export async function for Next.js config
const nextConfig = async (): Promise<NextConfig> => {
  const locales = await getLocales();

  const localeCodes = locales.map((locale) => locale.code);

  return {
    // i18n: {
    //   locales: localeCodes,
    //   defaultLocale: localeCodes.includes("en-US") ? "en-US" : localeCodes[0], // Ensure default
    // },
    // Other Next.js config options...
  };
};

// const nextConfig2: NextConfig = {
//   /* config options here */
//   i18n: {
//     locales: ["en-US", "es"],
//     defaultLocale: "en-US",
//   },
// };

export default nextConfig;
