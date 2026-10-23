"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Building2,
  Calendar,
  FileText,
  Clock,
  ChevronDown,
  BookOpen,
  ArrowRight,
  Compass,
} from "lucide-react";

interface ArticleRendererProps {
  content: string;
  className?: string;
}

interface TocItem {
  id: string;
  rawText: string;
  cleanTitle: string;
  level: 2 | 3;
  displayNumber?: string;
  lineIndex: number;
}

// Hàm format text inline: parse links [text](url), **bold**, *italic*, và gỡ bỏ các ký tự thừa
function renderInlineFormatting(text: string, isDark: boolean = false): React.ReactNode[] {
  let cleanText = text
    .replace(/👉\s*/g, "")
    .replace(/⚠️\s*/g, "")
    .replace(/🎯\s*/g, "")
    .replace(/📌\s*/g, "")
    .replace(/✨\s*/g, "");

  // Regex nhận diện link [text](url), bold **text**, italic *text*
  const parts: React.ReactNode[] = [];
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanText.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("[") && match[2] && match[3]) {
      const linkText = match[2];
      const linkUrl = match[3];
      const isInternal = linkUrl.startsWith("/");
      const isTel = linkUrl.startsWith("tel:");

      if (isInternal) {
        parts.push(
          <Link
            key={`link-${match.index}`}
            href={linkUrl}
            className={`font-semibold underline decoration-[#D4AF37] decoration-2 underline-offset-2 transition-colors ${
              isDark ? "text-amber-300 hover:text-white" : "text-[#0A1E5E] hover:text-[#D4AF37]"
            }`}
          >
            {linkText}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={`link-${match.index}`}
            href={linkUrl}
            target={isTel ? undefined : "_blank"}
            rel={isTel ? undefined : "noopener noreferrer"}
            className={`font-semibold underline decoration-[#D4AF37] decoration-2 underline-offset-2 transition-colors ${
              isDark ? "text-amber-300 hover:text-white" : "text-[#0A1E5E] hover:text-[#D4AF37]"
            }`}
          >
            {linkText}
          </a>
        );
      }
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong
          key={match.index}
          className={`font-bold ${isDark ? "text-[#D4AF37]" : "text-[#0A1E5E]"}`}
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em
          key={match.index}
          className={`italic ${isDark ? "text-amber-200/90" : "text-slate-600"}`}
        >
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < cleanText.length) {
    parts.push(cleanText.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [cleanText];
}

// Kiểm tra xem dòng có phải là phân đoạn liên hệ công ty
function isContactSection(blockLines: string[]): boolean {
  const combined = blockLines.join(" ").toLowerCase();
  return (
    combined.includes("0844 198 333") ||
    combined.includes("công ty tnhh sự kiện và du lịch trường hải") ||
    combined.includes("liên hệ nhận báo giá") ||
    combined.includes("hotline 24/7")
  );
}

// Tạo slug ID cho anchor TOC
function createAnchorId(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);
  return `toc-${index}-${slug || "muc"}`;
}

