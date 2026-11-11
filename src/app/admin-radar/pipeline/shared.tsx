"use client";

/** Kiểu dữ liệu + tiện ích dùng chung cho các tab dây chuyền Radar SEO. */

export interface Keyword {
  id: string;
  keyword: string;
  cluster_id: string | null;
  is_tracked: boolean;
  our_position: number | null;
  top_competitor: string | null;
  last_scanned_at: string | null;
}

export interface MustHave { item: string; count: number; sources: string[]; we_have: boolean }
export interface TopKeyword { keyword: string; count: number; we_use: boolean }
export interface Gap { gap: string; evidence: string; how_we_fill: string; has_material: boolean }
export interface OutlineItem { heading: string; level: 2 | 3; source: "must" | "gap" | "core"; note: string }
export interface Brief {
  title: string;
  focus_keyword: string;
  secondary_keywords: string[];
  outline: OutlineItem[];
  materials: string[];
  notes: string;
}

export interface Comparison {
  id: string;
  keyword_id: string;
  our_post_id: string | null;
  pages_used: number;
  must_have: MustHave[];
  top_keywords: TopKeyword[];
  gaps: Gap[];
  signals: { avgWords?: number; pctWithPrice?: number; pctWithFaq?: number; pctMentionProjects?: number; pages?: { domain: string; position: number; words: number; hasPrice: boolean; hasFaq: boolean; latestYear: number | null }[] };
  summary: string | null;
  created_at: string;
}

export interface DraftQa { words: number; h2: number; needsData: number; banned: string[]; focusInTitle: boolean; missingOutline: string[] }

export interface Proposal {
  id: string;
  keyword_id: string;
  comparison_id: string | null;
  type: "new" | "rewrite";
  reason: string | null;
  target_post_id: string | null;
  title: string;
  brief: Brief;
  score: number;
  score_reasons: string[];
  status: "proposed" | "writing" | "drafted" | "published" | "dismissed";
  post_id: string | null;
  draft: { title: string; meta_description: string; content: string; qa: DraftQa } | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface RadarRun { id: string; kind: string; status: string; message: string; created_at: string; details?: { dropped?: { keyword: string; from: number; to: number | null }[] } }

export interface Status {
  serperConfigured: boolean;
  geminiConfigured: boolean;
  cronReady: boolean;
  usedThisMonth: number;
  monthlyLimit: number;
  keywordsTotal: number;
  keywordsTracked: number;
  compareNeeded: number;
  queue: { pending: number; scraped: number; failed: number; total: number };
  recentRuns: RadarRun[];
}

export async function api<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(
    url,
    body === undefined ? undefined : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Lỗi ${res.status}`);
  return data as T;
}

export function fmtTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function Badge({ tone, children }: { tone: "red" | "green" | "amber" | "blue" | "slate" | "violet"; children: React.ReactNode }) {
  const cls = {
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
  }[tone];
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${cls}`}>{children}</span>;
}

export function Card({ title, hint, children, actions }: { title: string; hint?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
        </div>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">{children}</p>;
}
