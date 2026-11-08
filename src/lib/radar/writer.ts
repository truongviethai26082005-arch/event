// CHỈ dùng ở máy chủ.
/**
 * BƯỚC 6 – VIẾT: AI viết bài theo brief của đề xuất (bước 5), chỉ dùng chất liệu thật.
 *  - Viết mới  : tạo bài nháp trong bảng posts (status = draft) -> duyệt / đăng ở "Kho bài viết".
 *  - Viết lại  : lưu bản viết lại vào content_proposals.draft; "Áp dụng" cập nhật bài cũ, GIỮ slug.
 * Chỗ thiếu số liệu ghi đúng dạng "[CẦN SỐ LIỆU: ...]" (Kho bài viết dùng dạng này để chặn đăng).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { callGeminiWithFallback } from "@/app/api/radar/services/gemini-client";
import { createSeoSlug } from "@/app/api/radar/services/content-generator";
import { loadMaterials, writingRules } from "@/lib/radar/materials";
import type { Brief, Gap, MustHave } from "@/lib/radar/compare";

export const NEEDS_DATA_RE = /\[CẦN (?:SỐ LIỆU|KIỂM CHỨNG)[^\]]*\]/gi;

/** Cụm cấm theo quy tắc V8–V10 (voice.md), kiểm bằng code. */
const BANNED = [
  "đẳng cấp", "hàng đầu", "số 1", "top 1", "uy tín nhất", "chuyên nghiệp nhất", "độc bản", "đột phá", "bùng nổ",
  "thăng hoa", "đỉnh cao", "hoàn hảo", "tuyệt vời", "ấn tượng khó quên", "trong thời đại ngày nay", "không thể phủ nhận",
  "bạn có biết", "hãy cùng tìm hiểu", "bài viết dưới đây sẽ", "hy vọng bài viết", "tóm lại", "chúc bạn thành công",
  "không phát sinh chi phí", "đảm bảo thành công", "rẻ nhất",
];

export interface DraftQa {
  words: number;
  h2: number;
  needsData: number;
  banned: string[];
  focusInTitle: boolean;
  missingOutline: string[];
}

export interface WrittenDraft {
  title: string;
  meta_description: string;
  content: string;
  qa: DraftQa;
}

