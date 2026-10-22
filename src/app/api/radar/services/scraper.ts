/**
 * BƯỚC 1: SCRAPER SERVICE - CÀO & LÀM SẠCH DỮ LIỆU ĐỐI THỦ
 * Tách biệt hoàn toàn, xử lý triệt để các rác thải HTML / Markdown
 * Phạm vi: Nội bộ src/app/api/radar/services/scraper.ts
 */

import { ScrapedData } from "./types";

/**
 * Loại bỏ các thành phần rác (header, nav, footer, sidebar, widget, form, comment)
 */
function cleanExtractedContent(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Loại bỏ các thẻ HTML script, style, svg, iframe, noscript
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  text = text.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "");
  text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");

  // 2. Loại bỏ các đoạn văn bản phổ biến thuộc header, footer, navigation, cookie banner
  const noisyPatterns = [
    /^(trang chủ|menu|chính sách bảo mật|điều khoản|liên hệ|giới thiệu|bài viết liên quan|tin tức mới nhất|theo dõi chúng tôi|đăng ký nhận tin)[\s\:\-]*$/gim,
    /^share on\s+.*$/gim,
    /^chia sẻ bài viết[\s\:\-]*$/gim,
    /^bình luận[\s\:\-]*$/gim,
    /^để lại bình luận[\s\:\-]*$/gim,
    /^xem thêm\s*[\:\-].*$/gim,
    /^bài viết cùng chuyên mục.*$/gim,
  ];

  for (const pattern of noisyPatterns) {
    text = text.replace(pattern, "");
  }

  // 3. Chuẩn hóa khoảng trắng và dòng trống
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n\n");

  return text;
}

/**
 * Trích xuất danh sách heading (H1, H2, H3) từ văn bản
 */
function extractHeadings(markdownText: string): { title: string; headings: string[] } {
  const lines = markdownText.split("\n");
  let title = "";
  const headings: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ") && !title) {
      title = trimmed.replace(/^#\s+/, "").trim();
    } else if (trimmed.startsWith("## ")) {
      const h2 = trimmed.replace(/^##\s+/, "").trim();
      if (h2.length > 3 && headings.length < 12) {
        headings.push(`H2: ${h2}`);
      }
    } else if (trimmed.startsWith("### ")) {
      const h3 = trimmed.replace(/^###\s+/, "").trim();
      if (h3.length > 3 && headings.length < 16) {
        headings.push(`H3: ${h3}`);
      }
    }
  }

  if (!title) {
    // Tìm dòng đầu tiên có độ dài phù hợp làm tiêu đề
    const candidate = lines.find((l) => l.trim().length > 15 && l.trim().length < 120);
    title = candidate ? candidate.trim() : "Bài viết phân tích đối thủ";
  }

  return { title, headings };
}

/**
 * Service chính để cào và làm sạch nội dung bài viết đối thủ
 */
export async function scrapeAndCleanCompetitor(url: string, keyword: string): Promise<ScrapedData> {
  const sanitizedUrl = url.trim();
  let rawText = "";

  // 1. Ưu tiên cào qua Jina Reader (công cụ chuyên trích xuất Main Content của bài viết)
  try {
    const jinaUrl = `https://r.jina.ai/${encodeURI(sanitizedUrl)}`;
    const res = await fetch(jinaUrl, {
      headers: {
        Accept: "text/plain",
        "User-Agent": "TruongHaiEvent-RadarSEO/2.0",
      },
      signal: AbortSignal.timeout(12000), // Timeout 12 giây
    });

    if (res.ok) {
      rawText = await res.text();
    }
  } catch (err: any) {
    console.warn("[Scraper] Jina Reader fetch timeout/error, thử fetch trực tiếp:", err?.message);
  }

  // 2. Nếu Jina thất bại, fetch trực tiếp HTML và gọt sạch
  if (!rawText || rawText.length < 100) {
    try {
      const directRes = await fetch(sanitizedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(8000),
      });

      if (directRes.ok) {
        const html = await directRes.text();
        // Gọt sạch HTML đơn giản sang text
        rawText = html
          .replace(/<header[\s\S]*?<\/header>/gi, "")
          .replace(/<nav[\s\S]*?<\/nav>/gi, "")
          .replace(/<footer[\s\S]*?<\/footer>/gi, "")
          .replace(/<aside[\s\S]*?<\/aside>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ");
      }
    } catch (directErr: any) {
      console.warn("[Scraper] Direct fetch failed:", directErr?.message);
    }
  }

  // 3. Fallback tối thiểu nếu URL bị chặn hoặc hoàn toàn không cào được
  if (!rawText || rawText.length < 100) {
    rawText = `Nội dung đối thủ từ URL: ${sanitizedUrl}\nChủ đề nghiên cứu: ${keyword}\n(Chế độ dự phòng phân tích tối ưu hóa nội dung)`;
  }

  const cleanText = cleanExtractedContent(rawText.slice(0, 15000));
  const { title, headings } = extractHeadings(cleanText);
  const wordCountEstimate = Math.max(250, cleanText.split(/\s+/).length);

  return {
    title,
    headings,
    cleanText,
    wordCountEstimate,
  };
}
