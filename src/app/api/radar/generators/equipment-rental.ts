import { GeneratedPost, toSentenceCase, createSeoSlug, cleanMarkdownHeadings, cleanKeywordSubject } from "./types";

/**
 * GENERATOR CHO INTENT: THUÊ ÂM THANH ÁNH SÁNG, MÀN HÌNH LED, THIẾT BỊ SỰ KIỆN
 * Dàn ý tập trung: Tổng kho trực tiếp không qua trung gian, Thông số kỹ thuật Loa/LED, Báo giá bóc tách m2 và bộ
 */
export function generateEquipmentRentalArticle(keyword: string): GeneratedPost {
  const kw = keyword.toLowerCase().trim();
  let subject = cleanKeywordSubject(kw);
  subject = subject.replace(/\s+(tại\s+)?hà\s+nội$/iu, "").trim();
  const title = toSentenceCase(`Báo giá ${subject} tại Hà Nội: tổng kho trực tiếp, tiết kiệm 25% ngân sách, kỹ thuật viên trực chiến 100%`);
  const slug = `${createSeoSlug(keyword)}-gia-kho-truong-hai`;
  const metaDescription = `Báo giá ${subject} tại Hà Nội từ Trường Hải Event. Trực tiếp sở hữu kho âm thanh Line Array, màn hình LED P2.5/P3.91, đèn Moving Beam. Cam kết không phát sinh: 0844 198 333.`;

  const content = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Bảng giá ${kw} tại kho trực tiếp của Trường Hải Event & Travel: Màn hình LED P3.91 trong nhà từ **550.000đ/m²**, màn hình LED outdoor chống nước từ **650.000đ/m²**, gói âm thanh Line Array sự kiện từ **3.500.000đ/gói**. Toàn bộ thiết bị đều là hàng nhập khẩu chính hãng, có kỹ thuật viên trực chiến 100% trong suốt sự kiện và bảo lãnh hợp đồng 'không phát sinh thêm một đồng chi phí vận chuyển hay phụ phí ngoài giờ'. Nhận dự toán bóc tách trong 30 phút qua hotline: **0844 198 333**.

Khi tìm kiếm đơn vị cung cấp ${kw}, nỗi lo lớn nhất của các agency và doanh nghiệp là gặp phải các "công ty ma" hoặc môi giới trung gian: Nhận hợp đồng rồi đi thuê lại vòng quanh, vừa đẩy chi phí lên cao ngất ngưởng, vừa tiềm ẩn rủi ro thiết bị cũ nát, chập chờn khi vận hành thực tế.

Với lợi thế **trực tiếp sở hữu tổng kho thiết bị sự kiện quy mô lớn tại Hà Nội**, Công ty TNHH Sự kiện và Du lịch Trường Hải mang đến giải pháp cung ứng thiết bị tận gốc với cam kết chất lượng tuyệt đối.

---

## 1. Cảnh báo những bẫy chi phí khi thuê thiết bị qua đơn vị môi giới

Nhiều đơn vị đưa ra báo giá ban đầu rất thấp để câu khách ký hợp đồng, nhưng sau đó liên tục phụ thu các khoản phí bất hợp lý:

1. **Phụ phí vận chuyển và bốc dỡ:** Tính thêm từ 2.000.000đ - 5.000.000đ với lý do tòa nhà không có thang máy hàng hoặc địa điểm ngoài vành đai 3.
2. **Phụ phí kỹ thuật viên ngoài giờ:** Tính tiền làm việc sau 22h00 đêm hoặc phí chạy rehearsal trước giờ G.
3. **Phí thiết bị phụ trợ:** Tính tiền dây cáp tín hiệu, pin micro không dây, bàn mixer hoặc khung giàn treo loa.
4. **Tráo đổi thiết bị cũ:** Báo giá loa thương hiệu nổi tiếng nhưng khi lắp đặt lại đưa loa cũ méo tiếng, màn hình LED bị chết điểm ảnh (dead pixels) loang lổ.

**Cam kết của Trường Hải:** Giá niêm yết là **giá trọn gói chìa khóa trao tay**, bao gồm trọn gói chi phí vận chuyển, lắp đặt, tháo dỡ và kỹ thuật viên trực chiến suốt thời gian diễn ra sự kiện.

---

## 2. Thông số kỹ thuật chi tiết kho thiết bị tại Trường Hải Event

Chúng tôi công khai 100% thông số kỹ thuật để quý khách hàng và kỹ thuật viên kiểm chứng:

### 2.1. Hệ thống âm thanh Line Array nhập khẩu
- **Cụm loa Line Array:** Sử dụng củ loa cao cấp, dải tần đáp ứng từ 50Hz đến 20kHz, công suất cực đại 135dB SPL, phủ sóng góc ngang 110 độ.
- **Hệ thống loa Subwoofer kép 18 inch:** Tạo âm trầm uy lực, tròn tiếng, không bị ù rền khi phát nhạc sôi động hay EDM.
- **Bàn trộn kỹ thuật số (Digital Mixer):** Behringer X32 / Yamaha QL5 xử lý tín hiệu DSP 40 kênh, loại bỏ hoàn toàn tạp âm và chống hú micro tuyệt đối.
- **Hệ thống micro không dây UHF:** Dải tần sạch 640MHz - 690MHz, tự động dò sóng sạch, khoảng cách bắt sóng ổn định trên 80m.

### 2.2. Màn hình LED P2.5 trong nhà và P3.91 ngoài trời
- **Màn LED P2.5 Indoor:** Khoảng cách điểm ảnh 2.5mm, tần số quét 3840Hz (chống sọc đen khi quay video bằng smartphone), độ sáng 800 - 1000 nits mịn màng.
- **Màn LED P3.91 Outdoor:** Chuẩn chống nước IP65, độ sáng cực cao 4500 - 5500 nits, hiển thị rõ ràng dưới ánh nắng chói chang giữa trưa hè.
- **Bộ xử lý hình ảnh (Video Processor) 4K:** Cho phép chia nhỏ nhiều cửa sổ hiển thị, chuyển cảnh mượt mà không bị giật lag.

### 2.3. Hệ thống ánh sáng sân khấu chuyên nghiệp
- **Đèn Moving Beam 260 / 380:** Tạo luồng sáng sắc lẹm, gobo hoa văn đa dạng, xoay 540 độ linh hoạt.
- **Đèn Par LED 54 bóng 3W (Full Color):** Nhuộm màu sân khấu ấm cúng, tái hiện chuẩn sắc thái trang phục của diễn viên và khách mời.
- **Hiệu ứng đặc biệt:** Máy khói lạnh nặng bay là là mặt sàn, máy bắn kim tuyến và pháo điện an toàn được cấp phép PCCC.

---

## 3. Bảng báo giá chi tiết từng hạng mục thiết bị sự kiện (giá gốc kho)

| Danh mục thiết bị | Quy cách / Thông số | Đơn vị tính | Đơn giá thuê tham khảo |
| :--- | :--- | :--- | :--- |
| **Màn hình LED P3.91 Indoor** | Cabin nhôm đúc 500x500mm, processor kèm theo | m² / ngày | **550.000đ - 650.000đ** |
| **Màn hình LED P3.91 Outdoor** | Chuẩn IP65 chống nước, độ sáng 5000 nits | m² / ngày | **650.000đ - 750.000đ** |
| **Gói âm thanh 4 loa Full** | 4 loa Full, 2 Sub, Mixer, 4 mic UHF (dưới 150 khách) | Gói / ngày | **3.500.000đ - 4.500.000đ** |
| **Gói âm thanh Line Array 4 cụm** | 4 loa Array, 2 Sub kép, Mixer Digital (150 - 350 khách) | Gói / ngày | **6.500.000đ - 8.500.000đ** |
| **Gói âm thanh Line Array lớn** | 8 - 12 loa Array, 4 Sub kép công suất lớn (trên 500 khách) | Gói / ngày | **12.000.000đ - 18.000.000đ** |
| **Đèn Moving Beam 260** | Kèm bàn điều khiển DMX và kỹ thuật viên ánh sáng | Cặp (2 chiếc) | **1.200.000đ - 1.500.000đ** |
| **Sân khấu lắp ghép chịu tải** | Khung sắt hộp, ván ép phủ thảm đỏ/đen, cao 0.4 - 1.2m | m² / ngày | **120.000đ - 150.000đ** |
| **Nhà bạt nhôm không gian** | Khẩu độ 10m - 18m, bạt trắng cách nhiệt chống giông bão | m² / ngày | **85.000đ - 120.000đ** |

---

## 4. Quy trình cung cấp thiết bị nhanh chóng trong ngày

1. **Khảo sát vị trí lắp đặt trong 2 giờ:** Kỹ thuật viên kiểm tra nguồn điện 3 pha, vị trí đi dây và khoảng cách an toàn.
2. **Lắp đặt hoàn thiện trước sự kiện tối thiểu 4 - 6 tiếng:** Đảm bảo thời gian để ban tổ chức chạy thử chương trình.
3. **Kỹ thuật viên âm thanh - ánh sáng - màn LED trực chiến 100%:** Luôn có mặt tại bàn điều khiển, không bỏ vị trí bất kỳ giây phút nào.
4. **Tháo dỡ nhanh gọn sau khi kết thúc chương trình:** Bàn giao lại mặt bằng nguyên trạng, sạch sẽ cho ban quản lý tòa nhà.

---

## 5. Liên hệ đặt thuê thiết bị tại tổng kho Trường Hải Event

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
