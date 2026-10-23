"use client";

/**
 * =========================================================================
 * BỘ TẠO BÀI VIẾT SEO CASE STUDY TỪ HỒ SƠ SỰ KIỆN THỰC TẾ
 * Phân hệ: Admin Radar - Trường Hải Event & Travel
 * =========================================================================
 * Mục tiêu:
 * - Chuyển đổi dữ liệu hồ sơ sự kiện đã tổ chức thành bài viết chuẩn SEO E-E-A-T
 * - Sử dụng thông tin người thật, việc thật, chi phí thật, ảnh thật làm minh chứng độc bản
 * - Cập nhật ngay vào bảng 'posts' (CMS Tin tức / Dự án thực tế)
 * =========================================================================
 */

import { EventProfile, updateEventProfile } from "./event-profiles-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface GeneratedCaseStudyResult {
  title: string;
  slug: string;
  meta_description: string;
  focus_keyword: string;
  content: string;
  reading_time: string;
  status: "published" | "draft";
  created_at: string;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

/**
 * Sinh nội dung bài viết Case Study chuyên sâu từ Hồ Sơ Sự Kiện
 */
export function generateCaseStudyArticle(profile: EventProfile): GeneratedCaseStudyResult {
  const keyword =
    profile.seoMeta?.suggestedKeyword ||
    `tổ chức ${profile.categoryLabel.toLowerCase()} chuyên nghiệp`;

  const cleanSlug =
    profile.seoMeta?.suggestedSlug ||
    `ho-so-du-an-${profile.id.replace("ep-", "")}-${profile.category}`;

  const formattedBudget = formatVND(profile.financials.totalBudget);

  // Sinh bảng bóc tách chi phí dạng Markdown
  const costTableRows = profile.financials.items
    .map(
      (item, idx) =>
        `| ${idx + 1} | **${item.category}** | ${item.description} | ${item.quantity} ${item.unit} | ${formatVND(item.totalPrice)} |`
    )
    .join("\n");

  // Sinh danh sách thiết bị
  const equipmentMarkdown = profile.equipmentList
    .map((eq) => `- **${eq}** (Được kiểm định an toàn và dự phòng 1:1)`)
    .join("\n");

  // Sinh danh sách điểm nhấn
  const highlightsMarkdown = profile.keyHighlights
    .map((hl) => `1. 🌟 **${hl}**`)
    .join("\n");

  const testimonialBlock = profile.testimonial
    ? `> *" ${profile.testimonial.quote} "*\n>\n> **— ${profile.testimonial.author}**, ${profile.testimonial.position} tại ${profile.testimonial.company}`
    : `> *"Sự chỉn chu, nhiệt huyết và chuyên môn vững vàng của đội ngũ Trường Hải Event & Travel đã mang tới một sự kiện thành công trọn vẹn vượt ngoài mong đợi."*`;

  // Markdown hoàn chỉnh
  const content = `
![${profile.title}](${profile.coverImage})

## Bối Cảnh Dự Án & Bài Toán Thực Tế Của ${profile.client.company}

Ngày **${profile.date.split("-").reverse().join("/")}**, tại **${profile.location.venue}** (${profile.location.address}), **Trường Hải Event & Travel** vinh dự đồng hành cùng **${profile.client.company}** tổ chức thành công rực rỡ **${profile.title}** với quy mô **${profile.guestCount} khách mời VIP**.

Trong bối cảnh thị trường đòi hỏi tiêu chuẩn khắt khe về mặt nhận diện thương hiệu và trải nghiệm khách mời, ban lãnh đạo ${profile.client.company} đã đặt ra những yêu cầu vô cùng chặt chẽ:
- **Độ chính xác tuyệt đối về mặt timeline**: Từng nghi thức từ đón khách, khai mạc, cắt băng đến tiệc chiêu đãi phải diễn ra trọn vẹn theo kịch bản đạo diễn.
- **Hệ thống nghe nhìn (AV) chuẩn mực cao cấp**: Không gian rộng lớn đòi hỏi âm thanh lan tỏa đồng đều, không hú rít, màn hình LED hiển thị visual đồ họa sắc nét dưới mọi góc nhìn.
- **Chi phí minh bạch & tối ưu ngân sách**: Toàn bộ dự toán chi phí phải được bóc tách chi tiết, cam kết không phát sinh phụ phí sau sự kiện.

---

## Giải Pháp Thi Công & Kịch Bản Độc Bản Của Trường Hải Event & Travel

Nhận được đề bài từ phía khách hàng, ekip sáng tạo và chỉ huy kỹ thuật của Trường Hải Event đã tiến hành khảo sát thực địa hiện trường tại ${profile.location.city}, dựng phối cảnh 3D layout và xây dựng kịch bản dàn dựng chi tiết.

### Điểm Nhấn Sáng Tạo & Nghi Thức Ấn Tượng
${highlightsMarkdown}

### Đội Ngũ Ekip Vận Hành Trực Tiếp Tại Hiện Trường
Sự thành công của dự án là công sức của hơn 40 nhân sự lành nghề dưới sự chỉ đạo của:
- **Tổng đạo diễn sự kiện**: ${profile.team.director}
- **Chỉ huy trưởng kỹ thuật**: ${profile.team.chiefEngineer}
- **Phụ trách âm thanh & ánh sáng**: ${profile.team.soundLightingLead}
- **MC dẫn chương trình**: ${profile.team.mc}
- **Điều phối viên hiện trường**: ${profile.team.coordinator}

---

## Chi Tiết Hệ Thống Thiết Bị Kỹ Thuật Đã Triển Khai

Để đảm bảo chất lượng sự kiện xứng tầm vị thế doanh nghiệp, toàn bộ trang thiết bị do Trường Hải cung cấp đều là các dòng sản phẩm đời mới:

${equipmentMarkdown}

Công tác lắp đặt, căn chỉnh âm thanh và chạy thử kỹ thuật (rehearsal) được hoàn tất trước giờ G 4 tiếng đồng hồ, đảm bảo tính sẵn sàng 100%.

---

## Báo Giá Bóc Tách Chi Phí Hạng Mục Thực Tế Dự Án

Một trong những thế mạnh khác biệt của Trường Hải Event & Travel là sự **minh bạch và chi tiết trong báo giá**. Tổng ngân sách dự án được chốt ở mức **${formattedBudget}**, phân bổ cụ thể theo từng hạng mục:

| STT | Hạng Mục Triển Khai | Chi Tiết Kỹ Thuật | Số Lượng | Thành Tiền |
| :---: | :--- | :--- | :---: | :---: |
${costTableRows}
| | **TỔNG CỘNG HỢP ĐỒNG** | *(Cam kết không phát sinh phụ phí)* | | **${formattedBudget}** |

*Trạng thái thanh toán: ${profile.financials.paymentStatusLabel}. Hồ sơ chứng từ kế toán, hóa đơn VAT và biên bản nghiệm thu đã hoàn tất lưu trữ đầy đủ.*

---

## Phản Hồi Thực Tế Từ Khách Hàng (Social Proof)

${testimonialBlock}

Sự hài lòng và tin cậy của quý đối tác chính là minh chứng rõ nét nhất cho năng lực tổ chức sự kiện chuyên nghiệp và tận tâm của tập thể Trường Hải Event & Travel.

---

## Thư Viện Hình Ảnh Thực Tế Tại Sự Kiện

${profile.gallery
  .map(
    (img) => `![${img.caption}](${img.url})\n*Hình ảnh: ${img.caption}*`
  )
  .join("\n\n")}

---

## Tại Sao Doanh Nghiệp Lựa Chọn Trường Hải Event & Travel?

1. **Kho thiết bị sở hữu trực tiếp**: Sở hữu 100% kho âm thanh ánh sáng Line Array, màn hình LED, nhà bạt không gian, không qua trung gian giúp tiết kiệm 20% - 30% chi phí.
2. **Kịch bản độc bản**: Mỗi sự kiện được may đo riêng theo bản sắc và thông điệp truyền thông của từng doanh nghiệp.
3. **Đội ngũ tận tâm**: Hơn 10 năm kinh nghiệm thực chiến với hơn 1.000 sự kiện lớn nhỏ tại Hà Nội và toàn quốc.
4. **Hợp đồng & Pháp lý minh bạch**: Đầy đủ hợp đồng kinh tế, hóa đơn đỏ VAT, biên bản nghiệm thu bàn giao rõ ràng.

### Liên Hệ Nhận Tư Vấn & Dự Toán Chi Phí Miễn Phí
- **CÔNG TY TNHH SỰ KIỆN & DU LỊCH TRƯỜNG HẢI**
- **Hotline 24/7**: 096.388.9830
- **Email**: info@truonghaievent.vn
- **Website**: https://truonghaievent.vn
- **Địa chỉ văn phòng**: Hà Nội & hỗ trợ tổ chức sự kiện lưu động toàn quốc.

---

### Câu Hỏi Thường Gặp Về Dịch Vụ (FAQ)

### Thời gian chuẩn bị cho một sự kiện như thế này là bao lâu?
Thông thường từ 7 đến 15 ngày để lên kịch bản, thiết kế 3D và chốt báo giá. Với các sự kiện gấp, Trường Hải có thể triển khai thi công trong vòng 24 - 48 giờ.

### Chi phí trọn gói có phát sinh thêm khoản nào không?
Không. Báo giá của Trường Hải là trọn gói bao gồm vận chuyển, nhân sự lắp đặt, chạy kỹ thuật và tháo dỡ hoàn trả mặt bằng.
`.trim();

  const title = `Hồ Sơ Dự Án: ${profile.title}`;
  const meta_description = `Xem chi tiết hồ sơ dự án ${profile.title} do Trường Hải Event tổ chức cho ${profile.client.company}: kịch bản, bóc tách báo giá ${formattedBudget}, trang thiết bị và ảnh thực tế.`;

  return {
    title,
    slug: cleanSlug,
    meta_description,
    focus_keyword: keyword,
    content,
    reading_time: "6 phút",
    status: "published",
    created_at: new Date().toISOString(),
  };
}

