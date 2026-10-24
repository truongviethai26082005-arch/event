import { XMLParser } from "fast-xml-parser";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ScannedArticleUrl, DomainScanResult } from "./types";

/**
 * =========================================================================
 * DOMAIN & SITEMAP SCANNER SERVICE v2.0
 * Tự động quét đệ quy Sitemap Index & Category Crawler bóc tách bài viết chi tiết
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
  /\/wp-json/i,
  /\/wp-content\/plugins/i,
  /\/wp-includes/i,
  /\/xmlrpc\.php/i,
  /\/feed\/?$/i,
  /\/rss\/?$/i,
  /\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|rar|docx?|xlsx?|mp4|mp3|css|js|ico|xml|xsl)$/i,
];

// Tên danh mục / trang tĩnh cấp 1 cần loại bỏ khỏi danh sách bài viết
const CATEGORY_NAMES = new Set([
  "tin-tuc",
  "kien-thuc",
  "blog",
  "blogs",
  "su-kien",
  "du-an",
  "dich-vu",
  "gioi-thieu",
  "ve-chung-toi",
  "lien-he",
  "contact",
  "about",
  "about-us",
  "tuyen-dung",
  "career",
  "careers",
  "chinh-sach",
  "quy-dinh",
  "dieu-khoan",
  "privacy",
  "terms",
  "bao-gia",
  "khuyen-mai",
  "bang-gia",
  "thiet-bi",
  "san-pham",
  "shop",
  "news",
  "articles",
  "posts",
  "projects",
  "services",
  "category",
  "categories",
  "tag",
  "tags",
  "author",
  "tac-gia",
  "chuyen-muc",
  "danh-muc",
  "trang-chu",
  "home",
]);

import { restoreDiacriticsFromDictionary } from "./vietnamese-diacritics";

/**
 * Tạo tiêu đề bài viết dễ đọc và có dấu tiếng Việt từ URL slug nếu không có title từ sitemap
 */
