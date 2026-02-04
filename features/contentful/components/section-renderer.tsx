"use client";

import React from "react";
import type { Entry, EntrySkeletonType } from "contentful";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { getSectionComponent } from "../component-maps/sections";

interface SectionRendererProps {
  entry: Entry<EntrySkeletonType>;
  index: number;
}

/**
 * Renders a single section entry using the centralized component map.
 * Handles live preview updates and gracefully degrades for unknown types.
 */
export default function SectionRenderer({ entry, index }: SectionRendererProps) {
  const liveEntry = useContentfulLiveUpdates(entry) || entry;
  
  if (!liveEntry?.sys?.id) {
    return null;
  }

  const Component = getSectionComponent(liveEntry);
  
  if (!Component) {
    // Unknown content type - render placeholder in dev, nothing in prod
    if (process.env.NODE_ENV !== "production") {
      const ctid = liveEntry?.sys?.contentType?.sys?.id ?? "unknown";
      return (
        <div
          className="border-2 border-dashed border-amber-400 bg-amber-50 p-4 my-4 rounded"
          data-contentful-entry-id={liveEntry.sys.id}
        >
          <p className="text-amber-700 text-sm font-medium">
            Unknown section type: <code>{ctid}</code>
          </p>
          <p className="text-amber-600 text-xs mt-1">
            Add a component mapping in sections.ts to render this content type.
          </p>
        </div>
      );
    }
    return null;
  }

  return <Component key={`section-${liveEntry.sys.id}-${index}`} {...liveEntry} />;
}
