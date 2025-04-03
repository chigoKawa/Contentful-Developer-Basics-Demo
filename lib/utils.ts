import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Asset } from "contentful";
import {
  ILandingPage,
  IExternalUrl,
  IBlogPostPage,
} from "@/features/contentful/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractContentfulAssetUrl = (image: Asset | null): string => {
  const url: string = image?.fields?.file?.url?.toString() || "";
  if (url) return url;
  return "";
};

export const extractUrlFromTarget = (
  target: IExternalUrl | ILandingPage | IBlogPostPage
) => {
  const contentType = target?.sys?.contentType?.sys?.id;
  if (contentType === "landingPage") {
    const entry = target as ILandingPage;
    if (entry?.fields?.slug === "homepage" || entry?.fields?.slug === "home") {
      return "/";
    }

    return `/${entry?.fields?.slug}`;
  }

  if (contentType === "blogPost") {
    const entry = target as IBlogPostPage;

    return `/blog/${entry?.fields?.slug}`;
  }

  if (contentType === "externalLink") {
    const entry = target as IExternalUrl;

    return `${entry?.fields?.url}`;
  }

  return "";
};
