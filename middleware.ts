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
  const { locales, defaultLocale } = await getI18nConfig();
  const { pathname } = request.nextUrl;

  const startsWithLocale = locales.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  // 1) If URL already has a locale prefix
  if (startsWithLocale) {
    // If it's the default locale, redirect to clean URL without the locale prefix
    if (startsWithLocale === defaultLocale) {
      const stripped = pathname.replace(
        new RegExp(`^/${defaultLocale}(?:/)?`),
        "/"
      );
      const cleanPath = stripped === "" ? "/" : stripped;
      if (cleanPath !== pathname) {
        const url = request.nextUrl.clone();
        url.pathname = cleanPath;
        // preserve existing search params by mutating only the pathname
        return NextResponse.redirect(url);
      }
    }
    // Non-default locales: let the request continue
    return;
  }

  // 2) If URL is missing a locale prefix
  const best = await getLocale(request);

  // For the default locale: keep clean URL by rewriting internally
  if (best === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // For non-default best matches: redirect to locale-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${best}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Ignore API routes and Next.js static assets
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|setup).*)"],
};
