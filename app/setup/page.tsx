import SetupForm from "./_components/setup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set up your Contentful space",
  description: "Not indexed",
  robots: {
    index: false,
    follow: false,
  },
};
export default async function IndexPage() {
  return (
    <div>
      <SetupForm />
    </div>
  );
}
