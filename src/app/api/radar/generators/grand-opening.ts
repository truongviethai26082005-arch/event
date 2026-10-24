import { GeneratedPost, toSentenceCase, createSeoSlug, cleanMarkdownHeadings, cleanKeywordSubject } from "./types";

/**
 * GENERATOR CHO INTENT: LỄ KHAI TRƯƠNG, KHÁNH THÀNH, KHỞI CÔNG, ĐỘNG THỔ
 * Dàn ý tập trung: Phong thủy tài lộc, Giờ hoàng đạo, Múa lân sư rồng, Cắt băng, Pháp lý biển bảng
 */
export function generateGrandOpeningArticle(keyword: string): GeneratedPost {
  const kw = keyword.toLowerCase().trim();
  const subject = cleanKeywordSubject(kw);
  const title = toSentenceCase(`Kế hoạch tổ chức ${subject} trọn gói: nghi lễ phong thủy hút tài lộc và quy trình pháp lý chuẩn chỉ`);
  const slug = `${createSeoSlug(keyword)}-tron-goi-truong-hai`;
  const metaDescription = `Cẩm nang ${subject} trọn gói từ Trường Hải Event & Travel. Đội múa lân sư rồng, sân khấu LED, cổng hơi, thủ tục cấp phép. Hotline 24/7: 0844 198 333.`;

  const content = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Chi phí tổ chức ${subject} trọn gói hiện dao động từ **18.000.000đ - 65.000.000đ** (quy mô 50 - 300 khách) tùy diện tích sân khấu và gói nhân sự. Trường Hải Event & Travel cung cấp giải pháp chìa khóa trao tay: Múa lân sư rồng rước tài lộc, cổng hơi thương hiệu, thảm đỏ đón khách VIP, hệ thống âm thanh Line Array chống hú rít và trọn bộ hồ sơ xin cấp phép treo băng rôn. Khảo sát mặt bằng miễn phí, nhận dự toán bóc tách trong 30 phút qua hotline: **0844 198 333**.

Một buổi lễ ${subject} không đơn thuần là sự kiện gặp mặt giới thiệu địa điểm kinh doanh mới. Trong quan niệm kinh doanh của người Việt, đây là **thời khắc kích hoạt mạch vận khí tài lộc**, khẳng định uy tín thương hiệu trước khách hàng và kiến tạo tiếng vang truyền thông bùng nổ ngay ngày đầu ra mắt.

Từng vinh dự đảm nhận các đại lễ trọng điểm như **khánh thành Nhà máy Eiffel - Tập đoàn DAMSAN, khai trương cơ sở Vinpearl Nam Hội An, chuỗi showroom LocknLock cùng các sự kiện ngành ngân hàng Vietcombank, VPBank...**, Trường Hải Event & Travel chia sẻ cẩm nang thực chiến giúp doanh nghiệp tránh bẫy phát sinh và sở hữu ngày khai trương hồng phát viên mãn.

---

## 1. Yếu tố phong thủy và nghi thức tâm linh không thể xem nhẹ trong ngày khai trương

Khai trương thuận buồm xuôi gió thì cả năm buôn may bán đắt. Việc chuẩn bị nghi lễ đòi hỏi sự chuẩn xác tuyệt đối về cả tâm linh lẫn mỹ quan sự kiện:

### 1.1. Lựa chọn khung giờ hoàng đạo cắt băng kích hoạt tài vận
- **Giờ hoàng đạo:** Cần được tính toán dựa trên ngày tháng năm sinh của chủ doanh nghiệp hoặc người đại diện pháp luật, kết hợp với hướng tọa của mặt bằng kinh doanh.
- **Thời điểm cắt băng:** Phải diễn ra đúng vào chính ngọ hoặc khung giờ sinh khí, tuyệt đối không để trễ giờ do lỗi chuẩn bị âm thanh hay nhân sự đến muộn.

### 1.2. Mâm lễ cúng khai trương chu đáo theo truyền thống
- Mâm lễ Tam sên, gà trống luộc cánh tiên ngậm hoa hồng, heo quay cúng tài lộc, mâm ngũ quả tươi ngon tượng trưng cho Ngũ hành sung túc.
- Giấy tiền vàng bạc, trầu cau, chè xôi và bài văn khấn cúng khai trương chuẩn xác do chuyên gia văn hóa hướng dẫn.

### 1.3. Tiết mục múa lân sư rồng khai môn rước ngọc
- **Trống hội khai mạc:** Dàn trống 6 - 8 - 10 quả gióng lên những hồi trống giòn giã tượng trưng cho sự thịnh vượng, xua tan chướng khí.
- **Bài múa Độc chiếm ngao đầu hoặc Tứ quý hưng long:** Lân nhảy múa nhả câu đối chúc mừng may mắn: *"Khai trương hồng phát - Vạn sự hanh thông"*.
- **Nghi thức Lân nhả lộc:** Trao tay gia chủ cây bắp cải phong thủy hoặc phong bao may mắn mang ý nghĩa tiền tài đổ về như nước.

---

## 2. Các hạng mục thiết bị và không gian nhận diện thương hiệu chuẩn VIP

Để thương hiệu của bạn nổi bật hoàn toàn so với các đối thủ xung quanh, không gian tổ chức ${subject} cần được bố trí đồng bộ:

### 2.1. Cổng chào và khu vực đón tiếp khách VIP (Check-in Zone)
- **Cổng chào hơi hoặc cổng khung Truss bọc bạt 2D/3D:** Chiều ngang 6m - 12m, in logo sắc nét tạo điểm nhấn ấn tượng từ xa.
- **Thảm đỏ dẫn lối:** Trải dài từ cổng ngoài đến sảnh chính, hai bên bố trí cột inox dây nhung đỏ sang trọng.
- **Photobooth check-in thiết kế độc bản:** Kết hợp hoa tươi hoặc hoa lụa cao cấp cùng hệ thống đèn rọi spotlight, giúp khách mời chụp ảnh check-in và lan tỏa hình ảnh lên mạng xã hội.

### 2.2. Sân khấu và hệ thống âm thanh ánh sáng kho trực tiếp
- **Sân khấu lắp ghép chịu tải lớn:** Khung thép hộp kiên cố, ván gỗ phủ thảm đỏ hoặc thảm đen sang trọng, chân tăng chỉnh độ cao linh hoạt theo địa hình.
- **Dàn loa Line Array nhập khẩu:** Trường Hải trực tiếp sở hữu dàn Line Array công suất chuẩn, phủ âm thanh đều khắp mặt tiền mà không gây chói tai cho khách ngồi hàng đầu, tuyệt đối chống hú rít khi lãnh đạo phát biểu.
- **Màn hình LED outdoor P3.91 siêu sáng:** Chống lóa hoàn hảo dưới ánh nắng mặt trời buổi sáng, hiển thị clip giới thiệu thương hiệu và thông điệp ban giám đốc sắc nét từng chi tiết.

### 2.3. Bộ nghi thức cắt băng khai trương trang trọng
- Khay inox phủ vải đỏ, kéo vàng chuôi rồng, dải lụa đỏ gắn hoa lụa lớn được đội ngũ PG chuẩn bị chu đáo, trao tay quan khách đúng khoảnh khắc MC đếm ngược 3 - 2 - 1.
- Hiệu ứng pháo điện sáng bừng cùng máy bắn kim tuyến tạo nên cao trào thị giác rực rỡ nhất buổi lễ.

---

## 3. Thủ tục pháp lý xin phép sự kiện và an toàn mặt bằng

Đây là lỗ hổng chí mạng mà các đơn vị môi giới thường giấu nhẹm khách hàng:

### 3.1. Các loại giấy phép bắt buộc phải có
- **Thông báo hoạt động biểu diễn nghệ thuật:** Gửi cơ quan quản lý văn hóa địa phương trước 5 - 10 ngày nếu chương trình có ca sĩ, nhóm nhảy biểu diễn.
- **Giấy phép treo băng rôn, cờ phướn quảng cáo:** Nộp hồ sơ tại Sở Văn hóa Thể thao và Du lịch hoặc Phòng Văn hóa Thông tin quận/huyện.
- **Đăng ký sử dụng tạm thời vỉa hè, lòng đường:** Phải có văn bản chấp thuận của UBND phường/xã để tránh bị lực lượng đô thị can thiệp giữa giờ G.

### 3.2. Phương án dự phòng thời tiết với nhà bạt không gian
Khí hậu miền Bắc thường có mưa rào bất chợt hoặc nắng gắt. Trường Hải luôn trang bị sẵn **nhà bạt không gian hợp kim nhôm khẩu độ 6m - 18m**, bạt trắng 2 lớp chống nóng và chống thấm 100%, bảo vệ an toàn tuyệt đối cho toàn bộ khách VIP và trang thiết bị.

---

## 4. Bảng dự toán bóc tách chi phí tổ chức ${subject} (cam kết không phát sinh)

| Gói quy mô | Hạng mục cung cấp trọn gói | Thời gian setup | Ngân sách trọn gói |
| :--- | :--- | :--- | :--- |
| **Gói Khởi Sắc (30 - 80 khách)** | Cổng hơi, thảm đỏ, backdrop check-in, âm thanh 2 loa Full, 1 đội Lân (2 lân 1 trống), bộ cắt băng, MC, 2 PG đón khách | 4 - 6 tiếng trước giờ G | **18.000.000đ - 28.000.000đ** |
| **Gói Thịnh Vượng (80 - 200 khách)** | Sân khấu, Line Array 4 loa, màn LED P3.91 (12m²), 2 đội Lân Sư Rồng (4 lân 6 trống), cổng chào Formex, tiệc teabreak 50 suất, MC song ngữ, 4 PG | Trước 12 tiếng | **32.000.000đ - 48.000.000đ** |
| **Gói Đại Phát (200 - 500+ khách VIP)** | Sân khấu lớn, Line Array treo khung Truss, màn LED 24m², nhà bạt nhôm không gian, múa lân leo cột lấy lộc, ca sĩ, tiệc trà VIP, đạo diễn hiện trường | Trước 24 tiếng | **55.000.000đ - 85.000.000đ+** |

*(Ghi chú: Toàn bộ bảng giá đều được bóc tách chi tiết từng dòng, có hợp đồng pháp lý bảo lãnh: **Cam kết tuyệt đối không phát sinh một đồng phụ phí**).*

---

## 5. Quy trình 5 bước tác chiến nhanh chóng tại Trường Hải Event & Travel

1. **Khảo sát mặt bằng miễn phí trong 2 giờ:** Kỹ sư hiện trường đến tận nơi đo đạc diện tích, kiểm tra nguồn điện và hướng đón khách.
2. **Lên phối cảnh 2D/3D & kịch bản chi tiết trong 24 giờ:** Khách hàng hình dung chính xác diện mạo sự kiện trước khi chốt hợp đồng.
3. **Ký kết hợp đồng giá gốc từ kho:** Báo giá minh bạch, xuất hóa đơn VAT đầy đủ theo quy định.
4. **Lắp đặt & tổng duyệt kỹ thuật trước giờ G 6 - 12 tiếng:** Chạy thử âm thanh, ánh sáng, màn LED và khớp kịch bản cùng ban tổ chức.
5. **Trực chiến 100% trong sự kiện:** Đội ngũ kỹ thuật viên thường trực xử lý mọi phát sinh, bàn giao toàn bộ file ảnh/video HD sau 24 giờ.

---

## 6. Nhận tư vấn phong thủy và dự toán chi tiết ${subject} trong 30 phút

Đừng đánh cược ngày khởi đầu kinh doanh quan trọng vào các đơn vị trung gian thiếu thiết bị và thiếu kinh nghiệm xử lý sự cố. Hãy liên hệ ngay với Trường Hải Event & Travel để nhận trọn gói dịch vụ chuẩn VIP với giá gốc kho:

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
