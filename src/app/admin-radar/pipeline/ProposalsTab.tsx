"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Loader2, PenLine, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge, Card, Empty, Keyword, Proposal, api, fmtTime } from "./shared";

const NEEDS_DATA_RE = /\[CẦN (?:SỐ LIỆU|KIỂM CHỨNG)[^\]]*\]/gi;

interface Props {
  mode: "propose" | "write";
  proposals: Proposal[];
  keywords: Keyword[];
  onChanged: () => void;
  onOpenPosts: () => void;
  setNotice: (s: string) => void;
  setError: (s: string) => void;
}

interface PostInfo { id: string; title: string; slug: string; status: string }

/** Bước 5 – Đề xuất (mode="propose") và bước 6 – Viết & đăng (mode="write"). */
export default function ProposalsTab({ mode, proposals, keywords, onChanged, onOpenPosts, setNotice, setError }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Map<string, PostInfo>>(new Map());
  const [edits, setEdits] = useState<Record<string, { title: string; content: string }>>({});
  const kwName = (id: string) => keywords.find((k) => k.id === id)?.keyword || "";

  const list = useMemo(
    () =>
      proposals
        .filter((p) => (mode === "propose" ? p.status === "proposed" : ["writing", "drafted", "published"].includes(p.status)))
        .sort((a, b) => (mode === "propose" ? b.score - a.score : b.updated_at.localeCompare(a.updated_at))),
    [proposals, mode]
  );

  // Thông tin bài liên quan (bài cũ cần viết lại / bài nháp mới) + đồng bộ trạng thái đã đăng
  useEffect(() => {
    const ids = [...new Set(list.flatMap((p) => [p.target_post_id, p.post_id]).filter(Boolean))] as string[];
    if (!ids.length) return;
    const t = window.setTimeout(async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.from("posts").select("id,title,slug,status").in("id", ids);
      const map = new Map((data ?? []).map((p) => [p.id as string, p as PostInfo]));
      setPosts(map);
      const toSync = list.filter((p) => p.type === "new" && p.status === "drafted" && p.post_id && map.get(p.post_id)?.status === "published");
      if (toSync.length) {
        await supabase.from("content_proposals").update({ status: "published" }).in("id", toSync.map((p) => p.id));
        onChanged();
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [list, onChanged]);

  const write = async (p: Proposal) => {
    setBusy(p.id);
    setError("");
    try {
      await api(`/api/radar/proposals/${p.id}/write`, {});
      setNotice(p.type === "new" ? "AI đã viết xong bài nháp: xem ở tab 6 hoặc Kho bài viết." : "AI đã viết lại xong: duyệt và áp dụng ở tab 6.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI viết bài thất bại.");
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  const dismiss = async (p: Proposal) => {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("content_proposals").update({ status: "dismissed" }).eq("id", p.id);
    setNotice(`Đã bỏ qua đề xuất "${p.title}".`);
    onChanged();
  };

  const apply = async (p: Proposal) => {
    const edit = edits[p.id];
    setBusy(p.id);
    setError("");
    try {
      await api(`/api/radar/proposals/${p.id}/apply`, edit ? { title: edit.title, content: edit.content } : {});
      setNotice("Đã áp dụng bản viết lại vào bài cũ (giữ nguyên đường dẫn) và đăng.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không áp dụng được.");
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  return (
    <Card
      title={mode === "propose" ? "5. Đề xuất: viết mới hay viết lại" : "6. Viết & đăng"}
      hint={
        mode === "propose"
          ? "Xếp theo điểm ưu tiên. Bấm vào để xem brief (dàn ý = mục bắt buộc + mục vượt đối thủ). “Viết bằng AI” mất khoảng 30 giây."
          : "Bài mới: duyệt & đăng ở Kho bài viết. Viết lại: đọc, sửa, rồi “Áp dụng vào bài cũ” (giữ đường dẫn để không mất thứ hạng)."
      }
    >
      {list.length === 0 ? (
        <Empty>
          {mode === "propose"
            ? "Chưa có đề xuất. Chạy bước 4 “So sánh” để hệ thống tự tạo đề xuất."
            : "Chưa có bài nào đang viết. Bấm “Viết bằng AI” ở tab 5."}
        </Empty>
      ) : (
        <ul className="divide-y divide-slate-100">
          {list.map((p) => {
            const open = openId === p.id;
            const target = p.target_post_id ? posts.get(p.target_post_id) : null;
            const newPost = p.post_id ? posts.get(p.post_id) : null;
            const edit = edits[p.id] ?? (p.draft ? { title: p.draft.title, content: p.draft.content } : null);
            const needs = edit ? (edit.content.match(NEEDS_DATA_RE) || []).length : 0;
            return (
              <li key={p.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button type="button" onClick={() => setOpenId(open ? null : p.id)} className="min-w-0 flex-1 text-left">
                    <p className="flex flex-wrap items-center gap-1.5">
                      {p.type === "new" ? <Badge tone="blue">Viết mới</Badge> : <Badge tone="violet">Viết lại</Badge>}
                      {mode === "propose" && <Badge tone={p.score >= 70 ? "red" : p.score >= 50 ? "amber" : "slate"}>{p.score} điểm</Badge>}
                      {mode === "write" && (
                        <Badge tone={p.status === "published" ? "green" : p.status === "writing" ? "amber" : "slate"}>
                          {p.status === "published" ? "Đã đăng" : p.status === "writing" ? "AI đang viết" : "Chờ duyệt"}
                        </Badge>
                      )}
                      <span className="text-sm font-bold text-slate-900">{p.title}</span>
                      {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Từ khóa: <strong>{kwName(p.keyword_id)}</strong> · {p.reason}
                    </p>
                    {p.error && <p className="mt-1 text-xs text-rose-600">Lần viết trước lỗi: {p.error}</p>}
                  </button>
                  {mode === "propose" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void write(p)}
                        disabled={!!busy}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1E5E] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                      >
                        {busy === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PenLine className="h-3.5 w-3.5" />}
                        {busy === p.id ? "AI đang viết…" : "Viết bằng AI"}
                      </button>
                      <button type="button" onClick={() => void dismiss(p)} disabled={!!busy} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600" title="Bỏ qua">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {open && mode === "propose" && (
                  <div className="mt-3 grid gap-4 rounded-2xl bg-slate-50 p-4 text-xs lg:grid-cols-2">
                    <div>
                      <p className="font-bold text-slate-800">Vì sao điểm {p.score}</p>
                      <ul className="mt-1 list-inside list-disc text-slate-600">{p.score_reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                      <p className="mt-3 font-bold text-slate-800">Từ khóa</p>
                      <p className="text-slate-600">
                        Chính: <strong>{p.brief.focus_keyword}</strong>
                        <br />
                        Phụ: {p.brief.secondary_keywords.join(", ")}
                      </p>
                      <p className="mt-3 font-bold text-slate-800">Chất liệu thật sẽ dùng</p>
                      <ul className="list-inside list-disc text-slate-600">{p.brief.materials.map((m) => <li key={m}>{m}</li>)}</ul>
                      {p.brief.notes && <p className="mt-3 text-slate-500">Lưu ý: {p.brief.notes}</p>}
                      {target && (
                        <a href={`/tin-tuc/${target.slug}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 font-semibold text-[#0A1E5E] hover:underline">
                          Bài cũ sẽ được viết lại: /tin-tuc/{target.slug} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Dàn ý</p>
                      <ol className="mt-1 space-y-1">
                        {p.brief.outline.map((o, i) => (
                          <li key={i} className={o.level === 3 ? "pl-4" : ""}>
                            <Badge tone={o.source === "gap" ? "green" : o.source === "must" ? "blue" : "slate"}>
                              {o.source === "gap" ? "Vượt đối thủ" : o.source === "must" ? "Bắt buộc" : "Khung"}
                            </Badge>{" "}
                            <span className="text-slate-800">{o.heading}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {mode === "write" && p.draft && (
                  <div className="mt-3 space-y-3 rounded-2xl bg-slate-50 p-4 text-xs">
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="slate">{p.draft.qa.words.toLocaleString("vi-VN")} chữ · {p.draft.qa.h2} mục</Badge>
                      <Badge tone={needs ? "red" : "green"}>{needs ? `${needs} chỗ CẦN SỐ LIỆU` : "Đủ số liệu"}</Badge>
                      <Badge tone={p.draft.qa.banned.length ? "amber" : "green"}>
                        {p.draft.qa.banned.length ? `Cụm từ cấm: ${p.draft.qa.banned.join(", ")}` : "Không có cụm từ cấm"}
                      </Badge>
                      {!!p.draft.qa.missingOutline.length && <Badge tone="amber">Thiếu {p.draft.qa.missingOutline.length} mục dàn ý</Badge>}
                      <span className="text-slate-400">cập nhật {fmtTime(p.updated_at)}</span>
                    </div>

                    {p.type === "new" ? (
                      <p className="text-slate-700">
                        Bài nháp {newPost ? <strong>/tin-tuc/{newPost.slug}</strong> : ""} {newPost?.status === "published" ? "đã được đăng." : "đang chờ duyệt trong Kho bài viết."}{" "}
                        {newPost?.status !== "published" && (
                          <button type="button" onClick={onOpenPosts} className="font-bold text-[#0A1E5E] underline">
                            Mở Kho bài viết để duyệt & đăng
                          </button>
                        )}
                      </p>
                    ) : (
                      p.status !== "published" &&
                      edit && (
                        <>
                          <p className="text-slate-600">
                            Bản viết lại cho bài <strong>/tin-tuc/{target?.slug}</strong>. Sửa trực tiếp nếu cần; chỗ <code>[CẦN SỐ LIỆU: …]</code> phải thay bằng số thật.
                          </p>
                          <input
                            value={edit.title}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [p.id]: { ...edit, title: e.target.value } }))}
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm font-bold"
                          />
                          <textarea
                            value={edit.content}
                            onChange={(e) => setEdits((prev) => ({ ...prev, [p.id]: { ...edit, content: e.target.value } }))}
                            rows={16}
                            className="w-full rounded-lg border border-slate-200 p-3 font-mono text-[12px] leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => void apply(p)}
                            disabled={!!busy || needs > 0}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                            title={needs ? "Còn chỗ CẦN SỐ LIỆU" : ""}
                          >
                            {busy === p.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Áp dụng vào bài cũ & đăng (giữ đường dẫn)
                          </button>
                          {needs > 0 && <p className="text-rose-600">Khóa đăng: còn {needs} chỗ [CẦN SỐ LIỆU].</p>}
                        </>
                      )
                    )}
                    {p.type === "rewrite" && p.status === "published" && target && (
                      <a href={`/tin-tuc/${target.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#0A1E5E] hover:underline">
                        Xem bài đã cập nhật <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
