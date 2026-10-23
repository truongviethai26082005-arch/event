import { XMLParser } from "fast-xml-parser";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ScannedArticleUrl, DomainScanResult } from "./types";

/**
 * =========================================================================
 * DOMAIN & SITEMAP SCANNER SERVICE
 * Tự động quét sitemap và dò tìm danh sách bài viết từ domain đối thủ
 * =========================================================================
 */

// Danh sách đường dẫn sitemap phổ biến
const SITEMAP_CANDIDATE_PATHS = [
  "/sitemap.xml",
  "/sitemap_index.xml",
  "/post-sitemap.xml",
  "/news-sitemap.xml",
  "/posts-sitemap.xml",
  "/feed",
];

// Danh sách các từ khóa URL tĩnh cần LOẠI BỎ (không phải bài viết)
const EXCLUDED_URL_PATTERNS = [
  /\/gioi-thieu/i,
  /\/ve-chung-toi/i,
  /\/about/i,
  /\/lien-he/i,
  /\/contact/i,
  /\/tuyen-dung/i,
  /\/career/i,
  /\/chinh-sach/i,
  /\/quy-dinh/i,
  /\/dieu-khoan/i,
  /\/privacy/i,
  /\/terms/i,
  /\/cart/i,
  /\/gio-hang/i,
  /\/thanh-toan/i,
  /\/checkout/i,
  /\/my-account/i,
  /\/tai-khoan/i,
  /\/login/i,
  /\/dang-nhap/i,
  /\/register/i,
  /\/dang-ky/i,
  /\/category\//i,
  /\/chuyen-muc\//i,
  /\/danh-muc\//i,
  /\/tag\//i,
  /\/the\//i,
  /\/author\//i,
  /\/tac-gia\//i,
  /\/page\/\d+/i,
  /\/wp-json/i,
  /\/wp-content\/plugins/i,
  /\/feed\/?$/i,
  /\/rss\/?$/i,
  /\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|rar|docx?|xlsx?|mp4|mp3)$/i,
];

/**
 * Tạo tiêu đề bài viết dễ đọc từ URL slug nếu không có title từ sitemap
 */
export function formatTitleFromSlug(urlStr: string): string {
  try {
    const urlObj = new URL(urlStr);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "";
    const cleanSlug = lastPart.replace(/\.html?$/i, "");
    if (!cleanSlug) return urlObj.hostname;

    // Chuyển dấu gạch ngang thành dấu cách và viết hoa chữ cái đầu
    const words = cleanSlug.split("-").filter(Boolean);
    if (words.length === 0) return urlObj.pathname;

    const sentence = words.join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  } catch {
    return urlStr;
  }
}

/**
 * Chuẩn hóa input domain thành URL gốc hợp lệ (VD: https://viet-power.vn)
 */
export function normalizeDomain(rawDomain: string): { origin: string; fullUrl: string } {
  let domain = rawDomain.trim();
  if (!/^https?:\/\//i.test(domain)) {
    domain = `https://${domain}`;
  }
  const parsed = new URL(domain);
  return {
    origin: parsed.origin,
    fullUrl: domain,
  };
}

/**
 * Helper fetch an toàn với User-Agent và Timeout 8s
 */
async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 RadarSeoBot/2.0",
        Accept: "text/xml, application/xml, application/xhtml+xml, text/html;q=0.9, */*;q=0.8",
      },
    });
    return res;
  } catch (err: any) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Bóc tách danh sách URL từ nội dung XML (hỗ trợ urlset, sitemapindex, rss)
 */
