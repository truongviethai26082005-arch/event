import { GeneratedPost } from "./types";
import { generateGrandOpeningArticle } from "./grand-opening";
import { generateYearEndPartyArticle } from "./year-end-party";
import { generateTeambuildingTravelArticle } from "./teambuilding-travel";
import { generateConferenceSeminarArticle } from "./conference-seminar";
import { generateEquipmentRentalArticle } from "./equipment-rental";
import { generateGeneralEventArticle } from "./general-event";
import { generateDynamicArticleFromSemanticEngine } from "./dynamic-engine";
import { analyzeKeywordSemantics } from "./semantic-analyzer";

export * from "./types";
export * from "./semantic-analyzer";
export * from "./dynamic-engine";

export type SearchIntentType =
  | "GRAND_OPENING"
  | "YEAR_END_PARTY"
  | "TEAMBUILDING_TRAVEL"
  | "CONFERENCE_SEMINAR"
  | "EQUIPMENT_RENTAL"
  | "GENERAL_EVENT";

/**
 * BƯỚC 1: INTENT ANALYSIS - Xác định chuẩn xác nhu cầu cốt lõi của khách hàng
 * Áp dụng chuẩn Content SEO System
 */
export function detectSearchIntent(keyword: string): SearchIntentType {
  const k = keyword.toLowerCase().trim();

  // 1. Nhóm Du lịch, Team Building
  if (
    k.includes("team building") ||
    k.includes("teambuilding") ||
    k.includes("du lịch") ||
    k.includes("du lich") ||
    k.includes("tour") ||
    k.includes("nghỉ dưỡng") ||
    k.includes("nghi duong") ||
    k.includes("dã ngoại") ||
    k.includes("da ngoai")
  ) {
    return "TEAMBUILDING_TRAVEL";
  }

  // 2. Nhóm Cho thuê thiết bị âm thanh, ánh sáng, màn hình LED
  if (
    k.includes("thuê âm thanh") ||
    k.includes("thue am thanh") ||
    k.includes("thuê ánh sáng") ||
    k.includes("thue anh sang") ||
    k.includes("thuê màn hình led") ||
    k.includes("thuê màn led") ||
    k.includes("thue man hinh led") ||
    k.includes("thuê led") ||
    k.includes("thue led") ||
    k.includes("thuê loa") ||
    k.includes("thue loa") ||
    k.includes("thuê sân khấu") ||
    k.includes("thue san khau") ||
    k.includes("thiết bị sự kiện") ||
    k.includes("thiet bi su kien") ||
    k.includes("nhà bạt") ||
    k.includes("nha bat") ||
    k.includes("kho thiết bị")
  ) {
    return "EQUIPMENT_RENTAL";
  }

  // 3. Nhóm Khai trương, khánh thành, khởi công, động thổ
  if (
    k.includes("khai trương") ||
    k.includes("khai truong") ||
    k.includes("khánh thành") ||
    k.includes("khanh thanh") ||
    k.includes("khởi công") ||
    k.includes("khoi cong") ||
    k.includes("động thổ") ||
    k.includes("dong tho") ||
    k.includes("mở bán") ||
    k.includes("mo ban") ||
    k.includes("ra mắt chi nhánh") ||
    k.includes("khai mạc") ||
    k.includes("khai mac")
  ) {
    return "GRAND_OPENING";
  }

  // 4. Nhóm Tiệc tất niên, Year End Party, Gala Dinner độc lập
  if (
    k.includes("year end party") ||
    k.includes("yep") ||
    k.includes("tất niên") ||
    k.includes("tat nien") ||
    k.includes("gala dinner") ||
    k.includes("tiệc cuối năm") ||
    k.includes("tiec cuoi nam") ||
    k.includes("gala") ||
    k.includes("tổng kết") ||
    k.includes("tong ket")
  ) {
    return "YEAR_END_PARTY";
  }

  // 5. Nhóm Hội nghị, hội thảo, tọa đàm, workshop
  if (
    k.includes("hội nghị") ||
    k.includes("hoi nghi") ||
    k.includes("hội thảo") ||
    k.includes("hoi thao") ||
    k.includes("tọa đàm") ||
    k.includes("toa dam") ||
    k.includes("workshop") ||
    k.includes("conference") ||
    k.includes("seminar") ||
    k.includes("đại hội") ||
    k.includes("dai hoi") ||
    k.includes("ký kết")
  ) {
    return "CONFERENCE_SEMINAR";
  }

  return "GENERAL_EVENT";
}

/**
 * BỘ ĐIỀU PHỐI ĐỘNG THEO CHUẨN CONTENT SEO SYSTEM
 * Tự động tạo bài viết chuyên sâu cho BẤT KỲ từ khóa nào bằng Semantic Engine.
 * Không chỉ thay keyword mà phân tích sâu về bảng giá, điều kiện ngầm, trade-off và kỹ thuật.
 */
export function generateDynamicArticleByIntent(
  keyword: string,
  analysis?: any,
  customPrompt?: string
): GeneratedPost {
  // Ưu tiên sử dụng Master Dynamic Semantic Engine để tạo bài viết độc bản, giàu số liệu
  return generateDynamicArticleFromSemanticEngine(keyword, analysis, customPrompt);
}
