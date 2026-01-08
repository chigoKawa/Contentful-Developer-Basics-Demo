"use client";

import React, { FC } from "react";
// Importing interfaces and components
import { ILandingPage } from "../type";
// Import live updates hook from Contentful -> https://github.com/contentful/live-preview
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { IFrame } from "../type";
import Frame from "./frame/frame";

// Define the props interface for the ContentfulLandingPage component
interface IProps {
  // The entry prop contains the data for a landing page fetched from Contentful
  entry: ILandingPage;
}

// Main ContentfulLandingPage component
const ContentfulLandingPage: FC<IProps> = ({ entry: publishedEntry }) => {
  // Use live updates hook for Contentful preview mode or fallback to the published entry
  const entry = useContentfulLiveUpdates(publishedEntry) || publishedEntry;

  const frames = entry?.fields?.frames as unknown as IFrame[] | undefined;

  return (
    <div className="w-full overflow-hidden">
      {/* New: render Frames if present */}
      {Array.isArray(frames) &&
        frames?.map((frameEntry, index) => (
          <Frame key={`frame-${index}`} {...frameEntry} />
        ))}
    </div>
  );
};

export default ContentfulLandingPage;
