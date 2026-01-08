import React from "react";
import CtaWrapper from "../components/cta/cta-wrapper";
import CodeSnippet from "../components/code-snippet/code-snippet";
import PersonWrapper from "../components/person/person-wrapper";

export const embeddedEntryComponentMap = {
  cta: CtaWrapper,
  codeSnippet: CodeSnippet,
  person: PersonWrapper,
} as const;

export function renderEmbeddedEntry(
  entry: unknown,
  options?: { isInline?: boolean }
): React.ReactNode {
  const contentTypeId = (entry as any)?.sys?.contentType?.sys?.id as
    | keyof typeof embeddedEntryComponentMap
    | undefined;

  if (!contentTypeId) return null;

  const Component = embeddedEntryComponentMap[contentTypeId];
  if (!Component) return null;

  return options?.isInline ? (
    <Component isInline={true} {...(entry as any)} />
  ) : (
    <Component {...(entry as any)} />
  );
}
