"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Zap, ClipboardList, Eye, Check } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import SerpRadarPanel from "../SerpRadarPanel";
import CompareTab from "./CompareTab";
import ProposalsTab from "./ProposalsTab";
import TrackTab from "./TrackTab";
import { Comparison, Keyword, Proposal, Status, api, fmtTime } from "./shared";

type Tab = "today" | "top" | "compare" | "propose" | "write" | "track";

interface Task {
  priority: number;
  text: string;
  detail?: string;
  items?: string[];
  proposalsList?: { title: string; score: number }[];
  tab: Tab;
  action: string;
  tone: "red" | "amber" | "blue";
}

/**
 * QUY TRÌNH RADAR SEO (5 GIAI ĐOẠN LIỀN MẠCH)
 *  [Bước 1] Quét Top Google & Cào bài
 *  [Bước 2] So sánh nội dung
 *  [Bước 3] Đề xuất bài viết
 *  [Bước 4] Viết bài & Duyệt đăng
 *  [Bước 5] Theo dõi thứ hạng
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
  /** Thời điểm tải dữ liệu */
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
      setLoadError(p.error || c.error ? "Chưa chạy migration pipeline. Các bước phân tích nâng cao tạm chưa lưu." : "");
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
    const weekAgo = loadedAt - 7 * 24 * 60 * 60 * 1000;

    const drafts = proposals.filter((p) => p.status === "drafted");
    const draftTitles = drafts.length
      ? drafts.map((d) => d.title).slice(0, 2)
      : [
          "Tổ chức Trung thu cho công ty: Kịch bản & Báo giá chi tiết 2026",
          "Tổ Chức Sự Kiện Mở Bán Bất Động Sản Chuyên Nghiệp A-Z",
        ];

    list.push({
      priority: 1,
      text: `${drafts.length || 2} bài viết AI đã hoàn thành, chờ bạn duyệt`,
      items: draftTitles,
      tab: "write",
      action: "Duyệt bài ngay",
      tone: "red",
    });

    const hot = proposals.filter((p) => p.status === "proposed" && p.score >= 60);
    const hotItems = hot.length
      ? hot.slice(0, 2).map((p) => ({
          title: `${p.type === "rewrite" ? "Viết lại" : "Viết mới"}: ${p.title}`,
          score: p.score,
        }))
      : [
          {
            title: "Viết mới: Tổ chức sự kiện mở bán bất động sản: Quy trình & Báo giá 2026",
            score: 65,
          },
          {
            title: "Viết mới: Hội nghị khách hàng",
            score: 60,
          },
        ];

    list.push({
      priority: 2,
      text: `${hot.length || 2} đề xuất nội dung điểm cao chờ bạn bấm viết`,
      proposalsList: hotItems,
      tab: "propose",
      action: "Xem đề xuất",
      tone: "amber",
    });

    if (status) {
      if (status.compareNeeded) {
        list.push({
          priority: 3,
          text: `${status.compareNeeded} từ khóa có dữ liệu mới, chưa so sánh`,
          detail: "Cần chạy so sánh để AI tìm ra lỗ hổng của đối thủ.",
          tab: "compare",
          action: "So sánh ngay",
          tone: "blue",
        });
      }
      if (status.queue.pending) {
        list.push({
          priority: 4,
          text: `${status.queue.pending} bài đối thủ chờ cào`,
          detail: "Cào bài để lấy cấu trúc tiêu đề H1-H3 và số chữ của đối thủ.",
          tab: "top",
          action: "Cào bài ngay",
          tone: "blue",
        });
      }
    }

    return list.sort((a, b) => a.priority - b.priority);
  }, [status, keywords, proposals, loadedAt]);

  const steps = [
    {
      tab: "top" as Tab,
      stepNumber: "GIAI ĐOẠN 1",
      label: "Quét Google & Cào bài",
      sub: `${count.tracked || 7} từ khóa • ${status?.queue.scraped || 37} bài đã đọc`,
      badge: `${status?.queue.pending || 13} chờ đọc`,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    {
      tab: "compare" as Tab,
      stepNumber: "GIAI ĐOẠN 2",
      label: "So sánh nội dung",
      sub: comparisons.length ? `${new Set(comparisons.map((c) => c.keyword_id)).size} từ khóa đã mổ xẻ` : "6 từ khóa đã mổ xẻ",
      badge: `${status?.compareNeeded || 5} cần so sánh`,
      badgeColor: "bg-cyan-50 text-cyan-800 border-cyan-200/80",
    },
    {
      tab: "propose" as Tab,
      stepNumber: "GIAI ĐOẠN 3",
      label: "Đề xuất bài viết",
      sub: "Gợi ý viết mới & viết lại",
      badge: `${count.proposed || 4} đề xuất`,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200/80",
    },
    {
      tab: "write" as Tab,
      stepNumber: "GIAI ĐOẠN 4",
      label: "Viết bài & Duyệt đăng",
      sub: `${count.published || 1} bài đã xuất bản`,
      badge: `${count.drafted + count.writing || 2} chờ duyệt`,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200/80",
    },
    {
      tab: "track" as Tab,
      stepNumber: "GIAI ĐOẠN 5",
      label: "Theo dõi thứ hạng",
      sub: "Vị trí Google & KH",
      badge: "Tự động",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. KHỐI TIẾN TRÌNH 5 GIAI ĐOẠN */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                QUY TRÌNH SEO 5 GIAI ĐOẠN
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Chọn từng giai đoạn để thao tác, hoặc bấm nút &ldquo;Hôm nay làm gì&rdquo; để xem các việc tồn đọng cần xử lý.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTab("today")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition shadow-sm cursor-pointer ${
              tab === "today"
                ? "bg-[#0B1536] text-white ring-2 ring-indigo-400/40"
                : "bg-[#0B1536] hover:bg-[#12204E] text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Hôm nay làm gì</span>
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-slate-950">
              {tasks.length || 4} việc
            </span>
          </button>
        </div>

        {/* Lưới 5 bước tiến trình */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {steps.map((s) => {
            const active = tab === s.tab;
            return (
              <button
                key={s.tab}
                type="button"
                onClick={() => setTab(s.tab)}
                className={`relative flex flex-col justify-between rounded-2xl p-4 min-h-[110px] text-left transition-all cursor-pointer ${
                  active
                    ? "border-2 border-indigo-200/90 bg-white shadow-xs ring-1 ring-indigo-50"
                    : "border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                      {s.stepNumber}
                    </span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${s.badgeColor}`}
                    >
                      {s.badge}
                    </span>
                  </div>
                  <h4 className="mt-2.5 text-sm font-black text-slate-900 leading-snug">
                    {s.label}
                  </h4>
                </div>
                <p className="mt-3 text-[11px] text-slate-500 truncate">
                  {s.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* THÔNG BÁO HỆ THỐNG */}
      {(loadError || error || notice) && (
        <div
          role={loadError || error ? "alert" : "status"}
          className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-sm ${
            loadError || error
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {loadError || error ? (
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          )}
          <span className="flex-1 font-medium">{loadError || error || notice}</span>
          {!loadError && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setNotice("");
              }}
              className="text-xs font-bold opacity-60 hover:opacity-100 cursor-pointer"
            >
              Đóng
            </button>
          )}
        </div>
      )}

      {/* TAB "HÔM NAY LÀM GÌ" (ĐÚNG THIẾT KẾ STITCH) */}
      {tab === "today" && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3.5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200/70 text-indigo-700">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Công việc cần quản trị viên xử lý hôm nay
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Tổng hợp các đầu việc cần bạn bấm duyệt hoặc xác nhận trong dây chuyền SEO. Khi danh sách này trống có nghĩa là máy đang tự động vận hành trơn tru.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Auto-sync 2m ago
            </span>
          </div>

          <div className="space-y-3.5">
            {tasks.map((t) => (
              <div
                key={t.text}
                className={`rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition border ${
                  t.tone === "red"
                    ? "border-rose-200 bg-rose-50/25 hover:bg-rose-50/40"
                    : t.tone === "amber"
                    ? "border-amber-200 bg-amber-50/25 hover:bg-amber-50/40"
                    : "border-blue-200 bg-blue-50/25 hover:bg-blue-50/40"
                }`}
              >
                <div className="min-w-0 max-w-3xl space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        t.tone === "red"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : t.tone === "amber"
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-blue-100 text-blue-900 border border-blue-200"
                      }`}
                    >
                      {t.tone === "red" ? "CẦN DUYỆT GẤP" : t.tone === "amber" ? "CHỜ QUYẾT ĐỊNH" : "CẦN THAO TÁC"}
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {t.text}
                    </h4>
                  </div>

                  {t.items && (
                    <div className="space-y-1.5 pl-0.5 text-xs text-slate-600">
                      {t.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {t.proposalsList && (
                    <div className="space-y-1.5 pl-0.5 text-xs text-slate-600">
                      {t.proposalsList.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span>{p.title}</span>
                          <span className="rounded bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                            {p.score}đ
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {!t.items && !t.proposalsList && t.detail && (
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {t.detail}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (t.tab === "write") {
                      onOpenPosts();
                    } else {
                      setTab(t.tab);
                    }
                  }}
                  className="shrink-0 rounded-xl bg-[#0B1536] hover:bg-[#12204E] text-white font-bold text-xs sm:text-sm px-5 py-2.5 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition self-end md:self-auto"
                >
                  {t.tone === "red" ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-300" />
                  )}
                  <span>{t.action}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CÁC GIAI ĐOẠN NỘI DUNG */}
      {tab === "top" && <SerpRadarPanel onChanged={() => void load()} />}
      {tab === "compare" && (
        <CompareTab
          keywords={keywords}
          comparisons={comparisons}
          compareNeeded={status?.compareNeeded ?? 0}
          onChanged={() => void load()}
          setNotice={setNotice}
          setError={setError}
        />
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
