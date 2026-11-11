// CHỈ dùng ở máy chủ.
/**
 * Đọc nội dung 1 bài đối thủ cho Radar (bước 3).
 * Khác bộ cào cũ (services/scraper.ts): KHÔNG BAO GIỜ tạo nội dung giả. Không đọc được -> ném lỗi,
 * để Radar không so sánh với dữ liệu bịa.
 */
export interface ReadPage {
  title: string;
  headings: string[]; // "H2: ..." / "H3: ..."
  text: string;
  wordCount: number;
}

const MIN_TEXT_CHARS = 400;
const MIN_WORDS = 150;

/** Trang chặn máy đọc / chống bot (Cloudflare...) - không phải nội dung bài. */
const BLOCK_PAGE = /(you have been blocked|access denied|attention required|just a moment|checking your browser|verify you are human|403 forbidden|enable javascript and cookies|captcha)/i;

/** Nội dung đủ thật để lưu: đủ dài và không phải trang chặn. */
function usable(page: ReadPage): string | null {
  if (BLOCK_PAGE.test(page.title) || BLOCK_PAGE.test(page.text.slice(0, 600))) return "trang chặn máy đọc";
  if (page.text.length < MIN_TEXT_CHARS || page.wordCount < MIN_WORDS) return "nội dung quá ngắn";
  return null;
}

function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** Jina Reader trả markdown: "Title: ...", "URL Source: ...", "Markdown Content:" rồi nội dung. */
function parseJina(raw: string): ReadPage {
  const titleLine = raw.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || "";
  const body = raw.includes("Markdown Content:") ? raw.split("Markdown Content:").slice(1).join("") : raw;
  const headings: string[] = [];
  body.split("\n").forEach((line) => {
    const m = line.trim().match(/^(#{2,3})\s+(.+)$/);
    if (m) headings.push(`${m[1].length === 2 ? "H2" : "H3"}: ${m[2].replace(/[*_`[\]]/g, "").replace(/\(http[^)]*\)/g, "").trim()}`);
  });
  const text = body
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // ảnh
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // link -> chữ
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return { title: h1 || titleLine, headings: headings.slice(0, 60), text, wordCount: countWords(text) };
}

function parseHtml(html: string): ReadPage {
  const pick = (re: RegExp) => decodeEntities((html.match(re)?.[1] || "").replace(/<[^>]+>/g, "")).trim();
  const title = pick(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || pick(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const headings: string[] = [];
  for (const m of html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const t = decodeEntities(m[2].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    if (t) headings.push(`H${m[1]}: ${t}`);
  }
  const main = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || html;
  const text = decodeEntities(
    main
      .replace(/<(script|style|noscript|svg|header|nav|footer|aside|form)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
  return { title, headings: headings.slice(0, 60), text, wordCount: countWords(text) };
}

export async function readCompetitorPage(url: string): Promise<ReadPage> {
  const errors: string[] = [];

  // 1. Jina Reader: lấy phần nội dung chính, bỏ menu / quảng cáo
  try {
    const res = await fetch(`https://r.jina.ai/${encodeURI(url)}`, {
      headers: { Accept: "text/plain", "X-Return-Format": "markdown" },
      signal: AbortSignal.timeout(25_000),
    });
    if (res.ok) {
      const page = parseJina(await res.text());
      const problem = usable(page);
      if (!problem) return page;
      errors.push(`Jina: ${problem}`);
    } else {
      errors.push(`Jina: HTTP ${res.status}`);
    }
  } catch (err) {
    errors.push(`Jina: ${err instanceof Error ? err.message : "lỗi"}`);
  }

  // 2. Dự phòng: tải HTML trực tiếp
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
        "Accept-Language": "vi-VN,vi;q=0.9",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) {
      const page = parseHtml(await res.text());
      const problem = usable(page);
      if (!problem) return page;
      errors.push(`Tải trực tiếp: ${problem}`);
    } else {
      errors.push(`Tải trực tiếp: HTTP ${res.status}`);
    }
  } catch (err) {
    errors.push(`Tải trực tiếp: ${err instanceof Error ? err.message : "lỗi"}`);
  }

  throw new Error(`Không đọc được trang (${errors.join("; ")})`);
}
