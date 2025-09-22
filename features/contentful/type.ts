import { Entry, EntryFields, Asset, EntrySkeletonType } from "contentful";

export interface IExternalUrl extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    title: EntryFields.Symbol;
    url: EntryFields.Symbol;
    optionalIcon?: EntryFields.Symbol<
      "Twitter" | "Instagram" | "Facebook" | "TikTok" | "LinkedIn" | "Github"
    >;
  };
}

export type CtaSkeleton = {
  contentTypeId: "cta";
  fields: ICta["fields"];
};

export interface IBaseButton extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    label: EntryFields.Symbol;
    target: IExternalUrl;
    openInNewTab?: EntryFields.Boolean;
    color: EntryFields.Symbol<
      "Default" | "Primary" | "Secondary" | "Success" | "Danger" | "Warning"
    >;
    size: EntryFields.Symbol<"Small" | "Medium" | "Large">;
    variant: EntryFields.Symbol<
      "Primary" | "Secondary" | "Destructive" | "Ghost" | "Outline"
    >;
  };
}

export interface ISeo extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    title: EntryFields.Symbol;
    description: EntryFields.Symbol;
    ogImage: Asset;
    noIndex: EntryFields.Boolean;
    noFollow: EntryFields.Boolean;
  };
}

export interface ICta extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    title?: EntryFields.Symbol;
    images: EntryFields.Array<Asset>;
    body?: EntryFields.Text;
    actionButtons: EntryFields.Array<IBaseButton>;
    backgroundColor: EntryFields.Symbol<
      "Primary" | "Secondary" | "Default" | "None"
    >;
    variant: EntryFields.Symbol<"Simple" | "Smooth">;
  };
}

export interface IHeroBanner extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    headline?: EntryFields.Symbol;
    heroImage: Asset;
    body?: EntryFields.Text;
    variant: EntryFields.Symbol<
      "Primary" | "Centered" | "With Background Image" | "Right Aligned"
    >;
    actionButtons: EntryFields.Array<IBaseButton>;
    nt_experiences: Entry<EntrySkeletonType>[];
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
    internalName: EntryFields.Symbol;
    title: EntryFields.Symbol;
    slug: EntryFields.Symbol;
    heroBanner: EntryFields.EntryLink<HeroBannerSkeleton>;
    sections: EntryFields.Array<EntryFields.EntryLink<EntrySkeletonType>>;
    frames?: EntryFields.Array<EntryFields.EntryLink<FrameSkeleton>>;
    seoMetadata?: ISeo;
  };
}

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
    headline: EntryFields.RichText;
    subline?: EntryFields.RichText;
    eyebrow?: EntryFields.Symbol;
    nt_experiences?: Entry<EntrySkeletonType>[];
  };
}

export type FrameHeaderSkeleton = {
  contentTypeId: "frameHeader";
  fields: IFrameHeader["fields"];
};

// Minimal placeholders for image wrappers used in Frame.things
export interface IImageWrapper extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    asset?: Asset;
  };
}

export type ImageWrapperSkeleton = {
  contentTypeId: "imageWrapper";
  fields: IImageWrapper["fields"];
};

export interface IPexelsImageWrapper extends Entry {
  fields: {
    internalTitle?: EntryFields.Symbol;
    asset?: Asset;
  };
}

export type PexelsImageWrapperSkeleton = {
  contentTypeId: "pexelsImageWrapper";
  fields: IPexelsImageWrapper["fields"];
};

export interface ICallout extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    title?: EntryFields.RichText;
    subtitle?: EntryFields.RichText;
    button?: IBaseButton;
    media?: Asset;
  };
}

export type CalloutSkeleton = {
  contentTypeId: "callout";
  fields: ICallout["fields"];
};

export interface IFrame extends Entry {
  fields: {
    internalTitle: EntryFields.Symbol;
    frameHeader?: EntryFields.EntryLink<FrameHeaderSkeleton>;
    layout: EntryFields.Symbol<
      "single" | "duplex" | "hero" | "grid" | "carousel" | "list"
    >;
    theme: EntryFields.Symbol<"light" | "dark" | "brand">;
    backgroundColor: EntryFields.Symbol<
      "primary" | "secondary" | "accent" | "neutral" | "transparent"
    >;
    backgroundMedia?: Asset;
    things?: EntryFields.Array<
      EntryFields.EntryLink<
        ImageWrapperSkeleton | PexelsImageWrapperSkeleton | CalloutSkeleton | BlogPostPageSkeleton
      >
    >;
    gap?: EntryFields.Symbol<"sm" | "md" | "lg" | "xl">;
    padding?: EntryFields.Symbol<"none" | "sm" | "md" | "lg" | "xl" | "xxl">;
    alignment: EntryFields.Symbol<"left" | "right" | "center">;
    dimBackground?: EntryFields.Symbol<"10" | "20" | "30" | "40" | "50">;
    tintColor?: EntryFields.Symbol<"none" | "primary" | "secondary" | "accent" | "black">;
  };
}

export type FrameSkeleton = {
  contentTypeId: "frame";
  fields: IFrame["fields"];
};
