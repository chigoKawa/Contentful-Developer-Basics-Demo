"use client";

import React from "react";
import type { IFrame, IFrameHeader } from "@/features/contentful/type";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { baseRichTextOptions } from "@/features/contentful/richtext";
import { useContentfulInspectorMode, useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { Experience } from "@ninetailed/experience.js-react";
import { ExperienceMapper } from "@ninetailed/experience.js-utils-contentful";

function HeaderRender(entry: IFrameHeader) {
  const liveHeader = (useContentfulLiveUpdates(entry) as IFrameHeader) || entry;
  const inspectorProps = useContentfulInspectorMode({ entryId: liveHeader.sys.id });
  const f = liveHeader.fields;
  const eyebrow = f.eyebrow as string | undefined;

  return (
    <div className="mb-8 text-center">
      {eyebrow ? (
        <div
          {...inspectorProps({ fieldId: "eyebrow" })}
          className="text-sm uppercase tracking-wide text-current/80"
        >
          {eyebrow}
        </div>
      ) : null}

      {f.headline ? (
        <div
          {...inspectorProps({ fieldId: "headline" })}
          className="text-3xl md:text-4xl font-semibold mt-2"
        >
          {documentToReactComponents(f.headline, baseRichTextOptions)}
        </div>
      ) : null}

      {f.subline ? (
        <div
          {...inspectorProps({ fieldId: "subline" })}
          className="mt-3 text-current/80"
        >
          {documentToReactComponents(f.subline, baseRichTextOptions)}
        </div>
      ) : null}
    </div>
  );
}

export default function FrameHeader({ frame }: { frame: IFrame }) {
  const headerEntry = frame.fields?.frameHeader as unknown as IFrameHeader | undefined;
  if (!headerEntry) return null;

  const experiences = (headerEntry.fields?.nt_experiences ?? []) as unknown[];
  const isExp = ExperienceMapper.isExperienceEntry as (v: unknown) => boolean;
  const mapExp = ExperienceMapper.mapExperience as (v: unknown) => unknown;
  const mappedUnknown = Array.isArray(experiences)
    ? experiences.filter(isExp).map(mapExp)
    : [];
  type ExperiencesProp = NonNullable<
    React.ComponentProps<typeof Experience>["experiences"]
  >;
  const experiencesForProp = mappedUnknown as unknown as ExperiencesProp;

  if (mappedUnknown.length > 0) {
    const HeaderComponent: React.ComponentType<IFrameHeader> = HeaderRender;
    return (
      <Experience
        id={headerEntry.sys.id}
        component={HeaderComponent}
        experiences={experiencesForProp}
        {...headerEntry}
      />
    );
  }

  return <HeaderRender {...headerEntry} />;
}
