/**
 * BƯỚC 3: SINH NỘI DUNG TOÀN DIỆN & RENDER SCHEMA (AI Call 2 - Generator)
 * Tuân thủ nghiêm ngặt:
 * - Không dùng chung khuôn mẫu mở bài sáo rỗng
 * - Tiêu đề và Sapo biến thiên theo đúng Search Intent
 * - Informational: Tập trung vào timeline, lời thoại mẫu, kỹ năng ứng biến
 * - Commercial: Mới có bảng giá thiết bị, kho bãi, xe cộ, trade-off
 * - Render FAQ: H3 cho mỗi câu hỏi với câu trả lời trực diện <60 từ
 * - Render Schema.org/FAQPage JSON-LD ở cuối bài
 * Phạm vi: Nội bộ src/app/api/radar/services/content-generator.ts
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  IntentAnalysisResult,
  GeneratedArticle,
  BrandProfile,
  TRUONG_HAI_BRAND,
  FaqItem,
} from "./types";
import { buildFaqPageSchema } from "./schema-builder";

// Hàm chuyển đổi Sentence Case tiếng Việt và giữ danh từ riêng
export function toSentenceCase(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  let lower = trimmed.toLowerCase();
  let result = lower.charAt(0).toUpperCase() + lower.slice(1);

  const properNouns: { match: RegExp; replace: string }[] = [
    { match: /\btrường hải event & travel\b/gi, replace: "Trường Hải Event & Travel" },
    { match: /\btrường hải event\b/gi, replace: "Trường Hải Event" },
    { match: /\btrường hải\b/gi, replace: "Trường Hải" },
    { match: /\bhà nội\b/gi, replace: "Hà Nội" },
    { match: /\bhải phòng\b/gi, replace: "Hải Phòng" },
    { match: /\bthái bình\b/gi, replace: "Thái Bình" },
    { match: /\bđà nẵng\b/gi, replace: "Đà Nẵng" },
    { match: /\btp\.hcm\b/gi, replace: "TP.HCM" },
    { match: /\bviệt nam\b/gi, replace: "Việt Nam" },
    { match: /\bbộ gtvt\b/gi, replace: "Bộ GTVT" },
    { match: /\bcầu thăng long\b/gi, replace: "cầu Thăng Long" },
    { match: /\bvinpearl nam hội an\b/gi, replace: "Vinpearl Nam Hội An" },
    { match: /\bvinpearl\b/gi, replace: "Vinpearl" },
    { match: /\bdamsan\b/gi, replace: "Damsan" },
    { match: /\blocknlock\b/gi, replace: "LocknLock" },
    { match: /\bvietcombank\b/gi, replace: "Vietcombank" },
    { match: /\bvpbank\b/gi, replace: "VPBank" },
    { match: /\bncb\b/gi, replace: "NCB" },
    { match: /\bđh bách khoa\b/gi, replace: "ĐH Bách Khoa" },
    { match: /\bline array\b/gi, replace: "Line Array" },
    { match: /\bled p2\.5\b/gi, replace: "LED P2.5" },
    { match: /\bled p3\.91\b/gi, replace: "LED P3.91" },
    { match: /\bmàn led\b/gi, replace: "màn LED" },
    { match: /\bmàn hình led\b/gi, replace: "màn hình LED" },
    { match: /\bmoving beam\b/gi, replace: "Moving Beam" },
    { match: /\bmc\b/gi, replace: "MC" },
    { match: /\bpg\b/gi, replace: "PG" },
    { match: /\bq&a\b/gi, replace: "Q&A" },
    { match: /\bqr\b/gi, replace: "QR" },
    { match: /\buhf\b/gi, replace: "UHF" },
    { match: /\byep\b/gi, replace: "YEP" },
    { match: /\byear end party\b/gi, replace: "Year End Party" },
    { match: /\bgala dinner\b/gi, replace: "Gala Dinner" },
    { match: /\bteam building\b/gi, replace: "Team Building" },
  ];

  for (const { match, replace } of properNouns) {
    result = result.replace(match, replace);
  }
  return result;
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


/**
 * Làm sạch tiền tố dư thừa của từ khóa để dùng làm chủ ngữ tự nhiên
 */
function cleanKeywordForTopic(keyword: string): string {
  let k = keyword.trim().toLowerCase();
  k = k.replace(/^(báo giá\s+thuê|báo giá\s+dịch vụ|báo giá\s+tổ chức|báo giá|thuê|dịch vụ\s+tổ chức|dịch vụ|cẩm nang\s+tổ chức|cẩm nang|hướng dẫn\s+tổ chức|hướng dẫn|kịch bản\s+tổ chức|kịch bản|mẫu\s+lời dẫn|mẫu)\s+/iu, "");
  return k.trim() || keyword.trim();
}

