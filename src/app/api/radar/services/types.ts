/**
 * CÁC KIỂU DỮ LIỆU ĐỊNH NGHĨA CHO MODULE RADAR SEO & CONTENT GENERATOR
 * Tuân thủ nguyên tắc Single Responsibility & Modular Architecture
 * Phạm vi: Nội bộ src/app/api/radar/services/
 */

export type SearchIntent = "informational" | "commercial" | "listicle";

export interface OutlineSection {
  heading: string;
  purpose: string;
  required_elements: ("table" | "code_sample" | "script_template" | "bullet_points" | "comparison_matrix")[];
}

export interface FaqItem {
  question: string;
  answer_guideline: string;
  answer?: string;
}

export interface ScrapedData {
  title: string;
  headings: string[];
  cleanText: string;
  wordCountEstimate: number;
}

export interface IntentAnalysisResult {
  search_intent: SearchIntent;
  content_angle: string;
  content_gap: string;
  focus_keyword?: string;
  outline: OutlineSection[];
  faq_list: FaqItem[];
  competitor_weaknesses?: string[];
  seo_score?: number;
}

export interface GeneratedArticle {
  title: string;
  slug: string;
  meta_description: string;
  focus_keyword: string;
  content: string;
  schema_json_ld?: string;
  search_intent: SearchIntent;
  outline: OutlineSection[];
  faq_list: FaqItem[];
}

export interface BrandProfile {
  companyName: string;
  brandName: string;
  director: string;
  taxId: string;
  hotline: string;
  address: string;
  slogan: string;
  coreStrengths: string[];
  keyProjects: string[];
}

export const TRUONG_HAI_BRAND: BrandProfile = {
  companyName: "Công ty TNHH Sự kiện và Du lịch Trường Hải",
  brandName: "Trường Hải Event & Travel",
  director: "Nguyễn Thị Thu Hằng",
  taxId: "0111601327",
  hotline: "0844 198 333",
  address: "LK 628, ngõ Lực, đường Sinh Viên, thôn Thanh Kỳ, xã Bình Minh, TP Hà Nội",
  slogan: "Sự kiện chuyên nghiệp – Du lịch trải nghiệm – Kết nối thành công",
  coreStrengths: [
    "Trực tiếp sở hữu tổng kho thiết bị âm thanh Line Array nhập khẩu, màn hình LED P2.5/P3.91, đèn Moving Beam 260/380, khung Truss nhôm hợp kim (tiết kiệm 15-25% ngân sách môi giới).",
    "Báo giá minh bạch, bóc tách theo quy mô, cam kết hợp đồng pháp lý tuyệt đối 'không phát sinh thêm một đồng'.",
    "Hệ thống nhà bạt nhôm không gian khẩu độ 10-20m chống giông bão, trực chiến trước giờ G 6-12 tiếng.",
    "Mô hình hybrid độc nhất: Sự kiện kết hợp Du lịch (Event & Travel), trực tiếp sở hữu đội xe du lịch 16-45 chỗ riêng.",
  ],
  keyProjects: [
    "Lễ thông xe cầu Thăng Long (Bộ Giao thông Vận tải)",
    "Đại lễ khánh thành Nhà máy Eiffel (Tập đoàn DAMSAN)",
    "Chuỗi sự kiện Vinpearl Nam Hội An",
    "Khai trương chuỗi Showroom LocknLock",
    "Sự kiện ngành ngân hàng Vietcombank, VPBank, NCB",
    "Hội nghị & Ngày hội việc làm Trường Đại học Bách Khoa Hà Nội",
  ],
};

export interface ScannedArticleUrl {
  url: string;
  title: string;
  isScraped: boolean;
  lastMod?: string;
}

export interface DomainScanResult {
  domain: string;
  sitemapFound: string | null;
  totalFound: number;
  unscrapedCount: number;
  urls: ScannedArticleUrl[];
}