// Component Mục Lục Bài Viết (TOC)
function TableOfContents({ items }: { items: TocItem[] }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!items || items.length === 0) return null;

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  return (
    <div className="my-8 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-amber-50/25 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/70">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#D4AF37] block">
              Điều hướng nội dung
            </span>
            <h3 className="text-base sm:text-lg font-black text-[#0A1E5E] leading-snug">
              Mục Lục Bài Viết
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs flex items-center space-x-1.5 transition-all"
          aria-label={isOpen ? "Thu gọn mục lục" : "Mở rộng mục lục"}
        >
          <span>{isOpen ? "Thu gọn" : "Mở rộng"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <nav className="mt-4 space-y-1.5 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar text-xs sm:text-sm">
          {items.map((item) => {
            const isH2 = item.level === 2;
            return (
              <div
                key={item.id}
                className={`transition-colors ${
                  isH2
                    ? "pt-1.5 font-bold text-[#0A1E5E]"
                    : "ml-4 sm:ml-6 pl-3 border-l border-slate-200 py-0.5 text-slate-600 hover:text-[#0A1E5E]"
                }`}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleScroll(e, item.id)}
                  className="flex items-start space-x-2 group hover:underline decoration-[#D4AF37] decoration-2 underline-offset-2 leading-relaxed"
                >
                  {isH2 ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#0A1E5E] text-[#D4AF37] text-[10px] font-black shrink-0 mt-0.5 shadow-2xs">
                      {item.displayNumber ? `Mục ${item.displayNumber}` : "✦"}
                    </span>
                  ) : (
                    <span className="text-slate-400 group-hover:text-[#D4AF37] text-xs shrink-0 mt-0.5">
                      ↳
                    </span>
                  )}
                  <span
                    className={`${
                      isH2
                        ? "text-[#0A1E5E] group-hover:text-[#D4AF37]"
                        : "text-slate-700 group-hover:text-[#0A1E5E]"
                    } font-medium`}
                  >
                    {item.cleanTitle}
                  </span>
                </a>
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function ArticleContentRenderer({ content, className = "" }: ArticleRendererProps) {
  if (!content || !content.trim()) {
    return <p className="text-slate-500 italic">Nội dung bài viết đang được cập nhật...</p>;
  }

  // Chia nội dung thành các dòng để phân tích cấu trúc
  const lines = content.split("\n");

  // 1. Quét trước toàn bộ H2 và H3 để tạo TOC
  const tocItems: TocItem[] = [];
  let h2Count = 0;

  for (let idx = 0; idx < lines.length; idx++) {
    const trimmedLine = lines[idx].trim();
    if (trimmedLine.startsWith("## ")) {
      h2Count++;
      const raw = trimmedLine.replace(/^##\s+/, "").trim();
      const clean = raw.replace(/\*\*/g, "").replace(/\*/g, "").trim();
      const matchNum = clean.match(/^(\d+)[\.\:\-]\s*(.*)$/);
      const displayNumber = matchNum ? matchNum[1] : String(h2Count).padStart(2, "0");
      const cleanTitle = matchNum ? matchNum[2] : clean;
      tocItems.push({
        id: createAnchorId(cleanTitle, idx),
        rawText: raw,
        cleanTitle,
        level: 2,
        displayNumber,
        lineIndex: idx,
      });
    } else if (trimmedLine.startsWith("### ")) {
      const raw = trimmedLine.replace(/^###\s+/, "").trim();
      const clean = raw.replace(/\*\*/g, "").replace(/\*/g, "").trim();
      const matchNum = clean.match(/^(\d+(?:\.\d+)*)[\.\:\-]?\s*(.*)$/);
      const displayNumber = matchNum ? matchNum[1] : undefined;
      const cleanTitle = matchNum ? matchNum[2] : clean;
      tocItems.push({
        id: createAnchorId(cleanTitle, idx),
        rawText: raw,
        cleanTitle,
        level: 3,
        displayNumber,
        lineIndex: idx,
      });
    }
  }

  const renderedElements: React.ReactNode[] = [];
  let i = 0;
  let sectionIndex = 0;
  let hasRenderedToc = false;
  let hasSeenFirstH2 = false;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Dòng trống
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Phân cách ngang ---
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      renderedElements.push(
        <div key={`hr-${i}`} className="my-8 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="px-4 text-xs font-bold uppercase tracking-widest text-slate-300">
            Trường Hải Event
          </span>
          <div className="w-full border-t border-slate-200" />
        </div>
      );
      i++;
      continue;
    }

    // 3. Khối Schema.org JSON-LD Script
    if (trimmed.startsWith("<script") || trimmed.includes("application/ld+json")) {
      let scriptCode = "";
      while (i < lines.length) {
        scriptCode += lines[i] + "\n";
        if (lines[i].includes("</script>")) {
          i++;
          break;
        }
        i++;
      }
      const jsonMatch = scriptCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (jsonMatch && jsonMatch[1]) {
        renderedElements.push(
          <script
            key={`schema-script-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonMatch[1].trim() }}
          />
        );
      }
      continue;
    }

    // 4. Tiêu đề H1 (# ...)
    if (trimmed.startsWith("# ")) {
      const h1Text = trimmed.replace(/^#\s+/, "").trim();
      renderedElements.push(
        <div key={`h1-${i}`} className="mb-6 p-4 rounded-2xl bg-slate-50 border-l-4 border-[#0A1E5E]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
            Chủ đề chính
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1E5E] leading-snug">
            {h1Text}
          </h2>
        </div>
      );
      i++;
      continue;
    }

    // 5. Tiêu đề H2 (## ...) - Trước H2 đầu tiên, render Table of Contents (TOC)!
    if (trimmed.startsWith("## ")) {
      hasSeenFirstH2 = true;

      // Render TOC ngay trước thẻ H2 đầu tiên
      if (!hasRenderedToc && tocItems.length > 0) {
        renderedElements.push(
          <TableOfContents key="article-toc-component" items={tocItems} />
        );
        hasRenderedToc = true;
      }

      sectionIndex++;
      const currentToc = tocItems.find((t) => t.lineIndex === i && t.level === 2);
      const anchorId = currentToc ? currentToc.id : undefined;

      const h2Raw = trimmed.replace(/^##\s+/, "").trim();
      const matchNumber = h2Raw.match(/^(\d+)[\.\:\-]\s*(.*)$/);
      const displayTitle = matchNumber ? matchNumber[2] : h2Raw;
      const displayNumber = matchNumber ? matchNumber[1] : String(sectionIndex).padStart(2, "0");

      renderedElements.push(
        <div
          key={`h2-${i}`}
          id={anchorId}
          className="mt-10 mb-5 pt-4 border-t border-slate-100 first:mt-0 first:pt-0 scroll-mt-24"
        >
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 rounded-lg bg-[#0A1E5E] text-[#D4AF37] font-black text-xs tracking-wider shrink-0 shadow-sm">
              MỤC {displayNumber}
            </span>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-[#D4AF37]/50 via-slate-200 to-transparent" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0A1E5E] tracking-tight leading-snug">
            {displayTitle}
          </h2>
        </div>
      );
      i++;
      continue;
    }

    // 6. Tiêu đề H3 (### ...) - Mục nhỏ với Anchor ID
    if (trimmed.startsWith("### ")) {
      const currentToc = tocItems.find((t) => t.lineIndex === i && t.level === 3);
      const anchorId = currentToc ? currentToc.id : undefined;
      const h3Raw = trimmed.replace(/^###\s+/, "").trim();

      renderedElements.push(
        <div
          key={`h3-${i}`}
          id={anchorId}
          className="mt-6 mb-3 flex items-center space-x-2.5 scroll-mt-24"
        >
          <div className="w-2 h-5 rounded-full bg-[#D4AF37] shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-[#0A1E5E]">
            {renderInlineFormatting(h3Raw)}
          </h3>
        </div>
      );
      i++;
      continue;
    }

    // 7. Khối Trích dẫn / Call-out / Quick CTA Banner (> ...)
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s+/, "").trim();
      const lowerQuote = quoteText.toLowerCase();

      // a. Khối QUICK CONVERSION BANNER (Kêu gọi chuyển đổi nhanh)
      if (
        lowerQuote.includes("nhận tư vấn kịch bản & báo giá") ||
        lowerQuote.includes("sau 15 phút hoặc liên hệ hotline") ||
        lowerQuote.includes("sau 15 phút")
      ) {
        renderedElements.push(
          <div
            key={`quick-cta-${i}`}
            className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0A1E5E] via-[#0D246C] to-[#0A1E5E] text-white border-2 border-[#D4AF37]/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-[#D4AF37]/10 blur-xl pointer-events-none" />
            <div className="flex items-center space-x-3.5 relative z-10 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#0A1E5E] flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-wider border border-[#D4AF37]/30">
                    Phản hồi sau 15 phút
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                  Nhận tư vấn kịch bản & dự toán chi phí sự kiện chuẩn xác
                </p>
              </div>
            </div>
            <div className="relative z-10 w-full sm:w-auto shrink-0 flex items-center justify-end">
              <a
                href="tel:0844198333"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-[#0A1E5E] font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-105"
              >
                <Phone className="w-4 h-4 fill-[#0A1E5E]" />
                <span>Hotline 24/7: 0844 198 333</span>
              </a>
            </div>
          </div>
        );
        i++;
        continue;
      }

      // b. Khối INTERNAL CALL-OUT (Gợi ý xem thêm bài viết liên quan)
      if (lowerQuote.includes("xem chi tiết:")) {
        renderedElements.push(
          <div
            key={`callout-${i}`}
            className="my-5 p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-amber-50/40 border border-[#D4AF37]/50 shadow-2xs flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#0A1E5E] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] block sm:inline sm:mr-2">
                  Gợi ý đọc thêm:
                </span>
                {renderInlineFormatting(quoteText.replace(/^[💡📌⚡*]+\s*/, ""))}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#0A1E5E] group-hover:translate-x-1 transition-transform shrink-0 hidden sm:block" />
          </div>
        );
        i++;
        continue;
      }

      // c. Khối trích dẫn thường
      renderedElements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-5 p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-l-4 border-[#D4AF37] text-slate-800 text-xs sm:text-sm italic leading-relaxed"
        >
          {renderInlineFormatting(quoteText)}
        </blockquote>
      );
      i++;
      continue;
    }

    // 8. Bảng dữ liệu Markdown (| Cột 1 | Cột 2 | ...)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .slice(1, -1)
          .split("|")
          .map((c) => c.trim());
        const bodyRows = tableLines
          .slice(2)
          .map((row) =>
            row
              .slice(1, -1)
              .split("|")
              .map((c) => c.trim())
          );

        renderedElements.push(
          <div
            key={`table-${i}`}
            className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white"
          >
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0A1E5E] text-[#D4AF37] font-bold">
                <tr>
                  {headerRow.map((cell, cIdx) => (
                    <th
                      key={cIdx}
                      className="py-3 px-4 border-b border-white/10 uppercase tracking-wider text-[11px] sm:text-xs"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bodyRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={
                      rIdx % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/60 hover:bg-amber-50/40 transition-colors"
                    }
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="py-3 px-4 text-slate-700 leading-relaxed font-medium"
                      >
                        {renderInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 9. Danh sách đánh số (1. 2. 3. 4.) -> BIẾN THÀNH CÁC CARD ĐỘC LẬP
    const isNumberedList = /^\d+[\.\)]\s+/.test(trimmed);
    if (isNumberedList) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length && /^\d+[\.\)]\s+/.test(lines[i].trim())) {
        const itemLine = lines[i].trim();
        const numMatch = itemLine.match(/^(\d+)[\.\)]\s+(.*)$/);
        if (numMatch) {
          listItems.push({ num: numMatch[1], text: numMatch[2] });
        }
        i++;
      }

      renderedElements.push(
        <div key={`numbered-list-${i}`} className="my-5 grid grid-cols-1 gap-3.5">
          {listItems.map((item, idx) => {
            const boldMatch = item.text.match(/^\*\*([^*]+)\*\*[\:\-]?\s*(.*)$/);
            const cardTitle = boldMatch ? boldMatch[1] : null;
            const cardBody = boldMatch ? boldMatch[2] : item.text;

            return (
              <div
                key={idx}
                className="group p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/80 hover:border-[#D4AF37] hover:shadow-md transition-all flex items-start space-x-3.5"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0A1E5E] text-[#D4AF37] font-black text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5 group-hover:scale-105 transition-transform">
                  {item.num.padStart(2, "0")}
                </div>
                <div className="space-y-1 flex-1">
                  {cardTitle && (
                    <h4 className="font-bold text-sm sm:text-base text-[#0A1E5E] leading-snug">
                      {cardTitle}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {renderInlineFormatting(cardBody)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      );
      continue;
    }

    // 10. Danh sách gạch đầu dòng (- hoặc *)
    const isBulletList = /^[\-\*]\s+/.test(trimmed);
    if (isBulletList) {
      const bullets: string[] = [];
      while (i < lines.length && /^[\-\*]\s+/.test(lines[i].trim())) {
        bullets.push(lines[i].trim().replace(/^[\-\*]\s+/, ""));
        i++;
      }

      // Kiểm tra nếu danh sách này chứa thông tin liên hệ công ty
      if (isContactSection(bullets)) {
        renderedElements.push(
          <div
            key={`contact-box-${i}`}
            className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0A1E5E] to-[#06123B] text-white border-2 border-[#D4AF37]/60 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[#D4AF37]/10 blur-2xl pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex items-center space-x-2 text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Thông Tin Liên Hệ & Báo Giá Ưu Đãi
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm pt-2 text-slate-100">
                {bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start space-x-2.5">
                    <span className="text-[#D4AF37] font-bold text-sm shrink-0 mt-0.5">✦</span>
                    <span className="text-white/95 leading-relaxed font-normal">
                      {renderInlineFormatting(b, true)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="tel:0844198333"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-[#0A1E5E] font-black text-sm flex items-center justify-center space-x-2 shadow-lg transition-transform hover:scale-105"
                >
                  <Phone className="w-4 h-4 fill-[#0A1E5E]" />
                  <span>Gọi Hotline 24/7: 0844 198 333</span>
                </a>
                <Link
                  href="/ve-chung-toi"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center space-x-1.5 border border-white/20 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Hồ sơ năng lực & Kho thiết bị</span>
                </Link>
              </div>
            </div>
          </div>
        );
        continue;
      }

      renderedElements.push(
        <div key={`bullet-list-${i}`} className="my-4 space-y-2.5">
          {bullets.map((bText, bIdx) => (
            <div
              key={bIdx}
              className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed"
            >
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
              <div className="flex-1">{renderInlineFormatting(bText)}</div>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // 11. Đoạn SAPO (Nếu nằm trước H2 đầu tiên và in nghiêng *...*)
    if (
      !hasSeenFirstH2 &&
      (trimmed.startsWith("*") && trimmed.endsWith("*") && trimmed.length > 20)
    ) {
      const sapoText = trimmed.slice(1, -1).trim();
      renderedElements.push(
        <div
          key={`sapo-${i}`}
          className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/40 via-slate-50/80 to-white border-l-4 border-[#D4AF37] shadow-2xs"
        >
          <p className="text-sm sm:text-base text-slate-700 italic font-medium leading-relaxed sm:leading-loose">
            {renderInlineFormatting(sapoText)}
          </p>
        </div>
      );
      i++;
      continue;
    }

    // 12. Đoạn văn thường (Paragraph)
    renderedElements.push(
      <p
        key={`p-${i}`}
        className="my-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed sm:leading-loose"
      >
        {renderInlineFormatting(trimmed)}
      </p>
    );
    i++;
  }

  // Nếu bài viết không có H2 nào (hiếm), vẫn đảm bảo không lỗi
  return <div className={`space-y-1 ${className}`}>{renderedElements}</div>;
}