function qaCheck(d: { title: string; content: string }, brief: Brief): DraftQa {
  const lower = d.content.toLowerCase();
  const headings = d.content.split("\n").filter((l) => /^##\s/.test(l.trim())).map((l) => l.toLowerCase());
  return {
    words: d.content.split(/\s+/).filter(Boolean).length,
    h2: headings.length,
    needsData: (d.content.match(NEEDS_DATA_RE) || []).length,
    banned: BANNED.filter((b) => lower.includes(b)),
    focusInTitle: d.title.toLowerCase().includes(brief.focus_keyword.toLowerCase().split(" ").slice(0, 3).join(" ")),
    missingOutline: brief.outline
      .filter((o) => o.level === 2 && o.source !== "core")
      .map((o) => o.heading)
      .filter((h) => !headings.some((x) => x.includes(h.toLowerCase().slice(0, 18)))),
  };
}

export async function writeProposal(client: SupabaseClient, proposalId: string, actor: string) {
  const { data: p, error } = await client.from("content_proposals").select("*").eq("id", proposalId).single();
  if (error || !p) throw new Error("Không tìm thấy đề xuất.");
  const { data: kw } = await client.from("seo_keywords").select("keyword,cluster_id").eq("id", p.keyword_id).single();
  const { data: cmp } = p.comparison_id
    ? await client.from("serp_comparisons").select("must_have,gaps,summary,signals").eq("id", p.comparison_id).single()
    : { data: null };
  const { data: target } = p.target_post_id
    ? await client.from("posts").select("id,title,slug,content").eq("id", p.target_post_id).single()
    : { data: null };

  await client.from("content_proposals").update({ status: "writing", error: null }).eq("id", proposalId);

  const brief = p.brief as Brief;
  const materials = await loadMaterials(client, kw?.cluster_id);
  const rules = writingRules();
  const avgWords = Number((cmp?.signals as { avgWords?: number } | null)?.avgWords) || 1800;
  const targetWords = Math.min(Math.max(Math.round(avgWords * 1.1), 1500), 3500);

  const prompt = `Bạn là biên tập viên của Trường Hải Event & Travel. Viết ${p.type === "rewrite" ? "LẠI" : "MỚI"} một bài blog chuẩn SEO tiếng Việt để vượt các bài đang top Google cho từ khóa "${brief.focus_keyword}".

## BRIEF (bắt buộc bám theo)
- Tiêu đề đề xuất: ${brief.title}
- Từ khóa chính: ${brief.focus_keyword}
- Từ khóa phụ (rải tự nhiên trong tiêu đề mục và nội dung): ${brief.secondary_keywords.join(", ")}
- Dàn ý:
${brief.outline.map((o) => `${o.level === 3 ? "   ###" : "  ##"} ${o.heading}  [${o.source === "gap" ? "VƯỢT ĐỐI THỦ" : o.source === "must" ? "BẮT BUỘC" : "KHUNG"}] ${o.note}`).join("\n")}
- Chất liệu thật sẽ dùng: ${brief.materials.join("; ")}
- Lưu ý: ${brief.notes}

## VÌ SAO CÁC BÀI KHÁC ĐANG TOP / KHE HỞ PHẢI LẤP
${cmp?.summary || ""}
Mục bắt buộc: ${((cmp?.must_have as MustHave[]) || []).map((m) => m.item).join("; ")}
Khe hở: ${((cmp?.gaps as Gap[]) || []).map((g) => `${g.gap} → ${g.how_we_fill}`).join(" | ")}

## CHẤT LIỆU THẬT (CHỈ được dùng các số liệu, dự án, giá trong phần này)
${materials.text}

${target ? `## BÀI CŨ CẦN VIẾT LẠI (giữ ý đúng, bổ sung phần thiếu, viết lại cho tốt hơn)\nTiêu đề cũ: ${target.title}\n${String(target.content).slice(0, 6000)}\n` : ""}
## QUY TẮC GIỌNG VĂN
${rules.voice.slice(0, 3500)}

## QUY TẮC CẤU TRÚC
${rules.structure.slice(0, 3000)}

## YÊU CẦU ĐẦU RA
- Độ dài khoảng ${targetWords} chữ (đối thủ trung bình ${avgWords} chữ).
- Markdown: KHÔNG có dòng # (H1) trong content (tiêu đề để riêng), dùng ## và ###.
- Dẫn giá: chỉ dùng mức trong BẢNG ĐƠN GIÁ, ghi rõ "giá tham khảo, chưa gồm VAT". Dự án: chỉ các dự án trong danh sách.
- Thiếu số liệu thật thì viết đúng dạng: [CẦN SỐ LIỆU: mô tả cần gì]. Không bịa.
- Có mục câu hỏi thường gặp (FAQ) 4–6 câu nếu dàn ý có.
- Tối đa 2 lời mời liên hệ (hotline / form báo giá ở trang /dich-vu).

CHỈ trả JSON: {"title":"","meta_description":"(140–160 ký tự)","content":"markdown"}`;

  try {
    const raw = await callGeminiWithFallback({ apiKey: process.env.GEMINI_API_KEY || "", prompt, temperature: 0.5 });
    const out = JSON.parse(raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim()) as Record<string, string>;
    const title = String(out.title || brief.title).trim().slice(0, 160);
    const content = String(out.content || "").replace(/^#\s.+\n/, "").trim();
    if (content.split(/\s+/).length < 400) throw new Error("AI trả bài quá ngắn, thử viết lại.");
    const draft: WrittenDraft = {
      title,
      meta_description: String(out.meta_description || "").trim().slice(0, 170),
      content,
      qa: qaCheck({ title, content }, brief),
    };

    if (p.type === "new") {
      // Tạo bài nháp trong Kho bài viết, slug không trùng
      const base = createSeoSlug(title) || createSeoSlug(brief.focus_keyword);
      let slug = base;
      for (let i = 2; i < 20; i += 1) {
        const { data: exists } = await client.from("posts").select("id").eq("slug", slug).maybeSingle();
        if (!exists) break;
        slug = `${base}-${i}`;
      }
      const { data: post, error: postError } = await client
        .from("posts")
        .insert([{ title, slug, content, meta_description: draft.meta_description, focus_keyword: brief.focus_keyword, status: "draft" }])
        .select("id")
        .single();
      if (postError) throw postError;
      await client.from("content_proposals").update({ status: "drafted", post_id: post.id, draft }).eq("id", proposalId);
    } else {
      await client.from("content_proposals").update({ status: "drafted", draft }).eq("id", proposalId);
    }

    await client.from("radar_runs").insert([
      {
        kind: "write",
        status: draft.qa.needsData || draft.qa.banned.length ? "warning" : "success",
        message: `AI viết ${p.type === "new" ? "bài mới" : "lại bài"} "${title}": ${draft.qa.words} chữ, ${draft.qa.needsData} chỗ cần số liệu${draft.qa.banned.length ? `, ${draft.qa.banned.length} cụm từ cấm` : ""}.`,
        actor,
      },
    ]);
    return draft;
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI viết bài thất bại.";
    await client.from("content_proposals").update({ status: "proposed", error: message }).eq("id", proposalId);
    throw err;
  }
}

/** Áp dụng bản viết lại vào bài cũ (giữ slug để không mất thứ hạng). */
export async function applyRewrite(client: SupabaseClient, proposalId: string, override?: { content?: string; title?: string }) {
  const { data: p } = await client.from("content_proposals").select("*").eq("id", proposalId).single();
  if (!p || p.type !== "rewrite" || !p.target_post_id || !p.draft) throw new Error("Đề xuất không có bản viết lại để áp dụng.");
  const draft = p.draft as WrittenDraft;
  const content = override?.content ?? draft.content;
  const title = override?.title ?? draft.title;
  const needs = content.match(NEEDS_DATA_RE) || [];
  if (needs.length) throw new Error(`Còn ${needs.length} chỗ [CẦN SỐ LIỆU]: điền số thật trước khi áp dụng.`);
  const { error } = await client
    .from("posts")
    .update({ title, content, meta_description: draft.meta_description, focus_keyword: (p.brief as Brief).focus_keyword, status: "published" })
    .eq("id", p.target_post_id);
  if (error) throw error;
  await client.from("content_proposals").update({ status: "published", draft: { ...draft, title, content } }).eq("id", proposalId);
}
