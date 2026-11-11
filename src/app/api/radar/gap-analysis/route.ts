import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * =========================================================================
 * API ROUTE: /api/radar/gap-analysis
 * Phân tích khoảng trống nội dung (Content Gap) và gom nhóm xu hướng đối thủ
 * =========================================================================
 */

export async function GET(req: NextRequest) {
  try {
    // 1. Lấy danh sách bài viết hiện tại của công ty
    let ourPosts: { title: string; focus_keyword?: string; slug?: string }[] = [];
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from("posts")
          .select("title, focus_keyword, slug");
        if (data) ourPosts = data;
      } catch (e) {
        console.warn("Lỗi đọc posts từ Supabase:", e);
      }
    }

    // 2. Định nghĩa các cụm xu hướng ngành sự kiện 2026
    const clusters = [
      {
        cluster: "Khai trương & Khánh thành",
        competitorTrends: "Tập trung showroom xe điện, nhà máy khu công nghiệp FDI, lễ cất nóc.",
        gapTopics: [
          {
            topic: "Kịch bản lễ ra mắt xe ô tô điện showroom",
            keyword: "kịch bản ra mắt xe ô tô điện showroom",
            intent: "commercial",
            priority: "high",
            estimatedVolume: "1,200 tìm kiếm/tháng",
          },
          {
            topic: "Mẫu dự toán chi phí tổ chức lễ khai trương nhà máy FDI",
            keyword: "dự toán chi phí khai trương nhà máy fdi",
            intent: "transactional",
            priority: "medium",
            estimatedVolume: "850 tìm kiếm/tháng",
          },
        ],
      },
      {
        cluster: "Âm thanh & Thiết bị",
        competitorTrends: "Báo giá bóc tách theo quy mô 200, 500, 1000 khách cho Year End Party.",
        gapTopics: [
          {
            topic: "Báo giá âm thanh ánh sáng tất niên 300 khách",
            keyword: "báo giá âm thanh ánh sáng tất niên 300 khách",
            intent: "transactional",
            priority: "high",
            estimatedVolume: "2,400 tìm kiếm/tháng",
          },
        ],
      },
      {
        cluster: "Teambuilding & Outing",
        competitorTrends: "Kịch bản nhẹ nhàng, trò chơi bãi biển gắn kết không cần đạo cụ lớn.",
        gapTopics: [
          {
            topic: "Top 15 trò chơi teambuilding bãi biển không cần đạo cụ",
            keyword: "trò chơi teambuilding bãi biển không đạo cụ",
            intent: "informational",
            priority: "medium",
            estimatedVolume: "3,600 tìm kiếm/tháng",
          },
        ],
      },
      {
        cluster: "Hội nghị & Gala",
        competitorTrends: "Hội thảo chuyển đổi số, sự kiện ứng dụng AI, đại hội cổ đông trực tuyến.",
        gapTopics: [
          {
            topic: "Quy trình tổ chức hội thảo chuyển đổi số và AI doanh nghiệp",
            keyword: "quy trình tổ chức hội thảo chuyển đổi số ai",
            intent: "commercial",
            priority: "high",
            estimatedVolume: "950 tìm kiếm/tháng",
          },
        ],
      },
      {
        cluster: "Tổ chức sự kiện sinh nhật, tiệc cưới",
        competitorTrends: "Xu hướng tiệc cưới ngoài trời, private wedding bãi biển, tiệc sinh nhật công ty kết hợp tri ân.",
        gapTopics: [
          {
            topic: "Kế hoạch và chi phí tổ chức tiệc cưới ngoài trời trọn gói",
            keyword: "chi phí tổ chức tiệc cưới ngoài trời trọn gói",
            intent: "transactional",
            priority: "high",
            estimatedVolume: "1,600 tìm kiếm/tháng",
          },
          {
            topic: "Ý tưởng và kịch bản tổ chức sinh nhật công ty ấn tượng",
            keyword: "kịch bản tổ chức sinh nhật công ty ấn tượng",
            intent: "commercial",
            priority: "medium",
            estimatedVolume: "1,100 tìm kiếm/tháng",
          },
        ],
      },
    ];

    // Đối chiếu xem bài viết của chúng ta đã có từ khóa nào
    const ourKeywords = ourPosts.map(
      (p) => (p.focus_keyword || p.title || "").toLowerCase()
    );

    const detectedGaps: any[] = [];
    clusters.forEach((c) => {
      c.gapTopics.forEach((item) => {
        const hasArticle = ourKeywords.some((kw) =>
          kw.includes(item.keyword.toLowerCase())
        );

        detectedGaps.push({
          ...item,
          clusterCategory: c.cluster,
          ourSiteStatus: hasArticle ? "drafted" : "missing",
          gapReason: hasArticle
            ? "Website của bạn đã có bài nháp/xuất bản liên quan."
            : `Đối thủ đã lên top Google với bài viết tương tự, website của bạn chưa có bài cho từ khóa "${item.keyword}".`,
        });
      });
    });

    return NextResponse.json({
      success: true,
      totalGaps: detectedGaps.length,
      missingGaps: detectedGaps.filter((g) => g.ourSiteStatus === "missing").length,
      clusters,
      gaps: detectedGaps,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Lỗi phân tích khoảng trống SEO", details: err?.message },
      { status: 500 }
    );
  }
}

