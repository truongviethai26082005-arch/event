import { GeneratedPost, toSentenceCase, createSeoSlug, cleanMarkdownHeadings } from "./types";

/**
 * GENERATOR CHO INTENT: SỰ KIỆN TỔNG QUÁT, CÔNG TY TỔ CHỨC SỰ KIỆN TRỌN GÓI
 */
export function generateGeneralEventArticle(keyword: string): GeneratedPost {
  const kw = keyword.toLowerCase().trim();
  const title = toSentenceCase(`Cẩm nang ${kw} từ A-Z: bí quyết tối ưu 25% ngân sách và kiểm soát 100% rủi ro hiện trường`);
  const slug = `${createSeoSlug(keyword)}-chuyen-nghiep-truong-hai`;
  const metaDescription = `Dịch vụ ${kw} trọn gói uy tín tại Hà Nội từ Trường Hải Event & Travel. Sở hữu kho thiết bị âm thanh LED trực tiếp, đội xe riêng. Hotline: 0844 198 333.`;

  const content = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Chi phí dịch vụ ${kw} trọn gói hiện dao động từ **15.000.000đ - 95.000.000đ** tùy theo quy mô và độ phức tạp của hạng mục. Trường Hải Event & Travel mang lại lợi thế vượt trội nhờ **trực tiếp sở hữu kho thiết bị âm thanh Line Array, màn hình LED P2.5/P3.91 và đội xe du lịch 16-45 chỗ**, giúp doanh nghiệp tiết kiệm 15% - 25% chi phí trung gian và kiểm soát an toàn 100%. Hotline hỗ trợ dự toán trong 30 phút: **0844 198 333**.

Một sự kiện thành công không chỉ là buổi lễ hào nhoáng trong vài tiếng đồng hồ, mà là **một chiến dịch truyền thông trực tiếp bảo chứng cho uy tín và đẳng cấp của doanh nghiệp**. 

Từng đồng hành cùng các đơn vị hàng đầu như **Bộ GTVT, Tập đoàn DAMSAN, Vinpearl Nam Hội An, LocknLock, Vietcombank, VPBank...**, Trường Hải Event & Travel chia sẻ trọn bộ kinh nghiệm thực chiến giúp quý doanh nghiệp tổ chức sự kiện thành công trọn vẹn.

---

## 1. Bốn lỗ hổng thị trường thường gặp khi chọn nhầm agency môi giới

1. **Chi phí bị đội giá từ 20% - 35%:** Do agency phải thuê lại thiết bị và xe cộ qua nhiều tầng môi giới.
2. **Rủi ro kỹ thuật hiện trường:** Thiết bị cũ chập chờn, âm thanh hú rít làm gián đoạn bài phát biểu của lãnh đạo.
3. **Báo giá mập mờ, bẫy phát sinh:** Phát sinh thêm chi phí vận chuyển ngoài giờ, phí nhân công bốc dỡ.
4. **Bỏ quên an toàn và thủ tục pháp lý:** Không có phương án thời tiết dự phòng và thiếu giấy phép biểu diễn.

---

## 2. Năm vũ khí cốt lõi của Trường Hải Event & Travel

- **Trực tiếp sở hữu kho thiết bị Line Array & màn LED:** Tiết kiệm 15% - 25% chi phí cho khách hàng.
- **Báo giá minh bạch:** Cam kết bằng hợp đồng "không phát sinh một đồng".
- **Kịch bản độc bản:** Thiết kế riêng biệt theo câu chuyện thương hiệu của từng khách hàng.
- **An toàn tuyệt đối:** Có hệ thống nhà bạt không gian chịu giông bão và trực chiến trước giờ G 6 - 12 tiếng.
- **Mô hình Hybrid Event & Travel:** Đội xe riêng 16 - 45 chỗ đời mới, giải quyết trọn vẹn bài toán vận chuyển.

---

## 3. Bảng dự toán khung chi phí dịch vụ ${kw}

| Quy mô sự kiện | Hạng mục cung cấp | Thời gian chuẩn bị | Dự toán tham khảo |
| :--- | :--- | :--- | :--- |
| **Dưới 100 khách** | Sân khấu, backdrop, âm thanh 2 loa Full, MC, 2 mic không dây, tiệc trà teabreak | 1 - 2 ngày | **15.000.000đ - 28.000.000đ** |
| **100 - 300 khách** | Line Array 4 loa, màn LED P3.91 (15m²), đèn Beam, PG lễ tân, múa lân rước lộc | 3 - 5 ngày | **32.000.000đ - 55.000.000đ** |
| **300 - 1000+ khách** | Line Array công suất lớn, màn LED P2.5 (30m²), visual 3D, đạo diễn hiện trường | 5 - 10 ngày | **65.000.000đ - 110.000.000đ+** |

---

## 4. Quy trình làm việc 5 bước chuyên nghiệp

1. **Khảo sát mặt bằng miễn phí trong ngày.**
2. **Lên phối cảnh 2D/3D & kịch bản chi tiết sau 24 giờ.**
3. **Chốt dự toán gốc từ kho, ký kết hợp đồng pháp lý.**
4. **Lắp đặt & tổng duyệt kỹ thuật trước giờ G tối thiểu 6 tiếng.**
5. **Trực chiến 100% và bàn giao media HD sau 48 giờ.**

---

## 5. Nhận tư vấn và dự toán chi tiết ${kw} trong 30 phút

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
