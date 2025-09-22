/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IBlogPostPage } from "@/features/contentful/type";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { renderAsset } from "../utils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { baseRichTextOptions } from "@/features/contentful/richtext";
import { format } from "date-fns";

function useCurrentLocale() {
  const pathname = usePathname() || "/";
  const seg = pathname.split("/").filter(Boolean)[0];
  // Fallback to en-US if we cannot infer
  return seg || "en-US";
}

export default function ThingBlogPost({ entry }: { entry: IBlogPostPage }) {
  const live = (useContentfulLiveUpdates(entry) as IBlogPostPage) || entry;
  const inspectorProps = useContentfulInspectorMode({ entryId: live?.sys?.id });
  const locale = useCurrentLocale();

  const title = live.fields.title as string;
  const slug = live.fields.slug as string;
  const image = live.fields.featuredImage;
  const published = live.fields.publishedDate as string | undefined;
  const summary = live.fields.summary; // rich text

  const href = `/blog/${slug}`;

  return (
    <Link
      href={href}
      {...inspectorProps({ fieldId: "slug" })}
      className="group block focus:outline-none "
    >
      <Card className="overflow-hidden rounded-xl border-0 bg-transparent p-0 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5 focus-within:ring-0 h-[440px] md:h-[460px]">
        <div className=" grid h-full grid-rows-[52%_48%] md:grid-rows-[50%_50%]">
          {/* Top: image fills its half */}
          <div className="relative">
            {renderAsset(
              image,
              "absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            )}
          </div>
          {/* Bottom: solid readable panel */}
          <div className="bg-background text-foreground p-4 sm:p-5 md:p-6 flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <CardTitle className="text-xl leading-snug group-hover:underline line-clamp-2">
                <span {...inspectorProps({ fieldId: "title" })}>{title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2 text-sm text-foreground/80 overflow-hidden flex-1">
              {published ? (
                <div className="mb-2 text-foreground/60">
                  {format(new Date(published), "PP")}
                </div>
              ) : null}
              {summary ? (
                <div
                  className="line-clamp-2 overflow-hidden"
                  {...inspectorProps({ fieldId: "summary" })}
                >
                  {documentToReactComponents(
                    summary as Document,
                    baseRichTextOptions
                  )}
                </div>
              ) : null}
              <div className="mt-auto pt-4 font-medium text-primary inline-flex items-center gap-1">
                Read more <span aria-hidden>→</span>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}
