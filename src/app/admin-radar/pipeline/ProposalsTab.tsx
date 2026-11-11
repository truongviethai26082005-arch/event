"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  PenLine,
  X,
  FileCheck2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
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

interface PostInfo {
  id: string;
  title: string;
  slug: string;
  status: string;
}

export default function ProposalsTab({
  mode,
  proposals,
  keywords,
  onChanged,
  onOpenPosts,
  setNotice,
  setError,
}: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Map<string, PostInfo>>(new Map());
  const [edits, setEdits] = useState<Record<string, { title: string; content: string }>>({});
  const [filterType, setFilterType] = useState<"all" | "new" | "rewrite">("all");

  const kwName = (id: string) => keywords.find((k) => k.id === id)?.keyword || "Từ khóa SEO";

  const rawList = useMemo(
    () =>
      proposals
        .filter((p) =>
          mode === "propose"
            ? p.status === "proposed"
            : ["writing", "drafted", "published"].includes(p.status)
        )
        .sort((a, b) =>
          mode === "propose" ? b.score - a.score : b.updated_at.localeCompare(a.updated_at)
        ),
    [proposals, mode]
  );

  const list = useMemo(() => {
    if (filterType === "all") return rawList;
    return rawList.filter((p) => p.type === filterType);
  }, [rawList, filterType]);

  // Đồng bộ thông tin bài viết liên quan
  useEffect(() => {
    const ids = [
      ...new Set(list.flatMap((p) => [p.target_post_id, p.post_id]).filter(Boolean)),
    ] as string[];
    if (!ids.length) return;
    const t = window.setTimeout(async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.from("posts").select("id,title,slug,status").in("id", ids);
      const map = new Map((data ?? []).map((p) => [p.id as string, p as PostInfo]));
      setPosts(map);
      const toSync = list.filter(
        (p) =>
          p.type === "new" &&
          p.status === "drafted" &&
          p.post_id &&
          map.get(p.post_id)?.status === "published"
      );
      if (toSync.length) {
        await supabase
          .from("content_proposals")
          .update({ status: "published" })
          .in("id", toSync.map((p) => p.id));
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
      setNotice(
        p.type === "new"
          ? "AI đã viết xong bài nháp: xem ở Giai đoạn 4 hoặc Kho bài viết."
          : "AI đã viết lại xong: kiểm tra và áp dụng ở Giai đoạn 4."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI viết bài thất bại.");
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  const dismiss = async (p: Proposal) => {
    const isConfirm = window.confirm(`Bạn có chắc muốn bỏ qua đề xuất "${p.title}" không?`);
    if (!isConfirm) return;
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
      await api(
        `/api/radar/proposals/${p.id}/apply`,
        edit ? { title: edit.title, content: edit.content } : {}
      );
      setNotice("Đã áp dụng bản viết lại vào bài cũ (giữ nguyên đường dẫn) và đăng thành công.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không áp dụng được.");
    } finally {
      setBusy(null);
      onChanged();
    }
  };

  const newCount = rawList.filter((p) => p.type === "new").length;
  const rewriteCount = rawList.filter((p) => p.type === "rewrite").length;

  return (
    <div className="space-y-4">
      {/* KHỐI TIÊU ĐỀ & BỘ LỌC TỔNG QUAN */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {mode === "propose"
                  ? "Giai đoạn 3: Bảng danh sách đề xuất bài viết (Viết mới & Viết lại)"
                  : "Giai đoạn 4: Bảng theo dõi tiến trình viết bài & Kiểm duyệt chất lượng"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {mode === "propose"
                ? "Các đề tài được AI chấm điểm ưu tiên dựa trên khoảng trống của đối thủ. Bấm 'Viết bằng AI' để tự động tạo bài viết."
                : "Theo dõi bài viết AI đang soạn thảo, đối soát số liệu thực tế của công ty trước khi duyệt xuất bản lên website."}
            </p>
          </div>

          {/* Bộ lọc loại đề xuất */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterType === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tất cả ({rawList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("new")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterType === "new" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Viết mới ({newCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("rewrite")}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                filterType === "rewrite" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Viết lại ({rewriteCount})
            </button>
          </div>
        </div>

        {/* NỘI DUNG DẠNG BẢNG RÕ RÀNG TỪNG CỘT */}
        {list.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <p className="font-bold text-slate-700">
              {mode === "propose"
                ? "Chưa có đề xuất bài viết nào. Hãy chạy Giai đoạn 2 'So sánh nội dung' để máy tự động phân tích và tạo đề xuất."
                : "Hiện chưa có bài viết nào đang trong tiến trình soạn thảo. Bấm 'Viết bằng AI' ở Giai đoạn 3 để bắt đầu."}
            </p>
          </div>
        ) : mode === "propose" ? (
          /* BẢNG GIAI ĐOẠN 3: ĐỀ XUẤT BÀI VIẾT */
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">STT</th>
                  <th className="py-3.5 px-3 w-28">Phân loại</th>
                  <th className="py-3.5 px-3 w-28 text-center">Điểm ưu tiên</th>
                  <th className="py-3.5 px-4">Tiêu đề bài viết dự kiến</th>
                  <th className="py-3.5 px-4 w-44">Từ khóa SEO</th>
                  <th className="py-3.5 px-4 w-52">Lý do đề xuất</th>
                  <th className="py-3.5 px-4 w-40 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {list.map((p, idx) => {
                  const open = openId === p.id;
                  const target = p.target_post_id ? posts.get(p.target_post_id) : null;
                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        className={`transition hover:bg-slate-50/80 ${
                          open ? "bg-indigo-50/30" : idx % 2 === 1 ? "bg-slate-50/30" : "bg-white"
                        }`}
                      >
                        {/* 1. STT */}
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-semibold">
                          {idx + 1}
                        </td>

                        {/* 2. Loại đề xuất */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {p.type === "new" ? (
                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80 font-bold text-[11px]">
                              Viết mới
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200/80 font-bold text-[11px]">
                              Viết lại
                            </span>
                          )}
                        </td>

                        {/* 3. Điểm số */}
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-md font-mono font-black text-xs border ${
                              p.score >= 70
                                ? "bg-rose-100 text-rose-900 border-rose-300"
                                : p.score >= 50
                                ? "bg-amber-100 text-amber-900 border-amber-300"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {p.score} điểm
                          </span>
                        </td>

                        {/* 4. Tiêu đề */}
                        <td className="py-3.5 px-4 min-w-[240px]">
                          <button
                            type="button"
                            onClick={() => setOpenId(open ? null : p.id)}
                            className="text-left font-bold text-slate-900 hover:text-indigo-700 transition flex items-center gap-1.5 group cursor-pointer"
                          >
                            <span className="leading-snug">{p.title}</span>
                            {open ? (
                              <ChevronUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                            )}
                          </button>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                            <span
                              onClick={() => setOpenId(open ? null : p.id)}
                              className="text-indigo-600 hover:underline cursor-pointer"
                            >
                              {open ? "Thu gọn dàn ý" : "Bấm xem dàn ý & brief chi tiết"}
                            </span>
                            {target && (
                              <span>
                                • Viết lại bài:{" "}
                                <a
                                  href={`/tin-tuc/${target.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-slate-600 hover:underline inline-flex items-center gap-0.5"
                                >
                                  /{target.slug}
                                </a>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. Từ khóa SEO */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <code className="px-2 py-1 rounded bg-amber-50 text-amber-900 font-mono font-bold text-[11px] border border-amber-200">
                            {kwName(p.keyword_id)}
                          </code>
                        </td>

                        {/* 6. Lý do đề xuất */}
                        <td className="py-3.5 px-4 text-slate-600 text-[11px] leading-relaxed">
                          {p.reason || "Chưa có bài trên web · Cần viết để đón khách tìm kiếm"}
                          {p.error && (
                            <span className="block mt-1 text-rose-600 font-bold">
                              Lần viết trước lỗi: {p.error}
                            </span>
                          )}
                        </td>

                        {/* 7. Thao tác */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => void write(p)}
                              disabled={!!busy}
                              className="px-3.5 py-2 rounded-xl bg-[#0B1536] hover:bg-[#12204E] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                              title="Bấm để AI viết bài ngay"
                            >
                              {busy === p.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Đang viết...</span>
                                </>
                              ) : (
                                <>
                                  <PenLine className="w-3.5 h-3.5" />
                                  <span>Viết bằng AI</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => void dismiss(p)}
                              disabled={!!busy}
                              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                              title="Bỏ qua đề xuất này"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Khung mở rộng xem Brief & Dàn ý */}
                      {open && (
                        <tr>
                          <td colSpan={7} className="p-0 border-b border-indigo-100 bg-slate-50/70">
                            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                              {/* Cột trái: Căn cứ & Dữ liệu thật */}
                              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                                <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-100 pb-2">
                                  1. Căn cứ chấm điểm & Dữ liệu thật đưa vào bài
                                </h5>
                                <div>
                                  <strong className="text-slate-700">Lý do đạt {p.score} điểm:</strong>
                                  <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-600">
                                    {p.score_reasons.map((r, i) => (
                                      <li key={i}>{r}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <strong className="text-slate-700">Từ khóa mở rộng:</strong>
                                  <p className="mt-0.5 text-slate-600">
                                    Chính: <b>{p.brief.focus_keyword}</b>
                                    <br />
                                    Phụ: {p.brief.secondary_keywords?.join(", ") || "Đang cập nhật"}
                                  </p>
                                </div>
                                <div>
                                  <strong className="text-slate-700">Chất liệu thực tế của Trường Hải Event:</strong>
                                  <ul className="mt-1 list-disc list-inside space-y-0.5 text-slate-600">
                                    {p.brief.materials?.map((m, i) => (
                                      <li key={i}>{m}</li>
                                    ))}
                                  </ul>
                                </div>
                                {p.brief.notes && (
                                  <p className="text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                                    Lưu ý: {p.brief.notes}
                                  </p>
                                )}
                              </div>

                              {/* Cột phải: Dàn ý bài viết */}
                              <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
                                <h5 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-100 pb-2">
                                  2. Khung dàn ý đề xuất vượt đối thủ
                                </h5>
                                <ol className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                                  {p.brief.outline.map((o, i) => (
                                    <li
                                      key={i}
                                      className={`p-2 rounded-xl border flex items-start gap-2 ${
                                        o.level === 3 ? "ml-4 bg-slate-50 border-slate-200" : "bg-white border-slate-200 font-semibold"
                                      }`}
                                    >
                                      <span
                                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                                          o.source === "gap"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : o.source === "must"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-slate-100 text-slate-700"
                                        }`}
                                      >
                                        {o.source === "gap" ? "Vượt đối thủ" : o.source === "must" ? "Bắt buộc" : "Khung"}
                                      </span>
                                      <span className="text-slate-800 text-xs">{o.heading}</span>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* BẢNG GIAI ĐOẠN 4: VIẾT BÀI & DUYỆT ĐĂNG */
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/90 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-32">Trạng thái</th>
                  <th className="py-3.5 px-4">Tiêu đề bài viết & Đường dẫn nháp</th>
                  <th className="py-3.5 px-4 w-44">Từ khóa SEO</th>
                  <th className="py-3.5 px-4 w-60">Kiểm soát chất lượng (QA)</th>
                  <th className="py-3.5 px-3 w-28 text-center">Cập nhật</th>
                  <th className="py-3.5 px-4 w-44 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {list.map((p, idx) => {
                  const open = openId === p.id;
                  const target = p.target_post_id ? posts.get(p.target_post_id) : null;
                  const newPost = p.post_id ? posts.get(p.post_id) : null;
                  const edit = edits[p.id] ?? (p.draft ? { title: p.draft.title, content: p.draft.content } : null);
                  const needs = edit ? (edit.content.match(NEEDS_DATA_RE) || []).length : 0;

                  return (
                    <React.Fragment key={p.id}>
                      <tr
                        className={`transition hover:bg-slate-50/80 ${
                          open ? "bg-indigo-50/30" : idx % 2 === 1 ? "bg-slate-50/30" : "bg-white"
                        }`}
                      >
                        {/* 1. Trạng thái */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {p.status === "published" ? (
                              <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] inline-block">
                                Đã đăng
                              </span>
                            ) : p.status === "writing" ? (
                              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px] inline-block animate-pulse">
                                AI đang viết
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 border border-rose-300 font-bold text-[11px] inline-block">
                                Chờ duyệt
                              </span>
                            )}
                            <div>
                              <span className="text-[10px] text-slate-500 font-medium">
                                {p.type === "new" ? "Viết bài mới" : "Viết lại bài cũ"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Tiêu đề & slug */}
                        <td className="py-3.5 px-4 min-w-[240px]">
                          <p className="font-bold text-slate-900 text-sm leading-snug">{p.title}</p>
                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                            <span>/tin-tuc/{newPost?.slug || target?.slug || "bai-viet-chua-dat-ten"}</span>
                          </div>
                        </td>

                        {/* 3. Từ khóa SEO */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <code className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[11px] border border-slate-200">
                            {kwName(p.keyword_id)}
                          </code>
                        </td>

                        {/* 4. QA Checklist */}
                        <td className="py-3.5 px-4">
                          {p.draft ? (
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                                {p.draft.qa.words.toLocaleString("vi-VN")} chữ • {p.draft.qa.h2} mục
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded font-bold border ${
                                  needs > 0
                                    ? "bg-rose-100 text-rose-800 border-rose-200"
                                    : "bg-emerald-100 text-emerald-800 border-emerald-200"
                                }`}
                              >
                                {needs > 0 ? `${needs} chỗ cần số liệu` : "Đủ số liệu"}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded font-medium border ${
                                  p.draft.qa.banned.length
                                    ? "bg-amber-100 text-amber-900 border-amber-200"
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                              >
                                {p.draft.qa.banned.length ? `Từ cấm: ${p.draft.qa.banned.join(", ")}` : "Không có từ cấm"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Đang chờ tạo dữ liệu QA</span>
                          )}
                        </td>

                        {/* 5. Cập nhật */}
                        <td className="py-3.5 px-3 text-center text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          {fmtTime(p.updated_at)}
                        </td>

                        {/* 6. Thao tác */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.type === "new" ? (
                              p.status === "published" ? (
                                <a
                                  href={`/tin-tuc/${newPost?.slug || ""}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs flex items-center gap-1"
                                >
                                  <span>Xem bài đã đăng</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              ) : (
                                <button
                                  type="button"
                                  onClick={onOpenPosts}
                                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                                >
                                  <FileCheck2 className="w-3.5 h-3.5" />
                                  <span>Duyệt trong Kho bài</span>
                                </button>
                              )
                            ) : (
                              /* Bài viết lại */
                              <button
                                type="button"
                                onClick={() => setOpenId(open ? null : p.id)}
                                className="px-3.5 py-2 rounded-xl bg-[#0B1536] hover:bg-[#12204E] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <span>{open ? "Đóng sửa" : "Sửa & Áp dụng"}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Khung sửa trực tiếp bài viết lại (Rewrite Editor) */}
                      {open && p.type === "rewrite" && edit && (
                        <tr>
                          <td colSpan={6} className="p-0 border-b border-indigo-100 bg-slate-50/80">
                            <div className="p-5 sm:p-6 space-y-4">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                                  Soạn thảo & Áp dụng bản viết lại cho bài: /tin-tuc/{target?.slug}
                                </h5>
                                <span className="text-slate-500 text-xs">
                                  {needs > 0 ? (
                                    <span className="text-rose-600 font-bold">
                                      ⚠️ Còn {needs} chỗ cần điền số liệu trước khi đăng
                                    </span>
                                  ) : (
                                    <span className="text-emerald-700 font-bold">
                                      ✓ Đầy đủ số liệu thực tế, sẵn sàng áp dụng
                                    </span>
                                  )}
                                </span>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Tiêu đề bài viết:
                                </label>
                                <input
                                  type="text"
                                  value={edit.title}
                                  onChange={(e) =>
                                    setEdits((prev) => ({
                                      ...prev,
                                      [p.id]: { ...edit, title: e.target.value },
                                    }))
                                  }
                                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  Nội dung bài viết:
                                </label>
                                <textarea
                                  value={edit.content}
                                  onChange={(e) =>
                                    setEdits((prev) => ({
                                      ...prev,
                                      [p.id]: { ...edit, content: e.target.value },
                                    }))
                                  }
                                  rows={14}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>

                              <div className="flex items-center justify-end gap-3 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setOpenId(null)}
                                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs cursor-pointer"
                                >
                                  Đóng lại
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void apply(p)}
                                  disabled={!!busy || needs > 0}
                                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
                                >
                                  {busy === p.id && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                  <span>Áp dụng vào bài cũ & Xuất bản ngay</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