function parseSitemapXml(
  xmlText: string,
  origin: string
): { articleUrls: { url: string; lastMod?: string; title?: string }[]; childSitemaps: string[] } {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });

  const parsed = parser.parse(xmlText);
  const articleUrls: { url: string; lastMod?: string; title?: string }[] = [];
  const childSitemaps: string[] = [];

  // Trường hợp 1: Sitemap Index (<sitemapindex><sitemap><loc>...</loc></sitemap></sitemapindex>)
  if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
    const rawSitemaps = Array.isArray(parsed.sitemapindex.sitemap)
      ? parsed.sitemapindex.sitemap
      : [parsed.sitemapindex.sitemap];

    for (const sm of rawSitemaps) {
      const loc = typeof sm.loc === "string" ? sm.loc.trim() : "";
      if (loc) {
        childSitemaps.push(loc);
      }
    }
    return { articleUrls, childSitemaps };
  }

  // Trường hợp 2: URL Set (<urlset><url><loc>...</loc></url></urlset>)
  if (parsed.urlset && parsed.urlset.url) {
    const rawUrls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];

    for (const u of rawUrls) {
      const loc = typeof u.loc === "string" ? u.loc.trim() : "";
      const lastMod = typeof u.lastmod === "string" ? u.lastmod.trim() : undefined;
      let title: string | undefined = undefined;

      // Hỗ trợ trích xuất title từ image:title hoặc news:title nếu có
      if (u["image:image"] && u["image:image"]["image:title"]) {
        title = String(u["image:image"]["image:title"]).trim();
      } else if (u["news:news"] && u["news:news"]["news:title"]) {
        title = String(u["news:news"]["news:title"]).trim();
      }

      if (loc && isPotentialArticleUrl(loc, origin)) {
        articleUrls.push({ url: loc, lastMod, title });
      }
    }
  }

  // Trường hợp 3: RSS Feed (<rss><channel><item><link>...</link></item></channel></rss>)
  if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
    const items = Array.isArray(parsed.rss.channel.item)
      ? parsed.rss.channel.item
      : [parsed.rss.channel.item];

    for (const item of items) {
      const link = typeof item.link === "string" ? item.link.trim() : "";
      const title = typeof item.title === "string" ? item.title.trim() : undefined;
      const pubDate = typeof item.pubDate === "string" ? item.pubDate.trim() : undefined;

      if (link && isPotentialArticleUrl(link, origin)) {
        articleUrls.push({ url: link, lastMod: pubDate, title });
      }
    }
  }

  return { articleUrls, childSitemaps };
}

/**
 * Kiểm tra xem URL có phải là bài viết hợp lệ không (loại bỏ trang chủ, liên kết tĩnh, danh mục, file)
 */
