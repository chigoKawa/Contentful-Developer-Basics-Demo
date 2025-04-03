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
  const [selectedLocale, setSelectedLocale] = useState<string>("en-US");
  const pathname = usePathname();
  const router = useRouter();

  const redirectedPathname = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const onSelectionChange = (locale: string) => {
    router.push(redirectedPathname(locale));
    setSelectedLocale(locale);
  };
  useEffect(() => {
    const segments = pathname.split("/");
    const currentLocale = segments[1] || "en-US";
    setSelectedLocale(currentLocale);
    return () => {};
  }, [pathname]);

  useEffect(() => {
    const fetchLocales = async () => {
      const ii8nConfig = await getI18nConfig();
      setLocales(ii8nConfig?.locales);
      //   setSelectedLocale(ii8nConfig?.defaultLocale);
    };

    fetchLocales();
    return () => {};
  }, []);
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
