"use client";

import React, { FC } from "react";
import { IBlogPostPage } from "../type";
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { format } from "date-fns";

import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { extractContentfulAssetUrl } from "@/lib/utils";
import { useContentfulInspectorMode } from "@contentful/live-preview/react";
import CtaWrapper from "./cta/cta-wrapper";
import CodeSnippet from "./code-snippet/code-snippet";
import PersonWrapper from "./person/person-wrapper";

// Embed component map for handling Contentful embedded entries
const embeddedBlockComponentMap = {
  cta: CtaWrapper,
  codeSnippet: CodeSnippet,
  person: PersonWrapper,
};

// Define the props interface
interface IProps {
  entry: IBlogPostPage;
}

// Define rich text rendering options
export const richTextOptions: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_, children) => <p className="mb-4">{children}</p>,
    [BLOCKS.HEADING_1]: (_, children) => (
      <h1 className="text-4xl font-bold mb-6">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (_, children) => (
      <h2 className="text-3xl font-semibold mb-5">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_, children) => (
      <h3 className="text-2xl font-medium mb-4">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (_, children) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 [&>li]:ml-4">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (_, children) => (
      <ol className="list-outside px-4 ml-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_, children) => <li className="mb-2">{children}</li>,
    [BLOCKS.QUOTE]: (_, children) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 mb-4 italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const fileUrl = node?.data?.target?.fields?.file?.url;
      const title = node?.data?.target?.fields?.title || "Embedded Image";
      if (!fileUrl) return null;

      return (
        <div className="my-6">
          <img
            src={`https:${fileUrl}`}
            alt={title}
            className="rounded-md w-full object-cover"
          />
          <p className="text-sm mt-2 text-center">{title}</p>
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const componentEntry = node.data.target;
      const contentTypeId = node?.data?.target?.sys?.contentType?.sys?.id || "";
      const Component =
        embeddedBlockComponentMap[
          contentTypeId as keyof typeof embeddedBlockComponentMap
        ];

      return Component ? (
        <Component {...componentEntry} />
      ) : (
        <div className="p-10 text-lg text-red-500">
          <p>
            ⚠️ <strong>Missing component</strong> for content type:{" "}
            <strong>{contentTypeId}</strong>.
          </p>
        </div>
      );
    },
    [INLINES.EMBEDDED_ENTRY]: (node) => {
      const componentEntry = node.data.target;
      const contentTypeId = node?.data?.target?.sys?.contentType?.sys?.id || "";
      const Component =
        embeddedBlockComponentMap[
          contentTypeId as keyof typeof embeddedBlockComponentMap
        ];

      return Component ? (
        <Component isInline={true} {...componentEntry} />
      ) : (
        <span className="p-10 text-lg text-red-500">
          <div>
            ⚠️ <strong>Missing component</strong> for content type:{" "}
            <strong>{contentTypeId}</strong>.
          </div>
        </span>
      );
    },
  },
  renderText: (text) => text.replace("", ""),
};

// Main Blog Page Component
const ContentfulBlogPage: FC<IProps> = ({ entry: publishedEntry }) => {
  // Use live updates for Contentful preview mode
  const entry: IBlogPostPage =
    useContentfulLiveUpdates(publishedEntry) || publishedEntry;
  const { title, publishedDate, summary, body, featuredImage, author } =
    entry.fields;

  const featuredImageUrl = extractContentfulAssetUrl(featuredImage);
  const inspectorProps = useContentfulInspectorMode({
    entryId: entry?.sys?.id,
  });

  return (
    <div className="relative max-w-screen-md mx-auto px-4 py-8 prose">
      <h1
        {...inspectorProps({ fieldId: "title" })}
        className="text-4xl font-bold mb-6"
      >
        {title}
      </h1>

      {publishedDate && (
        <p className="text-sm text-gray-500 mb-4">
          Published on {format(new Date(publishedDate), "MMMM dd, yyyy")}
        </p>
      )}

      {featuredImageUrl && (
        <div
          {...inspectorProps({ fieldId: "featuredImage" })}
          className="mb-6 relative"
        >
          <img
            src={`https:${featuredImageUrl}`}
            alt={title || "Featured Image"}
            className="h-56x relative rounded-lg w-full "
          />
        </div>
      )}

      {summary && (
        <div
          {...inspectorProps({ fieldId: "summary" })}
          className="mb-6 text-lg text-gray-700"
        >
          {documentToReactComponents(summary, richTextOptions)}
        </div>
      )}

      <div
        {...inspectorProps({ fieldId: "body" })}
        className="prose prose-lg mb-8"
      >
        {documentToReactComponents(body, richTextOptions)}
      </div>

      {author && (
        <div className="flex items-center mt-8">
          {author?.fields?.avatar?.fields?.file?.url && (
            <Avatar className="mr-4">
              <AvatarImage
                src={`https:${author.fields.avatar.fields.file.url}`}
                alt={author.fields.firstName || "Author"}
              />
              <AvatarFallback>
                {author.fields.firstName?.charAt(0)}
                {author.fields.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}

          <div>
            <h3 className="font-semibold">
              {author.fields.firstName} {author.fields.lastName}
            </h3>
            {author.fields.bio && (
              <div className="text-sm text-gray-600">{author.fields.bio}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentfulBlogPage;
