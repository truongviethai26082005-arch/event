/**
 * BƯỚC 2: PHÂN LOẠI SEARCH INTENT & DỰNG OUTLINE ĐỘNG (AI Call 1 - Analyzer)
 * Tuân thủ nghiêm ngặt quy tắc Anti-Template:
 * - Informational (Kịch bản MC, hướng dẫn, mẹo): CẤM đưa bảng giá thiết bị, kho bãi, xe cộ!
 * - Commercial (Thuê đồ, đặt dịch vụ): Mới tập trung vào báo giá, năng lực kho bãi, quy trình.
 * - Listicle (Top ý tưởng, concept): Tập trung vào danh sách ý tưởng, so sánh, cảm hứng.
 * Phạm vi: Nội bộ src/app/api/radar/services/intent-analyzer.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScrapedData, IntentAnalysisResult, SearchIntent, OutlineSection, FaqItem } from "./types";

/**
 * Nhận diện Search Intent bằng thuật toán phân tích ngữ nghĩa (Semantic Rules)
 */
export function classifySearchIntent(keyword: string): SearchIntent {
  const k = keyword.toLowerCase().trim();

  // 1. Nhóm Listicle (Top, Ý tưởng, Xu hướng, Concept)
  if (
    k.startsWith("top ") ||
    k.includes("ý tưởng") ||
    k.includes("y tuong") ||
    k.includes("các concept") ||
    k.includes("concept") ||
    k.includes("gợi ý") ||
    k.includes("xu hướng") ||
    k.includes("xu huong") ||
    k.includes("những mẫu")
  ) {
    return "listicle";
  }

  // 2. Nhóm Informational (Kịch bản MC, Lời dẫn, Cẩm nang, Mẹo, Hướng dẫn, Quy trình, Kinh nghiệm)
  if (
    k.includes("kịch bản") ||
    k.includes("kich ban") ||
    k.includes("mc") ||
    k.includes("lời dẫn") ||
    k.includes("loi dan") ||
    k.includes("hướng dẫn") ||
    k.includes("huong dan") ||
    k.includes("kinh nghiệm") ||
    k.includes("kinh nghiem") ||
    k.includes("cách tổ chức") ||
    k.includes("cach to chuc") ||
    k.includes("mẹo") ||
    k.includes("checklist") ||
    k.includes("lưu ý")
  ) {
    return "informational";
  }

  // 3. Mặc định các từ khóa về thuê, dịch vụ, báo giá, công ty, chi phí là Commercial
  return "commercial";
}

/**
 * Sinh Outline & FAQ dự phòng chuẩn xác theo Search Intent khi không có AI
 */
