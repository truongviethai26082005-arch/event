// CHỈ dùng ở máy chủ (đọc SERPER_API_KEY).
import { COMPANY_INFO } from "@/lib/company-data";

/** Giới hạn lượt Serper mỗi tháng (credit miễn phí 2.500, hạn 6 tháng). Đổi bằng SERPER_MONTHLY_LIMIT. */
export const SERPER_MONTHLY_LIMIT = Number(process.env.SERPER_MONTHLY_LIMIT) || 300;

/** Vị trí người tìm: kết quả giống khách ở Hà Nội thấy. */
const SEARCH_LOCATION = "Hanoi, Hanoi, Vietnam";

export type ResultKind = "competitor" | "own" | "social" | "news" | "marketplace" | "gov" | "video" | "other";

export const RESULT_KIND_LABELS: Record<ResultKind, string> = {
  competitor: "Đối thủ",
  own: "Website mình",
  social: "Mạng xã hội",
  news: "Báo / tin tức",
  marketplace: "Sàn TMĐT",
  gov: "Cơ quan nhà nước",
  video: "Video",
  other: "Khác",
};

export interface SerpResult {
  position: number;
  title: string;
  link: string;
  domain: string;
  snippet: string;
  kind: ResultKind;
}

export interface SerpSearch {
  keyword: string;
  results: SerpResult[];
  ourPosition: number | null;
  topCompetitor: string | null;
  peopleAlsoAsk: string[];
  relatedSearches: string[];
  credits: number;
}

const SOCIAL = ["facebook.com", "fb.com", "instagram.com", "tiktok.com", "zalo.me", "linkedin.com", "pinterest.com", "x.com", "twitter.com", "threads.net"];
const VIDEO = ["youtube.com", "youtu.be", "vimeo.com"];
const MARKETPLACE = ["shopee.vn", "lazada.vn", "tiki.vn", "sendo.vn", "chotot.com"];
const NEWS = [
  "vnexpress.net", "dantri.com.vn", "tuoitre.vn", "thanhnien.vn", "vietnamnet.vn", "znews.vn", "zingnews.vn",
  "kenh14.vn", "cafef.vn", "cafebiz.vn", "laodong.vn", "nld.com.vn", "vtv.vn", "vov.vn", "baomoi.com",
  "24h.com.vn", "soha.vn", "genk.vn", "tienphong.vn", "plo.vn", "vietnamplus.vn", "nhandan.vn", "wikipedia.org",
];

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Tên miền của chính mình: tên miền công ty, NEXT_PUBLIC_SITE_URL, RADAR_OWN_DOMAINS (cách nhau dấu phẩy). */
function ownDomains() {
  return [COMPANY_INFO.website, process.env.NEXT_PUBLIC_SITE_URL, ...(process.env.RADAR_OWN_DOMAINS || "").split(",")]
    .map((d) => hostOf(String(d || "").includes("://") ? String(d) : `https://${d}`))
    .filter(Boolean);
}

const matches = (host: string, list: string[]) => list.some((d) => host === d || host.endsWith(`.${d}`));

export function classifyDomain(host: string): ResultKind {
  if (!host) return "other";
  if (matches(host, ownDomains())) return "own";
  if (matches(host, SOCIAL)) return "social";
  if (matches(host, VIDEO)) return "video";
  if (matches(host, MARKETPLACE)) return "marketplace";
  if (matches(host, NEWS)) return "news";
  if (host.endsWith(".gov.vn") || host.endsWith("chinhphu.vn") || host.endsWith(".edu.vn")) return "gov";
  if (host.endsWith("google.com")) return "other";
  return "competitor";
}

/** Link dạng google.com/goto?url=... hoặc /url?q=... -> link thật (không tốn thêm lượt). */
function realLink(link: string) {
  try {
    const u = new URL(link);
    if (u.hostname.endsWith("google.com") && (u.pathname === "/goto" || u.pathname === "/url")) {
      return u.searchParams.get("url") || u.searchParams.get("q") || link;
    }
  } catch {
    // giữ nguyên
  }
  return link;
}

/** Tìm 1 từ khóa trên Google Việt Nam (vị trí Hà Nội), trả top 10 đã phân loại. Tốn 1 lượt Serper. */
export async function searchGoogle(keyword: string): Promise<SerpSearch> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) throw new Error("Máy chủ chưa cấu hình SERPER_API_KEY.");

  const q = keyword.trim();
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ q, gl: "vn", hl: "vi", location: SEARCH_LOCATION, num: 10 }),
    signal: AbortSignal.timeout(30_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Serper lỗi ${res.status}: ${data?.message || "không rõ"}`);

  // Bảo vệ: Serper phải nhận đúng từ khóa (đã từng gặp lỗi mất dấu tiếng Việt khi gửi sai mã hóa)
  const echoed = String(data?.searchParameters?.q || "");
  if (echoed && echoed !== q) {
    throw new Error(`Serper nhận sai từ khóa ("${echoed}" thay vì "${q}"), không lưu kết quả.`);
  }

  const results: SerpResult[] = (data.organic || []).slice(0, 10).map((r: Record<string, unknown>, i: number) => {
    const link = realLink(String(r.link || ""));
    const domain = hostOf(link);
    return {
      position: Number(r.position) || i + 1,
      title: String(r.title || ""),
      link,
      domain,
      snippet: String(r.snippet || ""),
      kind: classifyDomain(domain),
    };
  });

  return {
    keyword: q,
    results,
    ourPosition: results.find((r) => r.kind === "own")?.position ?? null,
    topCompetitor: results.find((r) => r.kind === "competitor")?.domain ?? null,
    peopleAlsoAsk: (data.peopleAlsoAsk || []).map((x: { question?: string }) => String(x.question || "")).filter(Boolean),
    relatedSearches: (data.relatedSearches || []).map((x: { query?: string }) => String(x.query || "")).filter(Boolean),
    credits: Number(data.credits) || 1,
  };
}
