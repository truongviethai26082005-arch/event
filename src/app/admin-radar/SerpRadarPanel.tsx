"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Download,
  ExternalLink,
  FlaskConical,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import clustersFile from "@/app/api/radar/brand/clusters.json";

/* ------------------------------------------------------------------ */
/* Kiểu dữ liệu (khớp migration 20261109020000_radar_serp.sql)         */
/* ------------------------------------------------------------------ */
type ResultKind = "competitor" | "own" | "social" | "news" | "marketplace" | "gov" | "video" | "other";

interface SerpResult {
  position: number;
  title: string;
  link: string;
  domain: string;
  snippet: string;
  kind: ResultKind;
}
interface Keyword {
  id: string;
  keyword: string;
  cluster_id: string | null;
  is_tracked: boolean;
  our_position: number | null;
  top_competitor: string | null;
  last_scanned_at: string | null;
}
interface Snapshot {
  scanned_at: string;
  results: SerpResult[];
  people_also_ask: string[];
  related_searches: string[];
}
interface PageInfo {
  url: string;
  word_count: number;
  headings: string[];
  scrape_error: string | null;
}
interface RadarRun {
  id: string;
  kind: string;
  status: string;
  message: string;
  created_at: string;
}
interface Status {
  serperConfigured: boolean;
  usedThisMonth: number;
  monthlyLimit: number;
  keywordsTotal: number;
  keywordsTracked: number;
  queue: { pending: number; scraped: number; failed: number; total: number };
  recentRuns: RadarRun[];
}