/**
 * Sinh nội dung Informational chuyên sâu (Kịch bản MC, Lời dẫn, Cẩm nang...)
 * TUYỆT ĐỐI KHÔNG CÓ BẢNG GIÁ THIẾT BỊ, KHO BÃI, XE CỘ!
 */
function generateInformationalContent(
  keyword: string,
  analysis: IntentAnalysisResult,
  brand: BrandProfile
): GeneratedArticle {
  const isMc = keyword.toLowerCase().includes("mc") || keyword.toLowerCase().includes("lời dẫn");
  let topic = cleanKeywordForTopic(keyword);
  topic = topic.replace(/^mc\s+/iu, "").trim() || "sự kiện";

  const title = isMc
    ? toSentenceCase(`Mẫu kịch bản MC ${topic} chuyên nghiệp: lời dẫn chi tiết từng phần và bí quyết xử lý tình huống sân khấu`)
    : toSentenceCase(`Hướng dẫn ${cleanKeywordForTopic(keyword)} toàn diện: quy trình từng bước, checklist kiểm soát rủi ro từ chuyên gia`);

  const slug = `${createSeoSlug(keyword)}-chuyen-nghiep`;
  const metaDescription = isMc
    ? `Trọn bộ kịch bản MC ${topic} chuẩn chỉ từ Trường Hải Event: Lời dẫn khai mạc, giới thiệu đại biểu, keymoment và mẹo xử lý sự cố. Hotline: ${brand.hotline}.`
    : `Cẩm nang hướng dẫn ${keyword} chi tiết: Quy trình tổ chức, checklist kiểm soát an toàn từ Trường Hải Event & Travel. Hotline: ${brand.hotline}.`;

  // Render FAQ Section dạng H3 với câu trả lời ngắn gọn <60 từ
  const faqSections = analysis.faq_list
    .map(
      (f) => `### ${toSentenceCase(f.question)}
${f.answer || f.answer_guideline || "Đang cập nhật câu trả lời từ chuyên gia Trường Hải Event."}`
    )
    .join("\n\n");

  const schemaJsonLd = buildFaqPageSchema(analysis.faq_list);

  let body = "";

  if (isMc) {
    body = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Một **kịch bản MC ${topic}** đạt chuẩn chuyên nghiệp bắt buộc phải có 5 phần cốt lõi: Đón khách ổn định, Khai mạc tuyên bố lý do, Giới thiệu quan khách VIP, Nghi lễ chính (Keymoment), và Bế mạc cảm ơn. Người dẫn chương trình cần nắm vững timeline từng phút, phối hợp nhịp nhàng với đạo diễn âm thanh ánh sáng và luôn chuẩn bị sẵn phương án ứng biến khi xảy ra sự cố kỹ thuật. Hotline tư vấn kịch bản độc bản: **${brand.hotline}**.

Trong bất kỳ chương trình nào, người dẫn chương trình (MC) chính là **"linh hồn" kết nối toàn bộ mạch cảm xúc**, định hướng sự tập trung của quan khách và bảo chứng cho sự trôi chảy của toàn bộ sự kiện. Một kịch bản dẫn được chuẩn bị kỹ lưỡng sẽ giúp MC tự tin làm chủ sân khấu và xử lý mượt mà mọi tình huống phát sinh.

Từng đồng hành biên soạn kịch bản và cung cấp nhân sự dẫn chương trình cho các sự kiện trang trọng của **${brand.keyProjects.slice(0, 4).join(", ")}**, Trường Hải Event & Travel xin chia sẻ trọn bộ kịch bản và kinh nghiệm thực chiến đắt giá nhất.

---

## 1. Cấu trúc khung xương chuẩn của một kịch bản MC sự kiện chuyên nghiệp

Một kịch bản MC hoàn chỉnh không chỉ ghi chép lời nói, mà là một bảng điều phối tác chiến đa nhiệm bao gồm 5 cột thông tin bắt buộc:

| Thời gian | Phân đoạn chương trình | Lời thoại MC (Voice script) | Hiệu ứng âm thanh & Ánh sáng | Nhân sự phối hợp |
| :--- | :--- | :--- | :--- | :--- |
| **08:30 - 09:00** | Đón tiếp quan khách VIP | Nhắc nhở ổn định chỗ ngồi, giới thiệu photobooth check-in | Nhạc nền Acoustic hoặc hòa tấu nhẹ nhàng | PG lễ tân, bảo vệ phân luồng |
| **09:00 - 09:15** | Khai mạc & Giới thiệu | Lời chào trang trọng, tuyên bố lý do buổi lễ, xướng tên VIP | Nhạc chào mừng giòn giã, đèn rọi bục phát biểu | Đạo diễn sân khấu, kỹ thuật âm thanh |
| **09:15 - 09:45** | Nghi lễ chính (Keymoment) | Lời dẫn đếm ngược cắt băng, khui sâm-panh, nâng ly chúc mừng | Nhạc cao trào bùng nổ, pháo điện, khói sáng | PG bưng khay nghi thức |
| **09:45 - 10:30** | Vinh danh & Tri ân | Xướng tên cá nhân, phòng ban xuất sắc, mời lãnh đạo trao cúp | Nhạc trao giải hào hùng, visual LED hiển thị tên | Trợ lý sân khấu trao hoa và quà |
| **10:30 - 11:30** | Giao lưu & Minigame | Hoạt náo, bốc thăm may mắn, tương tác với khán giả | Nhạc game vui nhộn, hiệu ứng âm thanh hồi hộp | Đội ngũ hỗ trợ đạo cụ |
| **11:30** | Bế mạc & Chụp ảnh | Lời cảm ơn, chúc sức khỏe và hướng dẫn khách chụp ảnh lưu niệm | Nhạc bế mạc tươi vui, ấm áp | Toàn bộ ekip sự kiện |

---

## 2. Trọn bộ mẫu lời dẫn MC chi tiết từng phân đoạn chương trình

Dưới đây là mẫu lời dẫn được đúc kết từ hàng trăm chương trình thực tế của Trường Hải Event, có thể linh hoạt ứng dụng cho sự kiện của bạn:

### 2.1. Lời dẫn phần mở đầu và ổn định chỗ ngồi
*"Kính thưa quý vị đại biểu, quý vị khách quý cùng toàn thể quan khách thân mến! Chỉ còn ít phút nữa, chương trình của chúng ta sẽ chính thức bắt đầu. Ban tổ chức xin trân trọng kính mời quý vị nhanh chóng tiến vào khu vực hội trường, lựa chọn cho mình vị trí ngồi thích hợp và chuyển điện thoại sang chế độ rung để buổi lễ được diễn ra trang trọng nhất. Xin trân trọng cảm ơn!"*

### 2.2. Lời dẫn tuyên bố lý do và giới thiệu đại biểu VIP
*"Nhiệt liệt chào mừng toàn thể quý vị đại biểu, các vị khách quý và toàn thể thành viên đã có mặt trong buổi lễ ngày hôm nay! Thưa quý vị, mỗi hành trình bứt phá đều bắt đầu từ những bước chân kiên định. Hôm nay, chúng ta có mặt tại đây để cùng nhau chứng kiến thời khắc đặc biệt này..."*

*(Giới thiệu đại biểu theo đúng nguyên tắc: Xướng tên người có chức vụ cao nhất trước, kèm họ tên đầy đủ và chức danh chuẩn xác).*

### 2.3. Lời dẫn nghi lễ Keymoment bùng nổ
*"Và ngay sau đây, thời khắc thiêng liêng và quan trọng nhất của buổi lễ đã đến! Xin trân trọng kính mời ban lãnh đạo cùng tiến lên sân khấu... Quý vị thân mến, hãy cùng hướng mắt về màn hình trung tâm và đếm ngược cùng chúng tôi: 3... 2... 1... XIN CHÚC MỪNG!"*

---

## 3. Kỹ năng vàng xử lý 5 tình huống phát sinh đột xuất trên sân khấu

Sân khấu trực tiếp luôn tiềm ẩn những tình huống bất ngờ. Một MC bản lĩnh cần trang bị kỹ năng ứng biến theo nguyên tắc: **Bình tĩnh – Giữ nụ cười – Điều phối khéo léo**:

1. **Khi micro bị hú rít hoặc mất tiếng đột ngột:** Tuyệt đối không dùng tay gõ vào đầu mic. Giữ nguyên tư thế, mỉm cười nhẹ nhàng và di chuyển sang micro dự phòng trên bục hoặc nhận mic thay thế từ kỹ thuật viên trong 3 giây.
2. **Khi đại biểu lên phát biểu muộn hoặc chưa sẵn sàng:** Khéo léo kéo dài thời gian bằng cách tóm tắt nhanh một điểm nhấn ý nghĩa của video clip vừa chiếu, hoặc giao lưu ngắn 1 câu với khán đài để ekip điều phối chuẩn bị.
3. **Khi ban lãnh đạo thay đổi thứ tự trao giải phút chót:** Luôn giữ liên lạc qua tai nghe bộ đàm (In-ear) với đạo diễn hiện trường; đọc tên theo danh sách cập nhật mới nhất trên máy tính bảng hoặc phiếu trao giải được trợ lý đưa lên.
4. **Khi hội trường bị trầm lắng, thiếu tương tác:** Sử dụng các câu hỏi mở, vỗ tay tạo nhịp hoặc mời khán giả giơ tay hưởng ứng để hâm nóng bầu không khí.
5. **Khi có sự cố kỹ thuật visual LED hoặc máy chiếu:** Không nhìn chằm chằm vào màn hình lỗi. Chủ động thu hút sự chú ý của khách mời về phía mình bằng lời dẫn chuyện truyền cảm hứng.

---

## 4. Bảng checklist 7 bước chuẩn bị trước giờ G cho MC và ban tổ chức

| STT | Hạng mục kiểm tra | Tiêu chuẩn bắt buộc | Người phụ trách |
| :--- | :--- | :--- | :--- |
| **01** | Khớp kịch bản (Run-through) | Rà soát từng phân đoạn cùng đạo diễn sân khấu trước 2 tiếng | MC & Tổng đạo diễn |
| **02** | Phiên âm tên đại biểu VIP | Đọc chuẩn xác 100% họ tên, học hàm, chức danh cơ quan | MC & Thư ký ban tổ chức |
| **03** | Test âm thanh micro | Thử giọng tại đúng vị trí đứng, kiểm tra pin micro mới 100% | MC & Kỹ thuật viên âm thanh |
| **04** | Trang phục & Dresscode | Trang phục chỉn chu, đúng tone màu yêu cầu của sự kiện | MC |
| **05** | Thiết bị hỗ trợ | Bìa kịch bản bọc da sang trọng, bút dạ nhớ, thẻ cue card | MC |
| **06** | Tín hiệu kết nối | Kiểm tra tai nghe bộ đàm nội bộ hoặc ám hiệu tay với cánh gà | MC & Trợ lý điều phối |
| **07** | Tâm lý & Năng lượng | Uống nước ấm, khởi động thanh quản và giữ tinh thần tích cực | MC |

---

## 5. Câu hỏi thường gặp về kịch bản và người dẫn chương trình sự kiện (FAQ)

${faqSections}

---

## 6. Nhận tư vấn kịch bản độc bản và cung cấp MC sự kiện chuyên nghiệp

Một kịch bản hay được dẫn dắt bởi một MC tài năng sẽ đưa sự kiện của doanh nghiệp bạn chạm đến đỉnh cao thành công. Hãy liên hệ ngay với đội ngũ biên kịch và đạo diễn Trường Hải Event & Travel:

- **${brand.companyName.toUpperCase()}**
- **Hotline tư vấn kịch bản 24/7:** **${brand.hotline}**
- **Giám đốc điều hành:** ${brand.director}
- **Địa chỉ:** ${brand.address}
- **Mã số thuế:** ${brand.taxId}
- **Slogan:** *"${brand.slogan}"*

${schemaJsonLd}
`.trim();
  } else {
    // Informational chung (Cẩm nang, quy trình...)
    body = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Quy trình triển khai **${keyword}** đòi hỏi sự phối hợp đồng bộ giữa khâu khảo sát thực tế, lập kế hoạch chi tiết, kiểm soát an toàn và điều phối nhân sự nhịp nhàng. Nắm vững các bước chuẩn hóa và checklist dự phòng rủi ro sẽ giúp ban tổ chức tiết kiệm tối đa thời gian và đảm bảo sự kiện diễn ra thành công trọn vẹn. Hotline tư vấn chuyên môn: **${brand.hotline}**.

Để một sự kiện hay kế hoạch đạt được hiệu quả tối ưu, ban tổ chức cần xây dựng lộ trình triển khai khoa học, rõ ràng và có tính ứng dụng cao trong thực tế.

Với kinh nghiệm tổ chức thành công hàng trăm chương trình lớn nhỏ trên toàn quốc, Trường Hải Event & Travel xin chia sẻ cẩm nang chi tiết giúp bạn kiểm soát toàn diện mọi khâu tác chiến.

---

## 1. Bản chất và các nguyên tắc cốt lõi cần nắm vững khi triển khai ${topic}

Mọi kế hoạch thành công đều dựa trên 3 nguyên tắc nền tảng:
- **Mục tiêu rõ ràng:** Xác định chính xác thông điệp cần truyền tải và đối tượng thụ hưởng.
- **Phân công trách nhiệm minh bạch:** Mỗi mắt xích công việc đều phải có người chịu trách nhiệm chính và thời hạn hoàn thành (Deadline) cụ thể.
- **Phương án dự phòng rủi ro 100%:** Luôn có kế hoạch B cho các yếu tố bất khả kháng như thời tiết, thiết bị kỹ thuật hay thay đổi lịch trình.

---

## 2. Quy trình từng bước triển khai bài bản và chuyên nghiệp

1. **Bước 1 (Khảo sát và xác định nhu cầu):** Đo đạc thực tế mặt bằng, đánh giá hạ tầng điện nước và lưu lượng khách tham dự.
2. **Bước 2 (Lập kế hoạch tổng thể & Timeline):** Xây dựng bảng tiến độ chi tiết từ giai đoạn chuẩn bị đến ngày diễn ra.
3. **Bước 3 (Chuẩn bị hạng mục & Nhân sự):** Hoàn thiện maquette, kịch bản chi tiết và phân công ekip trực chiến.
4. **Bước 4 (Chạy thử & Tổng duyệt kỹ thuật):** Chạy thử toàn bộ quy trình trước giờ G để phát hiện và xử lý ngay các lỗ hổng.
5. **Bước 5 (Vận hành & Đánh giá nghiệm thu):** Điều phối trực tiếp tại hiện trường và họp rút kinh nghiệm sau sự kiện.

---

## 3. Bảng checklist kiểm tra toàn diện trước giờ triển khai

| STT | Đầu việc cần kiểm tra | Tiêu chuẩn hoàn thành | Người phụ trách |
| :--- | :--- | :--- | :--- |
| **01** | Hạ tầng mặt bằng & Nguồn điện | Kiểm tra tải điện, chiều cao trần, an toàn PCCC | Kỹ thuật hiện trường |
| **02** | Kịch bản & Timeline tác chiến | Kịch bản được duyệt lần cuối, in ấn phát cho các đầu mối | Điều phối chương trình |
| **03** | Nhân sự & Phân công nhiệm vụ | Toàn bộ nhân sự có mặt đúng giờ, trang phục chuẩn chỉ | Trưởng ban tổ chức |
| **04** | Thiết bị & Đạo cụ sự kiện | Kiểm tra hoạt động 100% không chập chờn | Phụ trách kỹ thuật |
| **05** | Bộ phận đón tiếp & Lễ tân | Chuẩn bị bàn check-in, hoa cài áo, nước uống đón khách | Đội ngũ lễ tân |

---

## 4. Câu hỏi thường gặp về chủ đề này (FAQ)

${faqSections}

---

## 5. Nhận tư vấn chuyên môn và giải pháp tối ưu từ chuyên gia

Liên hệ ngay với Trường Hải Event & Travel để được hỗ trợ xây dựng giải pháp trọn gói:

- **${brand.companyName.toUpperCase()}**
- **Hotline tư vấn 24/7:** **${brand.hotline}**
- **Giám đốc điều hành:** ${brand.director}
- **Địa chỉ:** ${brand.address}
- **Mã số thuế:** ${brand.taxId}
- **Slogan:** *"${brand.slogan}"*

${schemaJsonLd}
`.trim();
  }

  return {
    title,
    slug,
    meta_description: metaDescription,
    focus_keyword: keyword,
    content: body,
    schema_json_ld: schemaJsonLd,
    search_intent: "informational",
    outline: analysis.outline,
    faq_list: analysis.faq_list,
  };
}

