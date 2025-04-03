import React, { FC, ReactNode } from "react";
import { useContentfulInspectorMode } from "@contentful/live-preview/react";
import { cn } from "@/lib/utils";

interface IProps {
  entryId: string; // Unique entry ID for live preview inspector mode
  title: string; // Main heading of the hero banner
  body?: string; // Optional subtext
  images: string[]; // Array of image URLs
  buttons: ReactNode; // Buttons passed as children
}

const SimpleCta: FC<IProps> = ({ title, body, images, buttons, entryId }) => {
  const inspectorProps = useContentfulInspectorMode({ entryId });

  return (
    <section className="relative max-w-screen-xl mx-auto">
      <div className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Text Section */}
          <div className="bg-[#3B2F2F] flex items-center shadow-lg p-8 md:p-12 lg:px-16 lg:py-24 ">
            <div className="mx-auto max-w-xl text-center">
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

export default SimpleCta;
