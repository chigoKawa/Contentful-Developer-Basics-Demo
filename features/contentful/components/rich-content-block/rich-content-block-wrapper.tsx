"use client";

import React from "react";
import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from "@contentful/live-preview/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import type { IRichContentBlock } from "../../type";
import { baseRichTextOptions } from "../../richtext";

interface RichContentBlockWrapperProps extends IRichContentBlock {}

const bgColorClasses: Record<string, string> = {
  Default: "bg-background",
  Primary: "bg-primary/10",
  Secondary: "bg-secondary/10",
  None: "bg-transparent",
};

export default function RichContentBlockWrapper(
  entry: RichContentBlockWrapperProps
) {
  const liveEntry = useContentfulLiveUpdates(entry) || entry;
  const inspectorProps = useContentfulInspectorMode({
    entryId: liveEntry?.sys?.id,
  });

  const fields = liveEntry?.fields;
  if (!fields) {
    return null;
  }

  const { body, backgroundColor = "Default" } = fields;
  const bgClass = bgColorClasses[backgroundColor ?? "Default"] ?? "";

  if (!body) {
    return null;
  }

  return (
    <section
      className={`py-12 md:py-16 ${bgClass}`}
      data-contentful-entry-id={liveEntry?.sys?.id}
    >
      <div className="container mx-auto max-w-4xl px-4">
        <div
          {...inspectorProps({ fieldId: "body" })}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          {documentToReactComponents(body as Document, baseRichTextOptions)}
        </div>
      </div>
    </section>
  );
}
