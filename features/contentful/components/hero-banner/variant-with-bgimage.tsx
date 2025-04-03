import React, { FC, ReactNode } from "react";
import { useContentfulInspectorMode } from "@contentful/live-preview/react";
import { cn } from "@/lib/utils";
interface IProps {
  alignRight?: boolean; // Optional prop to align the text and buttons to the right side
  entryId: string; // Unique ID for the entry used for live preview inspector mode
  title: string; // The main heading of the hero banner
  body?: string; // Optional subtext for additional information
  image: { url: string; alt: string }; // Background image with alt text for accessibility
  buttons: ReactNode; // Buttons passed as children (can be multiple buttons from Contentful)
}

const VariantWithBgImage: FC<IProps> = ({
  title,
  body,
  image,
  buttons,
  entryId,
}) => {
  const inspectorProps = useContentfulInspectorMode({ entryId });
  return (
    <div className="relative bg-[#3B2F2F] text-white">
      {/* Hero section with a dynamic background image */}
      <section
        style={{ backgroundImage: `url(${image.url})` }}
        className="relative bg-cover bg-center bg-no-repeat"
      >
        {/* Overlay for better contrast on text */}
        <div className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></div>

        {/* Content container - centers text and buttons */}
        <div
          className={cn(
            "relative  mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-[600px] lg:items-center lg:px-8"
          )}
        >
          <div className="max-w-xl flex flex-col gap-4 text-center ltr:sm:text-left rtl:sm:text-right">
            {/* Hero title */}
            <h1
              {...inspectorProps({ fieldId: "headline" })}
              className="text-white sm:text-4xl scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl"
            >
              {title}
            </h1>

            {/* Optional body text */}
            {body && (
              <p
                {...inspectorProps({ fieldId: "body" })}
                className="mt-4 max-w-lg text-white sm:text-xl/relaxed"
              >
                {body}
              </p>
            )}

            {/* Button section */}
            <div className="mt-8">{buttons}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VariantWithBgImage;
