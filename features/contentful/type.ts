/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry, EntryFields, Asset, EntrySkeletonType } from "contentful";

// Base type for Ninetailed experiences field
export type NtExperiencesField = Entry<EntrySkeletonType>[] | undefined;

export interface IExternalLink extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    title?: EntryFields.Symbol;
    url?: EntryFields.Symbol;
    optionalIcon?: EntryFields.Symbol<
      "Twitter" | "Instagram" | "Facebook" | "TikTok" | "LinkedIn" | "Github"
    >;
  };
}

// Alias for backward compatibility
export type IExternalUrl = IExternalLink;

export type CtaSkeleton = {
  contentTypeId: "cta";
  fields: ICta["fields"];
};

export interface IBaseButton extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    label?: EntryFields.Symbol;
    target?: IExternalLink | ILandingPage | IBlogPostPage;
    openInNewTab?: EntryFields.Boolean;
    color?: EntryFields.Symbol<
      "Default" | "Primary" | "Secondary" | "Success" | "Danger" | "Warning"
    >;
    size?: EntryFields.Symbol<"Small" | "Medium" | "Large">;
    variant?: EntryFields.Symbol<
      "Primary" | "Secondary" | "Destructive" | "Ghost" | "Outline"
    >;
  };
}

export interface ISeo extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    title?: EntryFields.Symbol;
    description?: EntryFields.Text;
    ogImage?: Asset;
    noindex?: EntryFields.Boolean;
    nofollow?: EntryFields.Boolean;
    // Aliases for backward compatibility
    noIndex?: EntryFields.Boolean;
    noFollow?: EntryFields.Boolean;
  };
}

export interface ICta extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    title?: EntryFields.Symbol;
    body?: EntryFields.Text;
    actionButtons?: EntryFields.Array<IBaseButton>;
    backgroundColor?: EntryFields.Symbol<
      "Primary" | "Secondary" | "Default" | "None"
    >;
    images?: EntryFields.Array<Asset>;
    variant?: EntryFields.Symbol<"Simple" | "Smooth">;
  };
}

export interface IHeroBanner extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    headline?: EntryFields.Symbol;
    body?: EntryFields.Text;
    image?: IImageWrapper | IPexelsImageWrapper;
    heroImage?: Asset;
    variant?: EntryFields.Symbol<
      "Primary" | "Centered" | "With Background Image" | "Right Aligned"
    >;
    actionButtons?: EntryFields.Array<IBaseButton>;
    nt_experiences?: NtExperiencesField;
  };
}
export type HeroBannerSkeleton = {
  contentTypeId: "heroBanner";
  fields: IHeroBanner["fields"];
};

// 🔹 Define the Landing Page Skeleton
export type LandingPageSkeleton = {
  contentTypeId: "landingPage";
  fields: ILandingPage["fields"];
};

export interface ILandingPage extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    title?: EntryFields.Symbol;
    slug?: EntryFields.Symbol;
    frames?: EntryFields.Array<EntryFields.EntryLink<FrameSkeleton>>;
    sections?: EntryFields.Array<EntryFields.EntryLink<SectionSkeleton>>;
    seoMetadata?: ISeo;
  };
}

// Rich Content Block - section type
export interface IRichContentBlock extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    body?: EntryFields.RichText;
    images?: EntryFields.Array<IImageWrapper | IPexelsImageWrapper>;
    backgroundColor?: EntryFields.Symbol<
      "Default" | "Primary" | "Secondary" | "None"
    >;
  };
}

export type RichContentBlockSkeleton = {
  contentTypeId: "richContentBlock";
  fields: IRichContentBlock["fields"];
};

// Video Wrapper
export interface IVideoWrapper extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    title?: EntryFields.Symbol;
    videoSource?: EntryFields.Symbol<"Youtube" | "Wistia" | "Contentful">;
    url?: EntryFields.Symbol;
    contentfulVideo?: Asset;
  };
}

export type VideoWrapperSkeleton = {
  contentTypeId: "videoWrapper";
  fields: IVideoWrapper["fields"];
};

// Union type for all section content types
export type SectionEntry = IHeroBanner | ICta | IRichContentBlock;
export type SectionSkeleton = HeroBannerSkeleton | CtaSkeleton | RichContentBlockSkeleton;

