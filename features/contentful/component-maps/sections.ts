import type { FC } from "react";
import type { IHeroBanner, ICta } from "../type";
import PersonalizedHeroBanner from "../components/hero-banner/personalized-hero-banner";
import CtaWrapper from "../components/cta/cta-wrapper";

// Centralized component map for landing page sections
export const sectionsComponentMap: Record<string, FC<any>> = {
  heroBanner: PersonalizedHeroBanner,
  cta: CtaWrapper,
} as const;
