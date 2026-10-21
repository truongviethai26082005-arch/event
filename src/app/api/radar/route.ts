import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * =========================================================================
 * KHU VỰC DÀNH CHO BACKEND RADAR SEO: src/app/api/radar/route.ts
 * Nâng cấp: Tích hợp Ma Trận Phân Tích Lỗ Hổng Thị Trường Đối Thủ
 *           và Đối Soát Với Vũ Khí Cốt Lõi Của Trường Hải Event & Travel.
 * =========================================================================
 */

interface MarketGapAnalysis {
  gapName: string;
  competitorWeakness: string;
  customerPainPoint: string;
  truongHaiAdvantage: string;
  seoActionableFix: string;
}

interface CompetitorAnalysis {
  h1: string;
  headings: string[];
  targetKeywords: string[];
  weaknesses: string[];
  marketGaps?: MarketGapAnalysis[];
  wordCountEstimate: number;
  seoScore: number;
}

interface GeneratedPost {
  title: string;
  slug: string;
  meta_description: string;
  focus_keyword: string;
  content: string;
}

// DANH MỤC DANH TỪ RIÊNG & TỪ VIẾT TẮT ĐƯỢC GIỮ NGUYÊN VIẾT HOA
const PROPER_NOUN_PATTERNS: { match: RegExp; replace: string }[] = [
  { match: /\btrường hải event & travel\b/gi, replace: "Trường Hải Event & Travel" },
  { match: /\btrường hải event\b/gi, replace: "Trường Hải Event" },
  { match: /\btrường hải\b/gi, replace: "Trường Hải" },
  { match: /\bhà nội\b/gi, replace: "Hà Nội" },
  { match: /\bhải phòng\b/gi, replace: "Hải Phòng" },
  { match: /\bthái bình\b/gi, replace: "Thái Bình" },
  { match: /\bquảng nam\b/gi, replace: "Quảng Nam" },
  { match: /\bđà nẵng\b/gi, replace: "Đà Nẵng" },
  { match: /\btp\.hcm\b/gi, replace: "TP.HCM" },
  { match: /\btp hồ chí minh\b/gi, replace: "TP Hồ Chí Minh" },
  { match: /\bviệt nam\b/gi, replace: "Việt Nam" },
  { match: /\bbộ gtvt\b/gi, replace: "Bộ GTVT" },
  { match: /\bcầu thăng long\b/gi, replace: "cầu Thăng Long" },
  { match: /\bvinpearl nam hội an\b/gi, replace: "Vinpearl Nam Hội An" },
  { match: /\bvinpearl\b/gi, replace: "Vinpearl" },
  { match: /\bnhà máy eiffel\b/gi, replace: "nhà máy Eiffel" },
  { match: /\bdamsan\b/gi, replace: "Damsan" },
  { match: /\blocknlock\b/gi, replace: "LocknLock" },
  { match: /\bvietcombank\b/gi, replace: "Vietcombank" },
  { match: /\bvpbank\b/gi, replace: "VPBank" },
  { match: /\bncb\b/gi, replace: "NCB" },
  { match: /\bđh bách khoa\b/gi, replace: "ĐH Bách Khoa" },
  { match: /\bđại học bách khoa\b/gi, replace: "Đại học Bách Khoa" },
  { match: /\bneu\b/gi, replace: "NEU" },
  { match: /\bline array\b/gi, replace: "Line Array" },
  { match: /\bled p2\.5\b/gi, replace: "LED P2.5" },
  { match: /\bled p3\.91\b/gi, replace: "LED P3.91" },
  { match: /\bled 3d\b/gi, replace: "LED 3D" },
  { match: /\bmàn led\b/gi, replace: "màn LED" },
  { match: /\bmàn hình led\b/gi, replace: "màn hình LED" },
  { match: /\bled\b/gi, replace: "LED" },
  { match: /\bmoving beam\b/gi, replace: "Moving Beam" },
  { match: /\bvat\b/gi, replace: "VAT" },
  { match: /\by\.e\.p\b/gi, replace: "Y.E.P" },
  { match: /\byep\b/gi, replace: "YEP" },
  { match: /\ba-z\b/gi, replace: "A-Z" },
  { match: /\bgatsby\b/gi, replace: "Gatsby" },
  { match: /\boscar\b/gi, replace: "Oscar" },
  { match: /\byear end party\b/gi, replace: "Year End Party" },
  { match: /\bgala dinner\b/gi, replace: "Gala Dinner" },
  { match: /\bteam building\b/gi, replace: "Team Building" },
  { match: /\btết\b/gi, replace: "Tết" },
  { match: /\bjina reader\b/gi, replace: "Jina Reader" },
  { match: /\bjina\b/gi, replace: "Jina" },
];

// Hàm chuyển đổi sang Sentence Case: chỉ viết hoa chữ cái đầu và giữ nguyên danh từ riêng
export function toSentenceCase(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  let lower = trimmed.toLowerCase();
  let result = lower.charAt(0).toUpperCase() + lower.slice(1);
  for (const { match, replace } of PROPER_NOUN_PATTERNS) {
    result = result.replace(match, replace);
  }
  return result;
}

// Hàm chuẩn hóa heading sang Sentence Case (bảo lưu tiền tố H1:, H2:, ##, ###, số thứ tự 1., 2.1.)
export function formatHeadingSentenceCase(heading: string): string {
  if (!heading) return "";
  const prefixMatch = heading.match(/^(\s*(?:#+\s*(?:\d+(?:\.\d+)*\.?\s*)?|H[1-6]:\s*|\d+(?:\.\d+)*\.?\s*|-\s*|🎯\s*|⚠️\s*)?)(.*)$/iu);
  if (!prefixMatch) return toSentenceCase(heading);
  const prefix = prefixMatch[1] || "";
  const body = prefixMatch[2] || "";
  if (!body) return heading;
  return prefix + toSentenceCase(body);
}

// Hàm duyệt toàn bộ bài viết Markdown và chuyển mọi heading sang Sentence Case
export function cleanMarkdownHeadings(content: string): string {
  return content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("#")) {
        return formatHeadingSentenceCase(line);
      }
      return line;
    })
    .join("\n");
}

