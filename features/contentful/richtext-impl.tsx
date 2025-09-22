import React from "react";
import type { Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { MergeTag } from "@ninetailed/experience.js-react";

export const baseRichTextOptions: Options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => <p className="mb-4">{children}</p>,
    [BLOCKS.HEADING_1]: (_node, children) => (
      <h1 className="text-4xl font-bold mb-6">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="text-3xl font-semibold mb-5">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="text-2xl font-medium mb-4">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 [&>li]:ml-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="list-outside px-4 ml-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => <li className="mb-2">{children}</li>,
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 mb-4 italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const fileUrl = node?.data?.target?.fields?.file?.url as string | undefined;
      const title = (node?.data?.target?.fields?.title as string) || "Embedded Image";
      if (!fileUrl) return null;
      return (
        <div className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
        href={node.data.uri as string}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
    [INLINES.EMBEDDED_ENTRY]: (node) => {
      type NtMergeTagEntry = {
        sys?: { contentType?: { sys?: { id?: string } } };
        fields?: { nt_mergetag_id?: string; nt_fallback?: string };
      };
      const target = (node as { data?: { target?: NtMergeTagEntry } })?.data?.target;
      const ctid = target?.sys?.contentType?.sys?.id;
      if (ctid === "nt_mergetag") {
        const id = target?.fields?.nt_mergetag_id ?? "";
        const fallback = target?.fields?.nt_fallback ?? "";
        if (id) {
          return <MergeTag id={id} fallback={fallback} />;
        }
        // If no id provided, render the fallback string directly so authors still see content
        if (fallback) {
          return <span>{fallback}</span>;
        }
      }
      return null;
    },
  },
  renderText: (text) => text,
};
