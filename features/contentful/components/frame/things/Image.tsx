"use client";

import React from "react";
import type { Asset } from "contentful";
import { useContentfulInspectorMode, useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { renderAsset } from "../utils";
import type { IImageWrapper, IPexelsImageWrapper } from "@/features/contentful/type";

type DisplayMode = "default" | "hero";

export default function ThingImage({ entry, display = "default" }: { entry: IImageWrapper | IPexelsImageWrapper; display?: DisplayMode }) {
  const live = (useContentfulLiveUpdates(entry) as IImageWrapper | IPexelsImageWrapper) || entry;
  const inspectorProps = useContentfulInspectorMode({ entryId: live?.sys?.id });
  const fields = live?.fields as Partial<IImageWrapper["fields"] & IPexelsImageWrapper["fields"]> &
    Partial<{ image?: Asset; url?: string; src?: string }>;

  const asset = (fields?.asset || (fields as unknown as { image?: Asset })?.image) as Asset | undefined;
  const urlString = (fields as unknown as { url?: string; src?: string })?.url ||
    (fields as unknown as { url?: string; src?: string })?.src;

  const presentFieldId = asset ? (fields?.asset ? "asset" : "image") : urlString ? ("url" as const) : ("asset" as const);
  const hero = display === "hero";

  return (
    <div
      {...inspectorProps({ fieldId: presentFieldId })}
      className={hero ? "" : "rounded-xl overflow-hidden aspect-video"}
    >
      {renderAsset(asset ?? (urlString as string | undefined))}
    </div>
  );
}
