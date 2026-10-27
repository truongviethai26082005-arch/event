export interface GeneratedPost {
  title: string;
  slug: string;
  meta_description: string;
  focus_keyword: string;
  content: string;
}

export interface MarketGapAnalysis {
  gapName: string;
  competitorWeakness: string;
  customerPainPoint: string;
  truongHaiAdvantage: string;
  seoActionableFix: string;
}

export interface CompetitorAnalysis {
  h1: string;
  headings: string[];
  targetKeywords: string[];
  weaknesses: string[];
  marketGaps?: MarketGapAnalysis[];
  wordCountEstimate: number;
  seoScore: number;
}

// DANH MỤC DANH TỪ RIÊNG & TỪ VIẾT TẮT ĐƯỢC GIỮ NGUYÊN VIẾT HOA
export const PROPER_NOUN_PATTERNS: { match: RegExp; replace: string }[] = [
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
];

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

export function formatHeadingSentenceCase(heading: string): string {
  if (!heading) return "";
  const prefixMatch = heading.match(/^(\s*(?:#+\s*(?:\d+(?:\.\d+)*\.?\s*)?|H[1-6]:\s*|\d+(?:\.\d+)*\.?\s*|-\s*|🎯\s*|⚠️\s*)?)(.*)$/iu);
  if (!prefixMatch) return toSentenceCase(heading);
  const prefix = prefixMatch[1] || "";
  const body = prefixMatch[2] || "";
  if (!body) return heading;
  return prefix + toSentenceCase(body);
}

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

export function createSeoSlug(text: string): string {
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

// Hàm làm sạch chủ thể từ khóa để tránh lặp từ "tổ chức", "báo giá", "kịch bản" trong tiêu đề
export function cleanKeywordSubject(text: string): string {
  if (!text) return "";
  let clean = text.trim();
  clean = clean.replace(/^(báo giá\s+dịch vụ\s+tổ chức|báo giá\s+tổ chức|dịch vụ\s+tổ chức|kế hoạch\s+tổ chức|cẩm nang\s+tổ chức|kịch bản\s+tổ chức|kinh nghiệm\s+tổ chức|hướng dẫn\s+tổ chức|quy trình\s+tổ chức|ý tưởng\s+tổ chức|tổ chức|báo giá|dịch vụ|kịch bản|cẩm nang)\s+/iu, "");
  return clean.trim() || text.trim();
}

