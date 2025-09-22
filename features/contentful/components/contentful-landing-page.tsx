"use client";

import React, { FC } from "react";
// Importing interfaces and components
import { ILandingPage } from "../type";
import PersonalizedHeroBanner from "@/features/contentful/components/hero-banner/personalized-hero-banner";
import CtaWrapper from "./cta/cta-wrapper";
// Import live updates hook from Contentful -> https://github.com/contentful/live-preview
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
// Import types for HeroBanner and CTA
import { IHeroBanner, ICta, IFrame } from "../type";
import Frame from "./frame/frame";

// Define the props interface for the ContentfulLandingPage component
interface IProps {
  // The entry prop contains the data for a landing page fetched from Contentful
  entry: ILandingPage;
}

// Define a mapping from Contentful content types to their respective React components
type ComponentMap = {
  heroBanner: FC<IHeroBanner>;
  cta: FC<ICta>;
};

// Mapping of content type ID to React component
const componentMap: ComponentMap = {
  heroBanner: PersonalizedHeroBanner, // Resolve experience and render existing wrapper
  cta: CtaWrapper,
};

// Main ContentfulLandingPage component
const ContentfulLandingPage: FC<IProps> = ({ entry: publishedEntry }) => {
  // Use live updates hook for Contentful preview mode or fallback to the published entry
  const entry = useContentfulLiveUpdates(publishedEntry) || publishedEntry;

  // Extract page content (an array of components from the content field) from the Contentful entry
  const pageContent = entry?.fields?.sections;
  const frames = entry?.fields?.frames as unknown as IFrame[] | undefined;

  return (
    <div className="w-full overflow-hidden">
      {/* New: render Frames if present */}
      {Array.isArray(frames) &&
        frames?.map((frameEntry, index) => (
          <Frame key={`frame-${index}`} {...frameEntry} />
        ))}
      {/* Iterate over each content entry to dynamically render components */}
      {pageContent?.map(
        (componentEntry: ILandingPage["fields"]["sections"][0], index) => {
          // Extract content type ID from each entry
          const contentTypeId = componentEntry?.sys?.contentType?.sys?.id;

          // If no content type ID or no corresponding component in the map, show a warning and fallback
          if (!contentTypeId || !(contentTypeId in componentMap)) {
            console.warn(
              `No component found for content type: ${contentTypeId}`
            );
            return (
              <div key={index} className="p-10 text-lg text-red-500">
                <p>
                  ⚠️ <strong>Missing component</strong> for content type:{" "}
                  <strong>{contentTypeId}</strong>.
                </p>
              </div>
            );
          }

          // Get the corresponding React component based on the content type ID
          const Component =
            componentMap[contentTypeId as keyof typeof componentMap];

          // Render the component if found, else show a fallback message
          return Component ? (
            // Spread the componentEntry as props into the corresponding component
            // Using `any` to bypass TypeScript errors for type mismatch
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Component key={index} {...(componentEntry as any)} />
          ) : (
            // **thinking... Probably not needed??, Fallback if no component is found for the given content type ID
            <div key={index} className="p-10 text-lg text-red-500">
              <p>
                ⚠️ <strong>Missing component</strong> for content type:{" "}
                <strong>{contentTypeId}</strong>.
              </p>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ContentfulLandingPage;