const KIND_STYLE: Record<ResultKind, { label: string; cls: string }> = {
  competitor: { label: "Đối thủ", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
  own: { label: "Mình", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  social: { label: "MXH", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
  news: { label: "Báo", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
  marketplace: { label: "Sàn", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
  gov: { label: "Nhà nước", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
  video: { label: "Video", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
  other: { label: "Khác", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
};

const CLUSTERS = (clustersFile as { clusters: { id: string; name: string }[] }).clusters.filter(
  (c) => c.id !== "ngoai-pham-vi"
);
const clusterName = (id: string | null) => CLUSTERS.find((c) => c.id === id)?.name || "—";

function fmtTime(value?: string | null) {
  if (!value) return "Chưa quét";
  return new Date(value).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

async function api<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, body === undefined ? undefined : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
  return data as T;
}

/* ------------------------------------------------------------------ */
/* Bảng top 10 của 1 từ khóa                                           */
/* ------------------------------------------------------------------ */
function TopTenTable({
  results,
  pages,
}: {
  results: SerpResult[];
  pages: Map<string, PageInfo>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead className="text-[10px] uppercase tracking-wide text-slate-400">
          <tr>
            <th className="py-1.5 pr-2">#</th>
            <th className="py-1.5 pr-2">Loại</th>
            <th className="py-1.5 pr-2">Bài trên Google</th>
            <th className="py-1.5">Nội dung đã cào (bước 3)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((r) => {
            const page = pages.get(r.link);
            const h2 = page?.headings?.filter((h) => h.startsWith("H2")).length ?? 0;
            return (
              <tr key={`${r.position}-${r.link}`} className={r.kind === "competitor" || r.kind === "own" ? "" : "opacity-60"}>
                <td className="py-2 pr-2 font-black text-slate-700">{r.position}</td>
                <td className="py-2 pr-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${KIND_STYLE[r.kind].cls}`}>
                    {KIND_STYLE[r.kind].label}
                  </span>
                </td>
                <td className="py-2 pr-2">
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-800 hover:underline">
                    {r.title}
                  </a>
                  <span className="block text-[11px] text-slate-400">{r.domain}</span>
                </td>
                <td className="py-2 text-[11px]">
                  {r.kind !== "competitor" ? (
                    <span className="text-slate-400">Không cào (không phải đối thủ)</span>
                  ) : !page ? (
                    <span className="text-amber-600">Chờ cào</span>
                  ) : page.scrape_error ? (
                    <span className="text-rose-600" title={page.scrape_error}>
                      Không đọc được
                    </span>
                  ) : (
                    <span className="text-emerald-700">
                      ✓ {page.word_count.toLocaleString("vi-VN")} chữ · {h2} mục H2
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Khung chính                                                         */
/* ------------------------------------------------------------------ */
export default function SerpRadarPanel() {
  const [status, setStatus] = useState<Status | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [dryKeyword, setDryKeyword] = useState("");
  const [dryResult, setDryResult] = useState<SerpResult[] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [pages, setPages] = useState<Map<string, PageInfo>>(new Map());
  const [scrapeProgress, setScrapeProgress] = useState<string>("");

  const load = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const [s, kw] = await Promise.all([
        api<Status>("/api/radar/serp"),
        supabase.from("seo_keywords").select("*").order("cluster_id").order("keyword"),
      ]);
      setStatus(s);
      setKeywords((kw.data ?? []) as Keyword[]);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được dữ liệu Radar.");
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const loadPages = async (urls: string[]) => {
    if (!urls.length) return;
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.from("serp_pages").select("url,word_count,headings,scrape_error").in("url", urls);
    setPages((prev) => {
      const next = new Map(prev);
      (data ?? []).forEach((p) => next.set(p.url, p as PageInfo));
      return next;
    });
  };

  const openKeyword = async (k: Keyword) => {
    if (openId === k.id) {
      setOpenId(null);
      return;
    }
    setOpenId(k.id);
    setSnapshot(null);
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("serp_snapshots")
      .select("scanned_at,results,people_also_ask,related_searches")
      .eq("keyword_id", k.id)
      .order("scanned_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const snap = (data as Snapshot | null) ?? null;
    setSnapshot(snap);
    if (snap) await loadPages(snap.results.filter((r) => r.kind === "competitor").map((r) => r.link));
  };

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setBusy(null);
      void load();
    }
  };

  const seed = () =>
    run("seed", async () => {
      const r = await api<{ added: number }>("/api/radar/serp", { action: "seed" });
      setNotice(r.added ? `Đã nạp ${r.added} từ khóa gốc từ 11 cụm chủ đề.` : "Các từ khóa gốc đã có đủ.");
    });

  const dryRun = (e: FormEvent) => {
    e.preventDefault();
    void run("dry", async () => {
      const r = await api<{ result: { results: SerpResult[] } }>("/api/radar/serp", { action: "dry-run", keyword: dryKeyword });
      setDryResult(r.result.results);
      setNotice("Chạy thử xong (đã dùng 1 lượt Serper). Kết quả KHÔNG được lưu.");
    });
  };

  const liveRun = () => {
    const n = keywords.filter((k) => k.is_tracked).length;
    if (!window.confirm(`Quét top Google cho ${n} từ khóa đang theo dõi?\nSẽ dùng khoảng ${n} lượt Serper.`)) return;
    void run("live", async () => {
      const r = await api<{ message: string }>("/api/radar/serp", { action: "live" });
      setNotice(r.message);
    });
  };

  const scrapeAll = () =>
    run("scrape", async () => {
      let total = 0;
      let failed = 0;
      for (let round = 0; round < 40; round += 1) {
        const r = await api<{ processed: number; ok: number; failed: string[]; remaining: number }>("/api/radar/serp/scrape", { limit: 5 });
        total += r.ok;
        failed += r.failed.length;
        setScrapeProgress(`Đã cào ${total} bài${failed ? `, ${failed} không đọc được` : ""}. Còn ${r.remaining} bài chờ…`);
        if (!r.processed || !r.remaining) break;
      }
      setScrapeProgress("");
      setNotice(`Cào xong: ${total} bài đọc được${failed ? `, ${failed} trang không đọc được (chặn máy đọc hoặc quá ngắn)` : ""}.`);
      if (snapshot) await loadPages(snapshot.results.map((r) => r.link));
    });

  const addKeyword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const keyword = String(form.get("keyword") || "").trim();
    if (!keyword) return;
    const supabase = createSupabaseBrowserClient();
    const { error: insertError } = await supabase
      .from("seo_keywords")
      .insert([{ keyword, cluster_id: String(form.get("cluster_id") || "") || null }]);
    if (insertError) {
      setError(insertError.code === "23505" ? "Từ khóa này đã có." : insertError.message);
      return;
    }
    e.currentTarget.reset();
    void load();
  };

  const trackKeyword = async (keyword: string) => {
    const supabase = createSupabaseBrowserClient();
    const k = keywords.find((x) => x.id === openId);
    const { error: insertError } = await supabase.from("seo_keywords").insert([{ keyword, cluster_id: k?.cluster_id ?? null }]);
    setNotice(insertError ? (insertError.code === "23505" ? "Từ khóa này đã có." : insertError.message) : `Đã thêm "${keyword}" vào danh sách theo dõi.`);
    void load();
  };

  const toggleTracked = async (k: Keyword) => {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("seo_keywords").update({ is_tracked: !k.is_tracked }).eq("id", k.id);
    setKeywords((prev) => prev.map((x) => (x.id === k.id ? { ...x, is_tracked: !x.is_tracked } : x)));
  };

  const removeKeyword = async (k: Keyword) => {
    if (!window.confirm(`Xóa từ khóa "${k.keyword}" và lịch sử quét của nó?`)) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.from("seo_keywords").delete().eq("id", k.id);
    void load();
  };

  const tracked = keywords.filter((k) => k.is_tracked).length;
  const scanned = keywords.filter((k) => k.last_scanned_at).length;
  const inTop10 = keywords.filter((k) => k.our_position).length;
  const remainingCredits = status ? Math.max(status.monthlyLimit - status.usedThisMonth, 0) : 0;

  const steps = useMemo(
    () => [
      { n: 1, label: "Từ khóa", sub: `${tracked} đang theo dõi`, done: tracked > 0 },
      { n: 2, label: "Top Google", sub: `${scanned}/${keywords.length} đã quét`, done: scanned > 0 },
      { n: 3, label: "Cào bài", sub: status ? `${status.queue.scraped} đã cào · ${status.queue.pending} chờ` : "…", done: (status?.queue.scraped ?? 0) > 0 },
    ],
    [tracked, scanned, keywords.length, status]
  );

  return (
    <div className="space-y-5">
      {/* Dây chuyền đợt 1 */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A78113]">Radar SEO · Đợt 1</p>
        <h2 className="mt-1 text-lg font-black text-slate-900">Tìm bài đối thủ đang top Google và lấy nội dung của họ</h2>
        <p className="mt-1 text-xs text-slate-500">
          Mỗi từ khóa: lấy 10 kết quả đầu trên Google (khu vực Hà Nội), lọc ra đối thủ thật (bỏ Facebook, YouTube, báo, sàn, cơ quan nhà nước),
          rồi đọc nội dung các bài đó. Đây là dữ liệu cho bước so sánh &ldquo;họ có gì mình chưa có&rdquo; ở đợt 2.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className={`rounded-xl border px-3 py-2 ${s.done ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                <p className="text-xs font-black text-slate-800">
                  {s.n}. {s.label} {s.done && <CheckCircle2 className="inline h-3.5 w-3.5 text-emerald-600" />}
                </p>
                <p className="text-[10px] text-slate-500">{s.sub}</p>
              </div>
              {i < steps.length - 1 && <span className="text-slate-300">→</span>}
            </div>
          ))}
          <span className="text-slate-300">→</span>
          <div className="rounded-xl border border-dashed border-slate-300 px-3 py-2">
            <p className="text-xs font-bold text-slate-400">4. So sánh · 5. Đề xuất · 6. Viết · 7. Theo dõi</p>
            <p className="text-[10px] text-slate-400">các đợt sau</p>
          </div>
        </div>
      </div>

      {(error || notice) && (
        <div
          role={error ? "alert" : "status"}
          className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${error ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}
        >
          {error ? <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
          <span className="flex-1">{error || notice}</span>
        </div>
      )}

      {/* Máy đang tự làm gì */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900">Máy đang tự làm gì</h3>
          {!status ? (
            <p className="mt-2 text-xs text-slate-500">Đang tải…</p>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Lượt Serper tháng này" value={`${status.usedThisMonth}/${status.monthlyLimit}`} hint={`còn ${remainingCredits} lượt`} />
                <Stat label="Từ khóa theo dõi" value={String(status.keywordsTracked)} hint={`tổng ${status.keywordsTotal}`} />
                <Stat label="Bài đối thủ đã cào" value={String(status.queue.scraped)} hint={`${status.queue.pending} chờ · ${status.queue.failed} lỗi`} />
                <Stat label="Mình trong top 10" value={`${inTop10}/${scanned || 0}`} hint="từ khóa đã quét" />
              </div>
              {!status.serperConfigured && (
                <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Máy chủ chưa có SERPER_API_KEY: thêm vào .env.local rồi khởi động lại.</p>
              )}
              <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                {status.recentRuns.length === 0 && <li className="text-slate-400">Chưa có ca chạy nào.</li>}
                {status.recentRuns.map((r) => (
                  <li key={r.id}>
                    <span className={r.status === "error" ? "text-rose-600" : r.status === "warning" ? "text-amber-600" : "text-emerald-600"}>●</span>{" "}
                    <span className="text-slate-400">{fmtTime(r.created_at)}</span> · {r.message}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] text-slate-400">
                Lịch tự chạy hằng tuần sẽ bật ở đợt 5. Hiện tại bấm &ldquo;Chạy thật&rdquo; mỗi tuần một lần (credit miễn phí Serper hết hạn sau 6 tháng).
              </p>
            </>
          )}
        </div>

        {/* Thao tác */}
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900">Thao tác</h3>
          {keywords.length === 0 && (
            <button type="button" onClick={() => void seed()} disabled={!!busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {busy === "seed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Nạp từ khóa gốc từ 11 cụm chủ đề
            </button>
          )}
          <form onSubmit={dryRun} className="flex gap-2">
            <input
              value={dryKeyword}
              onChange={(e) => setDryKeyword(e.target.value)}
              placeholder="Từ khóa chạy thử"
              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm"
            />
            <button type="submit" disabled={!!busy || !dryKeyword.trim()} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 disabled:opacity-50">
              {busy === "dry" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FlaskConical className="h-3.5 w-3.5" />} Chạy thử
            </button>
          </form>
          <p className="-mt-1 text-[10px] text-slate-400">Chạy thử: xem top 10 của 1 từ khóa, tốn 1 lượt, không lưu.</p>
          <button type="button" onClick={liveRun} disabled={!!busy || !tracked} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
            {busy === "live" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {busy === "live" ? "Đang quét top Google…" : `Chạy thật: quét ${tracked} từ khóa (${tracked} lượt)`}
          </button>
          <button
            type="button"
            onClick={() => void scrapeAll()}
            disabled={!!busy || !status?.queue.pending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0A1E5E] px-4 py-2.5 text-sm font-bold text-[#0A1E5E] disabled:opacity-40"
          >
            {busy === "scrape" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Cào bài đối thủ ({status?.queue.pending ?? 0} bài chờ)
          </button>
          {scrapeProgress && <p className="text-xs text-slate-600">{scrapeProgress}</p>}
        </div>
      </div>

      {dryResult && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Kết quả chạy thử: &ldquo;{dryKeyword}&rdquo; (không lưu)</h3>
            <button type="button" onClick={() => setDryResult(null)} className="text-xs text-slate-500 underline">
              Đóng
            </button>
          </div>
          <TopTenTable results={dryResult} pages={pages} />
        </div>
      )}

      {/* Danh sách từ khóa */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Từ khóa theo dõi ({keywords.length})</h3>
            <p className="text-xs text-slate-500">Bấm vào từ khóa để xem top 10 Google lần quét gần nhất.</p>
          </div>
          <form onSubmit={addKeyword} className="flex flex-wrap gap-2">
            <input name="keyword" placeholder="Thêm từ khóa…" className="h-9 w-56 rounded-lg border border-slate-200 px-3 text-sm" />
            <select name="cluster_id" className="h-9 max-w-52 rounded-lg border border-slate-200 bg-white px-2 text-xs">
              <option value="">Chọn cụm</option>
              {CLUSTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button type="submit" className="inline-flex h-9 items-center gap-1 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white">
              <Plus className="h-3.5 w-3.5" /> Thêm
            </button>
          </form>
        </div>

        {keywords.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            Chưa có từ khóa. Bấm &ldquo;Nạp từ khóa gốc từ 11 cụm chủ đề&rdquo; ở khung Thao tác, hoặc thêm từ khóa ở trên.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-2 pr-3">Từ khóa</th>
                  <th className="py-2 pr-3">Cụm</th>
                  <th className="py-2 pr-3">Vị trí mình</th>
                  <th className="py-2 pr-3">Đối thủ đứng đầu</th>
                  <th className="py-2 pr-3">Quét lúc</th>
                  <th className="py-2 pr-3 text-center">Theo dõi</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keywords.map((k) => (
                  <FragmentRow key={k.id}>
                    <tr className={k.is_tracked ? "" : "opacity-50"}>
                      <td className="py-2.5 pr-3">
                        <button type="button" onClick={() => void openKeyword(k)} className="inline-flex items-center gap-1 text-left font-semibold text-slate-900 hover:text-[#0A1E5E]">
                          {openId === k.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          {k.keyword}
                        </button>
                      </td>
                      <td className="max-w-48 truncate py-2.5 pr-3 text-xs text-slate-500">{clusterName(k.cluster_id)}</td>
                      <td className="py-2.5 pr-3 text-xs">
                        {!k.last_scanned_at ? (
                          <span className="text-slate-400">—</span>
                        ) : k.our_position ? (
                          <span className="font-black text-emerald-700">#{k.our_position}</span>
                        ) : (
                          <span className="text-rose-600">Ngoài top 10</span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-slate-600">{k.top_competitor || "—"}</td>
                      <td className="py-2.5 pr-3 text-xs text-slate-500">{fmtTime(k.last_scanned_at)}</td>
                      <td className="py-2.5 pr-3 text-center">
                        <input type="checkbox" checked={k.is_tracked} onChange={() => void toggleTracked(k)} className="h-4 w-4" aria-label="Theo dõi" />
                      </td>
                      <td className="py-2.5 text-right">
                        <button type="button" onClick={() => void removeKeyword(k)} aria-label="Xóa" className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                    {openId === k.id && (
                      <tr>
                        <td colSpan={7} className="bg-slate-50/70 px-3 py-4">
                          {!snapshot ? (
                            <p className="text-xs text-slate-500">
                              {k.last_scanned_at ? "Đang tải…" : "Từ khóa chưa được quét. Bấm \"Chạy thật\" để lấy top 10."}
                            </p>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-[11px] text-slate-500">Top 10 Google lúc {fmtTime(snapshot.scanned_at)} (khu vực Hà Nội)</p>
                              <TopTenTable results={snapshot.results} pages={pages} />
                              {(snapshot.related_searches.length > 0 || snapshot.people_also_ask.length > 0) && (
                                <div className="text-xs">
                                  <p className="font-bold text-slate-700">Từ khóa liên quan Google gợi ý (bấm để theo dõi):</p>
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {[...snapshot.related_searches, ...snapshot.people_also_ask].slice(0, 14).map((q) => (
                                      <button
                                        key={q}
                                        type="button"
                                        onClick={() => void trackKeyword(q)}
                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:border-[#0A1E5E]"
                                      >
                                        <Plus className="h-3 w-3" /> {q}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(k.keyword)}&hl=vi&gl=vn`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A1E5E] hover:underline"
                              >
                                Tự đối chiếu trên Google <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FragmentRow({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400">{hint}</p>
    </div>
  );
}
