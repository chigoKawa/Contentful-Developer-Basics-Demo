// Dev-only preview data loader for Ninetailed Preview Plugin
// Implements https://www.contentful.com/developers/docs/personalization/preview-plugin/
// using the Contentful JS SDK already present in the project and the utils-contentful mappers.

import { getEntries } from "@/lib/contentful";
import {
  ExperienceMapper,
  AudienceMapper,
  type ExperienceEntryLike,
  type AudienceEntryLike,
} from "@ninetailed/experience.js-utils-contentful";
// Keep PreviewData payloads as unknown to avoid coupling to plugin's internal types

export type PreviewData = {
  experiences: unknown[];
  audiences: unknown[];
};

export async function loadPreviewData(): Promise<PreviewData> {
  // Experiences
  const expEntries = await getEntries(
    {
      content_type: "nt_experience",
      include: 1,
    },
    true // use preview API
  );
  const experiences = (expEntries as unknown as ExperienceEntryLike[])
    .filter(ExperienceMapper.isExperienceEntry)
    .map(ExperienceMapper.mapExperience);

  // Audiences
  const audEntries = await getEntries(
    {
      content_type: "nt_audience",
    },
    true // use preview API
  );
  const audiences = (audEntries as unknown as AudienceEntryLike[])
    .filter(AudienceMapper.isAudienceEntry)
    .map(AudienceMapper.mapAudience);

  return { experiences, audiences };
}
