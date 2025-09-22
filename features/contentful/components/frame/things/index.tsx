"use client";

import React from "react";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import ThingCallout from "./Callout";
import ThingImage from "./Image";
import ThingBlogPost from "./BlogPost";
import type {
  ICallout,
  IImageWrapper,
  IPexelsImageWrapper,
  IBlogPostPage,
} from "@/features/contentful/type";
import { Experience } from "@ninetailed/experience.js-react";
import { ExperienceMapper } from "@ninetailed/experience.js-utils-contentful";

type ThingEntry =
  | ICallout
  | IImageWrapper
  | IPexelsImageWrapper
  | IBlogPostPage;
type ThingDisplay = "default" | "hero";

function ThingView({
  entry,
  display,
}: {
  entry: ThingEntry;
  display: ThingDisplay;
}) {
  const liveEntry = useContentfulLiveUpdates(entry) || entry;
  const ctid = liveEntry?.sys?.contentType?.sys?.id as string | undefined;
  if (!ctid) return null;

  switch (ctid) {
    case "callout":
      return <ThingCallout entry={liveEntry as ICallout} display={display} />;
    case "imageWrapper":
    case "pexelsImageWrapper":
      return (
        <ThingImage
          entry={liveEntry as IImageWrapper | IPexelsImageWrapper}
          display={display}
        />
      );
    case "blogPost":
      return <ThingBlogPost entry={liveEntry as IBlogPostPage} />;
    default:
      console.warn("Unsupported Thing content type:", ctid);
      return null;
  }
}

export default function Thing({
  entry,
  display = "default",
}: {
  entry: ThingEntry;
  display?: ThingDisplay;
}) {
  const liveEntry = useContentfulLiveUpdates(entry) || entry;
  const experiences = (liveEntry as any)?.fields?.nt_experiences ?? [];

  const mapped = Array.isArray(experiences)
    ? experiences
        .filter(ExperienceMapper.isExperienceEntry)
        .map(ExperienceMapper.mapExperience)
    : [];

  if (mapped.length > 0) {
    return (
      <Experience
        loadingComponent={() => (
          <ThingView entry={liveEntry as ThingEntry} display={display} />
        )}
        id={liveEntry.sys.id}
        component={(props: any) => (
          <ThingView entry={props} display={display} />
        )}
        experiences={mapped}
        {...(liveEntry as any)}
      />
    );
  }

  return <ThingView entry={liveEntry as ThingEntry} display={display} />;
}