function buildDeterministicOutlineAndFaq(
  keyword: string,
  intent: SearchIntent,
  scrapedData: ScrapedData
): IntentAnalysisResult {
  const kw = keyword.trim();

  // -------------------------------------------------------------
  // TRƯỜNG HỢP 1: INFORMATIONAL (Ví dụ: Kịch bản MC, Hướng dẫn...)
  // TUYỆT ĐỐI KHÔNG ĐƯỢC CÓ BẢNG GIÁ THIẾT BỊ, KHO BÃI, XE CỘ!
  // -------------------------------------------------------------
  if (intent === "informational") {
    const isMcRelated = kw.toLowerCase().includes("mc") || kw.toLowerCase().includes("lời dẫn");

    if (isMcRelated) {
      return {
        search_intent: "informational",
        content_angle: `Cẩm nang kịch bản dẫn chương trình và mẫu lời dẫn MC thực chiến, tập trung vào cấu trúc timeline, câu từ dẫn dắt và bí quyết xử lý sự cố sân khấu`,
        content_gap: `Đối thủ chỉ đưa lời dẫn chung chung rời rạc; bài viết này sẽ bổ sung bảng phân bổ timeline chi tiết từng phút, trọn bộ lời dẫn mẫu từng phân đoạn và 5 kịch bản ứng biến sự cố âm thanh/diễn giả`,
        outline: [
          {
            heading: "H2: Cấu trúc khung xương chuẩn của một kịch bản MC sự kiện chuyên nghiệp",
            purpose: "Giới thiệu các thành phần bắt buộc của kịch bản dẫn: Thời gian, Timeline, Lời thoại MC, Hiệu ứng âm thanh ánh sáng và Nhân sự phụ trách",
            required_elements: ["table", "bullet_points"],
          },
          {
            heading: "H2: Trọn bộ mẫu lời dẫn MC chi tiết từng phân đoạn chương trình",
            purpose: "Cung cấp chi tiết các mẫu câu dẫn mẫu: Đón khách ổn định, Tuyên bố lý do, Giới thiệu đại biểu VIP, Keymoment khui rượu và Bế mạc",
            required_elements: ["script_template", "bullet_points"],
          },
          {
            heading: "H2: Kỹ năng vàng xử lý 5 tình huống phát sinh đột xuất trên sân khấu dành cho MC",
            purpose: "Phân tích cách ứng biến chuyên nghiệp: Khi micro bị hú rít mất tiếng, khi đại biểu lên phát biểu muộn, khi ban lãnh đạo đổi thứ tự trao giải",
            required_elements: ["bullet_points"],
          },
          {
            heading: "H2: Bảng checklist 7 bước chuẩn bị trước giờ G cho người dẫn chương trình",
            purpose: "Checklist thực tế: Kiểm tra âm thanh tai nghe, khớp kịch bản với đạo diễn sân khấu, phát âm đúng chức danh đại biểu",
            required_elements: ["table", "bullet_points"],
          },
          {
            heading: "H2: Câu hỏi thường gặp về kịch bản và người dẫn chương trình sự kiện",
            purpose: "Giải đáp thắc mắc người dùng với câu trả lời súc tích dưới 60 từ",
            required_elements: ["bullet_points"],
          },
          {
            heading: "H2: Nhận tư vấn biên soạn kịch bản độc bản và cung cấp MC chuyên nghiệp",
            purpose: "Kêu gọi hành động tư vấn hỗ trợ từ đội ngũ đạo diễn Trường Hải Event",
            required_elements: ["bullet_points"],
          },
        ],
        faq_list: [
          {
            question: "Kịch bản MC sự kiện thường được chia làm mấy phần chính?",
            answer_guideline: "Kịch bản MC chuẩn gồm 5 phần: Đón khách ổn định, Khai mạc giới thiệu đại biểu, Nội dung chính/Nghi lễ, Giao lưu/Vinh danh, và Bế mạc cảm ơn.",
          },
          {
            question: "MC cần chuẩn bị những gì trước giờ khai mạc sự kiện?",
            answer_guideline: "MC cần có mặt trước tối thiểu 60-90 phút để khớp kịch bản với đạo diễn, test micro chống hú, kiểm tra phát âm chính xác tên và chức vụ quan khách VIP.",
          },
          {
            question: "Cách xử lý nhanh khi micro của MC bị mất tiếng trên sân khấu?",
            answer_guideline: "Bình tĩnh giữ nụ cười, chuyển ngay sang micro dự phòng trên bục hoặc ra hiệu kỹ thuật viên âm thanh đổi mic trong vòng 5 giây, tránh gõ vào đầu mic.",
          },
          {
            question: "Nên thuê MC chuyên nghiệp hay để nhân sự nội bộ dẫn chương trình?",
            answer_guideline: "Với đại lễ khánh thành, hội nghị quốc tế nên thuê MC chuyên nghiệp để đảm bảo nghi lễ trang trọng; tiệc nội bộ ấm cúng có thể dùng MC nội bộ kết hợp kịch bản chuẩn.",
          },
        ],
        competitor_weaknesses: [
          "⚠️ Lỗ hổng đối thủ: Lời dẫn sơ sài, thiếu bảng mẫu timeline chi tiết ➔ 🎯 Khắc phục: Cung cấp trọn bộ lời dẫn mẫu chuẩn hóa từng phút kèm hiệu ứng âm thanh.",
          "⚠️ Lỗ hổng đối thủ: Không có hướng dẫn xử lý sự cố sân khấu ➔ 🎯 Khắc phục: Bổ sung 5 phương án ứng biến thực chiến khi micro hú hoặc đại biểu đến muộn.",
        ],
        seo_score: 78,
      };
    }

    // Các bài viết hướng dẫn, cẩm nang chung
    return {
      search_intent: "informational",
      content_angle: `Hướng dẫn thực tế, cung cấp kiến thức chuẩn hóa, quy trình từng bước và checklist kiểm soát rủi ro`,
      content_gap: `Bổ sung các checklist thực chiến, quy chuẩn an toàn và các bước triển khai chi tiết mà bài viết đối thủ bỏ qua`,
      outline: [
        {
          heading: "H2: Bản chất và các nguyên tắc cốt lõi cần nắm vững",
          purpose: "Phân tích nền tảng, định nghĩa và mục tiêu trọng tâm",
          required_elements: ["bullet_points"],
        },
        {
          heading: "H2: Quy trình từng bước triển khai bài bản và chuyên nghiệp",
          purpose: "Chi tiết các giai đoạn chuẩn bị, triển khai và đánh giá",
          required_elements: ["bullet_points", "table"],
        },
        {
          heading: "H2: Những sai lầm phổ biến và giải pháp phòng tránh rủi ro hiện trường",
          purpose: "Chỉ ra cạm bẫy thực tế và cách xử lý khoa học",
          required_elements: ["bullet_points"],
        },
        {
          heading: "H2: Bảng checklist kiểm tra toàn diện trước giờ triển khai",
          purpose: "Bảng kiểm tra các đầu việc bắt buộc không thể bỏ sót",
          required_elements: ["table"],
        },
        {
          heading: "H2: Câu hỏi thường gặp về chủ đề này",
          purpose: "Giải đáp trực diện dưới 60 từ",
          required_elements: ["bullet_points"],
        },
        {
          heading: "H2: Nhận tư vấn chuyên môn và giải pháp tối ưu từ chuyên gia",
          purpose: "Call to Action",
          required_elements: ["bullet_points"],
        },
      ],
      faq_list: [
        {
          question: `Yếu tố quan trọng nhất khi thực hiện ${kw} là gì?`,
          answer_guideline: "Yếu tố quan trọng nhất là lập kế hoạch chi tiết, phân công rõ người phụ trách và có phương án dự phòng cho mọi rủi ro kỹ thuật.",
        },
        {
          question: `Cần chuẩn bị trước bao lâu cho ${kw}?`,
          answer_guideline: "Thời gian chuẩn bị lý tưởng từ 1 đến 4 tuần tùy thuộc vào quy mô và độ phức tạp của từng hạng mục.",
        },
      ],
      competitor_weaknesses: ["Thiếu checklist cụ thể", "Văn phong lý thuyết suông thiếu tính ứng dụng"],
      seo_score: 75,
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP 2: LISTICLE (Ví dụ: Top 7 ý tưởng, các concept...)
  // -------------------------------------------------------------
  if (intent === "listicle") {
    return {
      search_intent: "listicle",
      content_angle: `Tuyển chọn các ý tưởng sáng tạo, concept dẫn đầu xu hướng kết hợp phân tích tính khả thi và dự toán`,
      content_gap: `Các bài viết đối thủ chỉ liệt kê tên ý tưởng; bài này sẽ đi sâu vào cách set-up sân khấu, hiệu ứng visual LED và đối tượng phù hợp cho từng concept`,
      outline: [
        {
          heading: "H2: Xu hướng sáng tạo mới nhất đang dẫn đầu thị trường",
          purpose: "Tổng quan bối cảnh và thị hiếu của người tham dự",
          required_elements: ["bullet_points"],
        },
        {
          heading: "H2: Danh sách các ý tưởng đột phá và concept độc bản ấn tượng nhất",
          purpose: "Trình bày chi tiết từng concept: Tone màu, Dresscode, Visual sân khấu và Điểm nhấn cảm xúc",
          required_elements: ["bullet_points"],
        },
        {
          heading: "H2: Bảng so sánh tính khả thi và chi phí ước tính giữa các concept",
          purpose: "Giúp người đọc dễ dàng lựa chọn theo ngân sách doanh nghiệp",
          required_elements: ["table", "comparison_matrix"],
        },
        {
          heading: "H2: Bí quyết hiện thực hóa ý tưởng trên sân khấu thực tế",
          purpose: "Biến bản vẽ 2D/3D thành hiệu ứng ánh sáng, âm thanh và visual LED sống động",
          required_elements: ["bullet_points"],
        },
        {
          heading: "H2: Câu hỏi thường gặp về lựa chọn concept và ý tưởng",
          purpose: "Giải đáp thắc mắc người đọc",
          required_elements: ["bullet_points"],
        },
        {
          heading: "H2: Nhận thiết kế concept độc bản và kịch bản 3D visual trong 24 giờ",
          purpose: "CTA kết bài",
          required_elements: ["bullet_points"],
        },
      ],
      faq_list: [
        {
          question: "Nên chọn concept truyền thống hay hiện đại cho sự kiện doanh nghiệp?",
          answer_guideline: "Tùy thuộc vào văn hóa công ty và độ tuổi nhân sự: Doanh nghiệp trẻ hợp với concept Cyberpunk/EDM; doanh nghiệp nhà nước hợp với Gala truyền thống sang trọng.",
        },
        {
          question: "Chi phí thiết kế concept độc bản có đắt hơn nhiều so với concept mẫu?",
          answer_guideline: "Tại Trường Hải Event, khách hàng đặt dịch vụ trọn gói sẽ được miễn phí hoàn toàn 100% chi phí thiết kế concept 2D/3D độc bản.",
        },
      ],
      competitor_weaknesses: ["Concept chung chung sao chép", "Không có bảng so sánh ngân sách giữa các concept"],
      seo_score: 80,
    };
  }

  // -------------------------------------------------------------
  // TRƯỜNG HỢP 3: COMMERCIAL (Báo giá, Thuê thiết bị, Dịch vụ trọn gói)
  // -------------------------------------------------------------
  return {
    search_intent: "commercial",
    content_angle: `Báo giá minh bạch bóc tách từng hạng mục từ kho trực tiếp, cam kết hợp đồng không phát sinh và kiểm soát an toàn tuyệt đối`,
    content_gap: `Đối thủ giấu giá hoặc chỉ ghi 'Liên hệ để biết giá', tạo nguy cơ bẫy phát sinh; bài viết này công khai bảng dự toán theo quy mô và cảnh báo phụ phí ẩn`,
    outline: [
      {
        heading: "H2: Những bẫy phát sinh chi phí và rủi ro thường gặp khi thuê qua agency trung gian",
        purpose: "Chỉ ra 4 lỗ hổng lớn: Kê giá 20-35%, thiết bị cũ hú rít, phụ phí vận chuyển đêm, thiếu an toàn",
        required_elements: ["bullet_points"],
      },
      {
        heading: "H2: Bảng báo giá và dự toán chi phí bóc tách theo quy mô (cam kết không phát sinh)",
        purpose: "Cung cấp bảng giá cụ thể theo từng quy mô khách mời hoặc diện tích",
        required_elements: ["table"],
      },
      {
        heading: "H2: Thông số kỹ thuật kho thiết bị và năng lực trực tiếp của Trường Hải Event",
        purpose: "Chứng minh năng lực sở hữu Line Array nhập khẩu, màn LED P2.5/P3.91, Moving Beam 380, xe riêng",
        required_elements: ["bullet_points"],
      },
      {
        heading: "H2: Bảng phân tích đánh đổi kỹ thuật giữa các dòng thiết bị (Trade-off Matrix)",
        purpose: "So sánh Loa Full vs Line Array, LED P3.91 vs LED P2.5 giúp khách hàng ra quyết định đúng đắn",
        required_elements: ["table", "comparison_matrix"],
      },
      {
        heading: "H2: Quy trình 5 bước khảo sát hiện trường và bàn giao trước giờ G 6-12 tiếng",
        purpose: "Khẳng định sự an toàn và quy chuẩn thi công chuyên nghiệp",
        required_elements: ["bullet_points"],
      },
      {
        heading: "H2: Câu hỏi thường gặp về báo giá và dịch vụ",
        purpose: "Giải đáp thắc mắc tài chính và hợp đồng dưới 60 từ",
        required_elements: ["bullet_points"],
      },
      {
        heading: "H2: Nhận tư vấn kịch bản độc bản và dự toán chi tiết trong 30 phút",
        purpose: "Kêu gọi hành động tư vấn và thông tin công ty",
        required_elements: ["bullet_points"],
      },
    ],
    faq_list: [
      {
        question: "Báo giá tại Trường Hải Event có phát sinh thêm phụ phí ngoài hợp đồng không?",
        answer_guideline: "Trường Hải cam kết hợp đồng pháp lý trọn gói 100%: Tuyệt đối không phát sinh phụ phí vận chuyển, phụ phí kỹ thuật trực đêm hay dây cáp.",
      },
      {
        question: "Thời gian kỹ thuật viên có mặt lắp đặt và test thiết bị trước sự kiện bao lâu?",
        answer_guideline: "Kỹ thuật viên Trường Hải luôn có mặt và hoàn thiện lắp đặt trước giờ G tối thiểu từ 6 đến 12 tiếng để chạy tổng duyệt âm thanh ánh sáng.",
      },
      {
        question: "Thuê trực tiếp từ kho Trường Hải giúp tiết kiệm bao nhiêu chi phí so với agency môi giới?",
        answer_guideline: "Do trực tiếp sở hữu thiết bị âm thanh, LED và đội xe riêng, khách hàng tiết kiệm trực tiếp từ 15% đến 25% ngân sách so với các bên trung gian.",
      },
    ],
    competitor_weaknesses: [
      "⚠️ Đối thủ giấu giá, thiếu dự toán chi tiết ➔ 🎯 Trường Hải: Công khai bảng giá bóc tách theo quy mô.",
      "⚠️ Đối thủ là môi giới thuê lại thiết bị ➔ 🎯 Trường Hải: Trực tiếp sở hữu kho Line Array và LED P2.5.",
    ],
    seo_score: 82,
  };
}

import { ensureAccentedKeyword } from "./vietnamese-diacritics";

/**
 * Service chính: Phân loại Search Intent và xây dựng Outline động
 * (AI Call 1 khi có Gemini API Key, hoặc Fallback Deterministic khi không có key)
 */
export async function analyzeIntentAndBuildOutline(
  scrapedData: ScrapedData,
  keyword: string,
  customPrompt?: string
): Promise<IntentAnalysisResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  // Luôn khôi phục dấu tiếng Việt chuẩn xác cho từ khóa trước khi phân tích
  const safeKeyword = ensureAccentedKeyword(keyword, scrapedData.title, scrapedData.cleanText);
  const detectedIntent = classifySearchIntent(safeKeyword);

  if (geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.4, // Nhiệt độ thấp để cấu trúc JSON chặt chẽ
        },
      });

      const prompt = `
Bạn là Chuyên gia Chiến lược SEO & Content Architecture cấp cao.
Nhiệm vụ của bạn là phân tích Search Intent của từ khóa và dữ liệu đối thủ cào được, sau đó thiết kế một OUTLINE ĐỘNG ĐỘC BẢN và DANH SÁCH FAQ chuẩn SEO.

THÔNG TIN ĐẦU VÀO:
- Từ khóa mục tiêu: "${safeKeyword}"
- Tiêu đề đối thủ: "${scrapedData.title}"
- Cấu trúc heading đối thủ: ${JSON.stringify(scrapedData.headings)}
- Tóm tắt nội dung đối thủ: "${scrapedData.cleanText.slice(0, 3000)}"

QUY TẮC BẮT BUỘC:
1. TỪ KHÓA CÓ DẤU TIẾNG VIỆT (FOCUS KEYWORD):
   - Bạn PHẢI trả về trường "focus_keyword" là từ khóa chính có đầy đủ dấu tiếng Việt chuẩn xác (ví dụ: 'tổ chức lễ khai trương', 'báo giá thuê âm thanh ánh sáng').
   - TUYỆT ĐỐI KHÔNG trả về từ khóa không dấu hoặc mất dấu!

2. PHÂN LOẠI SEARCH INTENT:
   - "informational": Dành cho các từ khóa tìm hiểu kiến thức, kịch bản MC, cẩm nang, mẹo, hướng dẫn, checklist, lời dẫn.
   - "commercial": Dành cho các từ khóa thuê thiết bị, báo giá, đặt dịch vụ sự kiện, công ty tổ chức trọn gói.
   - "listicle": Dành cho các từ khóa Top ý tưởng, danh sách concept, gợi ý mẫu.

3. RÀNG BUỘC CHẶT CHẼ THEO INTENT (ANTI-TEMPLATE RULE):
   - NẾU LÀ "informational" (Ví dụ: Kịch bản MC, hướng dẫn):
     * Outline và FAQ PHẢI tập trung 100% vào: Cấu trúc timeline, mẫu lời dẫn chi tiết, kỹ năng ứng biến sự cố sân khấu, checklist chuẩn bị.
     * TUYỆT ĐỐI CẤM đưa các heading về bảng giá thiết bị, kho bãi, xe cộ, chi phí thuê đồ vào bài!
   - NẾU LÀ "commercial" (Ví dụ: Thuê âm thanh, báo giá tổ chức sự kiện):
     * Outline và FAQ mới tập trung vào báo giá bóc tách theo quy mô, kho thiết bị trực tiếp, thông số kỹ thuật Line Array/LED, bảng đánh đổi trade-off và quy trình 5 bước.
   - NẾU LÀ "listicle":
     * Outline tập trung vào các concept độc bản, cách dàn dựng và bảng so sánh các concept.

4. FAQ LIST:
   - Gồm 3 - 5 câu hỏi thực tế mà người dùng tìm kiếm từ khóa này thắc mắc nhiều nhất.
   - Mỗi câu hỏi phải có định hướng câu trả lời ngắn gọn, trực diện (dưới 60 từ).

Trả về DUY NHẤT một chuỗi JSON hợp lệ theo đúng cấu trúc Schema sau:
{
  "search_intent": "informational" | "commercial" | "listicle",
  "focus_keyword": "từ khóa chính có đầy đủ dấu tiếng Việt",
  "content_angle": "Góc tiếp cận bài viết",
  "content_gap": "Những điểm đối thủ thiếu mà bài mình sẽ bổ sung vượt trội",
  "outline": [
    {
      "heading": "H2: ...",
      "purpose": "Mục đích đoạn văn",
      "required_elements": ["table", "code_sample", "script_template", "bullet_points", "comparison_matrix"]
    }
  ],
  "faq_list": [
    {
      "question": "Câu hỏi thực tế người dùng hay thắc mắc?",
      "answer_guideline": "Định hướng câu trả lời ngắn gọn (dưới 60 từ)"
    }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed: IntentAnalysisResult = JSON.parse(text);

      if (parsed.search_intent && parsed.outline && Array.isArray(parsed.outline)) {
        parsed.focus_keyword = ensureAccentedKeyword(
          parsed.focus_keyword || safeKeyword,
          scrapedData.title,
          scrapedData.cleanText
        );
        return parsed;
      }
    } catch (aiErr: any) {
      console.warn("[IntentAnalyzer] Gemini AI Call 1 failed or timed out:", aiErr?.message);
    }
  }

  // Fallback: Sử dụng Deterministic Semantic Engine để đảm bảo 100% không bao giờ crash
  const fallbackResult = buildDeterministicOutlineAndFaq(safeKeyword, detectedIntent, scrapedData);
  fallbackResult.focus_keyword = safeKeyword;
  return fallbackResult;
}
