import React, { FC, ReactNode } from "react";
import { useContentfulInspectorMode } from "@contentful/live-preview/react";
import { cn } from "@/lib/utils";

const bgImage =
  "https://images.ctfassets.net/m5vihs7hhhu6/6vGMEoaebHzVLnYQKWzP8r/6b240e791691ca51d7740da012efb8c8/pexels-roman-odintsov-4869223.jpg?w=1920&h=1080&fit=fill";

interface IProps {
  entryId: string; // Unique entry ID for live preview inspector mode
  title: string; // Main heading of the hero banner
  body?: string; // Optional subtext
  images: string[]; // Array of image URLs
  buttons: ReactNode; // Buttons passed as children
}

const SmoothCta: FC<IProps> = ({ title, body, images, buttons, entryId }) => {
  const inspectorProps = useContentfulInspectorMode({ entryId });

  return (
    <section
      style={{ backgroundImage: `url(${bgImage})` }}
      className="relative bg-[#3B2F2F] text-white max-w-screen-xl mx-auto p-2  bg-cover bg-center bg-no-repeat"
    >
      {/* Overlay for better contrast on text */}
      <div className="absolute inset-0 bg-gray-900/60 sm:bg-transparent sm:from-gray-900/45 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></div>

      <div className=" px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Text Section */}
          <div className="flex items-center relative rounded-xl shadow-2xl p-8 md:p-12 lg:px-16 lg:py-24 ">
            <div className=" mx-auto max-w-xl text-center">
              <h2
                {...inspectorProps({ fieldId: "headline" })}
                className="text-white text-2xl font-bold md:text-3xl"
              >
                {title}
              </h2>

              {/* Optional body text */}
              {body && (
                <p
                  {...inspectorProps({ fieldId: "body" })}
                  className="mt-4 mx-auto max-w-lg text-white/90 sm:mt-4 sm:block"
                >
                  {body}
                </p>
              )}
              <div className="mt-4 mx-auto max-w-lg md:mt-8 flex items-center justify-center">
                {buttons}
              </div>
            </div>
          </div>

          {/* Image Section with Conditional Grid Layout */}
          <div
            className={cn(
              "grid gap-4",
              images?.length === 1 && "grid-cols-1", // Single image takes full width
              images?.length === 3 && "grid-cols-2 grid-rows-2", // Three images: two in a row, third spans full width
              images?.length !== 1 && images?.length !== 3 && "grid-cols-2" // Default grid for even numbers
            )}
          >
            {Array.isArray(images) &&
              images.map((image, index) => (
                <img
                  key={`key-${index}`}
                  alt=""
                  src={image}
                  className={cn(
                    "h-40 w-full object-cover sm:h-56 md:h-full",
                    images.length === 3 && index === 2 && "col-span-2" // Third image in a 3-image set spans full width
                  )}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmoothCta;
