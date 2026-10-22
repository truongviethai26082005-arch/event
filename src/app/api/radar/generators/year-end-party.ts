import { GeneratedPost, toSentenceCase, createSeoSlug, cleanMarkdownHeadings, cleanKeywordSubject } from "./types";

/**
 * GENERATOR CHO INTENT: TIỆC TẤT NIÊN, YEAR END PARTY, GALA DINNER
 * Dàn ý tập trung: Concept độc bản, Vinh danh nhân sự 3 cung bậc cảm xúc, Visual LED 3D mapping, Gameshow, DJ bùng nổ
 */
export function generateYearEndPartyArticle(keyword: string): GeneratedPost {
  const kw = keyword.toLowerCase().trim();
  const subject = cleanKeywordSubject(kw);
  const title = toSentenceCase(`Bí quyết tổ chức ${subject} đáng nhớ: 5 concept độc bản, kịch bản vinh danh chạm cảm xúc và tối ưu chi phí`);
  const slug = `${createSeoSlug(keyword)}-chuyen-nghiep-truong-hai`;
  const metaDescription = `Tổ chức ${subject} ấn tượng cùng Trường Hải Event. Concept độc bản Gatsby, Oscar, Tết cổ truyền, sân khấu LED 3D visual, vinh danh nhân sự. Hotline 24/7: 0844 198 333.`;

  const content = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Chi phí tổ chức ${subject} trọn gói hiện dao động từ **25.000.000đ - 110.000.000đ** (quy mô 50 - 500 nhân sự) tùy thuộc vào độ phức tạp của concept và gói âm thanh ánh sáng. Trường Hải Event & Travel sở hữu tổng kho thiết bị Line Array, màn hình LED P2.5 trong nhà siêu mịn và đội ngũ biên kịch sáng tạo, cam kết dàn dựng kịch bản độc bản vinh danh nhân sự xúc động, bùng nổ năng lượng cuối năm mà không qua trung gian. Liên hệ tư vấn kịch bản trong 30 phút: **0844 198 333**.

Tiệc tất niên Year End Party (${subject}) là sự kiện nội bộ mang tính bước ngoặt của mọi doanh nghiệp sau một năm cống hiến kiên trì. Đây không đơn thuần chỉ là bữa liên hoan tổng kết ăn uống thông thường, mà chính là **thánh đường tôn vinh giá trị con người**, nơi gắn kết các phòng ban và truyền lửa nhiệt huyết cho mục tiêu bứt phá của năm tài chính mới.

Khảo sát nội bộ từ hơn 300 doanh nghiệp cho thấy: Nhân sự nhớ về đêm tất niên không phải vì món ăn ngon hay dở, mà chính là **cảm xúc thăng hoa tại thời khắc được ban lãnh đạo xướng tên vinh danh, niềm tự hào khi nhìn lại thước phim 365 ngày vượt khó và tiếng cười bùng nổ trong những trò chơi gắn kết**.

---

## 1. Top 4 concept ${subject} dẫn đầu xu hướng 2025 - 2026

Nói không với các khuôn mẫu sáo rỗng "MC lên nói - sếp phát biểu - ăn tiệc - ra về", Trường Hải Event & Travel mang đến những concept tiệc tất niên độc bản:

### 1.1. Concept Dạ tiệc Hoàng Gia (Gatsby & Red Carpet Oscar)
- **Không gian:** Tông màu vàng kim (Gold) kết hợp đen huyền bí (Black Velvet). Thảm đỏ trải dài từ cửa đón tiếp, photobooth mô phỏng tượng vàng Oscar danh giá.
- **Trải nghiệm khách mời:** Dress code Cocktail / Tuxedo sang trọng. Mỗi nhân sự bước vào đều được nhiếp ảnh gia săn đón như ngôi sao điện ảnh.
- **Điểm nhấn kịch bản:** Lễ trao giải "The Best of The Year" với phong bì bí mật, nhạc nền hồi hộp chuẩn lễ trao giải Hollywood, spotlight rọi theo từng bước chân người chiến thắng.

### 1.2. Concept Tết Xưa Giao Thoa Tết Nay (Retro Chic kết hợp EDM Hiện Đại)
- **Khu vực sảnh đón:** Tái hiện không gian chợ Tết cổ truyền với chõng tre, câu đối đỏ, ông đồ cho chữ và các quầy ẩm thực dân gian khởi động không khí ấm cúng.
- **Khu vực sân khấu chính:** Bất ngờ chuyển mình thành vũ trường ánh sáng với màn hình LED visual 3D, hiệu ứng pháo điện và đêm nhạc EDM bùng nổ từ DJ chuyên nghiệp.
- **Ý nghĩa:** Gợi nhắc cội nguồn văn hóa doanh nghiệp bền vững, đồng thời khẳng định tinh thần hiện đại, sẵn sàng đổi mới sáng tạo.

### 1.3. Concept Trạm Tương Lai (Cyberpunk & Digital Transformation)
- Dành riêng cho các công ty công nghệ, fintech, startup năng động.
- Sân khấu kết hợp hiệu ứng đèn Laser đa chiều, màn LED Matrix hiển thị mã code và visual vi mạch số hóa, tượng trưng cho bước chuyển mình thần tốc vào kỷ nguyên AI.

### 1.4. Concept Hội Làng Gắn Kết (Family Day Gala)
- Dành cho các tập đoàn sản xuất hoặc doanh nghiệp muốn tri ân cả gia đình nhân viên (vợ/chồng, con cái).
- Bố trí khu vui chơi trẻ em, góc tặng quà gia đình và những tiết mục văn nghệ "cây nhà lá vườn" đầm ấm, xúc động.

---

## 2. Nghệ thuật dàn dựng kịch bản vinh danh 3 cung bậc cảm xúc

Linh hồn của đêm ${subject} nằm ở kịch bản vinh danh. Đội ngũ biên kịch Trường Hải thiết kế mạch cảm xúc theo cấu trúc 3 hồi kinh điển:

### 2.1. Hồi 1: Lắng đọng & Tự hào (Video Recap 365 Ngày)
- Trình chiếu video clip tóm tắt chặng đường 1 năm đầy thăng trầm. Những giọt mồ hôi tại công trường, những đêm thức trắng chạy deadline của khối văn phòng được tái hiện chân thực.
- Lời phát biểu truyền cảm hứng của Ban Lãnh Đạo, không giáo điều cứng nhắc mà là những lời cảm ơn chân thành từ đáy lòng gửi đến từng chiến binh.

### 2.2. Hồi 2: Thăng hoa & Tri ân (Vinh danh cống hiến)
- Trao cúp vinh danh, kỷ niệm chương và những phần thưởng xứng đáng cho cá nhân xuất sắc, tập thể tiêu biểu, nhân sự thâm niên 5 năm - 10 năm.
- **Khoảnh khắc bất ngờ:** Trình chiếu video bí mật quay lời chúc từ cha mẹ, vợ con của nhân sự xuất sắc gửi từ quê nhà — chạm tới trái tim và lấy đi những giọt nước mắt tự hào của cả khán phòng.

### 2.3. Hồi 3: Bùng nổ & Kết nối (Gameshow & Đêm nhạc DJ)
- Minigame tương tác tập thể sân khấu vui nhộn, kéo gần khoảng cách giữa sếp và nhân viên.
- Bốc thăm trúng thưởng (Lucky Draw) với cơ cấu giải thưởng hấp dẫn: Xe máy, iPhone, Smart TV... giữ chân khách mời tới phút chót.
- DJ và Band nhạc sống khuấy động sàn diễn, toàn thể công ty cùng khoác vai nhau nhảy múa và cất cao tiếng hát đón chào năm mới.

---

## 3. Tiêu chuẩn kỹ thuật âm thanh ánh sáng cho đêm gala hoàn hảo

Không gì phá hỏng cảm xúc đêm tiệc nhanh hơn một sự cố kỹ thuật âm thanh hú rít hay màn hình chập chờn:

### 3.1. Dàn âm thanh Line Array treo khung Truss
- Khác biệt với loa thùng truyền thống chỉ lớn ở đầu phòng và mất tiếng ở cuối phòng, hệ thống **Line Array nhập khẩu** của Trường Hải phủ áp suất âm thanh mượt mà 100% diện tích, giúp bài phát biểu của sếp dù nói thì thầm vẫn chạm đến từng bàn tiệc xa nhất.
- Hệ thống micro UHF chuyên dụng được lọc tạp âm và chống hú rít tuyệt đối.

### 3.2. Màn hình LED P2.5 trong nhà độ nét siêu cao
- Khoảng cách điểm ảnh chỉ 2.5mm cho hình ảnh mịn màng, hiển thị chữ chiếu slide báo cáo rõ nét không bị nhòe vỡ khi chụp ảnh kỷ niệm.
- Đội ngũ Visual Effect của Trường Hải thiết kế riêng bộ visuals 3D theo đúng bộ nhận diện thương hiệu công ty bạn.

---

## 4. Bảng dự toán chi phí tổ chức ${subject} theo quy mô nhân sự

| Quy mô nhân sự | Hạng mục cung cấp trọn gói | Thời gian thi công | Dự toán tham khảo |
| :--- | :--- | :--- | :--- |
| **Dưới 80 người** | Sân khấu, backdrop, âm thanh 2 loa Full, màn LED 9m², MC khuấy động, 3 minigame, đạo cụ bốc thăm | 4 tiếng trước tiệc | **25.000.000đ - 38.000.000đ** |
| **80 - 250 người** | Line Array 4 loa, màn LED P2.5 (18m²), đèn Beam/Par LED, DJ biểu diễn 2h, visual 3D, MC chuyên nghiệp, chụp ảnh sự kiện | 8 tiếng trước tiệc | **42.000.000đ - 68.000.000đ** |
| **250 - 600+ người** | Line Array công suất lớn, màn LED 30m² cong, hiệu ứng khói lạnh, pháo điện, Band nhạc sống, đạo diễn điều phối hiện trường | 12 - 24 tiếng trước tiệc | **75.000.000đ - 120.000.000đ+** |

*(Lưu ý: Báo giá chưa bao gồm thực đơn tiệc ăn uống và địa điểm thuê hội trường, sẽ được Trường Hải hỗ trợ liên kết với chiết khấu tốt nhất).*

---

## 5. Quy trình đồng hành từ A-Z cùng doanh nghiệp

1. **Tiếp nhận nhu cầu và văn hóa doanh nghiệp:** Lắng nghe câu chuyện năm qua và thông điệp mà Ban Lãnh Đạo muốn truyền tải.
2. **Xây dựng Concept 3D & Kịch bản khung sau 24h:** Đội ngũ sáng tạo phác thảo chi tiết từng timeline hoạt động.
3. **Chốt dự toán gốc từ kho:** Báo giá bóc tách minh bạch từng mét vuông LED và từng bộ đèn, không qua trung gian.
4. **Setup và Rehearsal (tổng duyệt) trước 4 tiếng:** Khớp nhạc, khớp hiệu ứng visual màn hình LED và duyệt MC trực tiếp.
5. **Nghiệm thu và bàn giao media:** Gửi trọn bộ ảnh gốc chỉnh màu và video highlight recap cảm xúc trong vòng 48 giờ.

---

## 6. Nhận tư vấn kịch bản độc bản và dự toán ${subject} trong 30 phút

Hãy để đêm tất niên năm nay trở thành niềm tự hào bất tận của toàn thể cán bộ nhân viên công ty bạn. Liên hệ ngay với Trường Hải Event & Travel:

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
    focus_keyword: keyword,
    content: cleanMarkdownHeadings(content),
  };
}