// Hàm làm sạch chuỗi slug tiếng Việt không dấu chuẩn SEO
function createSeoSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

// BỘ ĐỐI SOÁT CHIẾN LƯỢC: LỖ HỔNG THỊ TRƯỜNG VS THẾ MẠNH TRƯỜNG HẢI
function analyzeMarketGapsAndAdvantages(rawContent: string, targetKeyword: string): {
  weaknesses: string[];
  marketGaps: MarketGapAnalysis[];
} {
  const lowerContent = rawContent.toLowerCase();
  const weaknesses: string[] = [];
  const marketGaps: MarketGapAnalysis[] = [];

  // 1. Kiểm tra lỗ hổng về Thiết bị & Khâu trung gian môi giới
  const hasEquipment =
    lowerContent.includes("line array") ||
    lowerContent.includes("kho thiết bị") ||
    lowerContent.includes("màn hình led") ||
    lowerContent.includes("moving beam");

  if (!hasEquipment) {
    const gap: MarketGapAnalysis = {
      gapName: "Agency trung gian - thiếu sở hữu thiết bị thực tế",
      competitorWeakness: "Không có thông số kỹ thuật kho bãi (Line Array, LED P2.5/P3.91), có nguy cơ là agency môi giới phải đi thuê lại thiết bị.",
      customerPainPoint: "Khách hàng lo sợ bị đội chi phí từ 20% - 35% qua nhiều tầng trung gian và rủi ro sự cố kỹ thuật âm thanh hú rít tại hiện trường.",
      truongHaiAdvantage: "Trường Hải Event trực tiếp sở hữu tổng kho thiết bị âm thanh ánh sáng nhập khẩu, không qua trung gian, giúp tối ưu 15% - 25% ngân sách.",
      seoActionableFix: "Bổ sung đề mục cam kết trực tiếp từ kho bãi và danh mục thông số thiết bị Line Array công suất lớn.",
    };
    marketGaps.push(gap);
    weaknesses.push(
      `⚠️ Lỗ hổng: Đối thủ thiếu thông số kho thiết bị thực tế (nguy cơ agency môi giới thuê lại) ➔ 🎯 Vũ khí Trường Hải: Nhấn mạnh lợi thế kho thiết bị Line Array nhập khẩu trực tiếp, tiết kiệm 15% - 25% ngân sách cho khách.`
    );
  }

  // 2. Kiểm tra lỗ hổng về Minh bạch Báo giá & Bẫy phát sinh
  const hasPricing =
    lowerContent.includes("bảng giá") ||
    lowerContent.includes("báo giá") ||
    lowerContent.includes("chi phí") ||
    lowerContent.includes("vnđ") ||
    lowerContent.includes("đồng/khách");

  if (!hasPricing) {
    const gap: MarketGapAnalysis = {
      gapName: "Báo giá mập mờ - bẫy phát sinh chi phí",
      competitorWeakness: "Chỉ ghi 'Liên hệ để biết giá' hoặc chung chung, không có bảng dự toán mẫu hay phân loại ngân sách theo quy mô khách mời.",
      customerPainPoint: "Khách hàng doanh nghiệp e ngại bị phát sinh chi phí ngoài giờ, phụ phí vận chuyển và khó khăn khi trình sếp duyệt ngân sách.",
      truongHaiAdvantage: "Trường Hải Event cung cấp dự toán chi tiết từng hạng mục chỉ trong 30 phút và cam kết hợp đồng: 'Không phát sinh thêm một đồng'.",
      seoActionableFix: "Đưa vào bài viết bảng dự toán mẫu bóc tách theo quy mô (100 - 300 - 500 khách) để đáp ứng trọn vẹn ý định tìm kiếm của khách hàng.",
    };
    marketGaps.push(gap);
    weaknesses.push(
      `⚠️ Lỗ hổng: Báo giá mập mờ, thiếu dự trù ngân sách cụ thể ➔ 🎯 Vũ khí Trường Hải: Công khai bảng khung chi phí bóc tách theo quy mô khách, cam kết tuyệt đối 'không phát sinh chi phí'.`
    );
  }

  // 3. Kiểm tra lỗ hổng về An toàn kỹ thuật & Pháp lý sự kiện
  const hasSafety =
    lowerContent.includes("giấy phép") ||
    lowerContent.includes("an toàn") ||
    lowerContent.includes("phòng cháy") ||
    lowerContent.includes("thời tiết") ||
    lowerContent.includes("nhà bạt");

  if (!hasSafety) {
    const gap: MarketGapAnalysis = {
      gapName: "Bỏ quên pháp lý và an toàn sự kiện",
      competitorWeakness: "Chỉ tập trung vào phần hoa lá, bàn ghế mà không đề cập đến thủ tục xin cấp phép biểu diễn, an ninh trật tự hay phương án thời tiết.",
      customerPainPoint: "Doanh nghiệp lo sợ sự kiện bị gián đoạn do cơ quan chức năng kiểm tra hoặc thời tiết mưa bão làm sập khung sân khấu ngoài trời.",
      truongHaiAdvantage: "Trường Hải có kinh nghiệm dày dặn làm việc với cơ quan Nhà nước, công an; luôn trang bị hệ thống nhà bạt nhôm không gian khẩu độ lớn chống mưa bão.",
      seoActionableFix: "Bổ sung quy trình an toàn 5 bước và hướng dẫn thủ tục xin giấy phép sự kiện chuẩn chỉ.",
    };
    marketGaps.push(gap);
    weaknesses.push(
      `⚠️ Lỗ hổng: Không đề cập đến an toàn kỹ thuật và thủ tục xin cấp phép sự kiện ➔ 🎯 Vũ khí Trường Hải: Bổ sung quy trình pháp lý chuẩn chỉ và phương án dự phòng thời tiết (nhà bạt không gian chịu giông bão).`
    );
  }

  // 4. Kiểm tra lỗ hổng về Tính Cá Nhân Hóa & Kịch Bản Độc Bản
  const hasCustomConcept =
    lowerContent.includes("độc bản") ||
    lowerContent.includes("concept") ||
    lowerContent.includes("phong thủy") ||
    lowerContent.includes("cá nhân hóa");

  if (!hasCustomConcept) {
    const gap: MarketGapAnalysis = {
      gapName: "Kịch bản rập khuôn - thiếu cá nhân hóa thương hiệu",
      competitorWeakness: "Kịch bản chung chung theo lối mòn, sao chép văn mẫu từ các trang khác, thiếu sự liên kết với văn hóa riêng của doanh nghiệp.",
      customerPainPoint: "Sự kiện diễn ra tẻ nhạt, khách mời bỏ về sớm, không để lại ấn tượng về thương hiệu trong mắt đối tác VIP.",
      truongHaiAdvantage: "Đội ngũ biên kịch Trường Hải sáng tạo kịch bản độc bản riêng biệt, kết hợp yếu tố phong thủy tài lộc cho từng ngành hàng.",
      seoActionableFix: "Xây dựng các phân đoạn kịch bản sáng tạo: nghi lễ phong thủy, visual LED 3D mapping và các trò chơi gắn kết nội bộ.",
    };
    marketGaps.push(gap);
    weaknesses.push(
      `⚠️ Lỗ hổng: Kịch bản sáo rỗng, thiếu tính cá nhân hóa theo văn hóa thương hiệu ➔ 🎯 Vũ khí Trường Hải: Cam kết biên kịch độc bản kết hợp nghi lễ phong thủy hút tài lộc và visual LED 3D đỉnh cao.`
    );
  }

  // 5. Kiểm tra lỗ hổng về Mô hình liên kết Sự kiện & Du lịch (Event & Travel)
  const isTravelRelated =
    targetKeyword.toLowerCase().includes("team building") ||
    targetKeyword.toLowerCase().includes("du lịch") ||
    targetKeyword.toLowerCase().includes("nghỉ dưỡng");

  if (isTravelRelated && !lowerContent.includes("xe du lịch") && !lowerContent.includes("trọn gói")) {
    const gap: MarketGapAnalysis = {
      gapName: "Tách rời sự kiện và du lịch",
      competitorWeakness: "Chỉ làm thuần sự kiện hoặc thuần tour, khiến khách hàng phải làm việc với 2 đơn vị khác nhau dẫn đến cập rập điều phối.",
      customerPainPoint: "Hai bên đùn đẩy trách nhiệm khi lịch trình xe bị trễ hoặc khách sạn không khớp thời gian set-up sân khấu gala.",
      truongHaiAdvantage: "Mô hình độc nhất: Công ty TNHH Sự kiện và Du lịch Trường Hải sở hữu đội xe 16-45 chỗ đời mới, tổ chức trọn gói A-Z không phát sinh.",
      seoActionableFix: "Nhấn mạnh giải pháp một đầu mối: đưa đón ➔ nghỉ dưỡng ➔ teambuilding ➔ Gala Dinner liền mạch.",
    };
    marketGaps.push(gap);
    weaknesses.push(
      `⚠️ Lỗ hổng: Tách rời khâu vận chuyển - du lịch và sự kiện Gala ➔ 🎯 Vũ khí Trường Hải: Phát huy mô hình hybrid độc nhất (Event & Travel) sở hữu đội xe riêng, trọn gói một đầu mối duy nhất.`
    );
  }

  // Đảm bảo luôn có ít nhất 3 lỗ hổng có giá trị chiến lược cao
  if (weaknesses.length < 3) {
    weaknesses.push(
      `⚠️ Lỗ hổng: Thiếu số liệu dẫn chứng và dự án thực tế đã triển khai ➔ 🎯 Vũ khí Trường Hải: Khẳng định uy tín đã tổ chức thành công cho Bộ GTVT, Nhà máy Damsan, Vinpearl, LocknLock, ĐH Bách Khoa...`
    );
  }

  return { weaknesses, marketGaps };
}

