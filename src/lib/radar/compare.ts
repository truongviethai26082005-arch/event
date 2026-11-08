// CHỈ dùng ở máy chủ.
/**
 * BƯỚC 4 – SO SÁNH: các bài đối thủ đang top vs bài của mình  →  A mục bắt buộc / B từ khóa top / C khe hở
 * BƯỚC 5 – ĐỀ XUẤT: viết mới (chưa có bài) hoặc viết lại (có bài nhưng thua), kèm brief + điểm ưu tiên.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { callGeminiWithFallback } from "@/app/api/radar/services/gemini-client";
import { loadMaterials } from "@/lib/radar/materials";
import type { SerpResult } from "@/lib/radar/serper";

/* ------------------------------------------------------------------ */
/* Tín hiệu đo bằng code (khách quan, không phụ thuộc AI)              */
/* ------------------------------------------------------------------ */
const PRICE_RE = /\d{1,3}([.,]\d{3})+\s*(đ|₫|vnđ|vnd|đồng)|\d+([.,]\d+)?\s*(triệu|tr)\b/i;
const FAQ_RE = /(câu hỏi|hỏi đáp|faq|thắc mắc)/i;
const PROJECT_RE = /(dự án|khách hàng|đã tổ chức|case study|sự kiện tiêu biểu)/i;

export interface PageSignals {
  domain: string;
  position: number;
  words: number;
  h2: number;
  hasPrice: boolean;
  hasFaq: boolean;
  mentionsProjects: boolean;
  latestYear: number | null;
}

