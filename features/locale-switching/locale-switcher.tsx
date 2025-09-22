"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Locale, getI18nConfig } from "@/i18n-config";
import { toFlag } from "cf-emoji";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LocaleSwitcher = () => {
  const [locales, setLocales] = useState<string[]>([]);
  const [defaultLocale, setDefaultLocale] = useState<string>("en-US");
  const [selectedLocale, setSelectedLocale] = useState<string>("en-US");
  const pathname = usePathname();
  const router = useRouter();

  const redirectedPathname = (nextLocale: Locale) => {
    if (!pathname) return "/";

    const segments = pathname.split("/").filter(Boolean); // e.g., ['blog', 'post'] or ['en-US', 'blog', 'post']

    const isPrefixed = segments.length > 0 && locales.includes(segments[0]);

    // Clean URL for default locale: remove locale prefix if present
    if (nextLocale === defaultLocale) {
      if (isPrefixed) {
        const rest = segments.slice(1);
        return `/${rest.join("/")}` || "/";
      }
      return pathname; // already clean
    }

    // Non-default locale: ensure the locale is the first segment
    if (isPrefixed) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }

    return `/${segments.join("/")}`;
  };

  const onSelectionChange = (locale: string) => {
    router.push(redirectedPathname(locale));
    setSelectedLocale(locale);
  };
  // Keep the selected option in sync with the current path
  useEffect(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    const current = locales.includes(seg) ? seg : defaultLocale;
    setSelectedLocale(current);
    return () => {};
  }, [pathname, locales, defaultLocale]);

  useEffect(() => {
    const fetchLocales = async () => {
      const ii8nConfig = await getI18nConfig();
      setLocales(ii8nConfig.locales);
      setDefaultLocale(ii8nConfig.defaultLocale);
      // Initialize selection based on current path
      const seg = pathname.split("/").filter(Boolean)[0];
      const current = ii8nConfig.locales.includes(seg)
        ? seg
        : ii8nConfig.defaultLocale;
      setSelectedLocale(current);
    };

    fetchLocales();
    return () => {};
  }, [pathname]);
  console.log(toFlag("en-US"));
  return (
    <div>
      <Select onValueChange={onSelectionChange} value={selectedLocale}>
        <SelectTrigger className="w-full text-white font-bold">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Locale</SelectLabel>
            {locales?.map((locale: string) => {
              return (
                <SelectItem key={locale} value={locale}>
                  <span className=" uppercase flex gap-2 items-center">
                    {locale}
                    <span>{toFlag(locale)}</span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocaleSwitcher;
