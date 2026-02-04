"use client";

import React, { FC } from "react";
import type { Entry, EntrySkeletonType } from "contentful";
import { ILandingPage, IFrame } from "../type";
import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from "@contentful/live-preview/react";
import Frame from "./frame/frame";
import SectionRenderer from "./section-renderer";

interface IProps {
  entry: ILandingPage;
}

/**
 * Main ContentfulLandingPage component.
 * Supports rendering both `sections` and `frames` fields.
 * Either field may exist, both may exist, or neither may exist.
 * Rendering gracefully handles empty, undefined, or disabled fields.
 */
const ContentfulLandingPage: FC<IProps> = ({ entry: publishedEntry }) => {
  const entry = useContentfulLiveUpdates(publishedEntry) || publishedEntry;
  const inspectorProps = useContentfulInspectorMode({
    entryId: entry?.sys?.id,
  });

  // Safely extract frames and sections - either may be undefined/empty
  const frames = (entry?.fields?.frames ?? []) as unknown as IFrame[];
  const sections = (entry?.fields?.sections ?? []) as unknown as Entry<EntrySkeletonType>[];

  const hasFrames = Array.isArray(frames) && frames.length > 0;
  const hasSections = Array.isArray(sections) && sections.length > 0;

  // If neither frames nor sections exist, render nothing (graceful degradation)
  if (!hasFrames && !hasSections) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <p>No content to display. Add sections or frames to this landing page.</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Render Frames if present */}
      {hasFrames && (
        <div {...inspectorProps({ fieldId: "frames" })}>
          {frames.map((frameEntry, index) => {
            if (!frameEntry?.sys?.id) return null;
            return (
              <Frame
                key={`frame-${frameEntry.sys.id}-${index}`}
                {...frameEntry}
              />
            );
          })}
        </div>
      )}

      {/* Render Sections if present */}
      {hasSections && (
        <div {...inspectorProps({ fieldId: "sections" })}>
          {sections.map((sectionEntry, index) => {
            if (!sectionEntry?.sys?.id) return null;
            return (
              <SectionRenderer
                key={`section-${sectionEntry.sys.id}-${index}`}
                entry={sectionEntry}
                index={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentfulLandingPage;