function signalsOf(page: { domain: string; position: number; clean_text: string; headings: string[]; word_count: number }): PageSignals {
  const text = page.clean_text || "";
  const years = [...text.matchAll(/\b(20[12]\d)\b/g)].map((m) => Number(m[1])).filter((y) => y <= new Date().getFullYear() + 1);
  return {
    domain: page.domain,
    position: page.position,
    words: page.word_count,
    h2: page.headings.filter((h) => h.startsWith("H2")).length,
    hasPrice: PRICE_RE.test(text),
    hasFaq: FAQ_RE.test(page.headings.join(" ")) || page.headings.filter((h) => h.trim().endsWith("?")).length >= 3,
    mentionsProjects: PROJECT_RE.test(text),
    latestYear: years.length ? Math.max(...years) : null,
  };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/* ------------------------------------------------------------------ */
/* Kết quả                                                             */
/* ------------------------------------------------------------------ */
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

export interface CompareOutcome {
  comparisonId: string;
  proposalId: string | null;
  skippedReason: string | null;
}

interface OurPost { id: string; title: string; slug: string; content: string }

/** Tìm bài của mình đang nhắm từ khóa: ưu tiên bài có link trong top 10, sau đó khớp từ khóa / tiêu đề. */
async function findOurPost(client: SupabaseClient, keyword: string, results: SerpResult[]): Promise<OurPost | null> {
  const own = results.find((r) => r.kind === "own");
  if (own) {
    const slug = own.link.split("/").filter(Boolean).pop();
    if (slug) {
      const { data } = await client.from("posts").select("id,title,slug,content").eq("slug", slug).maybeSingle();
      if (data) return data as OurPost;
    }
  }
  const { data } = await client.from("posts").select("id,title,slug,content,focus_keyword").neq("status", "archived");
  const k = norm(keyword);
  const scored = ((data ?? []) as (OurPost & { focus_keyword: string | null })[])
    .map((p) => {
      const fk = norm(p.focus_keyword || "");
      const title = norm(p.title || "");
      const score = fk === k ? 3 : fk && (k.includes(fk) || fk.includes(k)) ? 2 : title.includes(k) ? 1 : 0;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored[0]?.p ?? null;
}

const COMMERCIAL_RE = /(dịch vụ|giá|báo giá|trọn gói|thuê|công ty|chi phí|đơn vị|cho thuê)/i;

/** Điểm ưu tiên 0–100 + lý do (để người dùng hiểu vì sao đề xuất xếp trên). */
function scoreProposal(args: {
  businessValue?: string;
  keyword: string;
  ourPosition: number | null;
  fillableGaps: number;
  missingMust: number;
  isNew: boolean;
  pctWithPrice: number;
}) {
  const reasons: string[] = [];
  let score = 0;
  const bv = args.businessValue === "cao" ? 25 : args.businessValue === "trung_binh" ? 15 : 5;
  score += bv;
  reasons.push(`Giá trị kinh doanh của cụm: +${bv}`);
  if (COMMERCIAL_RE.test(args.keyword)) {
    score += 15;
    reasons.push("Từ khóa có ý định thuê dịch vụ: +15");
  }
  if (args.ourPosition && args.ourPosition >= 4) {
    score += 25;
    reasons.push(`Mình đang ở vị trí ${args.ourPosition}, gần top: +25`);
  } else if (!args.ourPosition) {
    score += 15;
    reasons.push("Mình chưa vào top 10: +15");
  }
  const gapPts = Math.min(args.fillableGaps * 5, 20);
  if (gapPts) {
    score += gapPts;
    reasons.push(`${args.fillableGaps} khe hở lấp được bằng chất liệu thật: +${gapPts}`);
  }
  if (args.isNew) {
    score += 10;
    reasons.push("Chưa có bài cho từ khóa: +10");
  } else if (args.missingMust) {
    const pts = Math.min(args.missingMust * 3, 15);
    score += pts;
    reasons.push(`Bài cũ thiếu ${args.missingMust} mục bắt buộc: +${pts}`);
  }
  if (args.pctWithPrice < 50) {
    score += 10;
    reasons.push(`Chỉ ${args.pctWithPrice}% bài top có giá cụ thể (mình có bảng giá): +10`);
  }
  return { score: Math.min(score, 100), reasons };
}

const clip = (s: unknown, n = 300) => (typeof s === "string" ? s.trim().slice(0, n) : "");
const list = (v: unknown) => (Array.isArray(v) ? v : []);

/**
 * So sánh 1 từ khóa (dùng lần quét top Google mới nhất + các bài đã cào), lưu phiếu so sánh và
 * tạo / cập nhật đề xuất viết.
 */
export async function compareKeyword(client: SupabaseClient, keywordId: string): Promise<CompareOutcome> {
  const { data: kw, error: kwError } = await client.from("seo_keywords").select("*").eq("id", keywordId).single();
  if (kwError || !kw) throw new Error("Không tìm thấy từ khóa.");

  const { data: snap } = await client
    .from("serp_snapshots")
    .select("id,results,people_also_ask,related_searches,our_position")
    .eq("keyword_id", keywordId)
    .order("scanned_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!snap) throw new Error(`"${kw.keyword}" chưa được quét top Google.`);

  const competitors = (snap.results as SerpResult[]).filter((r) => r.kind === "competitor");
  const { data: pageRows } = await client
    .from("serp_pages")
    .select("url,domain,title,headings,clean_text,word_count,scrape_error")
    .in("url", competitors.map((c) => c.link));
  const pages = (pageRows ?? [])
    .filter((p) => !p.scrape_error && p.clean_text)
    .map((p) => ({ ...p, position: competitors.find((c) => c.link === p.url)?.position ?? 99, headings: (p.headings || []) as string[] }))
    .sort((a, b) => a.position - b.position)
    .slice(0, 8);
  if (pages.length < 2) throw new Error(`"${kw.keyword}": cần ít nhất 2 bài đối thủ đã cào (hiện có ${pages.length}). Bấm "Cào bài" trước.`);

  const signals = pages.map(signalsOf);
  const pct = (f: (s: PageSignals) => boolean) => Math.round((signals.filter(f).length / signals.length) * 100);
  const summarySignals = {
    pages: signals,
    avgWords: Math.round(signals.reduce((s, x) => s + x.words, 0) / signals.length),
    pctWithPrice: pct((s) => s.hasPrice),
    pctWithFaq: pct((s) => s.hasFaq),
    pctMentionProjects: pct((s) => s.mentionsProjects),
  };

  const ourPost = await findOurPost(client, kw.keyword, snap.results as SerpResult[]);
  const ourHeadings = ourPost
    ? ourPost.content
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => /^#{2,3}\s/.test(l))
        .map((l) => (l.startsWith("###") ? "H3: " : "H2: ") + l.replace(/^#+\s*/, ""))
    : [];
  const materials = await loadMaterials(client, kw.cluster_id);

  const competitorBlock = pages
    .map(
      (p, i) =>
        `### Đối thủ ${i + 1}: #${p.position} ${p.domain} (${p.word_count} chữ)\nTiêu đề: ${p.title}\nMục lục:\n${p.headings.slice(0, 30).join("\n")}\nTrích đoạn đầu:\n${p.clean_text.slice(0, 1200)}`
    )
    .join("\n\n");

  const prompt = `Bạn là chuyên gia SEO nội dung cho ${materials.cluster?.name ? `mảng "${materials.cluster.name}" của ` : ""}Trường Hải Event & Travel (Hà Nội).
Nhiệm vụ: so sánh các bài ĐANG ĐỨNG TOP Google cho từ khóa "${kw.keyword}" với bài của Trường Hải, rồi lập brief để viết bài VƯỢT họ.

## CÁC BÀI ĐỐI THỦ ĐANG TOP
${competitorBlock}

## TÍN HIỆU ĐO BẰNG CODE
- Số chữ trung bình: ${summarySignals.avgWords}
- ${summarySignals.pctWithPrice}% bài có giá cụ thể · ${summarySignals.pctWithFaq}% có FAQ · ${summarySignals.pctMentionProjects}% nêu dự án/khách hàng
- Năm cập nhật mới nhất từng bài: ${signals.map((s) => `${s.domain}: ${s.latestYear ?? "không rõ"}`).join("; ")}

## BÀI CỦA TRƯỜNG HẢI
${ourPost ? `Tiêu đề: ${ourPost.title}\nĐường dẫn: /tin-tuc/${ourPost.slug}\nMục lục:\n${ourHeadings.join("\n") || "(không có heading)"}\nĐộ dài: ${ourPost.content.split(/\s+/).length} chữ` : "CHƯA CÓ BÀI cho từ khóa này."}

## CHẤT LIỆU THẬT TRƯỜNG HẢI CÓ (chỉ được dùng các thứ này để lấp khe hở)
${materials.text}

## GOOGLE GỢI Ý
Mọi người cũng hỏi: ${list(snap.people_also_ask).join(" | ") || "(không có)"}
Tìm kiếm liên quan: ${list(snap.related_searches).join(" | ") || "(không có)"}

## YÊU CẦU
1. must_have: các MỤC NỘI DUNG mà từ 3 bài top trở lên cùng có (gộp các mục cùng ý dù khác chữ). count = số bài có; sources = tên miền. we_have = bài Trường Hải đã có mục tương đương (false nếu chưa có bài).
2. top_keywords: 8–15 từ khóa / cụm từ khóa phụ mà các bài top dùng ở tiêu đề hoặc mục lục (ngoài từ khóa chính). count = số bài dùng.
3. gaps: 3–6 KHE HỞ: điều người tìm cần nhưng các bài top làm kém hoặc thiếu (dựa vào tín hiệu code + nội dung). evidence = dẫn chứng cụ thể. how_we_fill = Trường Hải lấp bằng chất liệu nào ở trên. has_material = true chỉ khi chất liệu đó CÓ THẬT trong danh sách trên.
4. brief: tiêu đề đề xuất (≤ 65 ký tự, chứa từ khóa chính); focus_keyword; secondary_keywords (5–10, ưu tiên từ top_keywords + gợi ý Google); outline 8–14 mục, mỗi mục ghi source: "must" (mục bắt buộc), "gap" (mục vượt đối thủ), "core" (mở bài, kêu gọi liên hệ); materials = chất liệu thật sẽ dùng; notes = lưu ý khi viết.
5. summary: 2 câu: vì sao các bài này đứng top và Trường Hải vượt bằng cách nào.
Không bịa số liệu. Không nêu tên đối thủ trong outline.

CHỈ trả JSON:
{"must_have":[{"item":"","count":0,"sources":[""],"we_have":false}],"top_keywords":[{"keyword":"","count":0}],"gaps":[{"gap":"","evidence":"","how_we_fill":"","has_material":true}],"summary":"","brief":{"title":"","focus_keyword":"","secondary_keywords":[""],"outline":[{"heading":"","level":2,"source":"must","note":""}],"materials":[""],"notes":""}}`;

  const raw = await callGeminiWithFallback({ apiKey: process.env.GEMINI_API_KEY || "", prompt, temperature: 0.2 });
  const ai = JSON.parse(raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim()) as Record<string, unknown>;

  const ourText = norm(ourPost ? `${ourPost.title} ${ourPost.content}` : "");
  const mustHave: MustHave[] = list(ai.must_have).slice(0, 20).map((m) => {
    const x = m as Record<string, unknown>;
    return { item: clip(x.item, 200), count: Number(x.count) || 0, sources: list(x.sources).map(String).slice(0, 8), we_have: Boolean(ourPost) && Boolean(x.we_have) };
  }).filter((m) => m.item);
  const topKeywords: TopKeyword[] = list(ai.top_keywords).slice(0, 15).map((k) => {
    const x = k as Record<string, unknown>;
    const keyword = clip(x.keyword, 100);
    return { keyword, count: Number(x.count) || 0, we_use: Boolean(ourPost) && ourText.includes(norm(keyword)) };
  }).filter((k) => k.keyword);
  const gaps: Gap[] = list(ai.gaps).slice(0, 8).map((g) => {
    const x = g as Record<string, unknown>;
    return { gap: clip(x.gap, 250), evidence: clip(x.evidence, 400), how_we_fill: clip(x.how_we_fill, 400), has_material: Boolean(x.has_material) };
  }).filter((g) => g.gap);
  const b = (ai.brief || {}) as Record<string, unknown>;
  const brief: Brief = {
    title: clip(b.title, 120) || kw.keyword,
    focus_keyword: clip(b.focus_keyword, 120) || kw.keyword,
    secondary_keywords: list(b.secondary_keywords).map((s) => clip(s, 100)).filter(Boolean).slice(0, 12),
    outline: list(b.outline)
      .map((o) => {
        const x = o as Record<string, unknown>;
        const source = x.source === "gap" || x.source === "core" ? x.source : "must";
        return { heading: clip(x.heading, 160), level: Number(x.level) === 3 ? 3 : 2, source, note: clip(x.note, 300) } as OutlineItem;
      })
      .filter((o) => o.heading)
      .slice(0, 18),
    materials: list(b.materials).map((s) => clip(s, 200)).filter(Boolean).slice(0, 12),
    notes: clip(b.notes, 800),
  };

  const { data: comparison, error: cmpError } = await client
    .from("serp_comparisons")
    .insert([
      {
        keyword_id: keywordId,
        snapshot_id: snap.id,
        our_post_id: ourPost?.id ?? null,
        pages_used: pages.length,
        must_have: mustHave,
        top_keywords: topKeywords,
        gaps,
        signals: summarySignals,
        summary: clip(ai.summary, 800),
      },
    ])
    .select("id")
    .single();
  if (cmpError) throw cmpError;

  // ---------- BƯỚC 5: ĐỀ XUẤT ----------
  const ourPosition = (snap.our_position as number | null) ?? null;
  const missingMust = mustHave.filter((m) => !m.we_have).length;
  if (ourPost && ourPosition && ourPosition <= 3 && missingMust === 0) {
    return { comparisonId: comparison.id, proposalId: null, skippedReason: `Đang ở top ${ourPosition} và đủ mục bắt buộc: chưa cần viết lại.` };
  }
  const { score, reasons } = scoreProposal({
    businessValue: materials.cluster?.business_value,
    keyword: kw.keyword,
    ourPosition,
    fillableGaps: gaps.filter((g) => g.has_material).length,
    missingMust,
    isNew: !ourPost,
    pctWithPrice: summarySignals.pctWithPrice,
  });
  const proposal = {
    keyword_id: keywordId,
    comparison_id: comparison.id,
    type: ourPost ? "rewrite" : "new",
    reason: ourPost
      ? `Có bài "${ourPost.title}" nhưng ${ourPosition ? `đang ở vị trí ${ourPosition}` : "chưa vào top 10"}, thiếu ${missingMust}/${mustHave.length} mục bắt buộc.`
      : "Chưa có bài cho từ khóa này.",
    target_post_id: ourPost?.id ?? null,
    title: brief.title,
    brief,
    score,
    score_reasons: reasons,
  };

  // Có đề xuất đang mở cho từ khóa → cập nhật, không tạo trùng
  const { data: open } = await client
    .from("content_proposals")
    .select("id")
    .eq("keyword_id", keywordId)
    .eq("status", "proposed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (open) {
    await client.from("content_proposals").update({ ...proposal, error: null }).eq("id", open.id);
    return { comparisonId: comparison.id, proposalId: open.id, skippedReason: null };
  }
  const { data: created, error: propError } = await client.from("content_proposals").insert([proposal]).select("id").single();
  if (propError) throw propError;
  return { comparisonId: comparison.id, proposalId: created.id, skippedReason: null };
}
