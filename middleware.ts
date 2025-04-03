import { NextRequest, NextResponse } from "next/server";
import { getI18nConfig } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

async function getLocale(request: NextRequest) {
  const { locales, defaultLocale } = await getI18nConfig(); // Wait for async function to resolve

  // Get user's preferred languages from the request headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const acceptedLanguages = new Negotiator({
    headers: negotiatorHeaders,
  }).languages();

  const matchedLocale = matchLocale(acceptedLanguages, locales, defaultLocale); // Default must be in array

  return matchedLocale || defaultLocale; // Ensure we always return a valid locale
}

export async function middleware(request: NextRequest) {
  const locale = await getLocale(request); // Get the best matching locale
  const { locales } = await getI18nConfig();
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already contains a locale
  const isMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (isMissingLocale) {
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Ignore API routes and Next.js static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|setup).*)"],
};
