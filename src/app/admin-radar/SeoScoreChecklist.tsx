"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  FileCheck,
  TrendingUp,
} from "lucide-react";

interface SeoScoreChecklistProps {
  title?: string;
  focusKeyword?: string;
  metaDescription?: string;
  slug?: string;
  content?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  passed: boolean;
  score: number;
  maxScore: number;
  recommendation?: string;
}

export default function SeoScoreChecklist({
  title = "",
  focusKeyword = "",
  metaDescription = "",
  slug = "",
  content = "",
}: SeoScoreChecklistProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Tính toán các chỉ số SEO thời gian thực
  const analysis = useMemo(() => {
    const rawContent = content || "";
    const cleanContent = rawContent.replace(/[#*`_~\[\]()|>-]/g, " ").trim();
    const words = cleanContent.length > 0 ? cleanContent.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));

    const keyword = (focusKeyword || "").trim().toLowerCase();
    const cleanContentLower = cleanContent.toLowerCase();

    // Đếm số lần từ khóa xuất hiện
    let keywordCount = 0;
    if (keyword.length > 1) {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      keywordCount = (cleanContentLower.match(regex) || []).length;
    }

    const keywordWords = keyword ? keyword.split(/\s+/).length : 1;
    const density = wordCount > 0 && keyword ? ((keywordCount * keywordWords) / wordCount) * 100 : 0;

    // Đếm số lượng headings
    const h2Matches = rawContent.match(/^##\s+.+$/gm) || [];
    const h3Matches = rawContent.match(/^###\s+.+$/gm) || [];

    // Kiểm tra từ khóa trong 150 từ đầu tiên
    const first150Words = words.slice(0, 150).join(" ").toLowerCase();
    const keywordInSapo = keyword ? first150Words.includes(keyword) : false;

    // Kiểm tra từ khóa trong Title & Meta
    const titleLower = (title || "").toLowerCase();
    const keywordInTitle = keyword ? titleLower.includes(keyword) : false;
    const metaLower = (metaDescription || "").toLowerCase();
    const keywordInMeta = keyword ? metaLower.includes(keyword) : false;

    // Kiểm tra từ khóa trong H2
    const keywordInH2 = keyword
      ? h2Matches.some((h) => h.toLowerCase().includes(keyword))
      : false;

    // Kiểm tra FAQ và Bảng biểu
    const hasFaq = rawContent.toLowerCase().includes("faq") || rawContent.toLowerCase().includes("câu hỏi thường gặp") || rawContent.includes("### ");
    const hasTable = rawContent.includes("|---") || rawContent.includes("| ---");

    // Xây dựng danh sách checklist
    const items: ChecklistItem[] = [
      {
        id: "title-keyword",
        label: "Từ khóa chính nằm trong Tiêu đề (H1)",
        detail: keywordInTitle ? `Đã có "${focusKeyword}" trong tiêu đề` : `Chưa tìm thấy từ khóa "${focusKeyword}" trong tiêu đề`,
        passed: keywordInTitle,
        score: keywordInTitle ? 15 : 0,
        maxScore: 15,
        recommendation: "Đưa từ khóa chính lên đầu tiêu đề để Google ưu tiên index.",
      },
      {
        id: "title-length",
        label: "Độ dài tiêu đề tối ưu (40 - 65 ký tự)",
        detail: `Độ dài hiện tại: ${title.length} ký tự`,
        passed: title.length >= 40 && title.length <= 65,
        score: title.length >= 40 && title.length <= 65 ? 10 : title.length >= 30 ? 6 : 2,
        maxScore: 10,
        recommendation: "Tiêu đề quá ngắn (<40) sẽ thiếu hấp dẫn, quá dài (>65) sẽ bị Google cắt bớt dấu ba chấm.",
      },
      {
        id: "sapo-keyword",
        label: "Từ khóa xuất hiện trong 150 từ đầu tiên (Sapo)",
        detail: keywordInSapo ? "Đã lồng ghép từ khóa vào đoạn mở đầu" : "Chưa có từ khóa chính trong 150 từ đầu",
        passed: keywordInSapo,
        score: keywordInSapo ? 15 : 0,
        maxScore: 15,
        recommendation: "Nhắc lại từ khóa chính ngay trong 2-3 câu mở đầu bài viết.",
      },
      {
        id: "meta-length",
        label: "Thẻ Meta Description chuẩn (120 - 165 ký tự)",
        detail: `Độ dài hiện tại: ${metaDescription.length} ký tự${keywordInMeta ? " (có chứa từ khóa)" : ""}`,
        passed: metaDescription.length >= 120 && metaDescription.length <= 165,
        score: metaDescription.length >= 120 && metaDescription.length <= 165 ? 10 : metaDescription.length >= 80 ? 6 : 2,
        maxScore: 10,
        recommendation: "Viết đoạn tóm tắt 120-165 ký tự kèm số hotline để tăng CTR khi lên trang nhất.",
      },
      {
        id: "heading-structure",
        label: "Cấu trúc Heading chuẩn (Tối thiểu 3 H2 & 2 H3)",
        detail: `Hiện có: ${h2Matches.length} thẻ H2, ${h3Matches.length} thẻ H3`,
        passed: h2Matches.length >= 3 && h3Matches.length >= 2,
        score: (h2Matches.length >= 3 ? 7 : 3) + (h3Matches.length >= 2 ? 3 : 1),
        maxScore: 10,
        recommendation: "Phân bổ cấu trúc bài bằng các thẻ H2 và H3 để người đọc dễ theo dõi.",
      },
      {
        id: "h2-keyword",
        label: "Từ khóa chính xuất hiện trong ít nhất 1 thẻ H2",
        detail: keywordInH2 ? "Đã có từ khóa trong ít nhất một tiêu đề H2" : "Chưa có thẻ H2 nào chứa từ khóa chính",
        passed: keywordInH2,
        score: keywordInH2 ? 10 : 0,
        maxScore: 10,
        recommendation: "Chèn từ khóa chính hoặc biến thể vào 1 thẻ H2 quan trọng.",
      },
      {
        id: "word-count",
        label: "Dung lượng bài viết chuyên sâu (>= 1.200 từ)",
        detail: `Hiện có: ${wordCount.toLocaleString("vi-VN")} từ (~${readingTimeMinutes} phút đọc)`,
        passed: wordCount >= 1200,
        score: wordCount >= 1500 ? 15 : wordCount >= 1200 ? 12 : wordCount >= 800 ? 8 : 4,
        maxScore: 15,
        recommendation: "Google ưu tiên bài viết dài trên 1.500 từ có chiều sâu chuyên môn (chuẩn E-E-A-T).",
      },
      {
        id: "keyword-density",
        label: "Mật độ từ khóa an toàn (1.0% - 2.5%)",
        detail: `Từ khóa xuất hiện ${keywordCount} lần (${density.toFixed(2)}%)`,
        passed: density >= 0.8 && density <= 2.8,
        score: density >= 0.8 && density <= 2.8 ? 10 : density > 2.8 ? 4 : 5,
        maxScore: 10,
        recommendation: density > 2.8 ? "Mật độ từ khóa quá cao, coi chừng bị Google phạt Spam Keyword!" : "Bổ sung thêm 2-3 lần nhắc từ khóa trong nội dung.",
      },
      {
        id: "rich-media-table",
        label: "Đa dạng hóa nội dung (Bảng báo giá & FAQ)",
        detail: `Bảng biểu: ${hasTable ? "Đã có" : "Chưa có"} | FAQ: ${hasFaq ? "Đã có" : "Chưa có"}`,
        passed: hasFaq || hasTable,
        score: (hasTable ? 3 : 0) + (hasFaq ? 2 : 0),
        maxScore: 5,
        recommendation: "Bổ sung bảng so sánh báo giá hoặc mục hỏi đáp FAQ để bài viết sinh động.",
      },
    ];

    const totalScore = Math.min(100, items.reduce((acc, it) => acc + it.score, 0));

    let scoreBadge = {
      label: "Cần tối ưu thêm",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      barColor: "bg-rose-500",
      grade: "C",
    };

    if (totalScore >= 85) {
      scoreBadge = {
        label: "Chuẩn SEO Xuất Sắc",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        barColor: "bg-gradient-to-r from-emerald-500 to-[#D4AF37]",
        grade: "A+",
      };
    } else if (totalScore >= 70) {
      scoreBadge = {
        label: "Đạt chuẩn SEO Khá",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        barColor: "bg-amber-500",
        grade: "B+",
      };
    }

    return {
      wordCount,
      readingTimeMinutes,
      keywordCount,
      density,
      items,
      totalScore,
      scoreBadge,
      passedCount: items.filter((i) => i.passed).length,
    };
  }, [title, focusKeyword, metaDescription, slug, content]);

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#0A1E5E] border border-[#D4AF37]/40 flex items-center justify-center shrink-0 shadow-md">
            <Award className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Thước Đo Chuẩn SEO On-Page Real-time
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${analysis.scoreBadge.color}`}>
                Hạng {analysis.scoreBadge.grade} • {analysis.scoreBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-light mt-0.5">
              Đạt {analysis.passedCount}/{analysis.items.length} tiêu chuẩn On-Page của Google Search Engine
            </p>
          </div>
        </div>

        {/* Điểm số & Toggle nút */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-white font-mono leading-none">
              <span className="text-[#D4AF37]">{analysis.totalScore}</span>
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <span className="text-[10px] text-slate-400">Điểm tối ưu</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 transition"
            title={isExpanded ? "Thu gọn danh sách" : "Mở rộng chi tiết"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Thanh tiến trình Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${analysis.scoreBadge.barColor}`}
            style={{ width: `${analysis.totalScore}%` }}
          />
        </div>

        {/* Các số liệu nhanh Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-[10px] text-slate-400">Dung lượng</span>
            <span className="text-xs font-bold text-white font-mono">
              {analysis.wordCount.toLocaleString("vi-VN")} từ
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-[10px] text-slate-400">Thời gian đọc</span>
            <span className="text-xs font-bold text-white font-mono">
              ~{analysis.readingTimeMinutes} phút
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-[10px] text-slate-400">Lặp từ khóa</span>
            <span className="text-xs font-bold text-amber-300 font-mono">
              {analysis.keywordCount} lần
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-[10px] text-slate-400">Mật độ từ khóa</span>
            <span className={`text-xs font-bold font-mono ${analysis.density > 2.8 ? "text-rose-400" : "text-emerald-400"}`}>
              {analysis.density.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chi tiết từng tiêu chí Checklist (Expandable) */}
      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-white/10 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {analysis.items.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl border transition-all ${
                  item.passed
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : "bg-rose-950/20 border-rose-500/30 text-rose-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold block text-white text-[11px]">
                        {item.label}
                      </span>
                      <p className="text-[10px] text-slate-300 mt-0.5">
                        {item.detail}
                      </p>
                      {!item.passed && item.recommendation && (
                        <p className="text-[10px] text-amber-300/90 font-light mt-1 italic">
                          💡 Gợi ý: {item.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold shrink-0 px-1.5 py-0.5 rounded bg-black/30">
                    +{item.score}/{item.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