/**
 * Sinh nội dung Commercial chuyên sâu (Báo giá, Thuê thiết bị, Dịch vụ trọn gói)
 * Tập trung vào: Báo giá bóc tách theo quy mô, Kho thiết bị trực tiếp, Trade-off, 5 bước
 */
function generateCommercialContent(
  keyword: string,
  analysis: IntentAnalysisResult,
  brand: BrandProfile
): GeneratedArticle {
  const topic = cleanKeywordForTopic(keyword);
  let cleanKw = keyword.trim();
  cleanKw = cleanKw.replace(/^báo giá\s+/iu, "").trim();
  const title = toSentenceCase(`Báo giá ${cleanKw} trọn gói từ kho trực tiếp: bảng dự toán chi tiết và cam kết không phát sinh`);
  const slug = `${createSeoSlug(keyword)}-chuyen-nghiep-truong-hai`;
  const metaDescription = `Báo giá ${keyword} trọn gói uy tín từ Trường Hải Event & Travel. Sở hữu kho thiết bị Line Array, màn LED P2.5/P3.91, đội xe riêng. Hotline: ${brand.hotline}.`;

  const faqSections = analysis.faq_list
    .map(
      (f) => `### ${toSentenceCase(f.question)}
${f.answer || f.answer_guideline || "Đang cập nhật câu trả lời từ chuyên gia Trường Hải Event."}`
    )
    .join("\n\n");

  const schemaJsonLd = buildFaqPageSchema(analysis.faq_list);

  const body = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Chi phí dịch vụ **${keyword}** trọn gói tại Hà Nội hiện dao động từ **15.000.000đ - 75.000.000đ** (tùy theo quy mô từ 50 đến 500 khách và gói cấu hình thiết bị). Trường Hải Event & Travel trực tiếp sở hữu **tổng kho thiết bị âm thanh Line Array nhập khẩu, màn hình LED P2.5/P3.91 và đội xe du lịch 16-45 chỗ riêng**, giúp doanh nghiệp tiết kiệm 15% - 25% chi phí trung gian và cam kết hợp đồng pháp lý tuyệt đối không phát sinh phụ phí. Hotline hỗ trợ dự toán bóc tách trong 30 phút: **${brand.hotline}**.

Trong bối cảnh cạnh tranh kinh doanh hiện đại, một sự kiện **${topic}** thành công không chỉ là việc lắp đặt vài bộ bàn ghế hay dựng một tấm phông nền đơn giản. Đây chính là **chiến dịch truyền thông trực tiếp khẳng định uy tín thương hiệu, nâng tầm vị thế trước đối tác và kích hoạt sự gắn kết nội bộ mạnh mẽ**.

Từng đồng hành tổ chức thành công các sự kiện trọng điểm cho **${brand.keyProjects.join(", ")}**, Trường Hải Event & Travel chia sẻ trọn bộ kinh nghiệm thực chiến giúp quý doanh nghiệp tối ưu chi phí và loại bỏ 100% rủi ro hiện trường.

---

## 1. Những bẫy phát sinh chi phí và rủi ro thường gặp khi thuê qua agency trung gian

Khảo sát thực tế từ hơn 500+ doanh nghiệp cho thấy, khi chọn nhầm các đơn vị agency "môi giới" không có năng lực thiết bị thực tế, doanh nghiệp thường gặp 4 bài toán nan giải:

1. **Chi phí bị đội lên từ 20% đến 35%:** Do agency phải thuê lại từng hạng mục âm thanh, ánh sáng, màn LED qua nhiều tầng trung gian, mỗi tầng đều cộng thêm biên độ lợi nhuận.
2. **Rủi ro kỹ thuật hiện trường:** Thiết bị cũ chập chờn, âm thanh hú rít, màn hình LED bị sọc màu làm gián đoạn bài phát biểu của ban lãnh đạo.
3. **Báo giá mập mờ, bẫy phụ phí ẩn:** Báo giá ban đầu rất thấp nhưng sau đó tính thêm phụ phí vận chuyển đêm, phí nhân công bốc dỡ tầng cao, phụ phí micro không dây dự phòng.
4. **Bỏ quên an toàn và pháp lý:** Không có phương án dự phòng thời tiết mưa bão (sập nhà bạt) và thiếu hiểu biết về thủ tục xin cấp phép với chính quyền địa phương.

---

## 2. Bảng báo giá và dự toán chi phí bóc tách theo quy mô (cam kết không phát sinh)

Nhằm giúp quý doanh nghiệp dễ dàng cân đối ngân sách và trình ban lãnh đạo phê duyệt, Trường Hải Event & Travel công khai bảng dự toán chi phí bóc tách theo quy mô:

| Quy mô triển khai | Hạng mục cung cấp chính | Chi tiết thiết bị & nhân sự | Thời gian chuẩn bị | Dự toán tham khảo |
| :--- | :--- | :--- | :--- | :--- |
| **Quy mô dưới 100 khách** | Sân khấu lắp ghép, backdrop chụp ảnh, âm thanh 2 loa Full, 2 mic không dây, tiệc trà teabreak | Bao gồm 01 MC dẫn chương trình, kỹ thuật viên trực chiến toàn thời gian, miễn phí vận chuyển nội thành | 1 - 2 ngày | **15.000.000đ - 28.000.000đ** |
| **Quy mô 100 - 300 khách** | Dàn Line Array 4 loa, màn hình LED P3.91 (15m²), đèn sân khấu Par LED + Beam, PG lễ tân | Đội ngũ kỹ thuật 3 người, visual LED độc quyền, quay phim chụp ảnh phóng sự HD | 3 - 5 ngày | **35.000.000đ - 65.000.000đ** |
| **Quy mô 300 - 1.000+ khách** | Hệ thống Line Array công suất lớn, màn LED P2.5 siêu nét (30m²), giàn Truss nhôm, visual 3D | Tổng đạo diễn điều phối hiện trường, đón tiếp khách VIP, cam kết hợp đồng pháp lý bảo hiểm | 5 - 10 ngày | **Báo giá bóc tách theo hồ sơ kỹ thuật chi tiết** |

*(Lưu ý: Báo giá thực tế sẽ được chuyên viên Trường Hải bóc tách theo đúng diện tích mặt bằng hiện trường và yêu cầu kịch bản riêng).*

---

## 3. Thông số kỹ thuật kho thiết bị và năng lực trực tiếp của Trường Hải Event

Trường Hải không làm việc qua trung gian môi giới. Chúng tôi trực tiếp đầu tư và làm chủ kho thiết bị hiện đại:

- **Hệ thống âm thanh Line Array nhập khẩu:** Củ loa chuẩn châu Âu, công suất cực đại, góc phủ âm rộng khắp hội trường và triệt tiêu hoàn toàn tiếng hú rít.
- **Màn hình LED Indoor P2.5 & Outdoor P3.91:** Tần số quét cao 3840Hz, chống lóa nắng ngoài trời, chụp ảnh và quay phim không bị gợn sóng sọc màn hình.
- **Hệ thống ánh sáng & hiệu ứng sân khấu:** Đèn Moving Beam 260/380 tạo luồng sáng sắc nét, đèn Par LED 54x3W đổi màu, máy khói lạnh và pháo điện an toàn tuyệt đối.
- **Mô hình Hybrid độc nhất (Event & Travel):** Sở hữu đội xe du lịch 16 - 45 chỗ riêng đời mới, giải quyết trọn vẹn bài toán đưa đón nhân sự và khách VIP liên tỉnh.

---

## 4. Bảng phân tích đánh đổi kỹ thuật giữa các dòng thiết bị (Trade-off Matrix)

Trước khi quyết định ký kết hợp đồng, ban tổ chức cần nắm rõ sự đánh đổi giữa các phương án triển khai để tối ưu hóa hiệu quả:

| Hạng mục xem xét | Phương án thông thường | Phương án chuẩn hóa Trường Hải | Lời khuyên từ chuyên gia |
| :--- | :--- | :--- | :--- |
| **Hệ thống âm thanh** | Loa Full đơn thông thường | Dàn loa Line Array treo giàn Truss | Chọn Line Array nếu không gian rộng trên 150m² để âm thanh phủ đều không chói tai hàng ghế đầu |
| **Màn hình hiển thị** | Màn chiếu hoặc màn LED P3.91 trong nhà | Màn hình LED P2.5 siêu nét mịn | Chọn LED P2.5 nếu khoảng cách người ngồi gần dưới 4m để chữ và số liệu slide không bị vỡ hạt |
| **Đơn vị cung cấp** | Thuê qua agency trung gian | Thuê trực tiếp từ tổng kho Trường Hải | Thuê từ kho tiết kiệm 15% - 25% chi phí và chủ động 100% phương án thay thế thiết bị tại chỗ |

---

## 5. Quy trình 5 bước khảo sát hiện trường và bàn giao trước giờ G 6-12 tiếng

Mọi sự kiện do Trường Hải Event & Travel đảm nhận đều tuân thủ nghiêm ngặt quy trình 5 bước:

1. **Bước 1 (Tiếp nhận & Khảo sát thực tế):** Khảo sát hiện trường trong ngày, đo đạc mặt bằng, kiểm tra tải trọng nguồn điện 3 pha và chiều cao trần miễn phí.
2. **Bước 2 (Lên maquette 2D/3D & Kịch bản):** Gửi kịch bản chi tiết và phối cảnh visual sân khấu 2D/3D trong vòng 24 giờ.
3. **Bước 3 (Chốt dự toán & Ký hợp đồng):** Bóc tách dự toán minh bạch từ gốc kho, cam kết pháp lý bằng hợp đồng *"tuyệt đối không phát sinh một đồng"*.
4. **Bước 4 (Thi công & Tổng duyệt kỹ thuật):** Lắp đặt hoàn thiện trước giờ G tối thiểu 6 - 12 tiếng, chạy tổng duyệt âm thanh ánh sáng cùng ban tổ chức.
5. **Bước 5 (Trực chiến 100% & Bàn giao media):** Trực chiến toàn bộ thời gian sự kiện, xử lý mọi phát sinh và bàn giao toàn bộ file ảnh phóng sự HD, video recap trong 48 giờ.

---

## 6. Câu hỏi thường gặp về báo giá và dịch vụ (FAQ)

${faqSections}

---

## 7. Nhận tư vấn kịch bản độc bản và dự toán chi tiết trong 30 phút

Đừng để sự kiện trọng đại của doanh nghiệp bạn gặp phải những rủi ro kỹ thuật hay chi phí đội lên từ các đơn vị trung gian. Hãy liên hệ ngay với Trường Hải Event & Travel:

- **${brand.companyName.toUpperCase()}**
- **Hotline tư vấn 24/7:** **${brand.hotline}**
- **Giám đốc điều hành:** ${brand.director}
- **Địa chỉ:** ${brand.address}
- **Mã số thuế:** ${brand.taxId}
- **Slogan:** *"${brand.slogan}"*

${schemaJsonLd}
`.trim();

  return {
    title,
    slug,
    meta_description: metaDescription,
    focus_keyword: keyword,
    content: body,
    schema_json_ld: schemaJsonLd,
    search_intent: "commercial",
    outline: analysis.outline,
    faq_list: analysis.faq_list,
  };
}

/**
 * Service chính: Sinh toàn bộ bài viết và render Schema.org/FAQPage
 * (AI Call 2 khi có Gemini API Key, hoặc Fallback Generator khi không có key)
 */
export async function generateFullContentAndSchema(
  keyword: string,
  analysis: IntentAnalysisResult,
  customPrompt?: string
): Promise<GeneratedArticle> {
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  const brand = TRUONG_HAI_BRAND;

  if (geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const prompt = `
Bạn là Giám đốc Chiến lược Nội dung & Chuyên gia SEO cao cấp của ${brand.companyName} (Hotline 24/7: ${brand.hotline}, Giám đốc: ${brand.director}, MST: ${brand.taxId}).
Nhiệm vụ: Viết bài viết hoàn chỉnh chuẩn Markdown dựa trên OUTLINE ĐỘNG và SEARCH INTENT đã được phê duyệt.

THÔNG TIN ĐẦU VÀO:
- Từ khóa mục tiêu: "${keyword}"
- Search Intent đã xác định: "${analysis.search_intent}"
- Góc tiếp cận: "${analysis.content_angle}"
- Điểm vượt trội cần bổ sung: "${analysis.content_gap}"
- Dàn ý Outline bắt buộc bám sát: ${JSON.stringify(analysis.outline)}
- Danh sách FAQ bắt buộc giải đáp: ${JSON.stringify(analysis.faq_list)}

QUY TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ):
1. BIẾN THIÊN THEO SEARCH INTENT:
   - TUYỆT ĐỐI KHÔNG dùng một khuôn mở bài chung (cấm các câu như 'Cẩm nang [Keyword] từ A-Z: Bí quyết tối ưu 25% ngân sách từ kho thiết bị...').
   - NẾU Search Intent là "informational" (Kịch bản MC, hướng dẫn):
     * Tập trung 100% vào: Cấu trúc timeline, mẫu kịch bản lời dẫn từng phân đoạn, kỹ năng ứng biến sự cố, checklist chuẩn bị.
     * NGHIÊM CẤM đưa các heading về bảng giá thiết bị, kho bãi, xe cộ vào bài viết!
   - NẾU Search Intent là "commercial" (Thuê thiết bị, báo giá, dịch vụ trọn gói):
     * Mới tập trung vào bảng giá bóc tách theo quy mô, thông số thiết bị Line Array/LED, kho bãi trực tiếp, bảng trade-off.

