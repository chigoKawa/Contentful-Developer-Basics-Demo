import React, { FC } from "react";

// Defining the props type for InlinePerson component
interface IProps {
  name: string; // Name of the person to display
  website: string; // The URL to the person's website
}

// InlinePerson displays the name with a link to their website.
const InlinePerson: FC<IProps> = ({ name, website }) => {
  return (
    <span className="bold font-bold">
      {/* The name is clickable and directs to the person's website */}
      <a
        className="no-underline"
        href={website}
        target="_blank"
        rel="noopener noreferrer"
      >
        {name}
      </a>
    </span>
  );
};

export default InlinePerson;
