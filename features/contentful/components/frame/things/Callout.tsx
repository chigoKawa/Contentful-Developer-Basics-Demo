"use client";

import React from "react";
import { useContentfulInspectorMode, useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { baseRichTextOptions } from "@/features/contentful/richtext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import BaseButtonWrapper from "../../base-button/base-button-wrapper";
import type { ICallout, IBaseButton } from "@/features/contentful/type";
import { renderAsset } from "../utils";

type DisplayMode = "default" | "hero";

export default function ThingCallout({ entry, display = "default" }: { entry: ICallout; display?: DisplayMode }) {
  const live = (useContentfulLiveUpdates(entry) as ICallout) || entry;
  const inspectorProps = useContentfulInspectorMode({ entryId: live?.sys?.id });
  const f = live.fields;

  const title = f.title; // rich text
  const subtitle = f.subtitle; // rich text
  const button = f.button as IBaseButton | undefined;
  const media = f.media;

  const hero = display === "hero";
  const cardClass = hero
    ? "bg-transparent border-0 shadow-none rounded-none mx-auto max-w-3xl"
    : "rounded-2xl shadow-sm";

  if (hero) {
    return (
      <div className="mx-auto max-w-3xl text-inherit">
        <div className="text-center">
          {title ? (
            <div {...inspectorProps({ fieldId: "title" })} className="text-current">
              {documentToReactComponents(title, baseRichTextOptions)}
            </div>
          ) : null}
          {subtitle ? (
            <div {...inspectorProps({ fieldId: "subtitle" })} className="text-current/80 mt-2">
              {documentToReactComponents(subtitle, baseRichTextOptions)}
            </div>
          ) : null}
        </div>
        {button ? (
          <div {...inspectorProps({ fieldId: "button" })} className="mt-6 flex justify-center">
            <BaseButtonWrapper {...button} />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Card className={cardClass}>
      {(
        <>
          <CardHeader>
            {title ? (
              <CardTitle {...inspectorProps({ fieldId: "title" })}>
                {documentToReactComponents(title, baseRichTextOptions)}
              </CardTitle>
            ) : null}
            {subtitle ? (
              <CardDescription {...inspectorProps({ fieldId: "subtitle" })}>
                {documentToReactComponents(subtitle, baseRichTextOptions)}
              </CardDescription>
            ) : null}
          </CardHeader>
          <CardContent>
            {media ? (
              <div {...inspectorProps({ fieldId: "media" })} className="rounded-lg overflow-hidden">
                {renderAsset(media)}
              </div>
            ) : null}
          </CardContent>
          {button ? (
            <CardFooter {...inspectorProps({ fieldId: "button" })}>
              <BaseButtonWrapper {...button} />
            </CardFooter>
          ) : null}
        </>
      )}
    </Card>
  );
}
