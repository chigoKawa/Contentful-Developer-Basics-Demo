import React from "react";
import type { Asset } from "contentful";
import { extractContentfulAssetUrl } from "@/lib/utils";
import type { IFrame } from "@/features/contentful/type";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Map dim percentage string to Tailwind opacity utility
function opacityFromDim(dim?: IFrame["fields"]["dimBackground"]) {
  switch (dim) {
    case "10":
      return "10";
    case "20":
      return "20";
    case "30":
      return "30";
    case "40":
      return "40";
    case "50":
      return "50";
    default:
      return "30"; // safe default
  }
}

// Compute an overlay class from tintColor + dimBackground.
// - If tint is a brand color, use mix-blend-multiply for subtle, image-aware tinting.
// - If tint is black or none, use a neutral black overlay.
export function getOverlayFromOptions(
  dim?: IFrame["fields"]["dimBackground"],
  tint?: IFrame["fields"]["tintColor"]
) {
  const op = opacityFromDim(dim);
  if (tint === "primary") return `bg-primary/${op} mix-blend-multiply`;
  if (tint === "secondary") return `bg-secondary/${op} mix-blend-multiply`;
  if (tint === "accent") return `bg-accent/${op} mix-blend-multiply`;
  if (tint === "black") return `bg-black/${op}`;
  // none or undefined -> neutral dim only
  return `bg-black/${op}`;
}

// When a background image is present, we ignore the surface but we still
// want the editor's chosen backgroundColor to control text color.
export function getTextClassFromBgColor(
  theme: IFrame["fields"]["theme"],
  color: IFrame["fields"]["backgroundColor"]
) {
  switch (color) {
    case "primary":
      return "text-primary-foreground";
    case "secondary":
      return "text-secondary-foreground";
    case "accent":
      return "text-accent-foreground";
    case "neutral":
      return "text-foreground";
    case "transparent":
    default:
      return theme === "dark" ? "text-white" : theme === "light" ? "text-black" : "text-foreground";
  }
}
export function getBgClass(theme: IFrame["fields"]["theme"], color: IFrame["fields"]["backgroundColor"]) {
  // Pair background tokens with their matching foreground for consistent contrast
  switch (color) {
    case "primary":
      return "bg-primary text-primary-foreground";
    case "secondary":
      return "bg-secondary text-secondary-foreground";
    case "accent":
      return "bg-accent text-accent-foreground";
    case "neutral":
      // Neutral maps to app background/foreground pair (no standalone neutral token defined)
      return "bg-background text-foreground";
    case "transparent":
    default: {
      // No explicit background; pick a readable text based on per-frame theme
      // We cannot switch CSS vars per-section easily, so use explicit utilities.
      const themeText = theme === "dark" ? "text-white" : theme === "light" ? "text-black" : "text-primary-foreground";
      return `bg-transparent ${themeText}`;
    }
  }
}

// Overlay helper used primarily for hero banners to blend background color with image
export function getOverlayClass(color: IFrame["fields"]["backgroundColor"]) {
  switch (color) {
    case "primary":
      return "bg-primary/50";
    case "secondary":
      return "bg-secondary/50";
    case "accent":
      return "bg-accent/45";
    case "neutral":
      return "bg-neutral/40";
    case "transparent":
    default:
      // Neutral darkening when no explicit color was chosen
      return "bg-black/30";
  }
}

export function getGapClass(gap?: IFrame["fields"]["gap"]) {
  switch (gap) {
    case "sm":
      return "gap-4";
    case "md":
      return "gap-6";
    case "lg":
      return "gap-8";
    case "xl":
      return "gap-12";
    default:
      return "gap-6";
  }
}

export function getPaddingClass(padding?: IFrame["fields"]["padding"]) {
  // Add horizontal padding for mobile, scale vertical rhythm by size
  switch (padding) {
    case "none":
      return "px-4 sm:px-6 md:px-8 py-0";
    case "sm":
      return "px-4 sm:px-6 md:px-8 py-8";
    case "md":
      return "px-4 sm:px-6 md:px-8 py-12";
    case "lg":
      return "px-4 sm:px-6 md:px-8 py-16";
    case "xl":
      return "px-4 sm:px-6 md:px-8 py-24";
    case "xxl":
      return "px-4 sm:px-6 md:px-8 py-32";
    default:
      return "px-4 sm:px-6 md:px-8 py-12";
  }
}

export function getLayoutClass(layout: IFrame["fields"]["layout"]) {
  switch (layout) {
    case "single":
      return "grid grid-cols-1";
    case "duplex":
      return "grid grid-cols-1 md:grid-cols-2";
    case "grid":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    case "carousel":
      return "flex overflow-x-auto snap-x snap-mandatory";
    case "list":
      return "flex flex-col";
    case "hero":
      return "grid grid-cols-1";
    default:
      return "grid grid-cols-1";
  }
}

type AssetFields = { title?: string; file?: { url?: string } };

export function renderAsset(asset?: Asset | string, className?: string) {
  if (!asset) return null;
  let url = "";
  let title = "";

  if (typeof asset === "string") {
    url = asset;
  } else {
    url = extractContentfulAssetUrl(asset);
    const fields = (asset as unknown as { fields?: AssetFields }).fields;
    title = fields?.title ?? "";
  }

  if (!url) {
    // Dev-friendly placeholder to surface missing or unresolved assets
    return React.createElement(
      "div",
      {
        className:
          className ??
          "aspect-video w-full rounded-md border border-dashed text-sm grid place-items-center text-muted-foreground/70",
      },
      "Image unavailable"
    );
  }

  const src = url.startsWith("//") ? `https:${url}` : url;
  return React.createElement("img", {
    src,
    alt: title,
    className: className ?? "w-full h-auto object-cover",
  });
}
