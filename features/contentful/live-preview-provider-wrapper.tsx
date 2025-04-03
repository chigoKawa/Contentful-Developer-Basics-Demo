"use client";
import React, { ReactNode } from "react";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

const LivePreviewProviderWrapper = ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) => {
  return (
    <ContentfulLivePreviewProvider
      locale={locale}
      enableInspectorMode={true}
      enableLiveUpdates={true}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
};

export default LivePreviewProviderWrapper;
