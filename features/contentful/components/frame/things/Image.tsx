"use client";

import React from "react";
import type { Asset } from "contentful";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { renderAsset } from "../utils";
import type {
  IImageWrapper,
  IPexelsImageWrapper,
} from "@/features/contentful/type";
// no direct import of extractContentfulAssetUrl needed here; we rely on renderAsset helper

type DisplayMode = "default" | "hero";

export default function ThingImage({
  entry,
  display = "default",
}: {
  entry: IImageWrapper | IPexelsImageWrapper;
  display?: DisplayMode;
}) {
  const live =
    (useContentfulLiveUpdates(entry) as IImageWrapper | IPexelsImageWrapper) ||
    entry;
  const inspectorProps = useContentfulInspectorMode({ entryId: live?.sys?.id });
  const fields = live?.fields as Partial<
    IImageWrapper["fields"] & IPexelsImageWrapper["fields"]
  > &
    Partial<{ image?: Asset; url?: string; src?: string }>;

  // Resolve a source either from a Contentful Asset, legacy url/src string, or the new Pexels payload
  const asset = (fields?.asset ||
    (fields as unknown as { image?: Asset })?.image) as Asset | undefined;

  // Pexels support: prefer appropriately sized variant for the display mode
  const pexels = (fields as Partial<IPexelsImageWrapper["fields"]>)
    ?.pexelsImage as
    | (IPexelsImageWrapper["fields"]["pexelsImage"] & {
        src?: {
          original?: string;
          large2x?: string;
          large?: string;
          medium?: string;
          small?: string;
          portrait?: string;
          landscape?: string;
          tiny?: string;
        };
      })
    | undefined;

  const pexelsUrl = (() => {
    const s = pexels?.src;
    if (!s) return undefined;
    // Hero prefers wider images
    if (display === "hero") return s.landscape || s.large2x || s.large || s.original;
    // Default prefers reasonable size
    return s.medium || s.large || s.small || s.original;
  })();

  const legacyUrl =
    (fields as unknown as { url?: string; src?: string })?.url ||
    (fields as unknown as { url?: string; src?: string })?.src;

  const resolved = asset ?? (pexelsUrl as string | undefined) ?? legacyUrl;

  const presentFieldId = asset
    ? fields?.asset
      ? "asset"
      : "image"
    : pexelsUrl
    ? ("pexelsImage" as const)
    : legacyUrl
    ? ("url" as const)
    : ("asset" as const);
  const hero = display === "hero";

  return (
    <div
      {...inspectorProps({ fieldId: presentFieldId })}
      className={hero ? "" : "rounded-xl overflow-hidden aspect-video"}
    >
      {renderAsset(resolved)}
    </div>
  );
}
