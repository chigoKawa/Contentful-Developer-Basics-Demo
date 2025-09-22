import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Site" };

export default function SegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Segment layouts should NOT render <html> or <body>.
  // Root layout already provides providers and shells.
  return <>{children}</>;
}
