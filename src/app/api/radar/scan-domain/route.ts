import { NextRequest, NextResponse } from "next/server";
import { scanDomainForArticles } from "../services";

/**
 * =========================================================================
 * API ROUTE: /api/radar/scan-domain
 * Quét toàn bộ sitemap hoặc trang chủ đối thủ để trích xuất bài viết
 * =========================================================================
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain } = body;

    if (!domain || typeof domain !== "string" || !domain.trim()) {
      return NextResponse.json(
        {
          error: "Vui lòng nhập tên miền hoặc địa chỉ website đối thủ (ví dụ: viet-power.vn hoặc https://viet-power.vn).",
        },
        { status: 400 }
      );
    }

    const trimmedDomain = domain.trim();

    // Thực thi quét bài viết từ sitemap & domain
    const result = await scanDomainForArticles(trimmedDomain);

    return NextResponse.json({
      success: true,
      domain: result.domain,
      sitemapFound: result.sitemapFound,
      totalFound: result.totalFound,
      unscrapedCount: result.unscrapedCount,
      urls: result.urls,
      message:
        result.totalFound > 0
          ? `Đã quét thành công ${result.totalFound} bài viết từ ${result.domain} (${result.unscrapedCount} bài mới chưa cào)!`
          : `Không tìm thấy sitemap công khai trên ${result.domain}. Hãy thử nhập URL bài viết đơn lẻ.`,
    });
  } catch (error: any) {
    console.error("[API Scan Domain Error]:", error);
    return NextResponse.json(
      {
        error: "Đã xảy ra lỗi khi quét tên miền đối thủ.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
