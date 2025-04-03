"use client";
import React, { ReactNode } from "react";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import { useSearchParams } from "next/navigation";

const LivePreviewProviderWrapper = ({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) => {
  const searchParams = useSearchParams();

  const preview = searchParams.get("preview");
  return (
    <ContentfulLivePreviewProvider
      locale={locale}
      enableInspectorMode={preview ? true : false}
      enableLiveUpdates={preview ? true : false}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
};

export default LivePreviewProviderWrapper;