export function formatTitleFromSlug(urlStr: string): string {
  try {
    const urlObj = new URL(urlStr);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || "";
    const cleanSlug = lastPart.replace(/\.html?$/i, "");
    if (!cleanSlug) return urlObj.hostname;

    const words = cleanSlug.split("-").filter(Boolean);
    if (words.length === 0) return urlObj.pathname;

    const sentence = words.join(" ");
    // Khôi phục dấu tiếng Việt chuẩn xác theo từ điển sự kiện
    const accented = restoreDiacriticsFromDictionary(sentence);
    return accented.charAt(0).toUpperCase() + accented.slice(1);
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
 * Helper fetch an toàn với User-Agent và Timeout
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
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Kiểm tra xem sitemap con có phải là sitemap rác không (danh mục, tag, tác giả, ảnh)
 */
function isLikelyNonArticleSitemap(sitemapUrl: string): boolean {
  const lower = sitemapUrl.toLowerCase();
  return /categor|taxonom|tag|author|pages\.xml|page-sitemap|attachment|media|gallery|galleries|portfolio-category/i.test(
    lower
  );
}

/**
 * Chấm điểm ưu tiên sitemap bài viết (post, blog, tin-tuc, article)
 */
function getSitemapPriority(url: string): number {
  const lower = url.toLowerCase();
  if (
    lower.includes("post") ||
    lower.includes("blog") ||
    lower.includes("tin-tuc") ||
    lower.includes("article") ||
    lower.includes("news")
  ) {
    return 10;
  }
  if (lower.includes("project")) return 5;
  return 1;
}

/**
 * KIỂM TRA CHÍNH XÁC: URL có phải là bài viết chi tiết thực thụ không?
 * Loại bỏ triệt để các link danh mục gốc (/tin-tuc, /tin-tuc/, /danh-muc/, /category/, /page/2)
 */
export function isDetailedArticleUrl(urlStr: string, origin: string): boolean {
  try {
    const u = new URL(urlStr);
    const parsedOrigin = new URL(origin);

    // Bắt buộc cùng hostname
    if (u.hostname !== parsedOrigin.hostname) return false;

    const path = u.pathname.trim();
    if (!path || path === "/" || path === "") return false;

    // 1. Loại bỏ các file tĩnh, ảnh, media
    if (
      /\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|rar|docx?|xlsx?|mp4|mp3|css|js|ico|xml|xsl)$/i.test(
        path
      )
    ) {
      return false;
    }

    // 2. Loại bỏ phân trang /page/2, /p/2
    if (/\/page\/\d+/i.test(path) || /\/p\/\d+/i.test(path)) {
      return false;
    }

    // 3. Loại bỏ các URL kỹ thuật
    if (
      /\/wp-json/i.test(path) ||
      /\/wp-content/i.test(path) ||
      /\/wp-includes/i.test(path) ||
      /\/feed\/?$/i.test(path) ||
      /\/rss\/?$/i.test(path)
    ) {
      return false;
    }

    const pathParts = path.split("/").filter(Boolean);
    if (pathParts.length === 0) return false;

    // 4. Nếu chỉ có 1 cấp (VD: /tin-tuc, /gioi-thieu, /dich-vu, /lien-he)
    if (pathParts.length === 1) {
      const singleSlug = pathParts[0].toLowerCase().replace(/\.html?$/i, "");
      // Nếu slug này thuộc danh mục hoặc trang tĩnh thì chắc chắn KHÔNG phải bài viết chi tiết
      if (CATEGORY_NAMES.has(singleSlug)) return false;
      // Slug bài viết phải có dấu gạch ngang hoặc dài >= 10 ký tự
      if (!singleSlug.includes("-") && singleSlug.length < 10) return false;
    }

    // 5. Nếu có nhiều cấp và cấp đầu là tiền tố danh mục (category, chuyen-muc, danh-muc, tag)
    const firstPart = pathParts[0].toLowerCase();
    if (
      firstPart === "category" ||
      firstPart === "chuyen-muc" ||
      firstPart === "danh-muc" ||
      firstPart === "tag" ||
      firstPart === "the" ||
      firstPart === "author"
    ) {
      // Nếu chỉ có 1-2 cấp (VD: /category/tin-tuc) thì là trang danh mục, không phải bài viết chi tiết
      if (pathParts.length <= 2) return false;
    }

    // 6. Kiểm tra danh sách loại trừ tĩnh
    for (const pattern of EXCLUDED_URL_PATTERNS) {
      if (pattern.test(path)) {
        return false;
      }
    }

    // 7. Kiểm tra slug cuối cùng
    const lastSlug = pathParts[pathParts.length - 1].toLowerCase().replace(/\.html?$/i, "");
    if (CATEGORY_NAMES.has(lastSlug)) return false;
    if (!lastSlug.includes("-") && lastSlug.length < 8) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Kiểm tra xem URL có phải là trang danh mục không (để đưa vào Category Crawler)
 */
function isCategoryUrl(urlStr: string, origin: string): boolean {
  try {
    const u = new URL(urlStr);
    const parsedOrigin = new URL(origin);
    if (u.hostname !== parsedOrigin.hostname) return false;

    const pathParts = u.pathname.split("/").filter(Boolean);
    if (pathParts.length === 0) return false;

    if (pathParts.length === 1 && CATEGORY_NAMES.has(pathParts[0].toLowerCase())) {
      return true;
    }

    if (
      pathParts.some((p) =>
        ["category", "chuyen-muc", "danh-muc", "tag", "the"].includes(p.toLowerCase())
      )
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Đọc ĐỆ QUY Sitemap Index và Sitemap con (Recursive Sitemap Parser)
 */
async function crawlSitemapsRecursive(
  sitemapUrl: string,
  origin: string,
  depth = 0,
  visited = new Set<string>(),
  collectedArticles = new Map<string, { url: string; lastMod?: string; title?: string }>(),
  discoveredCategories = new Set<string>()
): Promise<void> {
  if (depth > 2 || visited.has(sitemapUrl)) return;
  visited.add(sitemapUrl);

  const res = await fetchWithTimeout(sitemapUrl, 7000);
  if (!res || !res.ok) return;

  const xmlText = await res.text();
  if (
    !xmlText.includes("<urlset") &&
    !xmlText.includes("<sitemapindex") &&
    !xmlText.includes("<rss") &&
    !xmlText.includes("<feed")
  ) {
    return;
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });

  let parsed: any;
  try {
    parsed = parser.parse(xmlText);
  } catch {
    return;
  }

  // TRƯỜNG HỢP 1: SITEMAP INDEX (<sitemapindex><sitemap><loc>...</loc></sitemap></sitemapindex>)
  if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
    const rawSitemaps = Array.isArray(parsed.sitemapindex.sitemap)
      ? parsed.sitemapindex.sitemap
      : [parsed.sitemapindex.sitemap];

    const childSitemaps: string[] = [];
    for (const sm of rawSitemaps) {
      const loc = typeof sm.loc === "string" ? sm.loc.trim() : "";
      if (loc && !isLikelyNonArticleSitemap(loc)) {
        childSitemaps.push(loc);
      }
    }

    // Sắp xếp ưu tiên: Sitemaps bài viết lên trước, sitemap mới nhất lên đầu
    childSitemaps.sort((a, b) => getSitemapPriority(b) - getSitemapPriority(a));

    // Lấy tối đa 12 sitemap con triển vọng nhất
    const topChildSitemaps = childSitemaps.slice(0, 12);

    // Fetch đệ quy song song các sitemap con
    await Promise.allSettled(
      topChildSitemaps.map((childUrl) =>
        crawlSitemapsRecursive(
          childUrl,
          origin,
          depth + 1,
          visited,
          collectedArticles,
          discoveredCategories
        )
      )
    );
    return;
  }

  // TRƯỜNG HỢP 2: URL SET (<urlset><url><loc>...</loc></url></urlset>)
  if (parsed.urlset && parsed.urlset.url) {
    const rawUrls = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];

    for (const u of rawUrls) {
      const loc = typeof u.loc === "string" ? u.loc.trim() : "";
      const lastMod = typeof u.lastmod === "string" ? u.lastmod.trim() : undefined;
      let title: string | undefined = undefined;

      if (u["image:image"] && u["image:image"]["image:title"]) {
        title = String(u["image:image"]["image:title"]).trim();
      } else if (u["news:news"] && u["news:news"]["news:title"]) {
        title = String(u["news:news"]["news:title"]).trim();
      }

      if (loc) {
        if (isDetailedArticleUrl(loc, origin)) {
          if (!collectedArticles.has(loc)) {
            collectedArticles.set(loc, { url: loc, lastMod, title });
          }
        } else if (isCategoryUrl(loc, origin)) {
          discoveredCategories.add(loc);
        }
      }
    }
    return;
  }

  // TRƯỜNG HỢP 3: RSS FEED (<rss><channel><item><link>...</link></item></channel></rss>)
  if (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) {
    const items = Array.isArray(parsed.rss.channel.item)
      ? parsed.rss.channel.item
      : [parsed.rss.channel.item];

    for (const item of items) {
      const link = typeof item.link === "string" ? item.link.trim() : "";
      const title = typeof item.title === "string" ? item.title.trim() : undefined;
      const pubDate = typeof item.pubDate === "string" ? item.pubDate.trim() : undefined;

      if (link && isDetailedArticleUrl(link, origin)) {
        if (!collectedArticles.has(link)) {
          collectedArticles.set(link, { url: link, lastMod: pubDate, title });
        }
      }
    }
  }
}

/**
 * CATEGORY CRAWLER: Đào sâu vào các trang danh mục để tìm bài viết con
 * (Áp dụng khi đối thủ không có sitemap chi tiết hoặc sitemap chỉ trả về các link danh mục)
 */
async function crawlCategoryPagesForArticles(
  categoryUrls: string[],
  origin: string,
  collectedArticles: Map<string, { url: string; lastMod?: string; title?: string }>
): Promise<void> {
  const targetCategoryUrls = Array.from(new Set(categoryUrls)).slice(0, 6);

  await Promise.allSettled(
    targetCategoryUrls.map(async (catUrl) => {
      const res = await fetchWithTimeout(catUrl, 7000);
      if (!res || !res.ok) return;

      const html = await res.text();
      // Tìm tất cả thẻ <a href="...">text</a>
      const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

      let match: RegExpExecArray | null;
      while ((match = linkRegex.exec(html)) !== null) {
        let href = match[1]?.trim();
        const rawAnchorText = match[2]?.replace(/<[^>]+>/g, "").trim() || "";

        if (
          !href ||
          href.startsWith("#") ||
          href.startsWith("javascript:") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          continue;
        }

        if (href.startsWith("/")) {
          href = `${origin}${href}`;
        }

        if (isDetailedArticleUrl(href, origin)) {
          if (!collectedArticles.has(href)) {
            // Anchor text hợp lệ (> 15 ký tự và không phải nút "Xem thêm")
            const isGoodTitle =
              rawAnchorText.length >= 15 &&
              !/^(xem thêm|chi tiết|read more|click|tại đây|xem tiếp)/i.test(rawAnchorText);

            collectedArticles.set(href, {
              url: href,
              title: isGoodTitle ? rawAnchorText : formatTitleFromSlug(href),
            });
          }
        }
      }
    })
  );
}

/**
 * Lấy danh sách URL đã từng cào từ Supabase (competitor_logs và posts)
 */
async function getAlreadyScrapedUrls(): Promise<Set<string>> {
  const scrapedSet = new Set<string>();
  if (!isSupabaseConfigured) return scrapedSet;

  try {
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
 * HÀM CHÍNH: Quét toàn diện Domain đối thủ và trích xuất danh sách bài viết chi tiết
 */
export async function scanDomainForArticles(rawDomain: string): Promise<DomainScanResult> {
  const { origin } = normalizeDomain(rawDomain);
  const collectedArticles = new Map<string, { url: string; lastMod?: string; title?: string }>();
  const discoveredCategories = new Set<string>();
  const visitedSitemaps = new Set<string>();
  let successfulSitemapUrl: string | null = null;

  // 1. Thử duyệt qua các đường dẫn sitemap phổ biến
  for (const candidatePath of SITEMAP_CANDIDATE_PATHS) {
    const candidateUrl = `${origin}${candidatePath}`;
    const initialSize = collectedArticles.size;

    await crawlSitemapsRecursive(
      candidateUrl,
      origin,
      0,
      visitedSitemaps,
      collectedArticles,
      discoveredCategories
    );

    if (collectedArticles.size > initialSize) {
      successfulSitemapUrl = candidateUrl;
      // Nếu đã thu thập được >= 15 bài viết chi tiết từ sitemap thì dừng
      if (collectedArticles.size >= 15) {
        break;
      }
    }
  }

  // 2. KÍCH HOẠT CATEGORY CRAWLER: Nếu sitemap không có hoặc thu được < 15 bài
  if (collectedArticles.size < 15) {
    // Bổ sung các đường dẫn danh mục phổ biến của website sự kiện
    const candidateCategories = [
      ...Array.from(discoveredCategories),
      `${origin}/tin-tuc`,
      `${origin}/blog`,
      `${origin}/kien-thuc`,
      `${origin}/su-kien`,
      `${origin}/kinh-nghiem`,
      `${origin}/cam-nang`,
      `${origin}/du-an`,
    ];

    await crawlCategoryPagesForArticles(candidateCategories, origin, collectedArticles);
  }

  // 3. Nếu vẫn không có bài viết nào, quét trực tiếp từ HTML trang chủ
  if (collectedArticles.size === 0) {
    await crawlCategoryPagesForArticles([origin], origin, collectedArticles);
  }

  // 4. Lọc lại một lần nữa bằng Quality Gate: Tuyệt đối không để lọt link danh mục
  const verifiedArticles = Array.from(collectedArticles.values()).filter((item) =>
    isDetailedArticleUrl(item.url, origin)
  );

  // 5. Truy vấn Supabase để đối chiếu URL đã cào hay chưa
  const alreadyScrapedSet = await getAlreadyScrapedUrls();

  // 6. Định dạng danh sách trả về
  const allList: ScannedArticleUrl[] = verifiedArticles.map((item) => {
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

  // Giới hạn trả về tối đa 50 bài viết chi tiết
  const finalUrls = allList.slice(0, 50);
  const unscrapedCount = finalUrls.filter((u) => !u.isScraped).length;

  return {
    domain: origin,
    sitemapFound: successfulSitemapUrl,
    totalFound: finalUrls.length,
    unscrapedCount,
    urls: finalUrls,
  };
}
