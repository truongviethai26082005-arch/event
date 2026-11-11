import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BASE_RADAR_PATH = path.join(process.cwd(), "src/app/api/radar");

// Danh sách từ và cụm từ cấm tuyệt đối theo Quy tắc V8, V9, V10 trong rules/voice.md
const FORBIDDEN_WORDS = [
  { word: "đẳng cấp", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "hàng đầu", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "số 1", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "top 1", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "uy tín nhất", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "chuyên nghiệp nhất", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "đột phá", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "bùng nổ", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "thăng hoa", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "đỉnh cao", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "hoàn hảo", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "tuyệt vời", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "siêu", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "khủng", rule: "V8 (Tính từ tự khen không có căn cứ)" },
  { word: "trong kỷ nguyên số", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "trong thời đại ngày nay", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "trong bối cảnh", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "không thể phủ nhận", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "bạn có biết", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "hãy cùng tìm hiểu", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "bài viết dưới đây sẽ", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "như chúng ta đã biết", rule: "V9 (Mở bài sáo rỗng)" },
  { word: "hy vọng bài viết đã mang lại", rule: "V10 (Kết bài sáo rỗng)" },
  { word: "hy vọng bài viết", rule: "V10 (Kết bài sáo rỗng)" },
  { word: "chúc bạn thành công", rule: "V10 (Kết bài sáo rỗng)" },
  { word: "100%", rule: "V12 (Cam kết tuyệt đối không căn cứ)" },
  { word: "rẻ nhất", rule: "V12 (Cam kết tuyệt đối không căn cứ)" },
];