export interface IPerson extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    firstName: EntryFields.Symbol;
    lastName?: EntryFields.Symbol;
    avatar?: Asset;
    bio?: EntryFields.Text;
    website?: IExternalUrl;
    twitterProfileUrl?: IExternalUrl;
    linkedinProfileUrl?: IExternalUrl;
  };
  isInline?: boolean; // This is a custom flag, not part of the content model
}
export interface ICodeSnippet extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    codeBlock: EntryFields.Text;
    language: EntryFields.Symbol;
  };
}
export interface IBlogPostPage extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    title: EntryFields.Symbol;
    slug: EntryFields.Symbol;
    publishedDate?: EntryFields.Date;
    summary?: EntryFields.RichText;
    body: EntryFields.RichText;
    featuredImage: Asset;
    author?: IPerson;
    seoMetadata?: ISeo;
  };
}

export type BlogPostPageSkeleton = {
  contentTypeId: "blogPost";
  fields: IBlogPostPage["fields"];
};

// -----------------------------
// New content types: Frame model
// -----------------------------

export interface IFrameHeader extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    headline?: EntryFields.RichText;
    subline?: EntryFields.RichText;
    eyebrow?: EntryFields.Symbol;
    nt_experiences?: NtExperiencesField;
  };
}

export type FrameHeaderSkeleton = {
  contentTypeId: "frameHeader";
  fields: IFrameHeader["fields"];
};

export interface IImageWrapper extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    image?: Asset;
    altText?: EntryFields.Symbol;
    radius?: EntryFields.Symbol<"None" | "Small" | "Medium" | "Large" | "Full">;
    enableZoom?: EntryFields.Boolean;
    enableBlur?: EntryFields.Boolean;
  };
}

export type ImageWrapperSkeleton = {
  contentTypeId: "imageWrapper";
  fields: IImageWrapper["fields"];
};

type JsonObject = { [key: string]: any };
export interface IPexelsPhotoData extends JsonObject {
  photographer: string;
  photographer_url: string;
  image: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
  avg_color: string;
  url: string;
  attribution: string;
  photographer_attribution: string;
  width: number;
  height?: number;
}

export interface IPexelsImageWrapper extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    pexelsImage?: EntryFields.Object<IPexelsPhotoData>;
    radius?: EntryFields.Symbol<"None" | "Small" | "Medium" | "Large" | "Full">;
    enableZoom?: EntryFields.Boolean;
    enableBlur?: EntryFields.Boolean;
    nt_experiences?: NtExperiencesField;
  };
}

export type PexelsImageWrapperSkeleton = {
  contentTypeId: "pexelsImageWrapper";
  fields: IPexelsImageWrapper["fields"];
};

export interface ICallout extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    title?: EntryFields.RichText;
    subtitle?: EntryFields.RichText;
    button?: IBaseButton;
    media?: Asset;
    nt_experiences?: NtExperiencesField;
  };
}

export type CalloutSkeleton = {
  contentTypeId: "callout";
  fields: ICallout["fields"];
};

export interface IFrame extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    frameHeader?: EntryFields.EntryLink<FrameHeaderSkeleton>;
    layout?: EntryFields.Symbol<
      "single" | "duplex" | "hero" | "grid" | "carousel" | "list"
    >;
    things?: EntryFields.Array<
      EntryFields.EntryLink<
        | ImageWrapperSkeleton
        | PexelsImageWrapperSkeleton
        | CalloutSkeleton
        | BlogPostPageSkeleton
      >
    >;
    theme?: EntryFields.Symbol<"light" | "dark" | "brand">;
    backgroundMedia?: Asset;
    backgroundColor?: EntryFields.Symbol<
      "primary" | "secondary" | "accent" | "neutral" | "transparent"
    >;
    dimBackground?: EntryFields.Symbol<"10" | "20" | "30" | "40" | "50">;
    tintColor?: EntryFields.Symbol<
      "none" | "primary" | "secondary" | "accent" | "black"
    >;
    gap?: EntryFields.Symbol<"sm" | "md" | "lg" | "xl">;
    padding?: EntryFields.Symbol<"none" | "sm" | "md" | "lg" | "xl" | "xxl">;
    alignment?: EntryFields.Symbol<"left" | "right" | "center">;
  };
}

export type FrameSkeleton = {
  contentTypeId: "frame";
  fields: IFrame["fields"];
};
