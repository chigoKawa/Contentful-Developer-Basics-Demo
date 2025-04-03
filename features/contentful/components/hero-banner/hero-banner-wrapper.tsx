import React from "react";
import { IHeroBanner } from "../../type";
import VariantPrimary from "./variant-primary";
import VariantCentered from "./variant-centered";
import VariantWithBgImage from "./variant-with-bgimage";

import ActionButtonRender from "./action-button-render";
import { extractContentfulAssetUrl } from "@/lib/utils";

const HerobannerWrapper = (entry: IHeroBanner) => {
  const headline = entry?.fields?.headline as string;
  const body = entry?.fields?.body;
  const heroImage = entry?.fields?.heroImage;
  const imageUrl = extractContentfulAssetUrl(heroImage);
  const buttons = entry?.fields?.actionButtons;
  const variant = entry?.fields?.variant;

  if (variant === "Centered") {
    return (
      <VariantCentered
        entryId={entry.sys.id}
        title={headline}
        body={body}
        image={{ url: imageUrl, alt: "" }}
        buttons={buttons ? <ActionButtonRender buttons={buttons} /> : <></>}
      />
    );
  }

  if (variant === "With Background Image") {
    return (
      <VariantWithBgImage
        entryId={entry.sys.id}
        title={headline}
        body={body}
        image={{ url: imageUrl, alt: "" }}
        buttons={buttons ? <ActionButtonRender buttons={buttons} /> : <></>}
      />
    );
  }
  return (
    <div className="relative">
      <VariantPrimary
        alignRight={variant === "Right Aligned"}
        entryId={entry.sys.id}
        title={headline}
        body={body}
        image={{ url: imageUrl, alt: "" }}
        buttons={buttons ? <ActionButtonRender buttons={buttons} /> : <></>}
      />
    </div>
  );
};

export default HerobannerWrapper;
