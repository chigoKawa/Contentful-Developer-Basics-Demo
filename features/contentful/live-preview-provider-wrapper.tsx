"use client";
import React, { ReactNode } from "react";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

const LivePreviewProviderWrapper = ({
  children,
  locale,
  isPreviewEnabled,
}: {
  children: ReactNode;
  locale: string;
  isPreviewEnabled: boolean;
}) => {
  return (
    <ContentfulLivePreviewProvider
      locale={locale}
      enableInspectorMode={isPreviewEnabled}
      enableLiveUpdates={isPreviewEnabled}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
};

export default LivePreviewProviderWrapper;
