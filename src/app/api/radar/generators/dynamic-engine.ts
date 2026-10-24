/**
 * MASTER DYNAMIC ENGINE: SINH BÀI VIẾT ĐỘC BẢN CHO BẤT KỲ TỪ KHÓA NÀO
 * Thuộc chuẩn: Content SEO System - Multi-Stage Generation
 * Không dùng khuôn mẫu cố định - Nội dung và bảng biểu được tính toán linh hoạt
 * Phạm vi: Nội bộ src/app/api/radar/generators/
 */

import { GeneratedPost, toSentenceCase, createSeoSlug, cleanMarkdownHeadings } from "./types";
import { analyzeKeywordSemantics } from "./semantic-analyzer";

export function generateDynamicArticleFromSemanticEngine(
  targetKeyword: string,
  analysis?: any,
  customPrompt?: string
): GeneratedPost {
  const kw = (targetKeyword || "tổ chức sự kiện chuyên nghiệp").trim();
  const semantics = analyzeKeywordSemantics(kw);
  const subject = semantics.subject;

  // 1. TẠO TIÊU ĐỀ CHUẨN SENTENCE CASE, TỰ NHIÊN, KHÔNG DẬP KHUÔN
  const titleTemplates: Record<string, string> = {
    GRAND_OPENING_GROUNDBREAKING: `Kế hoạch tổ chức ${subject} trọn gói: nghi lễ phong thủy tài lộc và quy trình pháp lý chuẩn chỉ`,
    YEAR_END_ANNUAL_PARTY: `Ý tưởng tổ chức ${subject} độc bản: kịch bản vinh danh 3 nhịp cảm xúc và dự toán ngân sách tối ưu`,
    TEAMBUILDING_TRAVEL_CAMP: `Cẩm nang tổ chức ${subject} trọn gói: giải pháp Hybrid Event & Travel một đầu mối và kiểm soát 100% an toàn`,
    CONFERENCE_SEMINAR_WORKSHOP: `Quy trình tổ chức ${subject} chuẩn quốc tế: giải pháp âm thanh chống hú, màn LED P2.5 và check-in QR`,
    EQUIPMENT_TECHNICAL_RENTAL: `Bảng giá cho ${subject} kho trực tiếp: hệ thống Line Array, màn LED P2.5/P3.91 và cam kết không phát sinh`,
    FESTIVAL_SPORTS_COMMUNITY: `Kế hoạch tổ chức ${subject} quy mô lớn: kịch bản gắn kết đa thế hệ và phương án an toàn hiện trường`,
    CUSTOM_TAILORED_EVENT: `Cẩm nang ${subject} từ A-Z: bí quyết tối ưu 25% ngân sách từ kho thiết bị trực tiếp và kiểm soát rủi ro`,
  };

  const rawTitle = titleTemplates[semantics.category] || titleTemplates.CUSTOM_TAILORED_EVENT;
  const title = toSentenceCase(rawTitle);
  const slug = `${createSeoSlug(kw)}-chuyen-nghiep-truong-hai`;

  // 2. TẠO META DESCRIPTION CHUẨN 150-160 KÝ TỰ CÓ HOTLINE VÀ THẾ MẠNH
  const metaDescription = `Dịch vụ ${subject} trọn gói uy tín từ Trường Hải Event & Travel. Sở hữu kho thiết bị âm thanh Line Array, LED P2.5, đội xe riêng. Hotline 24/7: 0844 198 333.`;

  // 3. TẠO QUICK ANSWER (ANSWER-FIRST) DƯỚI H1
  const priceRangeSummary = semantics.scaleTiers[0] && semantics.scaleTiers[1]
    ? `${semantics.scaleTiers[0].estimatedBudget} đến ${semantics.scaleTiers[1].estimatedBudget}`
    : "tùy theo quy mô thực tế";

  const quickAnswerBlock = `> 📌 **Tóm tắt nhanh (Quick Answer):** Chi phí dịch vụ **${kw}** trọn gói hiện dao động trong khoảng từ **${priceRangeSummary}** tùy diện tích mặt bằng, địa điểm và độ phức tạp kỹ thuật. Trường Hải Event & Travel mang lại giải pháp vượt trội nhờ **trực tiếp sở hữu tổng kho thiết bị âm thanh Line Array nhập khẩu, màn hình LED P2.5/P3.91 và đội xe du lịch 16-45 chỗ**, giúp doanh nghiệp tiết kiệm 15% - 25% chi phí môi giới trung gian, kiểm soát 100% an toàn kỹ thuật và cam kết hợp đồng không phát sinh chi phí. Hotline hỗ trợ khảo sát và nhận dự toán bóc tách trong 30 phút: **0844 198 333**.`;

  // 4. BẢNG DỰ TOÁN CHI PHÍ BÓC TÁCH THEO QUY MÔ (DYNAMIC MARKDOWN TABLE)
  const pricingTableRows = semantics.scaleTiers
    .map(
      (tier) =>
        `| **${tier.scaleName}** | ${tier.scope} | ${tier.items} | ${tier.prepTime} | **${tier.estimatedBudget}** |`
    )
    .join("\n");

  // 5. BẢNG SO SÁNH TRADE-OFF ĐÁNH ĐỔI THỰC TẾ
  const tradeOffRows = semantics.tradeOffs
    .map(
      (t) =>
        `| **${t.aspect}** | ${t.optionA} | ${t.optionB} | ${t.recommendation} |`
    )
    .join("\n");

  // 6. TỔNG HỢP NỘI DUNG TOÀN BÀI VIẾT CHUẨN SEO
  const content = `
# ${title}

${quickAnswerBlock}

Một sự kiện **${subject}** thành công không chỉ là việc lắp đặt vài bộ bàn ghế hay dựng một tấm phông nền đơn giản. Trong chiến lược phát triển của mỗi tổ chức, đây là **khoảnh khắc vàng bảo chứng cho uy tín thương hiệu, khẳng định vị thế trước đối tác và kích hoạt động lực gắn kết nội bộ mạnh mẽ**.

Từng vinh dự đồng hành tổ chức các dự án quy mô quốc gia và tập đoàn lớn như **Lễ thông xe cầu Thăng Long (Bộ GTVT), Nhà máy Eiffel - Tập đoàn DAMSAN, Vinpearl Nam Hội An, chuỗi showroom LocknLock, Vietcombank, VPBank, NCB, Trường Đại học Bách Khoa Hà Nội...**, Trường Hải Event & Travel xin chia sẻ trọn bộ kinh nghiệm thực chiến giúp quý khách hàng làm chủ ngân sách và loại bỏ 100% rủi ro hiện trường.

---

## 1. Những bẫy phát sinh và điều kiện ngầm thường bị bỏ quên khi tổ chức ${subject}

Hầu hết các sự cố kỹ thuật hoặc chi phí đội giá trong các sự kiện ${subject} đều xuất phát từ việc thiếu khảo sát thực tế và chọn nhầm agency môi giới:

### 1.1. Bẫy phát sinh chi phí từ các đơn vị trung gian
${semantics.practicalPitfalls.map((p, i) => `${i + 1}. **${p.split(":")[0] || "Cạm bẫy"}:** ${p}`).join("\n")}

### 1.2. Các điều kiện ngầm về kỹ thuật và pháp lý hiện trường
Khác với việc thuê đồ thông thường, tổ chức ${subject} đòi hỏi kiểm soát nghiêm ngặt 3 yếu tố nền tảng:
${semantics.hiddenConditions.map((c) => `- **${c.split("(")[0] || c}:** ${c}`).join("\n")}

---

## 2. Giải pháp công nghệ và vũ khí độc quyền của Trường Hải Event & Travel

Để khắc phục hoàn toàn những lỗ hổng trên, Trường Hải Event & Travel trang bị hệ thống hạ tầng và quy chuẩn dịch vụ độc nhất:

### 2.1. Trực tiếp sở hữu tổng kho thiết bị – Không qua môi giới
- **Hệ thống âm thanh Line Array:** ${semantics.technicalHighlights[0] || "Loa Line Array nhập khẩu chuẩn châu Âu, góc phủ rộng, âm thanh vang rõ và triệt tiêu hoàn toàn tiếng hú rít."}
- **Công nghệ hiển thị màn hình LED:** ${semantics.technicalHighlights[1] || "Màn hình LED P2.5 siêu nét mịn cho không gian trong nhà và LED Outdoor P3.91 độ sáng cao chống lóa nắng."}
- **Hệ thống ánh sáng & hiệu ứng:** ${semantics.technicalHighlights[2] || "Đèn Moving Beam 260/380 tạo luồng sáng sân khấu sắc sảo, đèn Par LED đổi màu và máy khói lạnh an toàn."}

### 2.2. Đội ngũ nhân sự chuyên môn hóa cao
- **Đạo diễn hiện trường:** Xây dựng đường dây kịch bản chi tiết từng phút, bám sát thông điệp của ban lãnh đạo.
- **Kỹ thuật viên trực chiến:** Có mặt tại hiện trường trước giờ G tối thiểu 6 - 12 tiếng để chạy tổng duyệt kỹ thuật và dự phòng phương án thay thế 1:1 cho toàn bộ thiết bị chủ chốt.
- **Mô hình Hybrid độc nhất:** Sở hữu đội xe du lịch 16 - 45 chỗ riêng, giải quyết trọn vẹn bài toán đưa đón nhân sự và khách VIP liên tỉnh.

---

## 3. Bảng dự toán khung ngân sách tham khảo cho ${subject} (cam kết không phát sinh)

Nhằm giúp quý doanh nghiệp dễ dàng cân đối ngân sách và trình ban lãnh đạo phê duyệt, Trường Hải Event & Travel công khai bảng dự toán chi phí bóc tách theo quy mô:

| Quy mô triển khai | Hạng mục cung cấp chính | Chi tiết thiết bị & nhân sự | Thời gian chuẩn bị | Dự toán tham khảo |
| :--- | :--- | :--- | :--- | :--- |
${pricingTableRows}

*(Lưu ý: Bảng giá trên là khung tham khảo từ kho thiết bị. Báo giá chi tiết thực tế sẽ được chuyên viên Trường Hải bóc tách theo đúng diện tích mặt bằng, địa điểm và yêu cầu kịch bản riêng).*

---

## 4. Bảng phân tích so sánh các phương án kỹ thuật (Trade-off Matrix)

Trước khi quyết định ký kết hợp đồng, ban tổ chức cần nắm rõ sự đánh đổi giữa các phương án triển khai để tối ưu hóa hiệu quả:

| Hạng mục xem xét | Phương án thông thường | Phương án chuẩn hóa Trường Hải | Lời khuyên từ chuyên gia |
| :--- | :--- | :--- | :--- |
${tradeOffRows}

---

## 5. Quy trình làm việc 5 bước chuyên nghiệp từ kho thiết bị đến hiện trường

Mọi sự kiện do Trường Hải Event & Travel đảm nhận đều tuân thủ nghiêm ngặt quy trình quản lý chất lượng 5 bước:

1. **Bước 1 (tiếp nhận & khảo sát thực tế):** Khảo sát hiện trường trong ngày, đo đạc mặt bằng, kiểm tra tải trọng điện 3 pha và chiều cao trần miễn phí.
2. **Bước 2 (lên maquette 2D/3D & kịch bản):** Gửi kịch bản chi tiết và phối cảnh visual sân khấu 2D/3D trong vòng 24 giờ.
3. **Bước 3 (chốt dự toán & ký hợp đồng):** Bóc tách dự toán minh bạch từ gốc kho, cam kết pháp lý bằng hợp đồng *"tuyệt đối không phát sinh một đồng"*.
4. **Bước 4 (lắp đặt & tổng duyệt kỹ thuật):** Thi công hoàn thiện trước giờ G tối thiểu 6 - 12 tiếng, chạy tổng duyệt âm thanh ánh sáng cùng ban tổ chức.
5. **Bước 5 (trực chiến 100% & bàn giao media):** Trực chiến toàn bộ thời gian sự kiện, xử lý mọi phát sinh và bàn giao toàn bộ file ảnh phóng sự HD, video recap trong 48 giờ.

---

## 6. ${semantics.primaryActionHook}

Đừng để sự kiện trọng đại của doanh nghiệp bạn gặp phải những rủi ro kỹ thuật hay chi phí đội lên từ các agency trung gian thiếu sở hữu thiết bị. Hãy liên hệ ngay với Trường Hải Event & Travel để được phục vụ với chất lượng tốt nhất:

- **CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI**
- **Hotline tư vấn 24/7:** **0844 198 333**
- **Giám đốc điều hành:** Nguyễn Thị Thu Hằng
- **Địa chỉ:** LK 628, ngõ Lực, đường Sinh Viên, thôn Thanh Kỳ, xã Bình Minh, TP Hà Nội
- **Mã số thuế:** 0111601327 (Sở KH&ĐT TP Hà Nội cấp)
- **Slogan:** *"Sự kiện chuyên nghiệp – Du lịch trải nghiệm – Kết nối thành công"*
`.trim();

  return {
    title,
    slug,
    meta_description: metaDescription,
    focus_keyword: kw,
    content: cleanMarkdownHeadings(content),
  };
}