2. PHẦN FAQ TRỰC DIỆN:
   - Đặt ở cuối bài trước mục thông tin công ty.
   - Mỗi câu hỏi là một thẻ '###' kèm câu trả lời ngắn gọn, trực diện (dưới 60 từ).

3. ĐÍNH KÈM SCHEMA.ORG/FAQPAGE:
   - Ở cuối cùng của bài viết Markdown, bắt buộc xuất khối thẻ HTML sau:
   <script type="application/ld+json">
   {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     "mainEntity": [
       {
         "@type": "Question",
         "name": "Câu hỏi...",
         "acceptedAnswer": {
           "@type": "Answer",
           "text": "Câu trả lời..."
         }
       }
     ]
   }
   </script>

4. QUY TẮC SENTENCE CASE & CẤM HEADING 'KẾT LUẬN':
   - Chỉ viết hoa chữ cái đầu và danh từ riêng (Trường Hải, Vinpearl, Damsan, Hà Nội...). Tuyệt đối không viết hoa từng từ kiểu Title Case.
   - Cấm dùng heading "Kết luận" hoặc "Lời kết". Thay bằng heading hành động cụ thể kèm thông tin công ty và hotline ${brand.hotline}.

Trả về DUY NHẤT một chuỗi JSON hợp lệ:
{
  "title": "Tiêu đề bài viết biến thiên theo intent (chỉ viết hoa đầu dòng và danh từ riêng)",
  "slug": "duong-dan-url-chuan-seo-viet-khong-dau",
  "meta_description": "Meta description 150-160 ký tự có hotline ${brand.hotline}",
  "content": "Toàn bộ nội dung bài viết định dạng Markdown (đã bao gồm FAQ và khối script Schema.org ở cuối)"
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      if (parsed.title && parsed.content) {
        return {
          title: toSentenceCase(parsed.title),
          slug: parsed.slug || `${createSeoSlug(keyword)}-chuyen-nghiep`,
          meta_description: parsed.meta_description || `Dịch vụ ${keyword} từ Trường Hải Event & Travel. Hotline: ${brand.hotline}.`,
          focus_keyword: keyword,
          content: parsed.content,
          schema_json_ld: buildFaqPageSchema(analysis.faq_list),
          search_intent: analysis.search_intent,
          outline: analysis.outline,
          faq_list: analysis.faq_list,
        };
      }
    } catch (genErr: any) {
      console.warn("[ContentGenerator] Gemini AI Call 2 failed:", genErr?.message);
    }
  }

  // Fallback: Sử dụng Deterministic Content Engine được thiết kế riêng biệt cho từng Intent
  if (analysis.search_intent === "informational") {
    return generateInformationalContent(keyword, analysis, brand);
  }

  return generateCommercialContent(keyword, analysis, brand);
}
