import React, { FC, ReactNode } from "react";
import { useContentfulInspectorMode } from "@contentful/live-preview/react";

interface IProps {
  entryId: string; // Unique ID for the entry used for live preview inspector mode
  title: string; // The main heading of the hero banner
  body?: string; // Optional subtext for additional information
  image?: { url: string; alt: string }; // Background image with alt text for accessibility
  buttons: ReactNode; // Buttons passed as children (can be multiple buttons from Contentful)
}
const VariantCentered: FC<IProps> = ({ title, body, buttons, entryId }) => {
  const inspectorProps = useContentfulInspectorMode({ entryId });
  return (
    <section>
      <div className="relative">
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(100%+1.3px)] h-[176px]"
          >
            <path
              d="M1200,0H0V120H281.94C572.9,116.24,602.45,3.86,602.45,3.86h0S632,116.24,923,120h277Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
        <div className="w-full bg-[#3B2F2F] text-white pb-20">
          <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-[500px] lg:items-center">
            <div className="mx-auto max-w-3xl text-center">
              <h1
                {...inspectorProps({ fieldId: "headline" })}
                className="bg-gradient-to-r from-[#8B5A2B] via-[#D2A679] to-[#F4E1C1] bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
              >
                {title}
              </h1>

              {/* Optional body text */}
              {body && (
                <p
                  {...inspectorProps({ fieldId: "body" })}
                  className="mx-auto mt-4 max-w-xl text-gray-200 sm:text-xl/relaxed"
                >
                  {body}
                </p>
              )}

              {/* Button section */}
              <div className="mt-8 mx-auto flex items-center justify-center">
                {buttons}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VariantCentered;
