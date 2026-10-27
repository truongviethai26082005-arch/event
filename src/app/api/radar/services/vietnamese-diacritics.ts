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
  // Cụm 4-7 từ về dự trù & tài chính sự kiện
  ["bang du tru kinh phi to chuc su kien", "bảng dự trù kinh phí tổ chức sự kiện"],
  ["bang du toan kinh phi to chuc su kien", "bảng dự toán kinh phí tổ chức sự kiện"],
  ["du tru kinh phi to chuc su kien", "dự trù kinh phí tổ chức sự kiện"],
  ["du toan kinh phi to chuc su kien", "dự toán kinh phí tổ chức sự kiện"],
  ["bang du tru kinh phi to chuc", "bảng dự trù kinh phí tổ chức"],
  ["bang du toan kinh phi to chuc", "bảng dự toán kinh phí tổ chức"],
  ["bang du tru kinh phi", "bảng dự trù kinh phí"],
  ["bang du toan kinh phi", "bảng dự toán kinh phí"],
  ["du tru kinh phi to chuc", "dự trù kinh phí tổ chức"],
  ["du toan kinh phi to chuc", "dự toán kinh phí tổ chức"],
  ["du tru kinh phi", "dự trù kinh phí"],
  ["du toan kinh phi", "dự toán kinh phí"],
  ["bang du tru", "bảng dự trù"],
  ["bang du toan", "bảng dự toán"],
  ["bang ke chi phi", "bảng kê chi phí"],
  ["bang du tinh chi phi", "bảng dự tính chi phí"],
  ["du tru", "dự trù"],
  ["du toan", "dự toán"],
  ["kinh phi to chuc", "kinh phí tổ chức"],
  ["kinh phi", "kinh phí"],
  ["cam ket khong phat sinh", "cam kết không phát sinh"],
  ["cam ket", "cam kết"],
  ["cam nang", "cẩm nang"],

  // Y tế, khoa học & hội nghị
  ["benh vien bach mai", "Bệnh viện Bạch Mai"],
  ["benh vien", "bệnh viện"],
  ["bach mai", "Bạch Mai"],
  ["co so ninh binh", "cơ sở Ninh Bình"],
  ["ninh binh", "Ninh Bình"],
  ["co so", "cơ sở"],
  ["vien tim mach viet nam", "Viện Tim mạch Việt Nam"],
  ["vien tim mach", "Viện Tim mạch"],
  ["hoi nghi khoa hoc quoc te thuong nien", "hội nghị khoa học quốc tế thường niên"],
  ["hoi nghi khoa hoc quoc te", "hội nghị khoa học quốc tế"],
  ["hoi nghi khoa hoc", "hội nghị khoa học"],
  ["khoa hoc quoc te", "khoa học quốc tế"],
  ["khoa hoc", "khoa học"],
  ["thuong nien", "thường niên"],
  ["quoc te", "quốc tế"],
  ["viet nam", "Việt Nam"],

  // Sản phẩm & khai trương
  ["hong sam dam da", "hồng sâm đậm đà"],
  ["hong sam", "hồng sâm"],
  ["dam da", "đậm đà"],
  ["san pham", "sản phẩm"],
  ["ra mat san pham", "ra mắt sản phẩm"],
  ["ra mat", "ra mắt"],
  ["hoat dong", "hoạt động"],

  // Doanh nghiệp & kỷ niệm
  ["thanh lap cong ty", "thành lập công ty"],
  ["dien nissin viet nam", "Điện Nissin Việt Nam"],
  ["dien nissin", "Điện Nissin"],
  ["cong ty tnhh", "công ty TNHH"],
  ["ky niem", "kỷ niệm"],
  ["nam thanh lap", "năm thành lập"],

  // Nghệ thuật, văn hóa & cộng đồng
  ["chuong trinh nghe thuat nong dan thu do tu hao vung buoc tuong lai", "chương trình nghệ thuật nông dân thủ đô tự hào vững bước tương lai"],
  ["chuong trinh nghe thuat", "chương trình nghệ thuật"],
  ["nghe thuat", "nghệ thuật"],
  ["nong dan thu do", "nông dân thủ đô"],
  ["nong dan", "nông dân"],
  ["thu do", "thủ đô"],
  ["tu hao vung buoc tuong lai", "tự hào vững bước tương lai"],
  ["tu hao", "tự hào"],
  ["vung buoc tuong lai", "vững bước tương lai"],
  ["vung buoc", "vững bước"],
  ["tuong lai", "tương lai"],

  // Hội nghị quốc tế & môi trường
  ["nhom cong tac asean ve bao ton thien nhien va da dang sinh hoc", "nhóm công tác ASEAN về bảo tồn thiên nhiên và đa dạng sinh học"],
  ["nhom cong tac asean", "nhóm công tác ASEAN"],
  ["nhom cong tac", "nhóm công tác"],
  ["bao ton thien nhien va da dang sinh hoc", "bảo tồn thiên nhiên và đa dạng sinh học"],
  ["bao ton thien nhien", "bảo tồn thiên nhiên"],
  ["bao ton", "bảo tồn"],
  ["thien nhien", "thiên nhiên"],
  ["da dang sinh hoc", "đa dạng sinh học"],
  ["da dang", "đa dạng"],
  ["sinh hoc", "sinh học"],
  ["lan thu", "lần thứ"],

  // Môi trường & giao thông xanh
  ["chung tay hanh dong vi khong khi sach va giao thong xanh", "chung tay hành động vì không khí sạch và giao thông xanh"],
  ["chung tay hanh dong", "chung tay hành động"],
  ["chung tay", "chung tay"],
  ["hanh dong vi khong khi sach", "hành động vì không khí sạch"],
  ["hanh dong", "hành động"],
  ["khong khi sach va giao thong xanh", "không khí sạch và giao thông xanh"],
  ["khong khi sach", "không khí sạch"],
  ["khong khi", "không khí"],
  ["giao thong xanh", "giao thông xanh"],
  ["giao thong", "giao thông"],

  // Trẻ em & xã hội
  ["phat dong thang hanh dong vi tre em", "phát động tháng hành động vì trẻ em"],
  ["le phat dong thang hanh dong", "lễ phát động tháng hành động"],
  ["le phat dong", "lễ phát động"],
  ["phat dong", "phát động"],
  ["thang hanh dong vi tre em", "tháng hành động vì trẻ em"],
  ["thang hanh dong", "tháng hành động"],
  ["vi tre em", "vì trẻ em"],
  ["tre em", "trẻ em"],
  ["thang", "tháng"],

  // Thư mời & tham dự
  ["mau thu moi tham du su kien", "mẫu thư mời tham dự sự kiện"],
  ["mau thu moi tham du", "mẫu thư mời tham dự"],
  ["mau thu moi", "mẫu thư mời"],
  ["thu moi tham du su kien", "thư mời tham dự sự kiện"],
  ["thu moi tham du", "thư mời tham dự"],
  ["thu moi", "thư mời"],
  ["thu moi", "thư mời"],
  ["tham du su kien", "tham dự sự kiện"],
  ["tham du", "tham dự"],

  // Khởi công & mở rộng nhà ga
  ["le khoi cong du an mo rong nha ga hanh khach quoc te da nang", "lễ khởi công dự án mở rộng nhà ga hành khách quốc tế Đà Nẵng"],
  ["le khoi cong du an mo rong", "lễ khởi công dự án mở rộng"],
  ["du an mo rong nha ga hanh khach quoc te", "dự án mở rộng nhà ga hành khách quốc tế"],
  ["du an mo rong nha ga", "dự án mở rộng nhà ga"],
  ["du an mo rong", "dự án mở rộng"],
  ["mo rong nha ga hanh khach quoc te", "mở rộng nhà ga hành khách quốc tế"],
  ["mo rong nha ga", "mở rộng nhà ga"],
  ["mo rong", "mở rộng"],
  ["nha ga hanh khach quoc te", "nhà ga hành khách quốc tế"],
  ["nha ga hanh khach", "nhà ga hành khách"],
  ["nha ga", "nhà ga"],
  ["hanh khach", "hành khách"],
  ["du an", "dự án"],
  ["khoi cong du an", "khởi công dự án"],
  ["khoi cong", "khởi công"],
  ["da nang", "Đà Nẵng"],
  ["vung buoc", "vững bước"],
  ["vung", "vững"],
  ["20 nam", "20 năm"],
  ["10 nam", "10 năm"],
  ["30 nam", "30 năm"],
  ["50 nam", "50 năm"],

  // Cụm 4-5 từ khác
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
 * Bảng tra cứu các từ đơn tiếng Việt phổ biến (áp dụng khi từ ghép không khớp)
 */
