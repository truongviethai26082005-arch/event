"use client";

import { useState } from "react";
import { CircleAlert, GitMerge } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  AdminLead,
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  formatDate,
} from "@/app/admin/_components/admin-types";
import { findDuplicateLeads, resolveLeadSource } from "@/lib/lead-funnel";

interface LeadDuplicatesProps {
  lead: AdminLead;
  leads: AdminLead[];
  crmReady: boolean;
  onMerged: (removedId: string) => void;
  onOpenLead: (lead: AdminLead) => void;
}

/** Cảnh báo lead trùng số điện thoại và cho gộp vào lead đang xem. */
export default function LeadDuplicates({ lead, leads, crmReady, onMerged, onOpenLead }: LeadDuplicatesProps) {
  const [merging, setMerging] = useState<string | null>(null);
  const [error, setError] = useState("");
  const duplicates = findDuplicateLeads(lead, leads);
  if (duplicates.length === 0) return null;

  const merge = async (other: AdminLead) => {
    const ok = window.confirm(
      `Gộp lead “${other.full_name}” vào lead đang xem?\n\n` +
        "Thông tin còn thiếu, ghi chú, lịch sử và báo giá của lead kia sẽ được chuyển sang đây, sau đó lead kia bị xóa. Không thể hoàn tác."
    );
    if (!ok) return;
    setMerging(other.id);
    setError("");
    const supabase = createSupabaseBrowserClient();
    const { error: rpcError } = await supabase.rpc("merge_leads", { p_keep: lead.id, p_remove: other.id });
    setMerging(null);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    onMerged(other.id);
  };

  return (
    <section className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs">
      <p className="flex items-center gap-2 text-sm font-extrabold text-amber-900">
        <CircleAlert className="h-4 w-4" /> Trùng số điện thoại với {duplicates.length} lead khác
      </p>
      <ul className="mt-2 space-y-2">
        {duplicates.map((d) => (
          <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2">
            <button type="button" onClick={() => onOpenLead(d)} className="text-left">
              <span className="font-bold text-slate-900 hover:underline">{d.full_name}</span>
              <span className="block text-slate-500">
                {LEAD_STATUS_LABELS[d.status]} · {LEAD_SOURCE_LABELS[resolveLeadSource(d)]} · {formatDate(d.created_at)}
              </span>
            </button>
            {crmReady && (
              <button
                type="button"
                disabled={merging !== null}
                onClick={() => void merge(d)}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-300 px-2.5 py-1 font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-60"
              >
                <GitMerge className="h-3.5 w-3.5" />
                {merging === d.id ? "Đang gộp..." : "Gộp vào lead này"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {error && <p className="mt-2 text-rose-700">{error}</p>}
    </section>
  );
}
