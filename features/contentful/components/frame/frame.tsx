"use client";

import React from "react";
import type { IFrame } from "@/features/contentful/type";
import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from "@contentful/live-preview/react";
import FrameHeader from "./FrameHeader";
import Thing from "./things";
import { FadeIn, Stagger } from "@/features/animations/in-view";
import {
  getBgClass,
  getGapClass,
  getPaddingClass,
  getLayoutClass,
  renderAsset,
  cx,
} from "./utils";
import { getTextClassFromBgColor, getOverlayFromOptions } from "./utils";
import type {
  ICallout,
  IImageWrapper,
  IPexelsImageWrapper,
} from "@/features/contentful/type";

// (FrameHeader and Thing now live in dedicated files)

export default function Frame(frame: IFrame) {
  const liveFrame = useContentfulLiveUpdates(frame) || frame;
  const inspectorProps = useContentfulInspectorMode({
    entryId: liveFrame.sys.id,
  });
  // Fields can be temporarily undefined while preview/live updates stream in.
  // Use a defensive fallback with sensible defaults to avoid runtime crashes.
  const f =
    (liveFrame as unknown as { fields?: Partial<IFrame["fields"]> }).fields ||
    {};

  const {
    layout = "single",
    theme = "light",
    backgroundColor = "neutral",
    backgroundMedia,
    things,
    gap = "md",
    padding = "md",
    alignment = "left",
    dimBackground,
    tintColor,
  } = f as Partial<IFrame["fields"]>;
  const thingsArr = (things as IFrame["fields"]["things"]) || [];

  const containerClasses = [
    getBgClass(theme, backgroundColor),
    getPaddingClass(padding),
    alignment === "center"
      ? "text-center"
      : alignment === "right"
      ? "text-right"
      : "text-left",
  ]
    .filter(Boolean)
    .join(" ");

  const itemsWrapperClasses = [getLayoutClass(layout), getGapClass(gap)].join(
    " "
  );

  const hasImage = !!backgroundMedia;
  const forceWhiteText = hasImage && backgroundColor === "transparent";
  const imageTextClass = hasImage
    ? getTextClassFromBgColor(theme, backgroundColor)
    : undefined;

  return (
    <section
      className={cx(
        "relative overflow-hidden",
        containerClasses,
        hasImage ? "bg-transparent" : undefined,
        forceWhiteText ? "text-white" : undefined,
        hasImage ? imageTextClass : undefined
      )}
    >
      {backgroundMedia ? (
        <>
          <div
            {...inspectorProps({ fieldId: "backgroundMedia" })}
            className="absolute inset-0 -z-10 pointer-events-none"
          >
            {renderAsset(backgroundMedia, "w-full h-full object-cover")}
          </div>
          {/* Full-bleed darken/tint overlay driven by editor options */}
          <div
            className={cx(
              "absolute inset-0 -z-10 pointer-events-none",
              getOverlayFromOptions(dimBackground, tintColor)
            )}
          />
        </>
      ) : null}
      {layout === "hero" ? (
        <div className="relative mx-auto max-w-5xl px-6 py-16 md:py-24 text-center min-h-[50vh] md:min-h-[60vh] flex items-center justify-center">
          {!backgroundMedia && process.env.NODE_ENV !== "production" ? (
            <div className="absolute top-4 right-4 z-10 rounded-md bg-amber-500/90 text-white text-xs px-2 py-1 shadow">
              Hero layout: add a Background Image for best results
            </div>
          ) : null}
          <div className="relative z-10 w-full">
            <FadeIn y={24}>
              <FrameHeader frame={liveFrame} />
            </FadeIn>
            <div {...inspectorProps({ fieldId: "things" })}>
              {Array.isArray(thingsArr) && thingsArr.length > 0 ? (
                <FadeIn y={16} delay={0.1}>
                  <div
                    key={thingsArr[0]?.sys?.id ?? 0}
                    data-contentful-entry-id={thingsArr[0]?.sys?.id}
                    className="mt-6"
                  >
                    <Thing
                      entry={
                        thingsArr[0] as unknown as
                          | ICallout
                          | IImageWrapper
                          | IPexelsImageWrapper
                      }
                      display="hero"
                    />
                  </div>
                </FadeIn>
              ) : null}
            </div>
          </div>
        </div>
      ) : layout === "duplex" ? (
        <div className="container mx-auto">
          {(() => {
            const isHeaderPresent = !!liveFrame.fields.frameHeader;
            const first = thingsArr?.[0];
            const second = thingsArr?.[1];
            const firstCtid = first?.sys?.contentType?.sys?.id as
              | string
              | undefined;
            const secondCtid = second?.sys?.contentType?.sys?.id as
              | string
              | undefined;
            const isImageCtid = (ctid?: string) =>
              ctid === "imageWrapper" || ctid === "pexelsImageWrapper";

            const headerNode = isHeaderPresent ? (
              <div className="max-w-prose md:mx-0 mx-auto">
                <FrameHeader frame={liveFrame} />
              </div>
            ) : null;
            const firstNode = first ? (
              <div
                key={first?.sys?.id ?? 0}
                data-contentful-entry-id={first?.sys?.id}
              >
                <Thing
                  entry={
                    first as unknown as
                      | ICallout
                      | IImageWrapper
                      | IPexelsImageWrapper
                  }
                />
              </div>
            ) : null;
            const secondNode = second ? (
              <div
                key={second?.sys?.id ?? 1}
                data-contentful-entry-id={second?.sys?.id}
              >
                <Thing
                  entry={
                    second as unknown as
                      | ICallout
                      | IPexelsImageWrapper
                      | IImageWrapper
                  }
                />
              </div>
            ) : null;

            let left = null as React.ReactNode;
            let right = null as React.ReactNode;

            if (isHeaderPresent) {
              // Header on one side, first thing on the other; respect explicit alignment
              if (alignment === "right") {
                left = firstNode;
                right = headerNode;
              } else {
                left = headerNode;
                right = firstNode;
              }
            } else {
              // Use first two things; swap by alignment
              if (alignment === "right") {
                left = secondNode;
                right = firstNode;
              } else {
                left = firstNode;
                right = secondNode;
              }
              // Prefer media on the right if one side is an image
              if (isImageCtid(firstCtid) && left === firstNode) {
                const tmp = left;
                left = right;
                right = tmp;
              }
              if (isImageCtid(secondCtid) && right === secondNode) {
                // already on the right; ok
              }
            }

            return (
              <Stagger
                {...inspectorProps({ fieldId: "things" })}
                className={cx(
                  "grid grid-cols-1 md:grid-cols-2 gap-8 md:items-center gap-y-10",
                  getGapClass(gap)
                )}
              >
                <FadeIn y={20}>
                  <div className="min-w-0 md:flex md:flex-col md:justify-center md:gap-4">
                    {left}
                  </div>
                </FadeIn>
                <FadeIn y={20} delay={0.08}>
                  <div className="min-w-0 md:flex md:flex-col md:justify-center md:gap-4">
                    {right}
                  </div>
                </FadeIn>
              </Stagger>
            );
          })()}
        </div>
      ) : (
        <div className="container mx-auto max-w-7xl">
          <FrameHeader frame={liveFrame} />
          <Stagger
            {...inspectorProps({ fieldId: "things" })}
            className={cx(itemsWrapperClasses, "gap-y-10")}
          >
            {thingsArr?.map((it, idx) => (
              <FadeIn key={`${it?.sys?.id}-${idx}`} y={20} delay={idx * 0.05}>
                <div data-contentful-entry-id={it?.sys?.id} className="min-w-0">
                  <Thing
                    entry={
                      it as unknown as
                        | ICallout
                        | IImageWrapper
                        | IPexelsImageWrapper
                    }
                  />
                </div>
              </FadeIn>
            ))}
          </Stagger>
        </div>
      )}
    </section>
  );
}