const COMMON_SINGLE_WORDS: Record<string, string> = {
  bang: "bảng",
  du: "dự",
  tru: "trù",
  kinh: "kinh",
  phi: "phí",
  to: "tổ",
  chuc: "chức",
  su: "sự",
  kien: "kiện",
  bao: "báo",
  gia: "giá",
  mau: "mẫu",
  loi: "lời",
  thue: "thuê",
  thiet: "thiết",
  bi: "bị",
  am: "âm",
  thanh: "thanh",
  anh: "ánh",
  sang: "sáng",
  san: "sân",
  khau: "khấu",
  nha: "nhà",
  bat: "bạt",
  ban: "bàn",
  ghe: "ghế",
  le: "lễ",
  khai: "khai",
  truong: "trương",
  khanh: "khánh",
  khoi: "khởi",
  cong: "công",
  dong: "động",
  tho: "thổ",
  tat: "tất",
  nien: "niên",
  ky: "kỷ",
  niem: "niệm",
  hoi: "hội",
  nghi: "nghị",
  thao: "thảo",
  quy: "quy",
  trinh: "trình",
  huong: "hướng",
  nang: "nang",
  ke: "kế",
  hoach: "hoạch",
  chi: "chi",
  ngan: "ngân",
  tron: "trọn",
  goi: "gói",
  chuyen: "chuyên",
  nghiep: "nghiệp",
  uy: "uy",
  tin: "tín",
  tai: "tại",
  noi: "nội",
};

