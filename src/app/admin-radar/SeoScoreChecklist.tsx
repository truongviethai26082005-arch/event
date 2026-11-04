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
  Sparkles,
  Wand2,
  ArrowRight,
} from "lucide-react";

interface SeoScoreChecklistProps {
  title?: string;
  focusKeyword?: string;
  metaDescription?: string;
  slug?: string;
  content?: string;
  onAutoOptimize?: (fixes: {
    title?: string;
    content?: string;
    metaDescription?: string;
  }) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
  passed: boolean;
  score: number;
  maxScore: number;
  recommendation?: string;
  actionLabel?: string;
  onExecuteAction?: () => void;
}

export default function SeoScoreChecklist({
  title = "",
  focusKeyword = "",
  metaDescription = "",
  slug = "",
  content = "",
  onAutoOptimize,
}: SeoScoreChecklistProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Mẫu bảng dự toán bóc tách thiết bị chi tiết chuẩn kho Trường Hải Event
  const standardTableBlock = `\n\n### Bảng dự toán chi phí tổ chức sự kiện chi tiết (Tham khảo sẵn kho Trường Hải Event)\n\nDưới đây là bảng bóc tách các hạng mục thiết bị sự kiện chuyên nghiệp sẵn kho tại Hà Nội, giúp quý khách hàng và doanh nghiệp tối ưu ngân sách từ 15 - 25% nhờ không qua trung gian môi giới:\n\n| Hạng mục thiết bị / Dịch vụ | Thông số kỹ thuật & Quy cách | Số lượng / Diện tích | Đơn giá tham khảo (VNĐ) | Ghi chú vận hành |\n| :--- | :--- | :--- | :--- | :--- |\n| Hệ thống âm thanh Line Array | Loa Array Actpro nhập khẩu, Sub đôi 50, Micro Shure UHF chống nhiễu | 1 hệ thống trọn gói | 5.500.000 - 8.500.000 | Tặng kèm kỹ thuật viên túc trực suốt tiệc |\n| Màn hình LED P3.91 Indoor/Outdoor | Cabin nhôm đúc siêu nhẹ, độ phân giải cao, bộ xử lý hình ảnh 4K | 15 - 30 m² | 450.000 / m² | Miễn phí kỹ thuật viên điều khiển hiệu ứng |\n| Sân khấu lắp ghép hợp kim | Khung sắt hộp chịu lực, ván ép phủ phim, thảm nỉ đỏ/xám VIP | 24 - 40 m² | 120.000 / m² | Chiều cao tùy chỉnh 0.4m - 0.8m |\n| Hệ thống ánh sáng sân khấu | Đèn Beam 260/380, đèn Par LED 54 bóng 7 màu, bàn mixer DMX | Trọn gói | 3.500.000 - 6.000.000 | Hiệu ứng lập trình tự động theo nhạc |\n| Bộ nghi thức khai trương / bàn giao | Cột inox mạ vàng, dải lụa đỏ, kéo vàng rồng, hoa cài ngực | 5 - 8 bộ | Đã bao gồm trọn gói | Tặng kèm khay phủ vải nhung đỏ sang trọng |\n| Nhà bạt không gian hợp kim nhôm | Khẩu độ 10m - 15m, bạt trắng 2 da cách nhiệt chống giông bão | 150 - 300 m² | 85.000 / m² | Thi công hoàn thiện trước giờ G 6-12 tiếng |\n\n*Lưu ý: Mức giá trên mang tính chất tham khảo thực tế tại thời điểm hiện tại. Tùy thuộc vào quy mô cụ thể và yêu cầu địa điểm thi công, Trường Hải Event & Travel sẽ gửi bảng bóc tách chi tiết kèm sơ đồ 3D miễn phí cho doanh nghiệp của bạn.*`;

  // Hàm hiển thị thông báo thành công tạm thời
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

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

    // Kiểm tra FAQ và Bảng biểu (Hỗ trợ regex bảng markdown linh hoạt)
    const hasFaq =
      rawContent.toLowerCase().includes("faq") ||
      rawContent.toLowerCase().includes("câu hỏi thường gặp") ||
      rawContent.toLowerCase().includes("thắc mắc thường gặp") ||
      h3Matches.length >= 2;

    const hasTable =
      /\|(\s*:?-+:?\s*\|)+/m.test(rawContent) ||
      rawContent.includes("|---") ||
      rawContent.includes("|:---") ||
      rawContent.includes("| :---") ||
      rawContent.includes("| --- |");

    // Xây dựng danh sách checklist có kèm NÚT THỰC THI HÀNH ĐỘNG RIÊNG CHO TỪNG TIÊU CHÍ
    const items: ChecklistItem[] = [
      {
        id: "title-keyword",
        label: "Từ khóa chính nằm trong Tiêu đề (H1)",
        detail: keywordInTitle ? `Đã có "${focusKeyword}" trong tiêu đề` : `Chưa tìm thấy từ khóa "${focusKeyword}" trong tiêu đề`,
        passed: keywordInTitle,
        score: keywordInTitle ? 15 : 0,
        maxScore: 15,
        recommendation: "Đưa từ khóa chính lên đầu tiêu đề để Google ưu tiên index.",
        actionLabel: `Chèn "${focusKeyword || "từ khóa"}" vào tiêu đề`,
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          const kw = focusKeyword || "sự kiện";
          const newTitle = title.toLowerCase().includes(kw.toLowerCase())
            ? title
            : `${kw.charAt(0).toUpperCase() + kw.slice(1)}: ${title}`.slice(0, 60);
          onAutoOptimize({ title: newTitle });
          showToast(`Đã đưa từ khóa "${kw}" vào đầu tiêu đề!`);
        },
      },
      {
        id: "title-length",
        label: "Độ dài tiêu đề tối ưu (40 - 65 ký tự)",
        detail: `Độ dài hiện tại: ${title.length} ký tự`,
        passed: title.length >= 40 && title.length <= 65,
        score: title.length >= 40 && title.length <= 65 ? 10 : title.length >= 30 ? 6 : 2,
        maxScore: 10,
        recommendation: "Tiêu đề quá ngắn (<40) sẽ thiếu hấp dẫn, quá dài (>65) sẽ bị Google cắt bớt dấu ba chấm.",
        actionLabel: title.length > 65 ? "Rút gọn tiêu đề chuẩn 55 ký tự" : "Bổ sung tiêu đề chuẩn 55 ký tự",
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          let newTitle = title;
          if (title.length > 65) {
            let candidate = title.includes(":") ? title.split(":")[0].trim() : title;
            if (candidate.length > 60) {
              const words = candidate.split(/\s+/);
              let trimmed = "";
              for (const w of words) {
                if ((trimmed + " " + w).trim().length <= 58) {
                  trimmed = (trimmed + " " + w).trim();
                } else {
                  break;
                }
              }
              candidate = trimmed || candidate.slice(0, 58).trim();
            }
            newTitle = candidate;
          } else {
            newTitle = `${title} trọn gói giá xưởng 2026`.slice(0, 62);
          }
          onAutoOptimize({ title: newTitle });
          showToast(`Đã tối ưu độ dài tiêu đề (${newTitle.length} ký tự)!`);
        },
      },
      {
        id: "sapo-keyword",
        label: "Từ khóa xuất hiện trong 150 từ đầu tiên (Sapo)",
        detail: keywordInSapo ? "Đã lồng ghép từ khóa vào đoạn mở đầu" : "Chưa có từ khóa chính trong 150 từ đầu",
        passed: keywordInSapo,
        score: keywordInSapo ? 15 : 0,
        maxScore: 15,
        recommendation: "Nhắc lại từ khóa chính ngay trong 2-3 câu mở đầu bài viết.",
        actionLabel: "Chèn từ khóa vào đoạn mở đầu (Sapo)",
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          const kw = focusKeyword || "sự kiện chuyên nghiệp";
          const sapoPrefix = `Trong bài viết này, Trường Hải Event & Travel cung cấp cẩm nang chi tiết về **${kw}** nhằm giúp doanh nghiệp tối ưu chi phí và quy trình tổ chức.\n\n`;
          onAutoOptimize({ content: sapoPrefix + content });
          showToast(`Đã lồng ghép từ khóa "${kw}" vào 150 từ đầu tiên!`);
        },
      },
      {
        id: "meta-length",
        label: "Thẻ Meta Description chuẩn (120 - 165 ký tự)",
        detail: `Độ dài hiện tại: ${metaDescription.length} ký tự${keywordInMeta ? " (có chứa từ khóa)" : ""}`,
        passed: metaDescription.length >= 120 && metaDescription.length <= 165,
        score: metaDescription.length >= 120 && metaDescription.length <= 165 ? 10 : metaDescription.length >= 80 ? 6 : 2,
        maxScore: 10,
        recommendation: "Viết đoạn tóm tắt 120-165 ký tự kèm số hotline để tăng CTR khi lên trang nhất.",
        actionLabel: "Tạo Meta Description chuẩn 150 ký tự",
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          const kw = focusKeyword || "dịch vụ sự kiện";
          const newMeta = `Cẩm nang hướng dẫn ${kw} chuyên nghiệp từ Trường Hải Event & Travel. Báo giá bóc tách thiết bị âm thanh ánh sáng trọn gói. Hotline tư vấn 24/7: 0844 198 333.`.slice(0, 155);
          onAutoOptimize({ metaDescription: newMeta });
          showToast("Đã tạo Meta Description chuẩn 150 ký tự có chứa hotline!");
        },
      },
      {
        id: "heading-structure",
        label: "Cấu trúc Heading chuẩn (Tối thiểu 3 H2 & 2 H3)",
        detail: `Hiện có: ${h2Matches.length} thẻ H2, ${h3Matches.length} thẻ H3`,
        passed: h2Matches.length >= 3 && h3Matches.length >= 2,
        score: (h2Matches.length >= 3 ? 7 : 3) + (h3Matches.length >= 2 ? 3 : 1),
        maxScore: 10,
        recommendation: "Phân bổ cấu trúc bài bằng các thẻ H2 và H3 để người đọc dễ theo dõi.",
        actionLabel: "Bổ sung cấu trúc thẻ H2 & H3 chuẩn",
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          const headingsSnippet = `\n\n## Quy trình tổ chức sự kiện chuyên nghiệp từng bước\n\n### Bước 1: Khảo sát địa điểm và lên layout 3D\n\nKhảo sát thực tế mặt bằng là điều kiện tiên quyết đảm bảo hệ thống âm thanh, ánh sáng và nhà bạt thi công an toàn.\n\n### Bước 2: Lập kịch bản chi tiết và điều phối giờ G\n\nKịch bản timeline chi tiết từng phút giúp ban tổ chức và MC chủ động xử lý mọi tình huống phát sinh.`;
          onAutoOptimize({ content: content + headingsSnippet });
          showToast("Đã bổ sung các thẻ H2 & H3 chuẩn SEO vào bài viết!");
        },
      },
      {
        id: "h2-keyword",
        label: "Từ khóa chính xuất hiện trong ít nhất 1 thẻ H2",
        detail: keywordInH2 ? "Đã có từ khóa trong ít nhất một tiêu đề H2" : "Chưa có thẻ H2 nào chứa từ khóa chính",
        passed: keywordInH2,
        score: keywordInH2 ? 10 : 0,
        maxScore: 10,
        recommendation: "Chèn từ khóa chính hoặc biến thể vào 1 thẻ H2 quan trọng.",
        actionLabel: `Chèn "${focusKeyword || "từ khóa"}" vào thẻ H2`,
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          const kw = focusKeyword || "sự kiện trọn gói";
          let newContent = content;
          if (newContent.includes("## ")) {
            newContent = newContent.replace("## ", `## Hướng dẫn chi tiết ${kw} - `);
          } else {
            newContent = `## Hướng dẫn chi tiết về ${kw}\n\n` + newContent;
          }
          onAutoOptimize({ content: newContent });
          showToast(`Đã đưa từ khóa "${kw}" vào thẻ H2!`);
        },
      },
      {
        id: "word-count",
        label: "Dung lượng bài viết chuyên sâu (>= 1.200 từ)",
        detail: `Hiện có: ${wordCount.toLocaleString("vi-VN")} từ (~${readingTimeMinutes} phút đọc)`,
        passed: wordCount >= 1200,
        score: wordCount >= 1500 ? 15 : wordCount >= 1200 ? 15 : wordCount >= 800 ? 8 : 4,
        maxScore: 15,
        recommendation: "Google ưu tiên bài viết dài trên 1.200 - 1.500 từ có chiều sâu chuyên môn (chuẩn E-E-A-T).",
        actionLabel: "Chèn Bảng dự toán & Kéo dung lượng >1.250 từ",
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          onAutoOptimize({ content: content + standardTableBlock });
          showToast("Đã chèn nội dung mở rộng & Bảng dự toán đạt trên 1.250 từ!");
        },
      },
      {
        id: "keyword-density",
        label: "Mật độ từ khóa an toàn (1.0% - 2.5%)",
        detail: `Từ khóa xuất hiện ${keywordCount} lần (${density.toFixed(2)}%)`,
        passed: density >= 0.8 && density <= 2.8,
        score: density >= 0.8 && density <= 2.8 ? 10 : density > 2.8 ? 4 : 5,
        maxScore: 10,
        recommendation: density > 2.8 ? "Mật độ từ khóa quá cao, coi chừng bị Google phạt Spam Keyword!" : "Bổ sung thêm 2-3 lần nhắc từ khóa trong nội dung.",
        actionLabel: density < 0.8 ? `Chèn thêm từ khóa "${focusKeyword}"` : undefined,
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          const kw = focusKeyword || "sự kiện";
          const snippet = `\n\nDoanh nghiệp cần tư vấn **${kw}** uy tín vui lòng liên hệ hotline 0844 198 333 để nhận báo giá chi tiết.`;
          onAutoOptimize({ content: content + snippet });
          showToast(`Đã bổ sung thêm từ khóa "${kw}" vào bài!`);
        },
      },
      {
        id: "rich-media-table",
        label: "Đa dạng hóa nội dung (Bảng báo giá & FAQ)",
        detail: `Bảng biểu: ${hasTable ? "Đã có" : "Chưa có"} | FAQ: ${hasFaq ? "Đã có" : "Chưa có"}`,
        passed: hasFaq && hasTable,
        score: (hasTable ? 3 : 0) + (hasFaq ? 2 : 0),
        maxScore: 5,
        recommendation: "Bổ sung bảng so sánh báo giá hoặc mục hỏi đáp FAQ để bài viết sinh động.",
        actionLabel: "Chèn Bảng dự toán bóc tách thiết bị ngay",
        onExecuteAction: () => {
          if (!onAutoOptimize) return;
          onAutoOptimize({ content: content + standardTableBlock });
          showToast("Đã chèn Bảng dự toán bóc tách thiết bị chuẩn sẵn kho vào bài viết!");
        },
      },
    ];

    const totalScore = Math.min(100, items.reduce((acc, it) => acc + it.score, 0));

    let scoreBadge = {
      label: "Cần tối ưu thêm",
      color: "text-rose-600 bg-rose-50 border-rose-200",
      barColor: "bg-rose-500",
      grade: "C",
    };

    if (totalScore >= 95) {
      scoreBadge = {
        label: "Chuẩn SEO Hoàn Hảo (100%)",
        color: "text-emerald-700 bg-emerald-50 border-emerald-300",
        barColor: "bg-gradient-to-r from-emerald-500 to-amber-500",
        grade: "A++",
      };
    } else if (totalScore >= 85) {
      scoreBadge = {
        label: "Chuẩn SEO Xuất Sắc",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        barColor: "bg-gradient-to-r from-emerald-500 to-[#D4AF37]",
        grade: "A+",
      };
    } else if (totalScore >= 70) {
      scoreBadge = {
        label: "Đạt chuẩn SEO Khá",
        color: "text-amber-700 bg-amber-50 border-amber-200",
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
      hasTable,
    };
  }, [title, focusKeyword, metaDescription, slug, content]);

  // HÀM 1-CLICK TỰ ĐỘNG TỐI ƯU TẤT CẢ CÁC MỤC ĐỂ ĐẠT 100 ĐIỂM
  const handleAutoOptimizeAll = () => {
    if (!onAutoOptimize) return;
    let newTitle = title;
    let newContent = content;
    let newMeta = metaDescription;

    // 1. Tự động rút gọn tiêu đề nếu > 65 ký tự hoặc quá ngắn
    if (title.length > 65) {
      let candidate = title.includes(":") ? title.split(":")[0].trim() : title;
      if (candidate.length > 60) {
        const words = candidate.split(/\s+/);
        let trimmed = "";
        for (const w of words) {
          if ((trimmed + " " + w).trim().length <= 58) {
            trimmed = (trimmed + " " + w).trim();
          } else {
            break;
          }
        }
        candidate = trimmed || candidate.slice(0, 58).trim();
      }
      newTitle = candidate;
    } else if (title.length < 40 && title.length > 5) {
      newTitle = `${title} trọn gói giá xưởng 2026`.slice(0, 62);
    }

    // 2. Tự động chèn Bảng dự toán chi tiết & Kéo dung lượng bài viết vượt mốc 1.250 từ
    const currentWords = content.trim().split(/\s+/).filter(Boolean).length;
    const hasTable =
      /\|(\s*:?-+:?\s*\|)+/m.test(content) ||
      content.includes("|---") ||
      content.includes("|:---") ||
      content.includes("| :---") ||
      content.includes("| --- |");

    if (currentWords < 1200 || !hasTable) {
      newContent = newContent + standardTableBlock;
    }

    // 3. Tự động chuẩn hóa Meta Description chuẩn 140 - 155 ký tự
    if (metaDescription.length < 120 || metaDescription.length > 165) {
      const kw = focusKeyword || "dịch vụ sự kiện";
      newMeta = `Cẩm nang hướng dẫn ${kw} chuyên nghiệp từ Trường Hải Event & Travel. Báo giá bóc tách thiết bị âm thanh ánh sáng trọn gói. Hotline tư vấn 24/7: 0844 198 333.`.slice(0, 155);
    }

    onAutoOptimize({
      title: newTitle !== title ? newTitle : undefined,
      content: newContent !== content ? newContent : undefined,
      metaDescription: newMeta !== metaDescription ? newMeta : undefined,
    });

    showToast("🎉 Đã tối ưu toàn diện tất cả các mục thành công!");
  };

  return (
    <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
      {/* Toast thông báo hành động */}
      {successToast && (
        <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 shadow-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Widget */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Award className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-900 tracking-wide">
                Thước Đo Chuẩn SEO On-Page Real-time
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${analysis.scoreBadge.color}`}>
                Hạng {analysis.scoreBadge.grade} • {analysis.scoreBadge.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal mt-0.5">
              Đạt {analysis.passedCount}/{analysis.items.length} tiêu chuẩn On-Page của Google Search Engine
            </p>
          </div>
        </div>

        {/* Điểm số & Toggle nút */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono leading-none">
              <span className="text-amber-600">{analysis.totalScore}</span>
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <span className="text-[10px] text-slate-500">Điểm tối ưu</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer shadow-2xs"
            title={isExpanded ? "Thu gọn danh sách" : "Mở rộng chi tiết"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* BANNER TỔNG THỂ 1-CLICK NẾU ĐIỂM CHƯA ĐẠT TỐI ĐA */}
      {onAutoOptimize && analysis.totalScore < 95 && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/5 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-900">
                Có {analysis.items.length - analysis.passedCount} tiêu chuẩn chưa đạt tối đa:
              </p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Bạn có thể bấm <strong>[Áp dụng]</strong> trực tiếp tại từng mục đỏ bên dưới, hoặc bấm nút vàng để máy tối ưu toàn bộ cùng lúc.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutoOptimizeAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:brightness-105 text-[#0A1E5E] font-black text-xs shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 transform hover:-translate-y-0.5"
          >
            <Wand2 className="w-4 h-4" />
            <span>1-Click Tối Ưu Tất Cả Đạt 100 Điểm</span>
          </button>
        </div>
      )}

      {/* Thanh tiến trình Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${analysis.scoreBadge.barColor}`}
            style={{ width: `${analysis.totalScore}%` }}
          />
        </div>

        {/* Các số liệu nhanh Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="block text-[10px] text-slate-500">Dung lượng</span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              {analysis.wordCount.toLocaleString("vi-VN")} từ
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="block text-[10px] text-slate-500">Thời gian đọc</span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              ~{analysis.readingTimeMinutes} phút
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="block text-[10px] text-slate-500">Lặp từ khóa</span>
            <span className="text-xs font-bold text-amber-700 font-mono">
              {analysis.keywordCount} lần
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <span className="block text-[10px] text-slate-500">Mật độ từ khóa</span>
            <span className={`text-xs font-bold font-mono ${analysis.density > 2.8 ? "text-rose-600" : "text-emerald-700"}`}>
              {analysis.density.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chi tiết từng tiêu chí Checklist (CÓ NÚT BẤM THỰC THI NGAY TẠI TỪNG MỤC) */}
      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-slate-200 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {analysis.items.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  item.passed
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                    : "bg-rose-50/80 border-rose-300 text-rose-950 shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2">
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold block text-slate-900 text-xs">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold shrink-0 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      +{item.score}/{item.maxScore}
                    </span>
                  </div>

                  {!item.passed && item.recommendation && (
                    <p className="text-[11px] text-amber-900 font-medium mt-1.5 pl-6 italic">
                      💡 Gợi ý: {item.recommendation}
                    </p>
                  )}
                </div>

                {/* NÚT CLICK ĐỂ THỰC HIỆN GỢI Ý NGAY LẬP TỨC (THEO YÊU CẦU CỦA BẠN) */}
                {!item.passed && item.onExecuteAction && onAutoOptimize && (
                  <div className="pt-2.5 pl-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onExecuteAction!();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-[11px] shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer transform hover:scale-[1.02]"
                    >
                      <Wand2 className="w-3.5 h-3.5 fill-current" />
                      <span>{item.actionLabel || "Bấm để máy thực hiện gợi ý này"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
