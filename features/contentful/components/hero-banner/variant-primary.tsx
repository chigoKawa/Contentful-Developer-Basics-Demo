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

const VariantPrimary: FC<IProps> = ({
  title,
  body,
  image,
  buttons,
  entryId,
  alignRight,
}) => {
  const inspectorProps = useContentfulInspectorMode({ entryId });
  return (
    <div className="relative bg-[#3B2F2F] text-white">
      <div
        className={cn(
          "relative flex flex-col lg:flex-row gap-4 justify-between mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-[450px] lg:items-center lg:px-8 "
        )}
      >
        <img
          src={image.url}
          alt={""}
          className={cn("lg:w-[50%]", alignRight ? "order-last" : "")}
        />
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
    </div>
  );
};

export default VariantPrimary;
