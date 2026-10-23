"use client";

import { useRouter } from "next/navigation";
import EventProfileArchive from "@/app/admin-radar/EventProfileArchive";

export default function AdminPortfolioPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <EventProfileArchive
        onOpenInRadarEditor={() => {
          router.push("/admin-radar");
        }}
        onPostCreated={() => {
          // Article created and stored
        }}
      />
    </div>
  );
}