// BỘ BÓC TÁCH CẤU TRÚC BÀI ĐỐI THỦ TỪ DỮ LIỆU CÀO
function extractCompetitorSeoStructure(rawContent: string, targetKeyword: string): CompetitorAnalysis {
  const lines = rawContent.split("\n");
  let foundH1 = "";
  const headings: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ") && !foundH1) {
      foundH1 = formatHeadingSentenceCase(trimmed.replace(/^#\s+/, ""));
    } else if (trimmed.startsWith("## ")) {
      const h2Text = trimmed.replace(/^##\s+/, "");
      if (h2Text.length > 3 && headings.length < 10) {
        headings.push(formatHeadingSentenceCase(`H2: ${h2Text}`));
      }
    } else if (trimmed.startsWith("### ")) {
      const h3Text = trimmed.replace(/^###\s+/, "");
      if (h3Text.length > 3 && headings.length < 12) {
        headings.push(formatHeadingSentenceCase(`H3: ${h3Text}`));
      }
    }
  }

  if (!foundH1) {
    const firstLongLine = lines.find((l) => l.trim().length > 15 && l.trim().length < 120);
    foundH1 = formatHeadingSentenceCase(
      firstLongLine ? firstLongLine.trim() : `Bài viết về ${targetKeyword || "tổ chức sự kiện"}`
    );
  }

  if (headings.length < 3) {
    headings.push("H2: Khái niệm và tầm quan trọng của sự kiện");
    headings.push("H2: Quy trình tổ chức chuẩn chỉ từ chuyên gia");
    headings.push("H2: Báo giá và chi phí dự toán các hạng mục");
    headings.push("H3: Thiết bị âm thanh, ánh sáng và nhân sự");
  }

  const wordCount = Math.max(350, rawContent.trim().split(/\s+/).length);

  // Phân tích lỗ hổng thị trường chuyên sâu
  const { weaknesses, marketGaps } = analyzeMarketGapsAndAdvantages(rawContent, targetKeyword);

  // Tính điểm SEO đối thủ
  let seoScore = 52;
  if (foundH1) seoScore += 10;
  if (headings.length >= 4) seoScore += 12;
  if (wordCount > 900) seoScore += 12;
  if (rawContent.toLowerCase().includes(targetKeyword.toLowerCase())) seoScore += 6;
  seoScore = Math.min(85, Math.max(45, seoScore));

  const targetKeywords = [
    targetKeyword || "tổ chức sự kiện chuyên nghiệp",
    "báo giá tổ chức sự kiện trọn gói",
    "công ty sự kiện uy tín hà nội",
    "thuê âm thanh ánh sáng kho trực tiếp",
  ];

  return {
    h1: foundH1,
    headings,
    targetKeywords,
    weaknesses,
    marketGaps,
    wordCountEstimate: wordCount,
    seoScore,
  };
}

// BỘ TỰ ĐỘNG SINH BÀI VIẾT KHẮC CHẾ LỖ HỔNG ĐỐI THỦ
function generateTruongHaiSeoArticle(
  targetKeyword: string,
  analysis: CompetitorAnalysis,
  customPrompt: string
): GeneratedPost {
  const keyword = targetKeyword.trim() || "Tổ chức sự kiện chuyên nghiệp Hà Nội";
  const slug = `${createSeoSlug(keyword)}-chuyen-nghiep-truong-hai`;

  const lower = keyword.toLowerCase();
  let eventTypeCategory = "sự kiện doanh nghiệp trọng đại";
  let bespokeHighlights = "";

  if (lower.includes("khai trương") || lower.includes("khanh thanh") || lower.includes("khoi cong")) {
    eventTypeCategory = "lễ khai trương, khánh thành, khởi công động thổ";
    bespokeHighlights = `
- **Nghi lễ phong thủy chuẩn chỉ:** Múa lân sư rồng - trống hội rước tài lộc, cắt băng khánh thành và khui sâm-panh may mắn kích hoạt tài vận.
- **Set-up không gian thương hiệu:** Cổng chào hơi, thảm đỏ đón khách VIP, photobooth chụp hình check-in và tiệc trà teabreak menu cao cấp.
- **Hỗ trợ pháp lý:** Tư vấn thủ tục xin phép treo băng rôn, cờ phướn và thông báo sự kiện nhanh chóng đúng quy định pháp luật.`;
  } else if (lower.includes("year end party") || lower.includes("tat nien") || lower.includes("yep")) {
    eventTypeCategory = "tiệc tất niên Year End Party (Y.E.P) và Gala Dinner tri ân";
    bespokeHighlights = `
- **Concept độc bản theo thương hiệu:** Dàn dựng kịch bản từ dạ tiệc hoàng gia Gatsby, thảm đỏ Oscar đến hội chợ Tết cổ truyền kết hợp EDM hiện đại.
- **Sân khấu visual đỉnh cao:** Màn hình LED 3D visual mapping, hiệu ứng pháo điện, máy khói lạnh và hệ thống đèn Moving Beam sân khấu.
- **Gắn kết nhân sự:** Minigame tương tác, bốc thăm trúng thưởng, vinh danh cống hiến và đêm nhạc DJ bùng nổ năng lượng.`;
  } else if (lower.includes("team building") || lower.includes("du lich")) {
    eventTypeCategory = "tour du lịch kết hợp Team Building và Gala Dinner doanh nghiệp";
    bespokeHighlights = `
- **Mô hình hybrid độc nhất (Event & Travel):** Trường Hải sở hữu đội xe 16-45 chỗ đời mới, bao trọn khâu đưa đón, khách sạn nghỉ dưỡng và sân khấu sự kiện.
- **Kịch bản vận động ý nghĩa:** Trò chơi trí tuệ đồng đội, khơi gợi kỹ năng lãnh đạo và thông điệp 'Không ai bị bỏ lại phía sau'.
- **An toàn tuyệt đối:** Hướng dẫn viên tận tâm, điều phối viên hiện trường và bảo hiểm du lịch trọn gói mức bồi thường cao nhất.`;
  } else {
    eventTypeCategory = "tổ chức sự kiện chuyên nghiệp trọn gói";
    bespokeHighlights = `
- **Khảo sát và lên kịch bản độc bản:** Khảo sát mặt bằng miễn phí, dựng mô phỏng 2D/3D trong vòng 24 giờ.
- **Kho thiết bị nhập khẩu trực tiếp:** Âm thanh Line Array lọc tạp âm, màn hình LED sắc nét, sân khấu chịu tải trọng lớn.
- **Trực chiến hiện trường 100%:** Kỹ thuật viên và đạo diễn sự kiện tổng duyệt kỹ thuật trước 6-12 tiếng.`;
  }

  // Chuẩn hóa từ khóa viết thường để ghép vào câu chuẩn ngữ pháp tiếng Việt
  const lowerKeyword = keyword.toLowerCase();

  // Tiêu đề bài viết: chỉ viết hoa chữ cái đầu và danh từ riêng (Sentence Case chuẩn)
  const title = toSentenceCase(`Cẩm nang ${lowerKeyword} trọn gói từ A-Z: bí quyết tối ưu 25% chi phí và tạo dấu ấn độc bản`);
  const metaDescription = `Cẩm nang ${lowerKeyword} từ Trường Hải Event & Travel. Trực tiếp sở hữu kho thiết bị âm thanh Line Array, LED P3.91, cam kết không phát sinh chi phí. Hotline 24/7: 0844 198 333.`;

  const content = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Chi phí ${eventTypeCategory} trọn gói hiện dao động từ **15.000.000đ - 75.000.000đ** (quy mô 50 - 500 khách) tùy thuộc vào diện tích sân khấu và gói thiết bị. Trường Hải Event & Travel trực tiếp sở hữu tổng kho âm thanh Line Array, màn hình LED P2.5/P3.91 nhập khẩu và đội xe du lịch 16-45 chỗ, cam kết bảo lãnh hợp đồng 'không phát sinh thêm một đồng'. Nhận dự toán bóc tách chi tiết theo mặt bằng trong 30 phút qua hotline 24/7: **0844 198 333**.

Trong bối cảnh cạnh tranh kinh doanh hiện đại, một chương trình ${eventTypeCategory} không đơn thuần chỉ là buổi lễ gặp gỡ giao lưu thông thường. Đây chính là **chiến dịch truyền thông trực tiếp khẳng định vị thế, tầm vóc và uy tín của doanh nghiệp** đối với đối tác, khách hàng và toàn thể cán bộ nhân viên.

Từng vinh dự đồng hành tổ chức thành công hàng trăm sự kiện cho các tập đoàn, cơ quan trọng điểm như **Bộ GTVT (thông xe cầu Thăng Long), Tập đoàn DAMSAN (khánh thành nhà máy Eiffel), Vinpearl Nam Hội An, LocknLock, Vietcombank, VPBank cùng các trường Đại học Bách Khoa Hà Nội, NEU...**, **Công ty TNHH Sự kiện và Du lịch Trường Hải (Trường Hải Event & Travel)** tự hào mang đến giải pháp tổ chức toàn diện, khắc phục hoàn toàn những lỗ hổng thị trường thường gặp.

---

## 1. Những lỗ hổng và rủi ro thường gặp khi thuê đơn vị sự kiện trung gian

Khảo sát thực tế từ hơn 500+ doanh nghiệp cho thấy, khi chọn nhầm các đơn vị agency "môi giới" không có năng lực thực chất, doanh nghiệp thường gặp 4 bài toán nan giải:

1. **Chi phí bị đội lên từ 20% đến 35%:** Do agency phải thuê lại từng hạng mục âm thanh, ánh sáng, màn LED, bàn ghế qua nhiều tầng trung gian.
2. **Rủi ro kỹ thuật hiện trường:** Thiết bị thuê ngoài chập chờn, âm thanh hú rít, màn hình LED hiển thị sai tỷ lệ làm gián đoạn bài phát biểu của ban lãnh đạo.
3. **Báo giá mập mờ, bẫy phụ phí:** Báo giá ban đầu rất thấp nhưng sau đó liên tục phát sinh chi phí vận chuyển, phụ phí nhân công ngoài giờ.
4. **Bỏ quên an toàn và pháp lý:** Không có phương án dự phòng thời tiết mưa bão (sập nhà bạt) và thiếu hiểu biết về thủ tục xin cấp phép với chính quyền.

---

## 2. Năm vũ khí cốt lõi tạo nên sự khác biệt của Trường Hải Event & Travel

Trường Hải Event & Travel được xây dựng để lấp đầy những khoảng trống thị trường trên với 5 cam kết vàng:

### 2.1. Trực tiếp sở hữu kho thiết bị nhập khẩu - tiết kiệm 15% đến 25% ngân sách
Trường Hải không làm việc qua trung gian môi giới. Chúng tôi trực tiếp đầu tư và làm chủ kho thiết bị hiện đại:
- **Hệ thống âm thanh Line Array:** Công suất cực đại, lọc tạp âm và chống hú rít tuyệt đối.
- **Màn hình LED indoor và outdoor P2.5 - P3.91:** Tần số quét cao, hiển thị sắc nét dưới mọi điều kiện ánh sáng.
- **Hệ thống đèn sân khấu:** Moving Beam, Par LED, Follow spot và hiệu ứng khói lạnh, pháo điện an toàn.
- **Tối ưu ngân sách:** Giúp doanh nghiệp tiết kiệm trực tiếp từ 15% đến 25% chi phí so với các đơn vị môi giới qua nhiều tầng trung gian.

### 2.2. Báo giá minh bạch - tuyệt đối không phát sinh một đồng
- Lập dự toán chi tiết từng hạng mục chỉ trong **30 phút** sau khi tiếp nhận thông tin.
- Cam kết hợp đồng rõ ràng: **Giá trọn gói, tuyệt đối không phụ phí ẩn**.
- Xuất hóa đơn VAT đầy đủ theo đúng quy định pháp luật.

### 2.3. Kịch bản sáng tạo độc bản gắn liền với bản sắc doanh nghiệp
Mỗi chương trình là một tác phẩm riêng, nói không với việc sao chép kịch bản mẫu sáo rỗng:
${bespokeHighlights}

### 2.4. Quy trình vận hành an toàn tuyệt đối và trực chiến 100%
- Kỹ thuật viên và đạo diễn sự kiện luôn có mặt trước giờ G từ **6 đến 12 tiếng** để chạy tổng duyệt kỹ thuật (Rehearsal).
- Luôn trang bị hệ thống nhà bạt nhôm không gian khẩu độ lớn chịu được giông bão.
- Hỗ trợ thủ tục xin cấp phép biểu diễn và treo băng rôn quảng bá nhanh gọn.

### 2.5. Mô hình hybrid độc nhất: sự kiện kết hợp du lịch (Event & Travel)
Là đơn vị hiếm hoi sở hữu cả giấy phép lữ hành và đội xe du lịch 16-45 chỗ đời mới, Trường Hải mang đến giải pháp: **Một đầu mối duy nhất - trọn gói từ xe đưa đón, tour nghỉ dưỡng, Team Building đến Gala Dinner thăng hoa**.

---

## 3. Phân tích chiều sâu kỹ thuật và các điều kiện then chốt

Nhằm đảm bảo sự kiện diễn ra thành công không một tì vết, đội ngũ kỹ thuật Trường Hải chia sẻ 4 khía cạnh thực tế mà mọi doanh nghiệp cần nắm rõ:

### 3.1. Điều kiện ngầm về nguồn điện và mặt bằng tổ chức
- **Yêu cầu điện lưới:** Màn hình LED diện tích trên 15m² kết hợp dàn đèn Moving Beam bắt buộc phải cấp nguồn điện 3 pha ổn định (công suất từ 25kW - 45kW) hoặc có máy phát điện dự phòng độc lập để tránh sập atomat tòa nhà giữa chương trình.
- **Chiều cao trần và góc nhìn:** Với hội trường trần thấp dưới 3.8m, tuyệt đối không treo cụm loa Line Array trên cao vì sóng âm sẽ bị dội trần gây hú rít; thay vào đó, kỹ thuật viên sẽ bố trí hệ thống loa cột Column Array đặt sàn phân tán đều theo chiều dọc khán phòng.
- **Pháp lý sự kiện:** Với sự kiện ngoài trời quy mô từ 200 khách trở lên, doanh nghiệp cần chuẩn bị hồ sơ thông báo hoặc xin giấy phép biểu diễn với cơ quan quản lý văn hóa địa phương trước ngày diễn ra tối thiểu 10 ngày làm việc.

### 3.2. Tiêu chí chọn gói theo quy mô và đối tượng khách mời
- **Quy mô dưới 100 khách (nội bộ, tiệc thân mật):** Ưu tiên gói tinh gọn dùng hệ thống 2 - 4 loa Full chuyên dụng, backdrop bạt Hiflex de hit chống xuyên sáng hoặc màn hình LED mini dưới 12m², tập trung ngân sách cho menu tiệc và quà tặng tri ân.
- **Quy mô 100 - 300 khách (hội nghị, tất niên chuẩn):** Bắt buộc sử dụng tối thiểu 4 cụm loa Line Array để âm thanh phủ đều đến hàng ghế cuối cùng mà người ngồi bàn đầu không bị chói tai, kết hợp màn hình LED P3.91 kích thước tối thiểu 15m² - 20m².
- **Quy mô 300 - 1.000+ khách VIP (đại lễ, khánh thành tập đoàn):** Cần hệ thống Line Array công suất lớn, visual LED 3D mapping, đạo diễn điều phối hiện trường qua bộ đàm chuyên dụng và đội ngũ trực chiến 100%.

### 3.3. Bảng so sánh đánh đổi giữa các phương án kỹ thuật

| Hạng mục thiết bị | Phương án phổ thông | Phương án tối ưu tại Trường Hải | Đánh đổi thực tế cần lưu ý |
| :--- | :--- | :--- | :--- |
| **Hệ thống âm thanh** | Cụm loa thùng Full đặt sàn | Dàn Line Array nhập khẩu treo khung Truss | Loa Full rẻ hơn nhưng âm thanh dễ méo tiếng và không đều; Line Array phủ âm mượt mà toàn hội trường |
| **Màn hình LED** | Màn LED P3.91 đa năng | Màn LED P2.5 trong nhà siêu mịn | Màn P3.91 tối ưu chi phí hơn; màn P2.5 có độ sắc nét cực cao, không bị sọc nhiễu khi ghi hình máy ảnh chuyên nghiệp |
| **Kết cấu che mưa nắng** | Ô dù bạt dù tròn | Nhà bạt không gian hợp kim nhôm khẩu độ lớn | Ô dù giá rẻ nhưng dễ bị lật khi có gió lốc; nhà bạt nhôm khẩu độ lớn chống chịu được giông bão cấp 6-7 |

### 3.4. Cảnh báo thực chiến chống bẫy phát sinh chi phí
Nhiều agency trung gian thường báo giá ban đầu rất thấp để ký hợp đồng, sau đó liên tục phụ thu các khoản:
- Phụ phí vận chuyển và bốc dỡ vào ban đêm hoặc tòa nhà không có thang máy hàng.
- Phụ phí kỹ thuật viên trực ngoài giờ sau 21h00.
- Phí thuê thêm micro không dây và pin dự phòng.
Tại Trường Hải Event & Travel, mọi điều khoản chi phí đều được niêm yết trọn gói bằng hợp đồng pháp lý, **cam kết không phát sinh thêm một đồng phụ phí**.

---

## 4. Bảng dự toán khung ngân sách tham khảo (không phát sinh chi phí)

| Quy mô khách mời | Hạng mục cung cấp trọn gói | Thời gian chuẩn bị | Dự toán tham khảo |
| :--- | :--- | :--- | :--- |
| **Dưới 100 khách** | Sân khấu, backdrop, âm thanh 2 loa Full, 2 mic không dây, MC, tiệc trà teabreak | 1 - 2 ngày | Gói tiết kiệm (tối ưu chi phí) |
| **100 - 300 khách** | Dàn Line Array 4 loa, màn hình LED P3.91 (15m²), đèn Beam, PG lễ tân, múa lân rước lộc | 3 - 5 ngày | Gói tiêu chuẩn (được chọn nhiều nhất) |
| **300 - 1.000+ khách** | Hệ thống Line Array công suất lớn, màn LED P2.5 (30m²), visual 3D mapping, đạo diễn hiện trường | 5 - 10 ngày | Gói đẳng cấp / VIP doanh nghiệp |

*(Lưu ý: Báo giá thực tế sẽ được chuyên viên Trường Hải bóc tách theo đúng diện tích mặt bằng và nhu cầu cụ thể).*

---

## 5. Quy trình làm việc chuyên nghiệp 5 bước

1. **Bước 1 (tiếp nhận và khảo sát):** Khảo sát thực tế hiện trường trong ngày, đo đạc mặt bằng miễn phí.
2. **Bước 2 (lên maquette và kịch bản):** Gửi kịch bản chi tiết và phối cảnh 2D/3D sân khấu trong 24 giờ.
3. **Bước 3 (ký hợp đồng và chuẩn bị):** Chốt dự toán minh bạch, sản xuất thiết bị tại kho.
4. **Bước 4 (thi công và tổng duyệt):** Lắp đặt hoàn thiện trước giờ G tối thiểu 6 tiếng, trực chiến hiện trường 100%.
5. **Bước 5 (nghiệm thu và bàn giao media):** Bàn giao toàn bộ ảnh HD và video recap sự kiện trong 48 giờ.

---

## 6. Nhận tư vấn kịch bản độc bản và dự toán chi tiết trong 30 phút

Đừng để sự kiện trọng đại của doanh nghiệp bạn gặp phải những rủi ro kỹ thuật hay chi phí đội lên từ các đơn vị trung gian. Hãy liên hệ ngay với Trường Hải Event & Travel để được phục vụ với chất lượng tốt nhất:

- **CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI**
- **Hotline tư vấn 24/7:** **0844 198 333**
- **Giám đốc điều hành:** Nguyễn Thị Thu Hằng
- **Địa chỉ:** LK 628, ngõ Lực, đường Sinh Viên, thôn Thanh Kỳ, xã Bình Minh, TP Hà Nội
- **Mã số thuế:** 0111601327 (Sở KH&ĐT TP Hà Nội cấp)
- **Slogan:** *"Sự kiện chuyên nghiệp – Du lịch trải nghiệm – Kết nối thành công"*
    `.trim();

  return {
    title,
    slug,
    meta_description: metaDescription,
    focus_keyword: keyword,
    content: cleanMarkdownHeadings(content),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { competitorUrl, targetKeyword = "", customPrompt = "" } = body;

    // 1. Kiểm tra tính hợp lệ của URL
    if (!competitorUrl || typeof competitorUrl !== "string" || !competitorUrl.trim().startsWith("http")) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp URL bài viết đối thủ hợp lệ (bắt đầu bằng http:// hoặc https://)." },
        { status: 400 }
      );
    }

    const sanitizedUrl = competitorUrl.trim();

    // ------------------------------------------------------------------------
    // BƯỚC 1: Cào nội dung sạch của đối thủ qua Jina Reader (https://r.jina.ai/)
    // ------------------------------------------------------------------------
    let rawContent = "";
    try {
      const jinaUrl = `https://r.jina.ai/${encodeURI(sanitizedUrl)}`;
      const jinaResponse = await fetch(jinaUrl, {
        headers: {
          Accept: "text/plain",
          "User-Agent": "TruongHaiEvent-RadarSEO/1.0",
        },
        // Timeout 12s để tránh treo request
        signal: AbortSignal.timeout(12000),
      });

      if (jinaResponse.ok) {
        rawContent = await jinaResponse.text();
      } else {
        rawContent = `Nội dung từ URL: ${sanitizedUrl}\n(Quét tự động phục vụ tối ưu hóa SEO Trường Hải Event & Travel)`;
      }
    } catch (jinaErr: any) {
      console.warn("Jina Reader fetch warning (tiếp tục với bộ phân tích dự phòng):", jinaErr?.message);
      rawContent = `Nội dung đối thủ từ: ${sanitizedUrl}\n(Chế độ quét phân tích tối ưu nội dung Trường Hải Event)`;
    }

    const truncatedContent = rawContent.slice(0, 15000);

    // ------------------------------------------------------------------------
    // BƯỚC 2: Phân tích SEO theo Ma Trận Lỗ Hổng Thị Trường & Điểm Mạnh Trường Hải
    // Áp dụng chuẩn Skill System Content v2.4.5: Answer-First, Specificity Planning & Rule Lock
    // ------------------------------------------------------------------------
    let analysisResult: CompetitorAnalysis | null = null;
    let newPostResult: GeneratedPost | null = null;

    const geminiApiKey = process.env.GEMINI_API_KEY || "";

    if (geminiApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });

        const prompt = `
Bạn là Giám đốc Chiến lược & Chuyên gia SEO cao cấp của Công ty TNHH Sự kiện và Du lịch Trường Hải (Hotline 24/7: 0844 198 333, MST: 0111601327, Giám đốc: Nguyễn Thị Thu Hằng).
Thế mạnh cốt lõi (Vũ khí Trường Hải):
1. Trực tiếp sở hữu kho thiết bị âm thanh Line Array nhập khẩu, màn hình LED P2.5/P3.91, đèn Moving Beam (không qua trung gian, tiết kiệm 15-25% ngân sách).
2. Báo giá minh bạch, bóc tách theo quy mô, cam kết hợp đồng tuyệt đối 'không phát sinh thêm một đồng'.
3. Uy tín từng đồng hành cùng Bộ GTVT (thông xe cầu Thăng Long), Nhà máy Damsan, Vinpearl Nam Hội An, LocknLock, Vietcombank, VPBank, ĐH Bách Khoa...
4. An toàn 100%, có nhà bạt nhôm không gian khẩu độ lớn chống giông bão, trực chiến trước giờ G 6-12 tiếng.
5. Mô hình hybrid độc nhất: Sự kiện kết hợp Du lịch (Event & Travel), có đội xe 16-45 chỗ riêng.

Dưới đây là nội dung bài viết cào từ đối thủ:
---
${truncatedContent}
---
Từ khóa mục tiêu: "${targetKeyword || "tổ chức sự kiện chuyên nghiệp"}"
Yêu cầu biên tập: "${customPrompt || "Áp dụng Skill System v2.4.5: Answer-First, Specificity Planning và giải quyết lỗ hổng đối thủ bằng vũ khí Trường Hải"}"

QUY TẮC CỐT LÕI (RULE LOCK BẮT BUỘC):
1. CHIẾN LƯỢC ANSWER-FIRST: Ngay dưới H1, mở đầu bài bằng 1 trích dẫn callout (block quote >) tóm tắt nhanh (Quick Answer) về khung giá, thời gian triển khai, hotline và cam kết không phát sinh chi phí để tối ưu cho Google AI Overview và Featured Snippet.
2. SPECIFICITY PLANNING: Bài viết bắt buộc phải có mục phân tích chiều sâu gồm:
   - Điều kiện ngầm về nguồn điện 3 pha cho LED, chiều cao trần hội trường, pháp lý ngoài trời (hidden condition).
   - Phân nhóm ai nên chọn gói nào và ai không nên chọn theo số lượng khách (fit not fit).
   - Bảng Markdown so sánh đánh đổi giữa các thiết bị: Loa Full vs Line Array, LED P3.91 vs P2.5 (trade-off).
   - Cảnh báo bẫy phát sinh chi phí của agency trung gian (practical warning).
3. TUYỆT ĐỐI CẤM DÙNG HEADING "KẾT LUẬN" HOẶC "LỜI KẾT": Thay bằng heading kêu gọi hành động thực tế: "Nhận tư vấn kịch bản độc bản và dự toán chi tiết trong 30 phút" kèm thông tin công ty, giám đốc, MST, slogan và hotline.
4. QUY TẮC SENTENCE CASE: Chỉ viết hoa chữ cái đầu và danh từ riêng (Trường Hải, Vinpearl, Damsan, LocknLock, Hà Nội, Việt Nam...). Tuyệt đối không viết hoa từng từ theo Title Case tiếng Anh ở bất kỳ heading nào.

Hãy thực hiện:
1. Phân tích đối thủ: Chỉ rõ H1, các H2-H3, từ khóa, và đặc biệt là 3-5 LỖ HỔNG THỊ TRƯỜNG mà đối thủ bỏ sót, kèm giải pháp vũ khí của Trường Hải Event.
2. Viết bài viết mới chuẩn SEO độc bản đáp ứng đầy đủ 4 quy tắc cốt lõi trên.

Trả về DUY NHẤT một chuỗi JSON hợp lệ:
{
  "analysis": {
    "h1": "Tiêu đề H1 của đối thủ",
    "headings": ["H2: ...", "H2: ...", "H3: ..."],
    "targetKeywords": ["từ khóa 1", "từ khóa 2"],
    "weaknesses": [
      "⚠️ Lỗ hổng: [Lỗ hổng đối thủ] ➔ 🎯 Vũ khí Trường Hải: [Thế mạnh khắc chế]"
    ],
    "wordCountEstimate": 850,
    "seoScore": 68
  },
  "generatedPost": {
    "title": "Tiêu đề bài viết mới (chỉ viết hoa đầu dòng và danh từ riêng)",
    "slug": "duong-dan-url-chuan-seo-viet-khong-dau",
    "meta_description": "Meta description 150-160 ký tự kèm hotline 0844 198 333",
    "focus_keyword": "${targetKeyword || "tổ chức sự kiện chuyên nghiệp"}",
    "content": "Nội dung bài viết mới hoàn chỉnh chuẩn Markdown (tuân thủ Answer-First, Specificity Planning và không dùng heading Kết luận)"
  }
}
`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();
        const parsed = JSON.parse(textResponse);
        if (parsed.analysis && parsed.generatedPost) {
          analysisResult = parsed.analysis;
          newPostResult = parsed.generatedPost;
        }
      } catch (geminiError: any) {
        console.warn("Gemini API call skipped/failed, using standalone Market Gap Engine:", geminiError?.message);
      }
    }

    // Nếu không có Gemini API hoặc gọi API lỗi: Kích hoạt Standalone Market Gap Engine
    if (!analysisResult || !newPostResult) {
      analysisResult = extractCompetitorSeoStructure(truncatedContent, targetKeyword);
      newPostResult = generateTruongHaiSeoArticle(targetKeyword, analysisResult, customPrompt);
    }

    // Chuẩn hóa triệt để Sentence Case cho đầu ra
    if (newPostResult) {
      newPostResult.title = toSentenceCase(newPostResult.title);
      newPostResult.content = cleanMarkdownHeadings(newPostResult.content);
    }
    if (analysisResult) {
      if (analysisResult.h1) {
        analysisResult.h1 = formatHeadingSentenceCase(analysisResult.h1);
      }
      if (analysisResult.headings && Array.isArray(analysisResult.headings)) {
        analysisResult.headings = analysisResult.headings.map(formatHeadingSentenceCase);
      }
    }

    // ------------------------------------------------------------------------
    // BƯỚC 3: Lưu bản ghi an toàn vào Supabase (Bản nháp draft)
    // ------------------------------------------------------------------------
    let savedLogId: string | null = null;
    let savedPostId: string | null = null;

    if (isSupabaseConfigured) {
      try {
        const { data: postData, error: postErr } = await supabase
          .from("posts")
          .insert([
            {
              title: newPostResult.title,
              slug: newPostResult.slug,
              content: newPostResult.content,
              meta_description: newPostResult.meta_description,
              focus_keyword: newPostResult.focus_keyword,
              competitor_source_url: sanitizedUrl,
              status: "draft",
            },
          ])
          .select("id")
          .single();

        if (!postErr && postData) {
          savedPostId = postData.id;
        }

        const { data: logData } = await supabase
          .from("competitor_logs")
          .insert([
            {
              competitor_url: sanitizedUrl,
              raw_content: truncatedContent,
              ai_analysis: analysisResult,
              target_keyword: targetKeyword,
            },
          ])
          .select("id")
          .single();

        if (logData) {
          savedLogId = logData.id;
        }
      } catch (dbErr) {
        console.warn("Lưu DB Supabase bỏ qua (chế độ độc lập):", dbErr);
      }
    }

    // ------------------------------------------------------------------------
    // BƯỚC 4: Trả về kết quả JSON chuẩn hóa cho giao diện Admin
    // ------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      generatedPost: newPostResult,
      savedPostId,
      savedLogId,
      isSupabaseSaved: Boolean(savedPostId),
      message: "Phân tích lỗ hổng thị trường và khởi tạo bài viết chuẩn SEO thành công!",
    });
  } catch (error: any) {
    console.error("Radar SEO API error:", error);
    return NextResponse.json(
      {
        error: "Đã xảy ra lỗi trong quá trình xử lý Radar SEO.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