/**
 * Phục hồi dấu cho từng từ đơn lẻ chưa có dấu
 */
export function restoreIndividualWords(text: string): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words
    .map((w) => {
      // Nếu từ đó là ASCII thuần (chưa có bất kỳ dấu tiếng Việt nào)
      const lower = w.toLowerCase();
      if (!VIETNAMESE_DIACRITIC_REGEX.test(w) && COMMON_SINGLE_WORDS[lower]) {
        const rep = COMMON_SINGLE_WORDS[lower];
        // Giữ nguyên chữ hoa đầu nếu từ gốc viết hoa
        if (w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase()) {
          return rep[0].toUpperCase() + rep.slice(1);
        }
        return rep;
      }
      return w;
    })
    .join(" ");
}

/**
 * HÀM CỐT LÕI: Đảm bảo từ khóa luôn luôn có dấu tiếng Việt 100%
 * Tự động sửa cả các từ khóa hỗn hợp (nửa có dấu, nửa không dấu như "bang du tru kinh phi tổ chức sự kiện")
 */
export function ensureAccentedKeyword(
  keyword: string,
  referenceTitle?: string,
  referenceContent?: string
): string {
  let trimmed = (keyword || "").trim();
  if (!trimmed) return "";

  // 1. Thử đối chiếu và khôi phục dấu từ tiêu đề trang đối thủ
  if (referenceTitle && hasVietnameseDiacritics(referenceTitle)) {
    const fromTitle = restoreDiacriticsFromReference(trimmed, referenceTitle);
    if (fromTitle && hasVietnameseDiacritics(fromTitle)) {
      trimmed = fromTitle;
    }
  }

  // 2. Thử đối chiếu và khôi phục dấu từ nội dung cào được của trang đối thủ
  if (referenceContent && hasVietnameseDiacritics(referenceContent)) {
    const fromContent = restoreDiacriticsFromReference(trimmed, referenceContent.slice(0, 4000));
    if (fromContent && hasVietnameseDiacritics(fromContent)) {
      trimmed = fromContent;
    }
  }

  // 3. Khôi phục thông qua từ điển chuyên ngành sự kiện (áp dụng cho cả cụm từ)
  trimmed = restoreDiacriticsFromDictionary(trimmed);

  // 4. Khôi phục cho từng từ đơn lẻ còn sót lại chưa có dấu
  trimmed = restoreIndividualWords(trimmed);

  // 5. Nếu từ khóa hoàn toàn không dấu và tiêu đề đối thủ có dấu hợp lệ, lấy tiêu đề đối thủ làm chủ đề
  if (!hasVietnameseDiacritics(trimmed) && referenceTitle && hasVietnameseDiacritics(referenceTitle)) {
    const cleanedTitle = cleanTitleAsKeyword(referenceTitle);
    if (cleanedTitle && hasVietnameseDiacritics(cleanedTitle)) {
      return cleanedTitle;
    }
  }

  return trimmed;
}

