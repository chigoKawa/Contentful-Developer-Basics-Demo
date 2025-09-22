"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import type ExperienceConfiguration from "@ninetailed/experience.js-plugin-preview";

type AnyExperienceConfig = ExperienceConfiguration;
type AnyAudience = unknown;

export type PreviewData = {
  experiences: AnyExperienceConfig[];
  audiences: AnyAudience[];
};

export type PreviewDataContextType = PreviewData & {
  setExperiences: (exps: AnyExperienceConfig[]) => void;
  setAudiences: (audiences: AnyAudience[]) => void;
  reset: () => void;
};

const PreviewDataContext = createContext<PreviewDataContextType | null>(null);

export function PreviewDataProvider({ children }: { children: React.ReactNode }) {
  const [experiences, setExperiences] = useState<AnyExperienceConfig[]>([]);
  const [audiences, setAudiences] = useState<AnyAudience[]>([]);

  const value: PreviewDataContextType = useMemo(
    () => ({
      experiences,
      audiences,
      setExperiences,
      setAudiences,
      reset: () => {
        setExperiences([]);
        setAudiences([]);
      },
    }),
    [experiences, audiences]
  );

  return <PreviewDataContext.Provider value={value}>{children}</PreviewDataContext.Provider>;
}

export function usePreviewData() {
  const ctx = useContext(PreviewDataContext);
  if (!ctx) throw new Error("usePreviewData must be used within PreviewDataProvider");
  return ctx;
}