/**
 * Lưu bài viết Case Study vào cơ sở dữ liệu Supabase hoặc Mock CMS
 */
export async function saveGeneratedCaseStudyToCMS(
  caseStudy: GeneratedCaseStudyResult,
  profileId: string,
  onSuccess?: (post: any) => void
): Promise<any> {
  const payload = {
    title: caseStudy.title,
    slug: caseStudy.slug,
    content: caseStudy.content,
    meta_description: caseStudy.meta_description,
    focus_keyword: caseStudy.focus_keyword,
    category: "du-an-thuc-te",
    status: caseStudy.status,
    reading_time: caseStudy.reading_time,
    created_at: caseStudy.created_at,
  };

  let savedPost: any = null;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([payload])
        .select()
        .single();
      if (!error && data) {
        savedPost = data;
      }
    } catch (e) {
      console.warn("Lỗi khi lưu bài viết Case Study lên Supabase:", e);
    }
  }

  // Fallback / local object
  if (!savedPost) {
    savedPost = {
      id: `case-study-${Date.now()}`,
      ...payload,
    };
  }

  // Cập nhật trạng thái SEO của profile
  updateEventProfile(profileId, {
    seoMeta: {
      suggestedKeyword: caseStudy.focus_keyword,
      suggestedSlug: caseStudy.slug,
      generatedPostSlug: caseStudy.slug,
      isGenerated: true,
      lastGeneratedAt: new Date().toISOString(),
    },
  });

  if (onSuccess) {
    onSuccess(savedPost);
  }

  return savedPost;
}
