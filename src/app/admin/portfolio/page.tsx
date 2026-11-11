"use client";

import { useRouter } from "next/navigation";
import EventProfileArchive from "@/app/admin-radar/EventProfileArchive";
import {
  buildRadarHref,
  savePendingRadarDraft,
  savePendingRadarProfileId,
} from "@/app/admin-radar/radar-handoff";

export default function AdminPortfolioPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <EventProfileArchive
        onOpenInRadarEditor={(post) => {
          savePendingRadarDraft(post);
          router.push(
            buildRadarHref("viet_bai", {
              profileId: post.sourceProfileId,
              fromDraft: true,
            })
          );
        }}
        onSelectForRadarWriter={(profile) => {
          savePendingRadarProfileId(profile.id);
          router.push(buildRadarHref("viet_bai", { profileId: profile.id }));
        }}
        onNavigateRadarTab={(tab, options) => {
          router.push(buildRadarHref(tab, options));
        }}
        onPostCreated={() => {
          // Article created and stored in CMS
        }}
      />
    </div>
  );
}