function readRadarJson(relativePath: string) {
  try {
    const fullPath = path.join(BASE_RADAR_PATH, relativePath);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    }
  } catch (err) {
    console.error(`Error loading ${relativePath}:`, err);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content = "", title = "", keyword = "" } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Nội dung bài viết không được để trống" },
        { status: 400 }
      );
    }

    const lowerContent = content.toLowerCase();
    const lowerTitle = title.toLowerCase();
    const lowerKeyword = (keyword || "").toLowerCase().trim();

    const checkResults: {
      id: string;
      category: "structure" | "facts" | "voice" | "seo";
      name: string;
      status: "pass" | "warn" | "fail";
      scoreImpact: number;
      message: string;
      matches?: string[];
      suggestion?: string;
    }[] = [];

    let score = 100;

    // =========================================================================
    // 1. KIỂM TRA THẺ [CẦN SỐ LIỆU] (Q12 - SỰ THẬT & CON SỐ)
    // =========================================================================
    const missingDataRegex = /\[\[CẦN SỐ LIỆU:?\s*(.*?)\]\]|\[CẦN SỐ LIỆU:?\s*(.*?)\]/gi;
    const missingMatches = content.match(missingDataRegex) || [];

    if (missingMatches.length > 0) {
      score -= Math.min(25, missingMatches.length * 10);
      checkResults.push({
        id: "Q12_DATA",
        category: "facts",
        name: "Số liệu thực tế & Tránh bịa đặt",
        status: "fail",
        scoreImpact: -15,
        message: `Phát hiện ${missingMatches.length} vị trí còn gắn cờ [CẦN SỐ LIỆU] chưa được điền thông số thật.`,
        matches: missingMatches,
        suggestion: "Bấm 'Điền số thật' hoặc chỉnh sửa để thay thế bằng thông số thực tế của công ty trước khi xuất bản.",
      });
    } else {
      checkResults.push({
        id: "Q12_DATA",
        category: "facts",
        name: "Số liệu thực tế & Tránh bịa đặt",
        status: "pass",
        scoreImpact: 0,
        message: "Không còn vị trí [CẦN SỐ LIỆU] nào. Mọi số liệu trong bài đều đã được điền đầy đủ.",
      });
    }

    // =========================================================================
    // 2. QUÉT TỪ CẤM V8, V9, V10 (Q6 - GIỌNG VĂN THƯƠNG HIỆU)
    // =========================================================================
    const foundForbidden: { word: string; rule: string }[] = [];
    for (const item of FORBIDDEN_WORDS) {
      const regex = new RegExp(`\\b${item.word}\\b`, "i");
      if (regex.test(content) || regex.test(title)) {
        foundForbidden.push(item);
      }
    }

    if (foundForbidden.length > 0) {
      score -= Math.min(30, foundForbidden.length * 8);
      checkResults.push({
        id: "Q6_VOICE",
        category: "voice",
        name: "Từ ngữ sáo rỗng & Cấm tự khen",
        status: "fail",
        scoreImpact: -foundForbidden.length * 8,
        message: `Phát hiện ${foundForbidden.length} từ cấm vi phạm chính sách giọng văn Google Helpful Content.`,
        matches: foundForbidden.map((f) => `"${f.word}" (${f.rule})`),
        suggestion: "Thay thế các từ tự khen bằng số liệu thực tế (Ví dụ: thay 'dịch vụ đỉnh cao' bằng 'đội ngũ 10 kỹ thuật viên túc trực').",
      });
    } else {
      checkResults.push({
        id: "Q6_VOICE",
        category: "voice",
        name: "Từ ngữ sáo rỗng & Cấm tự khen",
        status: "pass",
        scoreImpact: 0,
        message: "Xuất sắc! Bài viết không chứa bất kỳ từ sáo rỗng nào trong danh sách đen V8, V9, V10.",
      });
    }

    // =========================================================================
    // 3. KIỂM TRA BỘ NÃO THƯƠNG HIỆU & KHÁCH HÀNG THẬT (Q12 - BRAND ASSETS)
    // =========================================================================
    const companyData = readRadarJson("brand/company.json");
    const projectsData = readRadarJson("brand/projects.json");

    const brandNamePresent =
      lowerContent.includes("trường hải") || lowerContent.includes("truong hai");
    const hotlinePresent =
      lowerContent.includes("0844 198 333") ||
      lowerContent.includes("0844198333") ||
      lowerContent.includes("096.386.1313") ||
      lowerContent.includes("0963861313") ||
      lowerContent.includes("hotline") ||
      lowerContent.includes("liên hệ");

    // Quét đối chiếu dự án thật trong projects.json
    const projectsList: any[] = projectsData?.projects || [];
    const matchedProjects = projectsList.filter((p) =>
      lowerContent.includes(p.name.toLowerCase()) || lowerContent.includes(p.client.toLowerCase())
    );

    if (!brandNamePresent) {
      score -= 10;
      checkResults.push({
        id: "Q12_BRAND",
        category: "facts",
        name: "Nhận diện thương hiệu Trường Hải Event",
        status: "fail",
        scoreImpact: -10,
        message: "Chưa thấy nhắc đến tên thương hiệu Trường Hải trong bài viết.",
        suggestion: "Bổ sung tên thương hiệu Trường Hải Event vào ít nhất 1-2 vị trí tự nhiên.",
      });
    } else {
      checkResults.push({
        id: "Q12_BRAND",
        category: "facts",
        name: "Nhận diện thương hiệu Trường Hải Event",
        status: "pass",
        scoreImpact: 0,
        message: `Đã có thương hiệu Trường Hải Event. ${
          matchedProjects.length > 0
            ? `Đối chiếu thấy nhắc đến dự án thật: ${matchedProjects.map((p) => p.name).slice(0, 2).join(", ")}.`
            : "Đã lồng ghép thông điệp công ty."
        }`,
      });
    }

    // =========================================================================
    // 4. KIỂM TRA TỪ KHÓA & CẤU TRÚC SEO (Q1, Q2, S1-S3)
    // =========================================================================
    const h1Matches = content.match(/^#\s+(.+)$/gm) || [];
    const h2Matches = content.match(/^##\s+(.+)$/gm) || [];
    const h3Matches = content.match(/^###\s+(.+)$/gm) || [];

    const hasKeywordInTitle = lowerKeyword ? lowerTitle.includes(lowerKeyword) : true;
    const hasKeywordInH2 = lowerKeyword
      ? h2Matches.some((h) => h.toLowerCase().includes(lowerKeyword))
      : true;

    if (lowerKeyword && !hasKeywordInTitle && !hasKeywordInH2) {
      score -= 10;
      checkResults.push({
        id: "Q1_SEO",
        category: "seo",
        name: "Từ khóa mục tiêu chuẩn SEO",
        status: "warn",
        scoreImpact: -10,
        message: `Từ khóa chính "${keyword}" chưa xuất hiện rõ ràng trong Tiêu đề hoặc thẻ H2.`,
        suggestion: `Đưa từ khóa "${keyword}" vào tiêu đề hoặc thẻ H2 đầu tiên của bài viết.`,
      });
    } else {
      checkResults.push({
        id: "Q1_SEO",
        category: "seo",
        name: "Từ khóa mục tiêu chuẩn SEO",
        status: "pass",
        scoreImpact: 0,
        message: `Từ khóa "${keyword || "chính"}" được phân bổ tự nhiên trong tiêu đề và cấu trúc bài.`,
      });
    }

    // =========================================================================
    // 5. KIỂM TRA CÂU HỎI THƯỜNG GẶP FAQ & LỜI KÊU GỌI (Q15, V16, V17)
    // =========================================================================
    const hasFaq =
      lowerContent.includes("câu hỏi thường gặp") ||
      lowerContent.includes("faq") ||
      lowerContent.includes("thắc mắc thường gặp") ||
      h3Matches.length >= 2;

    if (!hasFaq || !hotlinePresent) {
      score -= 8;
      checkResults.push({
        id: "Q15_FAQ",
        category: "structure",
        name: "FAQ Schema & Thông tin liên hệ",
        status: "warn",
        scoreImpact: -8,
        message: !hasFaq
          ? "Chưa có phần FAQ (Câu hỏi thường gặp) để Google hiển thị đoạn trích nổi bật (Rich Snippet)."
          : "Chưa có số hotline hoặc lời mời nhận báo giá ở cuối bài.",
        suggestion: "Bổ sung 2-3 câu hỏi thường gặp dạng H3 và số hotline tư vấn cuối bài.",
      });
    } else {
      checkResults.push({
        id: "Q15_FAQ",
        category: "structure",
        name: "FAQ Schema & Thông tin liên hệ",
        status: "pass",
        scoreImpact: 0,
        message: "Đã có đầy đủ cụm câu hỏi thường gặp (FAQ) và thông tin liên hệ rõ ràng.",
      });
    }

    // =========================================================================
    // 6. KIỂM TRA ĐỘ DÀI & ĐỘ SÂU BÀI VIẾT (Q5, S17)
    // =========================================================================
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 800) {
      score -= 10;
      checkResults.push({
        id: "Q5_LENGTH",
        category: "structure",
        name: "Độ dài & Chiều sâu nội dung",
        status: "warn",
        scoreImpact: -10,
        message: `Bài viết hiện có ~${wordCount} từ (hơi ngắn so với tiêu chuẩn ngành sự kiện từ 1,200 - 2,500 từ).`,
        suggestion: "Nên bổ sung thêm kịch bản chi tiết hoặc bảng thông số thiết bị để bài viết toàn diện hơn.",
      });
    } else {
      checkResults.push({
        id: "Q5_LENGTH",
        category: "structure",
        name: "Độ dài & Chiều sâu nội dung",
        status: "pass",
        scoreImpact: 0,
        message: `Độ dài lý tưởng: ~${wordCount} từ (~${content.length} ký tự). Đảm bảo chiều sâu cho bài viết.`,
      });
    }

    // Điểm số cuối cùng từ 0 đến 100
    const finalScore = Math.max(20, Math.min(100, score));
    const isOverallPass = finalScore >= 80 && missingMatches.length === 0 && foundForbidden.length === 0;

    return NextResponse.json({
      success: true,
      data: {
        score: finalScore,
        isOverallPass,
        wordCount,
        charCount: content.length,
        checks: checkResults,
        summary: {
          totalChecks: checkResults.length,
          passedChecks: checkResults.filter((c) => c.status === "pass").length,
          warnChecks: checkResults.filter((c) => c.status === "warn").length,
          failedChecks: checkResults.filter((c) => c.status === "fail").length,
          missingDataCount: missingMatches.length,
          forbiddenWordCount: foundForbidden.length,
        },
      },
    });
  } catch (error: any) {
    console.error("QA review error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Không thể thực hiện soát QA" },
      { status: 500 }
    );
  }
}

