"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, CircleAlert, ListChecks } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import SerpRadarPanel from "../SerpRadarPanel";
import CompareTab from "./CompareTab";
import ProposalsTab from "./ProposalsTab";
import TrackTab from "./TrackTab";
import { Card, Comparison, Keyword, Proposal, Status, api, fmtTime } from "./shared";

type Tab = "today" | "top" | "compare" | "propose" | "write" | "track";

interface Task {
  priority: number;
  text: string;
  detail?: string;
  tab: Tab;
  action: string;
  tone: "red" | "amber" | "blue";
}

/**
 * DÂY CHUYỀN RADAR SEO (docs/radar-seo-quy-trinh.md)
 *  [1] Từ khóa → [2] Top Google → [3] Cào bài → [4] So sánh → [5] Đề xuất → [6] Viết & đăng → [7] Theo dõi
 * Màn hình đầu tiên: "Hôm nay làm gì" – mọi việc cần người, xếp sẵn theo ưu tiên.
 */
export default function RadarPipeline({ onOpenPosts }: { onOpenPosts: () => void }) {
  const [tab, setTab] = useState<Tab>("today");
  const [status, setStatus] = useState<Status | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");
  /** Thời điểm tải dữ liệu (không đọc giờ trong lúc vẽ giao diện). */
  const [loadedAt, setLoadedAt] = useState(0);

  const load = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const [s, k, p, c] = await Promise.all([
        api<Status>("/api/radar/serp"),
        supabase.from("seo_keywords").select("*").order("cluster_id").order("keyword"),
        supabase.from("content_proposals").select("*").order("score", { ascending: false }),
        supabase.from("serp_comparisons").select("*").order("created_at", { ascending: false }).limit(300),
      ]);
      setStatus(s);
      setLoadedAt(Date.now());
      setKeywords((k.data ?? []) as Keyword[]);
      setProposals((p.data ?? []) as Proposal[]);
      setComparisons((c.data ?? []) as Comparison[]);
      setLoadError(p.error || c.error ? "Chưa chạy migration supabase/migrations/20261109030000_radar_pipeline.sql: các bước 4–7 tạm chưa dùng được." : "");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Không tải được dữ liệu Radar.");
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const count = useMemo(() => {
    const by = (st: Proposal["status"][]) => proposals.filter((p) => st.includes(p.status)).length;
    return {
      tracked: keywords.filter((k) => k.is_tracked).length,
      scanned: keywords.filter((k) => k.last_scanned_at).length,
      proposed: by(["proposed"]),
      drafted: by(["drafted"]),
      published: by(["published"]),
      writing: by(["writing"]),
    };
  }, [keywords, proposals]);

  /* ---------- "Hôm nay làm gì" ---------- */
  const tasks = useMemo<Task[]>(() => {
    const list: Task[] = [];
    if (!status) return list;
    const weekAgo = loadedAt - 7 * 24 * 60 * 60 * 1000;
    if (keywords.length === 0) {
      list.push({ priority: 0, text: "Chưa có từ khóa nào", detail: "Nạp 49 từ khóa gốc từ 11 cụm chủ đề để bắt đầu.", tab: "top", action: "Nạp từ khóa", tone: "red" });
    }
    const drafts = proposals.filter((p) => p.status === "drafted");
    if (drafts.length) list.push({ priority: 1, text: `${drafts.length} bài AI đã viết xong, chờ duyệt`, detail: drafts.map((d) => d.title).slice(0, 3).join(" · "), tab: "write", action: "Duyệt bài", tone: "red" });
    const lastScan = status.recentRuns.find((r) => (r.kind === "serp-live" || r.kind === "cron") && r.details?.dropped?.length);
    if (lastScan?.details?.dropped?.length) {
      list.push({
        priority: 2,
        text: `${lastScan.details.dropped.length} từ khóa tụt hạng`,
        detail: lastScan.details.dropped.map((d) => `${d.keyword}: #${d.from} → ${d.to ? `#${d.to}` : "ngoài top 10"}`).join(" · "),
        tab: "track",
        action: "Xem thứ hạng",
        tone: "red",
      });
    }
    const hot = proposals.filter((p) => p.status === "proposed" && p.score >= 60);
    if (hot.length) list.push({ priority: 3, text: `${hot.length} đề xuất điểm cao chờ quyết định`, detail: hot.slice(0, 3).map((p) => `${p.type === "rewrite" ? "Viết lại" : "Viết mới"}: ${p.title} (${p.score})`).join(" · "), tab: "propose", action: "Xem đề xuất", tone: "amber" });
    const failed = proposals.filter((p) => p.status === "proposed" && p.error);
    if (failed.length) list.push({ priority: 4, text: `${failed.length} bài AI viết lỗi`, detail: failed[0].error || "", tab: "propose", action: "Viết lại", tone: "amber" });
    if (status.compareNeeded) list.push({ priority: 5, text: `${status.compareNeeded} từ khóa có dữ liệu mới, chưa so sánh`, tab: "compare", action: "So sánh", tone: "blue" });
    if (status.queue.pending) list.push({ priority: 6, text: `${status.queue.pending} bài đối thủ chờ cào`, tab: "top", action: "Cào bài", tone: "blue" });
    const stale = keywords.filter((k) => k.is_tracked && (!k.last_scanned_at || new Date(k.last_scanned_at).getTime() < weekAgo));
    if (stale.length && keywords.length) list.push({ priority: 7, text: `${stale.length} từ khóa chưa quét trong 7 ngày`, detail: status.cronReady ? "Lịch tự chạy sẽ quét vào 02:00 Chủ nhật." : "Chưa bật lịch tự chạy: bấm “Chạy thật” mỗi tuần.", tab: "top", action: "Quét top Google", tone: "blue" });
    const errs = status.recentRuns.filter((r) => r.status === "error");
    if (errs.length) list.push({ priority: 8, text: "Ca chạy gần đây bị lỗi", detail: `${fmtTime(errs[0].created_at)} · ${errs[0].message}`, tab: "top", action: "Xem nhật ký", tone: "amber" });
    return list.sort((a, b) => a.priority - b.priority);
  }, [status, keywords, proposals, loadedAt]);

  const steps: { tab: Tab; n: string; label: string; sub: string; badge?: number }[] = [
    { tab: "top", n: "1–3", label: "Từ khóa · Top Google · Cào bài", sub: `${count.tracked} từ khóa · ${count.scanned} đã quét · ${status?.queue.scraped ?? 0} bài đã cào`, badge: status?.queue.pending },
    { tab: "compare", n: "4", label: "So sánh", sub: `${comparisons.length ? new Set(comparisons.map((c) => c.keyword_id)).size : 0} phiếu`, badge: status?.compareNeeded },
    { tab: "propose", n: "5", label: "Đề xuất", sub: "viết mới / viết lại", badge: count.proposed },
    { tab: "write", n: "6", label: "Viết & đăng", sub: `${count.published} đã đăng`, badge: count.drafted + count.writing },
    { tab: "track", n: "7", label: "Theo dõi", sub: "thứ hạng · khách" },
  ];

  return (
    <div className="space-y-5">
      {/* Dây chuyền */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-stretch gap-2">
          <button
            type="button"
            onClick={() => setTab("today")}
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-left ${tab === "today" ? "border-[#0A1E5E] bg-[#0A1E5E] text-white" : "border-slate-200 hover:border-[#0A1E5E]"}`}
          >
            <ListChecks className="h-4 w-4" />
            <span>
              <span className="block text-xs font-black">Hôm nay làm gì</span>
              <span className={`block text-[10px] ${tab === "today" ? "text-blue-100" : "text-slate-500"}`}>{tasks.length ? `${tasks.length} việc` : "không có việc"}</span>
            </span>
          </button>
          {steps.map((s, i) => (
            <div key={s.tab} className="flex items-center gap-2">
              {i > 0 && <ArrowRight className="h-3.5 w-3.5 text-slate-300" />}
              <button
                type="button"
                onClick={() => setTab(s.tab)}
                className={`relative rounded-2xl border px-3 py-2 text-left ${tab === s.tab ? "border-[#0A1E5E] ring-2 ring-[#0A1E5E]/20" : "border-slate-200 hover:border-[#0A1E5E]"}`}
              >
                <span className="block text-xs font-black text-slate-900">
                  {s.n}. {s.label}
                </span>
                <span className="block text-[10px] text-slate-500">{s.sub}</span>
                {!!s.badge && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0A1E5E] px-1 text-[10px] font-bold text-white">{s.badge}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {(loadError || error || notice) && (
        <div
          role={loadError || error ? "alert" : "status"}
          className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${loadError || error ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
        >
          {loadError || error ? <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
          <span className="flex-1">{loadError || error || notice}</span>
          {!loadError && (
            <button type="button" onClick={() => { setError(""); setNotice(""); }} className="opacity-60 hover:opacity-100">✕</button>
          )}
        </div>
      )}

      {tab === "today" && (
        <Card
          title="Hôm nay làm gì"
          hint="Mọi việc cần người trong dây chuyền SEO, xếp theo ưu tiên. Danh sách trống = xong việc. Máy tự làm phần còn lại."
        >
          {tasks.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5" /> Không có việc chờ. Dây chuyền đang chạy ổn.
            </p>
          ) : (
            <ol className="space-y-2">
              {tasks.map((t) => (
                <li key={t.text} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span className={`h-2 w-2 rounded-full ${t.tone === "red" ? "bg-rose-500" : t.tone === "amber" ? "bg-amber-500" : "bg-blue-500"}`} />
                      {t.text}
                    </p>
                    {t.detail && <p className="mt-0.5 truncate text-xs text-slate-500">{t.detail}</p>}
                  </div>
                  <button type="button" onClick={() => setTab(t.tab)} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#0A1E5E] px-3 py-1.5 text-xs font-bold text-white">
                    {t.action} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ol>
          )}
          {status && (
            <p className="mt-4 text-[11px] text-slate-400">
              Lượt Serper tháng này: {status.usedThisMonth}/{status.monthlyLimit} · AI: {status.geminiConfigured ? "sẵn sàng" : "chưa cấu hình GEMINI_API_KEY"} · Lịch tự chạy:{" "}
              {status.cronReady ? "đã bật (02:00 Chủ nhật)" : "chưa bật"}
            </p>
          )}
        </Card>
      )}

      {tab === "top" && <SerpRadarPanel onChanged={() => void load()} />}
      {tab === "compare" && (
        <CompareTab keywords={keywords} comparisons={comparisons} compareNeeded={status?.compareNeeded ?? 0} onChanged={() => void load()} setNotice={setNotice} setError={setError} />
      )}
      {(tab === "propose" || tab === "write") && (
        <ProposalsTab
          mode={tab}
          proposals={proposals}
          keywords={keywords}
          onChanged={load}
          onOpenPosts={onOpenPosts}
          setNotice={setNotice}
          setError={setError}
        />
      )}
      {tab === "track" && <TrackTab keywords={keywords} status={status} />}
    </div>
  );
}
