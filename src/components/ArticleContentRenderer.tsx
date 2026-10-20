"use client";

import React from "react";
import Link from "next/link";
import { Phone, CheckCircle2, ShieldCheck, Sparkles, Building2, Calendar, FileText } from "lucide-react";

interface ArticleRendererProps {
  content: string;
  className?: string;
}

// Hàm format text inline: parse **bold**, *italic*, và gỡ bỏ các ký tự thừa
function renderInlineFormatting(text: string): React.ReactNode[] {
  // Thay thế icon thừa hoặc vụn vặt nếu có
  let cleanText = text
    .replace(/👉\s*/g, "")
    .replace(/⚠️\s*/g, "")
    .replace(/🎯\s*/g, "")
    .replace(/📌\s*/g, "")
    .replace(/✨\s*/g, "");

  // Tách text theo markdown **bold** và *italic*
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleanText.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-[#0A1E5E]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-slate-600">
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

export default function ArticleContentRenderer({ content, className = "" }: ArticleRendererProps) {
  if (!content || !content.trim()) {
    return <p className="text-slate-500 italic">Nội dung bài viết đang được cập nhật...</p>;
  }

  // Chia nội dung thành các dòng để phân tích cấu trúc
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let i = 0;
  let sectionIndex = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Dòng trống hoặc phân cách ---
    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      renderedElements.push(
        <div key={`hr-${i}`} className="my-8 flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <span className="px-4 text-xs font-bold uppercase tracking-widest text-slate-300">Trường Hải Event</span>
          <div className="w-full border-t border-slate-200" />
        </div>
      );
      i++;
      continue;
    }

    // 2. Tiêu đề H1 (# ...) - thường bỏ qua vì tiêu đề đã có ở Header trang, hoặc hiển thị trang trọng
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

    // 3. Tiêu đề H2 (## ...) - Phân đoạn mục lớn: hiển thị dạng Header sang trọng có số thứ tự
    if (trimmed.startsWith("## ")) {
      sectionIndex++;
      const h2Raw = trimmed.replace(/^##\s+/, "").trim();
      // Tách số thứ tự nếu có (VD: "1. Những lỗ hổng..." -> "Những lỗ hổng...")
      const matchNumber = h2Raw.match(/^(\d+)[\.\:\-]\s*(.*)$/);
      const displayTitle = matchNumber ? matchNumber[2] : h2Raw;
      const displayNumber = matchNumber ? matchNumber[1] : String(sectionIndex).padStart(2, "0");

      renderedElements.push(
        <div key={`h2-${i}`} className="mt-10 mb-5 pt-4 border-t border-slate-100 first:mt-0 first:pt-0">
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

    // 4. Tiêu đề H3 (### ...) - Mục nhỏ
    if (trimmed.startsWith("### ")) {
      const h3Raw = trimmed.replace(/^###\s+/, "").trim();
      renderedElements.push(
        <div key={`h3-${i}`} className="mt-6 mb-3 flex items-center space-x-2.5">
          <div className="w-2 h-5 rounded-full bg-[#D4AF37] shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-[#0A1E5E]">
            {renderInlineFormatting(h3Raw)}
          </h3>
        </div>
      );
      i++;
      continue;
    }

    // 5. Bảng dữ liệu Markdown (| Cột 1 | Cột 2 | ...)
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // Tách header, separator, body
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
          <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0A1E5E] text-[#D4AF37] font-bold">
                <tr>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="py-3 px-4 border-b border-white/10 uppercase tracking-wider text-[11px] sm:text-xs">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60 hover:bg-amber-50/40 transition-colors"}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 text-slate-700 leading-relaxed font-medium">
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

    // 6. Danh sách đánh số (1. 2. 3. 4.) -> BIẾN THÀNH CÁC CARD ĐỘC LẬP THOÁNG ĐÃNG
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
            // Tách phần tiêu đề in đậm nếu có (VD: "**Chi phí bị đội lên:** Do...")
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

    // 7. Danh sách gạch đầu dòng (- hoặc *)
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2 text-slate-200">
                {bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start space-x-2">
                    <span className="text-[#D4AF37] font-bold shrink-0">✦</span>
                    <span>{renderInlineFormatting(b)}</span>
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
            <div key={bIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
              <div className="flex-1">{renderInlineFormatting(bText)}</div>
            </div>
          ))}
        </div>
      );
      continue;
    }

    // 8. Khối trích dẫn (> ...)
    if (trimmed.startsWith("> ")) {
      const quoteText = trimmed.replace(/^>\s+/, "").trim();
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

    // 9. Đoạn văn thường (Paragraph)
    renderedElements.push(
      <p key={`p-${i}`} className="my-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed sm:leading-loose">
        {renderInlineFormatting(trimmed)}
      </p>
    );
    i++;
  }

  return <div className={`space-y-1 ${className}`}>{renderedElements}</div>;
}
