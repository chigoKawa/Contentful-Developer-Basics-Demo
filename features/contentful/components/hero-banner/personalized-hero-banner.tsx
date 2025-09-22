"use client";
import React from "react";
import { Experience } from "@ninetailed/experience.js-react";
import { ExperienceMapper } from "@ninetailed/experience.js-utils-contentful";
import HerobannerWrapper from "./hero-banner-wrapper";
import { IHeroBanner } from "../../type";

// This component resolves the active Ninetailed experience for a Hero Banner
// and renders the existing Hero Banner wrapper with the selected variation data.
// Downstream UI stays unchanged.
export default function PersonalizedHeroBanner(entry: IHeroBanner) {
  const experiencesUnknown = (entry.fields.nt_experiences ?? []) as unknown[];

  const isExp = ExperienceMapper.isExperienceEntry as (v: unknown) => boolean;
  const mapExp = ExperienceMapper.mapExperience as (v: unknown) => unknown;

  let mappedExperiencesUnknown: unknown[] = [];
  try {
    mappedExperiencesUnknown = experiencesUnknown.filter(isExp).map(mapExp);
  } catch (e) {
    // If mapping fails for any reason, render baseline to avoid 500s in production
    return <HerobannerWrapper {...entry} />;
  }
  type ExperiencesProp = NonNullable<
    React.ComponentProps<typeof Experience>["experiences"]
  >;
  const experiencesForProp = mappedExperiencesUnknown as unknown as ExperiencesProp;

  // If there are no experiences configured, render baseline as-is
  if (!mappedExperiencesUnknown || mappedExperiencesUnknown.length === 0) {
    return <HerobannerWrapper {...entry} />;
  }

  // Thin wrapper: decisioning happens inside <Experience>, downstream stays untouched.

  // Experience will choose the active variant client-side and pass it
  // to the provided component (HerobannerWrapper). We forward the baseline
  // entry props so the wrapper can render if no decision is made.
  return (
    <Experience
      id={entry.sys.id}
      component={HerobannerWrapper}
      experiences={experiencesForProp}
      {...entry}
    />
  );
}