function isPotentialArticleUrl(urlStr: string, origin: string): boolean {
  try {
    const u = new URL(urlStr);
    const parsedOrigin = new URL(origin);

    // Cùng hostname
    if (u.hostname !== parsedOrigin.hostname) return false;

    // Loại bỏ trang chủ
    const path = u.pathname.trim();
    if (!path || path === "/" || path === "") return false;

    // Kiểm tra danh sách loại trừ tĩnh
    for (const pattern of EXCLUDED_URL_PATTERNS) {
      if (pattern.test(path)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Dò tìm bài viết trực tiếp từ HTML trang chủ nếu sitemap không tồn tại hoặc bị chặn
 */
async function fallbackScrapeFromHtml(
  origin: string
): Promise<{ url: string; title: string; lastMod?: string }[]> {
  try {
    const res = await fetchWithTimeout(origin, 8000);
    if (!res || !res.ok) return [];

    const html = await res.text();
    const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const foundMap = new Map<string, { url: string; title: string }>();

    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1]?.trim();
      const rawAnchorText = match[2]?.replace(/<[^>]+>/g, "").trim() || "";

      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        continue;
      }

      if (href.startsWith("/")) {
        href = `${origin}${href}`;
      }

      if (isPotentialArticleUrl(href, origin)) {
        // Chỉ nhận các đường link có dấu gạch ngang (slug bài viết)
        const path = new URL(href).pathname;
        if (path.includes("-") && !foundMap.has(href)) {
          foundMap.set(href, {
            url: href,
            title: rawAnchorText && rawAnchorText.length > 10 ? rawAnchorText : formatTitleFromSlug(href),
          });
        }
      }
    }

    return Array.from(foundMap.values());
  } catch {
    return [];
  }
}

/**
 * Lấy danh sách URL đã từng cào từ Supabase (competitor_logs và posts)
 */
async function getAlreadyScrapedUrls(): Promise<Set<string>> {
  const scrapedSet = new Set<string>();
  if (!isSupabaseConfigured) return scrapedSet;

  try {
    // 1. Kiểm tra bảng competitor_logs
    const { data: logs } = await supabase
      .from("competitor_logs")
      .select("competitor_url")
      .limit(1000);

    if (logs) {
      for (const row of logs) {
        if (row.competitor_url) {
          scrapedSet.add(row.competitor_url.trim().toLowerCase());
        }
      }
    }

    // 2. Kiểm tra bảng posts
    const { data: posts } = await supabase
      .from("posts")
      .select("competitor_source_url")
      .not("competitor_source_url", "is", null)
      .limit(1000);

    if (posts) {
      for (const row of posts) {
        if (row.competitor_source_url) {
          scrapedSet.add(row.competitor_source_url.trim().toLowerCase());
        }
      }
    }
  } catch (err: any) {
    console.warn("[DomainScanner] Không thể đọc Supabase để kiểm tra URL cũ:", err?.message);
  }

  return scrapedSet;
}

/**
 * HÀM CHÍNH: Quét toàn diện Domain đối thủ và trích xuất danh sách bài viết
 */
export async function scanDomainForArticles(rawDomain: string): Promise<DomainScanResult> {
  const { origin } = normalizeDomain(rawDomain);
  const collectedUrlsMap = new Map<string, { url: string; lastMod?: string; title?: string }>();
  let successfulSitemapUrl: string | null = null;

  // 1. Thử duyệt qua các đường dẫn sitemap phổ biến
  for (const candidatePath of SITEMAP_CANDIDATE_PATHS) {
    const candidateUrl = `${origin}${candidatePath}`;
    const res = await fetchWithTimeout(candidateUrl, 6000);

    if (res && res.ok) {
      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      // Kiểm tra có phải XML / RSS không
      if (
        text.includes("<urlset") ||
        text.includes("<sitemapindex") ||
        text.includes("<rss") ||
        text.includes("<feed")
      ) {
        successfulSitemapUrl = candidateUrl;
        const { articleUrls, childSitemaps } = parseSitemapXml(text, origin);

        // Lưu các URL tìm thấy trong sitemap hiện tại
        for (const item of articleUrls) {
          if (!collectedUrlsMap.has(item.url)) {
            collectedUrlsMap.set(item.url, item);
          }
        }

        // Nếu là sitemap index, đào sâu tiếp vào các sitemap con
        if (childSitemaps.length > 0) {
          // Ưu tiên sitemap chứa từ khóa post, tin-tuc, bai-viet, news
          const postSitemaps = childSitemaps.filter(
            (sm) => /post|blog|tin-tuc|bai-viet|news|article/i.test(sm)
          );
          const targetSitemaps = postSitemaps.length > 0 ? postSitemaps : childSitemaps.slice(0, 3);

          for (const childUrl of targetSitemaps) {
            const childRes = await fetchWithTimeout(childUrl, 6000);
            if (childRes && childRes.ok) {
              const childText = await childRes.text();
              const childResult = parseSitemapXml(childText, origin);
              for (const item of childResult.articleUrls) {
                if (!collectedUrlsMap.has(item.url)) {
                  collectedUrlsMap.set(item.url, item);
                }
              }
            }
          }
        }

        // Nếu đã tìm thấy đủ bài viết trong sitemap, dừng dò tìm các path khác
        if (collectedUrlsMap.size >= 10) {
          break;
        }
      }
    }
  }

  // 2. Nếu sitemap không tìm thấy bài nào, kích hoạt fallback quét từ HTML trang chủ
  if (collectedUrlsMap.size === 0) {
    const fallbackArticles = await fallbackScrapeFromHtml(origin);
    for (const item of fallbackArticles) {
      collectedUrlsMap.set(item.url, item);
    }
  }

  // 3. Truy vấn Supabase để đối chiếu URL đã cào hay chưa
  const alreadyScrapedSet = await getAlreadyScrapedUrls();

  // 4. Định dạng và phân loại danh sách trả về
  const allList = Array.from(collectedUrlsMap.values()).map((item) => {
    const isScraped = alreadyScrapedSet.has(item.url.toLowerCase());
    return {
      url: item.url,
      title: item.title || formatTitleFromSlug(item.url),
      lastMod: item.lastMod,
      isScraped,
    };
  });

  // Ưu tiên hiển thị bài chưa cào lên đầu, sắp xếp theo thời gian mới nhất nếu có
  allList.sort((a, b) => {
    if (a.isScraped !== b.isScraped) {
      return a.isScraped ? 1 : -1;
    }
    if (a.lastMod && b.lastMod) {
      return new Date(b.lastMod).getTime() - new Date(a.lastMod).getTime();
    }
    return 0;
  });

  // Giới hạn trả về tối đa 50 bài viết
  const finalUrls: ScannedArticleUrl[] = allList.slice(0, 50);
  const unscrapedCount = finalUrls.filter((u) => !u.isScraped).length;

  return {
    domain: origin,
    sitemapFound: successfulSitemapUrl,
    totalFound: finalUrls.length,
    unscrapedCount,
    urls: finalUrls,
  };
}
