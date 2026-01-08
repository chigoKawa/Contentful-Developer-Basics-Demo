import React from "react";
import ThingCallout from "../components/frame/things/Callout";
import ThingImage from "../components/frame/things/Image";
import ThingBlogPost from "../components/frame/things/BlogPost";
import type {
  ICallout,
  IImageWrapper,
  IPexelsImageWrapper,
  IBlogPostPage,
} from "../type";

type ThingDisplay = "default" | "hero";

// Centralized component map for frame things
export const thingsComponentMap: Record<string, (entry: any, display: ThingDisplay) => React.ReactElement | null> = {
  callout: (entry, display) => <ThingCallout entry={entry as ICallout} display={display} />,
  imageWrapper: (entry, display) => <ThingImage entry={entry as IImageWrapper | IPexelsImageWrapper} display={display} />,
  pexelsImageWrapper: (entry, display) => <ThingImage entry={entry as IImageWrapper | IPexelsImageWrapper} display={display} />,
  blogPost: (entry) => <ThingBlogPost entry={entry as IBlogPostPage} />,
} as const;
