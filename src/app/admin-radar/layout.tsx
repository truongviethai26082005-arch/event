import type { ReactNode } from "react";
import FloatingContactHider from "./FloatingContactHider";

export default function AdminRadarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <FloatingContactHider />
      {children}
    </>
  );
}
