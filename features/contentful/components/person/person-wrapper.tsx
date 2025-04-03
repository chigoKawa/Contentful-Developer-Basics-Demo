import React from "react";
import { IPerson } from "../../type";
import InlinePerson from "./inline-person";

// This component is responsible for rendering a person entry based on certain conditions.
const PersonWrapper: React.FC<IPerson> = (entry) => {
  // Construct the full name by combining first and last names from the fields
  const name = `${entry?.fields?.firstName} ${entry?.fields?.lastName}`;

  // Get the bio text or fallback to an empty string if no bio is provided
  const bio = entry?.fields?.bio || "";

  // If the person has a website, use it; otherwise, fallback to the root '/'
  const website = entry?.fields?.website?.fields?.url || "/";

  // If the person is marked as inline, we render the InlinePerson component
  if (entry?.isInline) {
    return <InlinePerson name={name} website={website} />;
  }

  // If not inline, return a simple message displaying the inline status (for debugging or fallback)
  return (
    <div className="w-60 p-2 shadow-md rounded-md">
      <p className="font-bold">{name}</p>
      <div className="">{bio}</div>
    </div>
  );
};

export default PersonWrapper;
