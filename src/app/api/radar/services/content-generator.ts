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


import { ensureAccentedKeyword } from "./vietnamese-diacritics";

/**
 * Làm sạch tiền tố dư thừa của từ khóa để dùng làm chủ ngữ tự nhiên (luôn có dấu tiếng Việt)
 */
function cleanKeywordForTopic(keyword: string): string {
  const safeKw = ensureAccentedKeyword(keyword);
  let k = safeKw.trim().toLowerCase();
  k = k.replace(
    /^(báo giá\s+thuê|bao gia\s+thue|báo giá\s+dịch vụ|bao gia\s+dich vu|báo giá\s+tổ chức|bao gia\s+to chuc|báo giá|bao gia|cho thuê|cho thue|thuê|thue|dịch vụ\s+tổ chức|dich vu\s+to chuc|dịch vụ|dich vu|cẩm nang\s+tổ chức|cam nang\s+to chuc|cẩm nang|cam nang|hướng dẫn\s+tổ chức|huong dan\s+to chuc|hướng dẫn|huong dan|kịch bản\s+tổ chức|kich ban\s+to chuc|kịch bản|kich ban|mẫu\s+lời dẫn|mau\s+loi dan|mẫu|mau)\s+/iu,
    ""
  );
  return k.trim() || safeKw.trim();
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
  const safeKeyword = ensureAccentedKeyword(analysis.focus_keyword || keyword);
  const isMc = safeKeyword.toLowerCase().includes("mc") || safeKeyword.toLowerCase().includes("lời dẫn");
  let topic = cleanKeywordForTopic(safeKeyword);
  topic = topic.replace(/^mc\s+/iu, "").trim() || "sự kiện";

  const title = isMc
    ? toSentenceCase(`Mẫu kịch bản MC ${topic} chuyên nghiệp: 5 phần cốt lõi, lời dẫn chi tiết và bí quyết xử lý tình huống sân khấu`)
    : toSentenceCase(`10 bước ${cleanKeywordForTopic(safeKeyword)} chuyên nghiệp: quy trình thực chiến và checklist tối ưu chi phí`);

  const slug = `${createSeoSlug(safeKeyword)}-chuyen-nghiep`;
  const metaDescription = isMc
    ? `Trọn bộ kịch bản MC ${topic} chuẩn chỉ từ Trường Hải Event: Lời dẫn khai mạc, giới thiệu đại biểu, keymoment và mẹo xử lý sự cố. Hotline: ${brand.hotline}.`
    : `Cẩm nang hướng dẫn ${safeKeyword} chi tiết: Quy trình tổ chức, checklist kiểm soát an toàn từ Trường Hải Event & Travel. Hotline: ${brand.hotline}.`;

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

*Một kịch bản MC ${topic} đạt chuẩn chuyên nghiệp là "kim chỉ nam" giúp người dẫn chương trình làm chủ sân khấu, kết nối liền mạch cảm xúc khán giả và bảo chứng cho sự thành công trọn vẹn của sự kiện. Bài viết này chia sẻ trọn bộ kịch bản 5 phần chi tiết từng phút, lời dẫn mẫu thực chiến và bí quyết xử lý 5 tình huống phát sinh từ đạo diễn 10 năm kinh nghiệm.*

> 💡 *Xem chi tiết: [Cẩm nang quy trình tổ chức sự kiện chuyên nghiệp từ A-Z](/tin-tuc/cam-nang-to-chuc-su-kien-chuyen-nghiep)*

> ⚡ **Nhận tư vấn kịch bản & báo giá sự kiện sau 15 phút hoặc liên hệ Hotline: [${brand.hotline}](tel:${brand.hotline.replace(/\s+/g, "")})**

Trong bất kỳ chương trình nào, người dẫn chương trình (MC) chính là **"linh hồn" kết nối toàn bộ mạch cảm xúc**, định hướng sự tập trung của quan khách và bảo chứng cho sự trôi chảy của toàn bộ sự kiện. Một kịch bản dẫn được chuẩn bị kỹ lưỡng sẽ giúp MC tự tin làm chủ sân khấu và xử lý mượt mà mọi tình huống phát sinh.

Từng đồng hành biên soạn kịch bản và cung cấp nhân sự dẫn chương trình cho các sự kiện trang trọng của **${brand.keyProjects.slice(0, 4).join(", ")}**, Trường Hải Event & Travel xin chia sẻ trọn bộ kịch bản và kinh nghiệm thực chiến đắt giá nhất.

---

## 1. Cấu trúc khung xương 5 phần chuẩn của một kịch bản MC sự kiện chuyên nghiệp

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

*Quy trình triển khai ${cleanKeywordForTopic(keyword)} chuyên nghiệp đòi hỏi sự phối hợp đồng bộ giữa khâu khảo sát thực tế, lập kế hoạch chi tiết, kiểm soát an toàn và điều phối nhân sự nhịp nhàng. Cẩm nang thực chiến này cung cấp lộ trình từng bước kèm bảng checklist kiểm tra giúp ban tổ chức tối ưu thời gian và chi phí.*

> 💡 *Xem chi tiết: [Hồ sơ năng lực và quy trình tổ chức sự kiện chuyên nghiệp](/tin-tuc/quy-trinh-to-chuc-su-kien-chuyen-nghiep)*

> ⚡ **Nhận tư vấn kịch bản & báo giá sự kiện sau 15 phút hoặc liên hệ Hotline: [${brand.hotline}](tel:${brand.hotline.replace(/\s+/g, "")})**

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
    focus_keyword: safeKeyword,
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
  const safeKeyword = ensureAccentedKeyword(analysis.focus_keyword || keyword);
  const topic = cleanKeywordForTopic(safeKeyword);
  let cleanKw = safeKeyword.trim();
  cleanKw = cleanKw.replace(/^báo giá\s+/iu, "").trim();
  const title = toSentenceCase(`Báo giá ${cleanKw} trọn gói 2026: bảng dự toán chi tiết theo quy mô và cam kết không phát sinh`);
  const slug = `${createSeoSlug(safeKeyword)}-chuyen-nghiep-truong-hai`;
  const metaDescription = `Báo giá ${safeKeyword} trọn gói uy tín từ Trường Hải Event & Travel. Sở hữu kho thiết bị Line Array, màn LED P2.5/P3.91, đội xe riêng. Hotline: ${brand.hotline}.`;

  const faqSections = analysis.faq_list
    .map(
      (f) => `### ${toSentenceCase(f.question)}
${f.answer || f.answer_guideline || "Đang cập nhật câu trả lời từ chuyên gia Trường Hải Event."}`
    )
    .join("\n\n");

  const schemaJsonLd = buildFaqPageSchema(analysis.faq_list);

  const body = `
# ${title}

*Chi phí dịch vụ ${safeKeyword} trọn gói hiện nay phụ thuộc lớn vào quy mô khách tham dự và cấu hình hệ thống thiết bị âm thanh ánh sáng. Bài viết này cung cấp bảng báo giá bóc tách chi tiết theo từng hạng mục, ma trận so sánh thiết bị và giải pháp tối ưu 15% - 25% ngân sách trực tiếp từ tổng kho Trường Hải Event & Travel.*

> 💡 *Xem chi tiết: [Hồ sơ năng lực tổng kho thiết bị sự kiện và các dự án tiêu biểu](/tin-tuc/ho-so-nang-luc-kho-thiet-bi-truong-hai)*

> ⚡ **Nhận tư vấn kịch bản & báo giá sự kiện sau 15 phút hoặc liên hệ Hotline: [${brand.hotline}](tel:${brand.hotline.replace(/\s+/g, "")})**

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
    focus_keyword: safeKeyword,
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
  // Khôi phục và đảm bảo từ khóa có đầy đủ dấu tiếng Việt chuẩn xác
  const safeKeyword = ensureAccentedKeyword(analysis.focus_keyword || keyword);

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
Nhiệm vụ: Viết bài viết hoàn chỉnh chuẩn Markdown theo CẤU TRÚC ON-PAGE CHUYÊN NGHIỆP CỦA CÁC WEBSITE SỰ KIỆN HÀNG ĐẦU.

THÔNG TIN ĐẦU VÀO:
- Từ khóa mục tiêu: "${safeKeyword}" (BẮT BUỘC giữ nguyên dấu tiếng Việt)
- Search Intent đã xác định: "${analysis.search_intent}"
- Góc tiếp cận: "${analysis.content_angle}"
- Điểm vượt trội cần bổ sung: "${analysis.content_gap}"
- Dàn ý Outline bắt buộc bám sát: ${JSON.stringify(analysis.outline)}
- Danh sách FAQ bắt buộc giải đáp: ${JSON.stringify(analysis.faq_list)}

QUY TẮC CHÍNH TẢ TIẾNG VIỆT BẮT BUỘC (TUYỆT ĐỐI TUÂN THỦ):
- BẮT BUỘC 100% toàn bộ tiêu đề bài viết, đoạn sapo, heading H2/H3, nội dung phân tích, từ khóa in đậm và FAQ PHẢI VIẾT BẰNG TIẾNG VIỆT CÓ ĐẦY ĐỦ DẤU CHUẨN XÁC THEO TỪ ĐIỂN TIẾNG VIỆT.
- TUYỆT ĐỐI KHÔNG ĐƯỢC sinh bất kỳ từ khóa nào không có dấu (ví dụ: NGHIÊM CẤM viết 'to chuc su kien', 'bao gia thiet bi', 'to chuc le khai truong'; BẮT BUỘC phải viết chuẩn là 'tổ chức sự kiện', 'báo giá thiết bị', 'tổ chức lễ khai trương').
- Nếu từ khóa đầu vào "${safeKeyword}" có bất kỳ từ nào chưa có dấu, bạn PHẢI tự động phục hồi đầy đủ dấu tiếng Việt chuẩn trước khi đưa vào bài viết.

CẤU TRÚC BÀI VIẾT BẮT BUỘC (TUÂN THỦ TUYỆT ĐỐI THEO THỨ TỰ TỪ TRÊN XUỐNG DƯỚI):

1. TIÊU ĐỀ (H1):
   - Sử dụng công thức thu hút (chứa con số cụ thể, từ khóa chính "${safeKeyword}", hướng dẫn hành động hoặc cẩm nang thực chiến).
   - Áp dụng Sentence Case tiếng Việt: Chỉ viết hoa chữ cái đầu và danh từ riêng (Trường Hải, Vinpearl, Damsan, Hà Nội...). Tuyệt đối không viết hoa từng từ kiểu Title Case tiếng Anh.
   - Ví dụ:
     * Dạng cẩm nang/hướng dẫn: "10 bước lên kế hoạch tổ chức sự kiện chuyên nghiệp: quy trình thực chiến và checklist tối ưu chi phí"
     * Dạng kịch bản: "Mẫu kịch bản MC sự kiện chuyên nghiệp: 5 phần cốt lõi, lời dẫn chi tiết và bí quyết xử lý tình huống sân khấu"
     * Dạng thương mại/báo giá: "Báo giá tổ chức sự kiện trọn gói 2026: bảng dự toán chi tiết theo quy mô và cam kết không phát sinh"

2. ĐOẠN SAPO:
   - Đặt ngay sau H1.
   - 2-3 câu nêu trực diện giá trị của bài viết, giải quyết đúng Search Intent của người đọc.
   - BẮT BUỘC in nghiêng nhẹ toàn bộ đoạn Sapo dạng *...*.

3. INTERNAL CALL-OUT:
   - Tự động tạo 1 gợi ý xem thêm bài viết liên quan ngay sau Sapo:
     > 💡 *Xem chi tiết: [Chủ đề liên quan mật thiết đến ${safeKeyword}](/tin-tuc/slug-lien-quan)*
   - Thay [Chủ đề liên quan...] bằng dịch vụ hoặc cẩm nang liên quan và đường dẫn slug chuẩn SEO tiếng Việt không dấu.

4. QUICK CONVERSION BANNER (KHỐI KÊU GỌI CHUYỂN ĐỔI NHANH):
   - Sinh một block CTA ngắn gọn đặt ngay sau Internal call-out và trước thẻ H2 đầu tiên:
     > ⚡ **Nhận tư vấn kịch bản & báo giá sự kiện sau 15 phút hoặc liên hệ Hotline: [${brand.hotline}](tel:${brand.hotline.replace(/\s+/g, "")})**

5. DÀN Ý THÂN BÀI (H2, H3):
   - Sử dụng đánh số thứ tự rõ ràng cho các bài dạng cẩm nang/hướng dẫn (Ví dụ: "## 1. ...", "## 2. ...", các mục con hướng dẫn là "### 1.1. ...", "### 1.2. ...").
   - In đậm các từ khóa quan trọng và thuật ngữ chuyên ngành trong đoạn văn một cách tự nhiên (ví dụ: **âm thanh Line Array**, **màn hình LED P2.5**, **kịch bản phân vai**, **timeline sự kiện**...).
   - Mỗi bước/mục phải có lời khuyên thực chiến (Pro-tips) và checklist hành động được (bảng markdown hoặc danh sách 1. 2. 3.).
   - BIẾN THIÊN THEO SEARCH INTENT:
     * NẾU "informational" (Kịch bản MC, hướng dẫn): Tập trung vào timeline, lời thoại mẫu, kỹ năng ứng biến, checklist. NGHIÊM CẤM đưa các heading về bảng giá thiết bị, kho bãi, xe cộ!
     * NẾU "commercial" (Thuê thiết bị, báo giá, dịch vụ): Mới tập trung vào bảng giá bóc tách theo quy mô, thông số Line Array/LED, kho bãi trực tiếp, bảng trade-off.

6. KHỐI FAQ TRỰC DIỆN (3-5 CÂU HỎI):
   - Đặt ở cuối bài trước mục thông tin công ty.
   - Heading H2: "## Câu hỏi thường gặp về [chủ đề] (FAQ)"
   - Mỗi câu hỏi là một thẻ '###' kèm câu trả lời ngắn gọn, trực diện (dưới 60 từ).

7. KHỐI THÔNG TIN DOANH NGHIỆP:
   - Heading H2 hành động cụ thể kèm hotline ${brand.hotline} (CẤM dùng heading "Kết luận" hoặc "Lời kết").
   - Kèm thông tin công ty ${brand.companyName}, Giám đốc: ${brand.director}, MST: ${brand.taxId}.

8. ĐÍNH KÈM SCHEMA.ORG/FAQPAGE JSON-LD:
   - Ở cuối cùng của bài viết Markdown, bắt buộc xuất khối thẻ script sau:
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

Trả về DUY NHẤT một chuỗi JSON hợp lệ:
{
  "title": "Tiêu đề bài viết thu hút (chỉ viết hoa đầu dòng và danh từ riêng)",
  "slug": "duong-dan-url-chuan-seo-viet-khong-dau",
  "meta_description": "Meta description 150-160 ký tự có hotline ${brand.hotline}",
  "content": "Toàn bộ nội dung bài viết định dạng Markdown (đúng cấu trúc từ H1 -> Sapo in nghiêng -> Call-out -> Quick Banner -> H2/H3 -> FAQ -> Thông tin liên hệ -> Script Schema.org)"
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      if (parsed.title && parsed.content) {
        return {
          title: toSentenceCase(parsed.title),
          slug: parsed.slug || `${createSeoSlug(safeKeyword)}-chuyen-nghiep`,
          meta_description: parsed.meta_description || `Dịch vụ ${safeKeyword} từ Trường Hải Event & Travel. Hotline: ${brand.hotline}.`,
          focus_keyword: safeKeyword,
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
    return generateInformationalContent(safeKeyword, analysis, brand);
  }

  return generateCommercialContent(safeKeyword, analysis, brand);
}

