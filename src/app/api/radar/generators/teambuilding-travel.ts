import { GeneratedPost, toSentenceCase, createSeoSlug, cleanMarkdownHeadings, cleanKeywordSubject } from "./types";

/**
 * GENERATOR CHO INTENT: TOUR DU LỊCH & TEAM BUILDING KẾT HỢP GALA DINNER
 * Dàn ý tập trung: Mô hình hybrid Event & Travel, Đội xe riêng 16-45 chỗ, Trò chơi phá vỡ khoảng cách, An toàn tour
 */
export function generateTeambuildingTravelArticle(keyword: string): GeneratedPost {
  const kw = keyword.toLowerCase().trim();
  const subject = cleanKeywordSubject(kw);
  const title = toSentenceCase(`Cẩm nang tổ chức ${subject} trọn gói: giải pháp mô hình Event & Travel một đầu mối, tối ưu 25% ngân sách`);
  const slug = `${createSeoSlug(keyword)}-tron-goi-truong-hai`;
  const metaDescription = `Tour ${subject} kết hợp Gala Dinner trọn gói cùng Trường Hải Event & Travel. Sở hữu đội xe 16-45 chỗ đời mới, kho thiết bị âm thanh LED trực tiếp. Hotline: 0844 198 333.`;

  const content = `
# ${title}

> 📌 **Tóm tắt nhanh (Quick Answer):** Chi phí tổ chức ${subject} trọn gói hiện dao động từ **850.000đ - 2.800.000đ/người** (tùy tuyến điểm 1 ngày hoặc 2 ngày 1 đêm và tiêu chuẩn lưu trú 3 - 5 sao). Trường Hải Event & Travel là đơn vị tiên phong sở hữu mô hình **Hybrid Event & Travel**: Trực tiếp sở hữu đội xe du lịch 16 - 45 chỗ đời mới, giấy phép lữ hành quốc tế và tổng kho thiết bị sự kiện. Giải quyết triệt để vấn đề trễ giờ điều phối, cam kết hợp đồng trọn gói không phát sinh. Nhận lịch trình chi tiết trong 30 phút qua hotline: **0844 198 333**.

Tổ chức tour du lịch kết hợp ${subject} là hoạt động thường niên không thể thiếu để tái tạo năng lượng, gắn kết tinh thần đồng đội và nâng cao lòng trung thành của nhân sự với tổ chức. Tuy nhiên, thực tế triển khai cho thấy nhiều doanh nghiệp gặp phải những trải nghiệm đáng thất vọng do mô hình vận hành rời rạc của các đơn vị trên thị trường.

---

## 1. Nỗi đau lớn nhất của doanh nghiệp: Sự tách rời giữa công ty lữ hành và agency sự kiện

Khi lên kế hoạch cho chuyến đi, đa phần các doanh nghiệp phải làm việc với **hai nhà cung cấp riêng biệt**: Một công ty du lịch lo xe cộ, khách sạn, ăn uống; và một agency sự kiện lo trò chơi Team Building và sân khấu Gala Dinner. Điều này dẫn đến 3 lỗ hổng chí mạng:

1. **Đùn đẩy trách nhiệm khi xảy ra sự cố:** Lái xe của công ty tour đến muộn làm lệch giờ check-in khách sạn, dẫn đến đội sự kiện không kịp setup âm thanh bãi biển trước khi thủy triều dâng. Khi sự việc hỏng bét, hai bên quay sang đổ lỗi cho nhau.
2. **Chi phí bị đội giá từ 20% đến 35%:** Mỗi bên cộng thêm phần biên lợi nhuận (margin) riêng, không ai có cái nhìn tổng thể để tối ưu ngân sách cho khách hàng.
3. **Kịch bản sự kiện rời rạc, không ăn khớp với lộ trình di chuyển:** Trò chơi teambuilding quá sức khiến nhân sự kiệt sức, không còn năng lượng để tham gia đêm tiệc Gala Dinner buổi tối.

---

## 2. Giải pháp độc nhất của Trường Hải: Mô hình Hybrid Event & Travel một đầu mối

Công ty TNHH Sự kiện và Du lịch Trường Hải là số ít đơn vị trên thị trường tích hợp hoàn hảo hai năng lực cốt lõi:

### 2.1. Trực tiếp làm chủ đội xe du lịch 16 - 29 - 45 chỗ đời mới
- Toàn bộ dòng xe du lịch chất lượng cao (Hyundai Universe, Thaco Mobihome, Ford Transit) thuộc sở hữu trực tiếp của Trường Hải.
- Lái xe kinh nghiệm đường trường, thái độ nhã nhặn, cam kết đón khách đúng giờ từng phút và linh hoạt dừng nghỉ theo nhu cầu của đoàn.
- Khách hàng không phải chịu chi phí trung gian qua các nhà xe môi giới.

### 2.2. Trực tiếp sở hữu kho thiết bị âm thanh ánh sáng di động
- Hệ thống âm thanh Line Array bãi biển chống gió rít, mic không dây tầm xa 100m.
- Đạo cụ Team Building khổng lồ bằng phao hơi màu sắc rực rỡ, được kiểm định an toàn kỹ thuật định kỳ.
- Sân khấu Gala Dinner lung linh được đội kỹ thuật setup ngay tại bãi biển hoặc sảnh tiệc resort.

---

## 3. Thiết kế kịch bản Team Building thực chiến: Gắn kết thật, không sáo rỗng

Nói không với các trò chơi photocopy phản cảm hay mang tính chất hành hạ thể lực, Trường Hải chú trọng vào **tính nhân văn và kích hoạt năng lực phối hợp**:

### 3.1. Các chặng thử thách kích hoạt sức mạnh đồng đội
- **Chặng 1: Phá băng và Xây dựng bản sắc đội (Ice Breaking):** Bầu đội trưởng, sáng tạo slogan bá đạo, điệu nhảy chiến binh khơi dậy tinh thần tranh đấu.
- **Chặng 2: Đồng lòng vượt chướng ngại vật:** Trò chơi bánh xe khổng lồ, đưa nước về nguồn, cầu người bắc qua thử thách đòi hỏi sự hy sinh và kỷ luật thép.
- **Chặng 3: Bức tranh chiến lược thương hiệu:** Ghép những mảnh ghép khổng lồ tạo nên bức tranh tầm nhìn tương lai của công ty.

### 3.2. Đêm Gala Dinner biển: Đỉnh điểm cảm xúc sau ngày dài vận động
- Sau một ngày lăn xả hết mình, toàn bộ cán bộ nhân viên được thay những bộ trang phục đẹp nhất, cùng bước vào không gian tiệc ấm cúng bên bờ biển hoặc khán phòng sang trọng.
- Nghi thức nâng ly mừng chiến thắng, vinh danh đội vô địch Teambuilding và những tiết mục văn nghệ bùng nổ năng lượng.

---

## 4. Bảng dự toán khung chi phí tour ${subject} trọn gói

| Tuyến điểm du lịch | Thời lượng | Tiêu chuẩn dịch vụ | Dự toán trọn gói/người |
| :--- | :--- | :--- | :--- |
| **Tam Đảo / Flamingo Đại Lải / Ba Vì** | 1 Ngày | Xe 45 chỗ, ăn trưa đặc sản, vé vào cổng, MC & đạo cụ Team Building bãi cỏ | **750.000đ - 1.150.000đ** |
| **Hạ Long / Cát Bà / Sầm Sơn / Ninh Bình** | 2 Ngày 1 Đêm | Xe đưa đón, khách sạn 3 - 4 sao, 3 bữa chính, Team Building bãi biển, sân khấu Gala Dinner trọn gói | **1.650.000đ - 2.450.000đ** |
| **Đà Nẵng - Hội An / Phú Quốc / Quy Nhơn** | 3 Ngày 2 Đêm | Vé máy bay đoàn, xe đời mới đón tiễn, resort 4 - 5 sao, Teambuilding biển, Gala Dinner visual LED | **3.800.000đ - 5.500.000đ+** |

*(Dự toán đã bao gồm bảo hiểm du lịch mức đền bù tối đa 50.000.000đ/vụ, nước uống trên xe, áo đồng phục teambuilding và banner chụp hình).*

---

## 5. Cam kết an toàn và bảo hiểm tuyệt đối trên mọi cung đường

- **An toàn sức khỏe:** Hướng dẫn viên và điều phối viên đều có chứng chỉ sơ cấp cứu, luôn trang bị tủ thuốc y tế dự phòng trên mọi chặng đường.
- **Phương án thời tiết linh hoạt:** Trong trường hợp mưa bão ngoài biển, Trường Hải lập tức kích hoạt phương án Teambuilding trong nhà (Indoor Amazing Race) hoặc hội trường mà không làm gián đoạn lịch trình.

---

## 6. Đặt lịch tư vấn lịch trình và nhận báo giá ${subject} trong 30 phút

Hãy để chuyến đi của công ty bạn là một hành trình gắn kết thăng hoa và trọn vẹn từng khoảnh khắc. Liên hệ ngay với Trường Hải Event & Travel:

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
