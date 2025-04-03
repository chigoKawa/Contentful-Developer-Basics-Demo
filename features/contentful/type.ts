import { Entry, EntryFields, Asset } from "contentful";

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
    seoMetadata?: ISeo;
    sections: EntryFields.Array<IHeroBanner | ICta>;
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
  };
}

export type BlogPostPageSkeleton = {
  contentTypeId: "blogPost";
  fields: IBlogPostPage["fields"];
};
