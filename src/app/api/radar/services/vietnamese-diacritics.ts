/**
 * VIETNAMESE DIACRITICS RESTORATION SERVICE
 * Tự động phát hiện và khôi phục dấu tiếng Việt chuẩn xác cho các từ khóa sự kiện
 * Phạm vi: src/app/api/radar/services/vietnamese-diacritics.ts
 */

// Regex kiểm tra xem chuỗi có chứa bất kỳ ký tự tiếng Việt có dấu nào không
const VIETNAMESE_DIACRITIC_REGEX =
  /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i;

/**
 * Kiểm tra xem chuỗi đã có dấu tiếng Việt hay chưa
 */
export function hasVietnameseDiacritics(text: string): boolean {
  if (!text) return false;
  return VIETNAMESE_DIACRITIC_REGEX.test(text);
}

/**
 * Gỡ bỏ dấu tiếng Việt để so sánh chuỗi không dấu
 */
export function stripVietnameseDiacritics(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Từ điển các thuật ngữ chuyên ngành sự kiện phổ biến (Sắp xếp theo thứ tự cụm từ dài trước)
 */
const VIETNAMESE_EVENT_DICTIONARY: [string, string][] = [
  // Cụm 4-5 từ
  ["nguoi dan chuong trinh", "người dẫn chương trình"],
  ["nha bat khong gian", "nhà bạt không gian"],
  ["hoi dong quan tri", "hội đồng quản trị"],
  ["man hinh led trong nha", "màn hình LED trong nhà"],
  ["man hinh led ngoai troi", "màn hình LED ngoài trời"],
  ["phong chay chua chay", "phòng cháy chữa cháy"],
  ["chuoi su kien", "chuỗi sự kiện"],
  ["giai thuong am nhac", "giải thưởng âm nhạc"],

  // Cụm 3 từ
  ["to chuc su kien", "tổ chức sự kiện"],
  ["to chuc le", "tổ chức lễ"],
  ["to chuc tiec", "tổ chức tiệc"],
  ["to chuc tour", "tổ chức tour"],
  ["man hinh led", "màn hình LED"],
  ["am thanh anh sang", "âm thanh ánh sáng"],
  ["kho thiet bi", "kho thiết bị"],
  ["bang bao gia", "bảng báo giá"],
  ["du toan chi phi", "dự toán chi phí"],
  ["thue am thanh", "thuê âm thanh"],
  ["thue anh sang", "thuê ánh sáng"],
  ["thue man led", "thuê màn LED"],
  ["thue san khau", "thuê sân khấu"],
  ["thue nha bat", "thuê nhà bạt"],
  ["thue ban ghe", "thuê bàn ghế"],
  ["khu cong nghiep", "khu công nghiệp"],
  ["tai ha noi", "tại Hà Nội"],
  ["tai da nang", "tại Đà Nẵng"],
  ["tai tphcm", "tại TP.HCM"],
  ["tai hai phong", "tại Hải Phòng"],
  ["tai quang ninh", "tại Quảng Ninh"],
  ["toan quoc", "toàn quốc"],
  ["mien bac", "miền Bắc"],
  ["mien trung", "miền Trung"],
  ["mien nam", "miền Nam"],

  // Cụm 2 từ phổ biến
  ["to chuc", "tổ chức"],
  ["su kien", "sự kiện"],
  ["khai truong", "khai trương"],
  ["khanh thanh", "khánh thành"],
  ["khoi cong", "khởi công"],
  ["dong tho", "động thổ"],
  ["tat nien", "tất niên"],
  ["tong ket", "tổng kết"],
  ["ky niem", "kỷ niệm"],
  ["thanh lap", "thành lập"],
  ["tri an", "tri ân"],
  ["khach hang", "khách hàng"],
  ["hoi nghi", "hội nghị"],
  ["hoi thao", "hội thảo"],
  ["toa dam", "tọa đàm"],
  ["ra mat", "ra mắt"],
  ["san pham", "sản phẩm"],
  ["thuong hieu", "thương hiệu"],
  ["le hoi", "lễ hội"],
  ["chuong trinh", "chương trình"],
  ["cam nang", "cẩm nang"],
  ["huong dan", "hướng dẫn"],
  ["quy trinh", "quy trình"],
  ["kinh nghiem", "kinh nghiệm"],
  ["ke hoach", "kế hoạch"],
  ["y tuong", "ý tưởng"],
  ["kich ban", "kịch bản"],
  ["loi dan", "lời dẫn"],
  ["bao gia", "báo giá"],
  ["bang gia", "bảng giá"],
  ["du toan", "dự toán"],
  ["chi phi", "chi phí"],
  ["ngan sach", "ngân sách"],
  ["cho thue", "cho thuê"],
  ["thiet bi", "thiết bị"],
  ["am thanh", "âm thanh"],
  ["anh sang", "ánh sáng"],
  ["man led", "màn LED"],
  ["san khau", "sân khấu"],
  ["nha bat", "nhà bạt"],
  ["ban ghe", "bàn ghế"],
  ["cong chao", "cổng chào"],
  ["nhan su", "nhân sự"],
  ["le tan", "lễ tân"],
  ["dong phuc", "đồng phục"],
  ["chuyen nghiep", "chuyên nghiệp"],
  ["tron goi", "trọn gói"],
  ["uy tin", "uy tín"],
  ["gia re", "giá rẻ"],
  ["tiet kiem", "tiết kiệm"],
  ["ha noi", "Hà Nội"],
  ["hai phong", "Hải Phòng"],
  ["quang ninh", "Quảng Ninh"],
  ["thai binh", "Thái Bình"],
  ["nam dinh", "Nam Định"],
  ["da nang", "Đà Nẵng"],
  ["tphcm", "TP.HCM"],
  ["sai gon", "Sài Gòn"],
  ["doanh nghiep", "doanh nghiệp"],
  ["cong ty", "công ty"],
  ["nha may", "nhà máy"],
  ["du an", "dự án"],
  ["toa nha", "tòa nhà"],
  ["chung cu", "chung cư"],
  ["showroom", "Showroom"],
  ["cua hang", "cửa hàng"],
  ["chi nhanh", "chi nhánh"],
  ["van phong", "văn phòng"],
  ["dai bieu", "đại biểu"],
  ["khach moi", "khách mời"],
  ["quan khach", "quan khách"],
  ["tiec tra", "tiệc trà"],
  ["tiec ngot", "tiệc ngọt"],
  ["tiec man", "tiệc mặn"],
  ["tro choi", "trò chơi"],
  ["hoat nao", "hoạt náo"],
  ["qua tang", "quà tặng"],
  ["vinh danh", "vinh danh"],
  ["trao giai", "trao giải"],
  ["khen thuong", "khen thưởng"],
  ["khuyen mai", "khuyến mại"],
  ["trien lam", "triển lãm"],
  ["gian hang", "gian hàng"],
  ["hoi cho", "hội chợ"],
  ["chay thu", "chạy thử"],
  ["tong duyet", "tổng duyệt"],
  ["an toan", "an toàn"],
  ["thoi tiet", "thời tiết"],
  ["mua bao", "mưa bão"],
  ["du phong", "dự phòng"],
  ["rui ro", "rủi ro"],
  ["xu ly", "xử lý"],
  ["tinh huong", "tình huống"],
  ["su co", "sự cố"],
  ["luu y", "lưu ý"],
  ["bi quyet", "bí quyết"],
  ["loi thoai", "lời thoại"],
  ["giai doan", "giai đoạn"],
  ["thoi gian", "thời gian"],
  ["dia diem", "địa điểm"],
  ["khong gian", "không gian"],
  ["mat bang", "mặt bằng"],
  ["dien tich", "diện tích"],
  ["so luong", "số lượng"],
  ["quy mo", "quy mô"],
  ["thanh vien", "thành viên"],
  ["gia dinh", "gia đình"],
  ["noi bo", "nội bộ"],
  ["nam moi", "năm mới"],
  ["nam 2026", "năm 2026"],
  ["nam 2025", "năm 2025"],

  // Từ đơn đặc thù
  ["thue", "thuê"],
  ["mau", "mẫu"],
  ["buoc", "bước"],
  ["nguoi", "người"],
  ["khach", "khách"],
  ["tiec", "tiệc"],
  ["le", "lễ"],
  ["gio", "giờ"],
  ["dep", "đẹp"],
  ["tot", "tốt"],
  ["chuan", "chuẩn"],
  ["hay", "hay"],
  ["moi", "mới"],
  ["nhat", "nhất"],
  ["gia", "giá"],
  ["goi", "gói"],
  ["top", "Top"],
  ["meo", "mẹo"],
];

/**
 * Phục hồi dấu tiếng Việt thông qua từ điển chuyên ngành
 */
export function restoreDiacriticsFromDictionary(rawText: string): string {
  if (!rawText) return "";
  let text = rawText.trim();

  for (const [unaccented, accented] of VIETNAMESE_EVENT_DICTIONARY) {
    const regex = new RegExp(`\\b${unaccented}\\b`, "gi");
    text = text.replace(regex, accented);
  }

  return text;
}

/**
 * Tìm kiếm và trích xuất cụm từ có dấu tương ứng từ văn bản tham chiếu (tiêu đề đối thủ hoặc nội dung cào được)
 */
export function restoreDiacriticsFromReference(
  unaccentedPhrase: string,
  referenceText: string
): string | null {
  if (!unaccentedPhrase || !referenceText) return null;

  const cleanUnaccented = stripVietnameseDiacritics(unaccentedPhrase);
  if (!cleanUnaccented) return null;

  const targetWords = cleanUnaccented.split(/\s+/).filter(Boolean);
  if (targetWords.length === 0) return null;

  // Tách văn bản tham chiếu thành các từ giữ nguyên dấu
  const refWords = referenceText
    .replace(/[\r\n\t]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !/^[-–—|•*#]+$/.test(w));

  const targetLen = targetWords.length;

  // Trượt cửa sổ có độ dài targetLen
  for (let i = 0; i <= refWords.length - targetLen; i++) {
    const windowWords = refWords.slice(i, i + targetLen);
    const windowUnaccented = stripVietnameseDiacritics(windowWords.join(" "));

    if (windowUnaccented === cleanUnaccented) {
      const result = windowWords.join(" ").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
      if (hasVietnameseDiacritics(result)) {
        return result;
      }
    }
  }

  // Thử trượt cửa sổ ngắn hơn nếu target dài (tìm cụm khớp con)
  if (targetLen >= 3) {
    for (let len = targetLen - 1; len >= 2; len--) {
      const subTarget = targetWords.slice(0, len).join(" ");
      for (let i = 0; i <= refWords.length - len; i++) {
        const windowWords = refWords.slice(i, i + len);
        const windowUnaccented = stripVietnameseDiacritics(windowWords.join(" "));

        if (windowUnaccented === subTarget) {
          const result = windowWords.join(" ").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
          if (hasVietnameseDiacritics(result)) {
            return result;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Làm sạch tiêu đề đối thủ để lấy chủ đề bài viết gọn gàng (bỏ hậu tố thương hiệu như | Viet Power, - Hoabinh Events)
 */
export function cleanTitleAsKeyword(rawTitle: string): string {
  if (!rawTitle) return "";
  let clean = rawTitle
    .replace(/^#+\s*/, "")
    .replace(/\s*[-–—|•]\s*(viet-?power|hoabinh|senxanh|vietwind|marcom|truong-?hai|sukien|event|travel|du-lich).*$/iu, "")
    .replace(/\s*[-–—|•]\s*[^-–—|•]{3,35}$/iu, "") // Bỏ đuôi thương hiệu ở cuối sau gạch ngang
    .trim();

  return clean;
}

/**
 * HÀM CỐT LÕI: Đảm bảo từ khóa luôn luôn có dấu tiếng Việt 100%
 */
export function ensureAccentedKeyword(
  keyword: string,
  referenceTitle?: string,
  referenceContent?: string
): string {
  const trimmed = (keyword || "").trim();

  // 1. Nếu từ khóa đã có dấu tiếng Việt chuẩn xác thì giữ nguyên
  if (hasVietnameseDiacritics(trimmed)) {
    return trimmed;
  }

  // 2. Thử đối chiếu và khôi phục dấu từ tiêu đề trang đối thủ
  if (referenceTitle && hasVietnameseDiacritics(referenceTitle)) {
    const fromTitle = restoreDiacriticsFromReference(trimmed, referenceTitle);
    if (fromTitle && hasVietnameseDiacritics(fromTitle)) {
      return fromTitle;
    }
  }

  // 3. Thử đối chiếu và khôi phục dấu từ nội dung cào được của trang đối thủ
  if (referenceContent && hasVietnameseDiacritics(referenceContent)) {
    const fromContent = restoreDiacriticsFromReference(trimmed, referenceContent.slice(0, 4000));
    if (fromContent && hasVietnameseDiacritics(fromContent)) {
      return fromContent;
    }
  }

  // 4. Khôi phục thông qua từ điển chuyên ngành sự kiện
  const fromDict = restoreDiacriticsFromDictionary(trimmed);
  if (hasVietnameseDiacritics(fromDict)) {
    return fromDict;
  }

  // 5. Nếu từ khóa hoàn toàn không dấu và tiêu đề đối thủ có dấu hợp lệ, lấy tiêu đề đối thủ làm chủ đề
  if (referenceTitle && hasVietnameseDiacritics(referenceTitle)) {
    const cleanedTitle = cleanTitleAsKeyword(referenceTitle);
    if (cleanedTitle && hasVietnameseDiacritics(cleanedTitle)) {
      return cleanedTitle;
    }
  }

  return trimmed;
}
