import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  scrapeAndCleanCompetitor,
  analyzeIntentAndBuildOutline,
  generateFullContentAndSchema,
  toSentenceCase,
  cleanMarkdownHeadings,
  formatHeadingSentenceCase,
  ensureAccentedKeyword,
} from "./services";

/**
 * =========================================================================
 * MODULE RADAR SEO & CONTENT GENERATOR: src/app/api/radar/route.ts
 * Kiến trúc Pipeline 3 bước:
 * - BƯỚC 1: Scraper Service (Cào & làm sạch dữ liệu đối thủ)
 * - BƯỚC 2: Intent Analyzer (AI Call 1 - Phân loại Intent & Dựng Outline động)
 * - BƯỚC 3: Content Generator (AI Call 2 - Sinh bài viết toàn diện & Render Schema.org/FAQPage)
 * =========================================================================
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { competitorUrl, targetKeyword = "", customPrompt = "" } = body;

    // 1. Kiểm tra tính hợp lệ của URL đối thủ
    if (!competitorUrl || typeof competitorUrl !== "string" || !competitorUrl.trim().startsWith("http")) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp URL bài viết đối thủ hợp lệ (bắt đầu bằng http:// hoặc https://)." },
        { status: 400 }
      );
    }

    const sanitizedUrl = competitorUrl.trim();
    const rawKeyword = targetKeyword.trim() || "tổ chức sự kiện chuyên nghiệp";

    // ------------------------------------------------------------------------
    // BƯỚC 1: CÀO & LÀM SẠCH DỮ LIỆU ĐỐI THỦ (Scraper Service)
    // ------------------------------------------------------------------------
    const scrapedData = await scrapeAndCleanCompetitor(sanitizedUrl, rawKeyword);

    // Tự động khôi phục dấu tiếng Việt chuẩn xác cho từ khóa dựa trên tiêu đề & nội dung đối thủ
    const resolvedKeyword = ensureAccentedKeyword(
      rawKeyword,
      scrapedData.title,
      scrapedData.cleanText
    );

    // ------------------------------------------------------------------------
    // BƯỚC 2: PHÂN LOẠI SEARCH INTENT & DỰNG OUTLINE ĐỘNG (AI Call 1 - Analyzer)
    // Ràng buộc nghiêm ngặt:
    // - Informational (Kịch bản MC, cẩm nang): Outline tập trung vào timeline, lời thoại mẫu, xử lý sự cố.
    //   CẤM ĐƯA BẢNG GIÁ THIẾT BỊ, KHO BÃI, XE CỘ VÀO BÀI!
    // - Commercial (Thuê đồ, đặt dịch vụ): Outline tập trung vào báo giá bóc tách, thông số kỹ thuật, kho bãi.
    // ------------------------------------------------------------------------
    const intentAnalysis = await analyzeIntentAndBuildOutline(scrapedData, resolvedKeyword, customPrompt);
    const finalKeyword = intentAnalysis.focus_keyword || resolvedKeyword;

    // ------------------------------------------------------------------------
    // BƯỚC 3: SINH NỘI DUNG TOÀN DIỆN & RENDER SCHEMA (AI Call 2 - Generator)
    // - Viết bám sát outline từ Bước 2
    // - Mở bài và Sapo biến thiên theo Search Intent (không dùng khuôn dập)
    // - Render FAQ dạng H3 với câu trả lời ngắn gọn <60 từ
    // - Tự động xuất chuỗi Schema.org/FAQPage JSON-LD ở cuối bài
    // ------------------------------------------------------------------------
    const generatedArticle = await generateFullContentAndSchema(finalKeyword, intentAnalysis, customPrompt);

    // ------------------------------------------------------------------------
    // QUALITY GATE: Kiểm duyệt và chuẩn hóa Sentence Case toàn diện
    // ------------------------------------------------------------------------
    generatedArticle.title = toSentenceCase(generatedArticle.title);
    generatedArticle.content = cleanMarkdownHeadings(generatedArticle.content);

    // Chuẩn hóa dữ liệu trả về cho giao diện Admin Radar
    const analysisResponse = {
      h1: scrapedData.title ? formatHeadingSentenceCase(scrapedData.title) : `Bài viết phân tích: ${finalKeyword}`,
      headings: scrapedData.headings.map(formatHeadingSentenceCase),
      targetKeywords: [
        finalKeyword,
        "báo giá tổ chức sự kiện trọn gói",
        "công ty sự kiện uy tín hà nội",
        "kịch bản sự kiện độc bản",
      ],
      weaknesses: intentAnalysis.competitor_weaknesses || [
        "⚠️ Đối thủ thiếu chiều sâu kỹ thuật ➔ 🎯 Vũ khí Trường Hải: Phân tích chi tiết và độc bản hóa kịch bản.",
      ],
      wordCountEstimate: scrapedData.wordCountEstimate,
      seoScore: intentAnalysis.seo_score || 85,
      search_intent: intentAnalysis.search_intent,
      content_angle: intentAnalysis.content_angle,
      content_gap: intentAnalysis.content_gap,
      outline: intentAnalysis.outline,
      faq_list: intentAnalysis.faq_list,
    };

    const postResponse = {
      title: generatedArticle.title,
      slug: generatedArticle.slug,
      meta_description: generatedArticle.meta_description,
      focus_keyword: generatedArticle.focus_keyword,
      content: generatedArticle.content,
      schema_json_ld: generatedArticle.schema_json_ld,
      search_intent: generatedArticle.search_intent,
      outline: generatedArticle.outline,
      faq_list: generatedArticle.faq_list,
    };

    // ------------------------------------------------------------------------
    // BƯỚC 4: LƯU BẢN GHI VÀO SUPABASE (Bản nháp draft)
    // ------------------------------------------------------------------------
    let savedLogId: string | null = null;
    let savedPostId: string | null = null;

    if (isSupabaseConfigured) {
      try {
        const { data: postData, error: postErr } = await supabase
          .from("posts")
          .insert([
            {
              title: postResponse.title,
              slug: postResponse.slug,
              content: postResponse.content,
              meta_description: postResponse.meta_description,
              focus_keyword: postResponse.focus_keyword,
              competitor_source_url: sanitizedUrl,
              status: "draft",
            },
          ])
          .select("id")
          .single();

        if (!postErr && postData) {
          savedPostId = postData.id;
        }

        const { data: logData } = await supabase
          .from("competitor_logs")
          .insert([
            {
              competitor_url: sanitizedUrl,
              raw_content: scrapedData.cleanText,
              ai_analysis: analysisResponse,
              target_keyword: finalKeyword,
            },
          ])
          .select("id")
          .single();

        if (logData) {
          savedLogId = logData.id;
        }
      } catch (dbErr) {
        console.warn("[Radar] Lưu Supabase thất bại hoặc bị bỏ qua:", dbErr);
      }
    }

    // ------------------------------------------------------------------------
    // BƯỚC 5: TRẢ KẾT QUẢ CHO GIAO DIỆN ADMIN
    // ------------------------------------------------------------------------
    return NextResponse.json({
      success: true,
      analysis: analysisResponse,
      generatedPost: postResponse,
      savedPostId,
      savedLogId,
      isSupabaseSaved: Boolean(savedPostId),
      message: `Phân tích thành công Intent (${intentAnalysis.search_intent.toUpperCase()}) và khởi tạo bài viết chuẩn SEO có Schema.org FAQPage!`,
    });
  } catch (error: any) {
    console.error("[Radar SEO API] Unhandled Exception:", error);
    return NextResponse.json(
      {
        error: "Đã xảy ra lỗi trong quá trình xử lý Radar SEO.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
