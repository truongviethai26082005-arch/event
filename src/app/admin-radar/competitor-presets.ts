/**
 * =========================================================================
 * DANH BẠ ĐỐI THỦ MẪU & CƠ CHẾ NẠP SẴN ĐỐI THỦ CHO RADAR SEO
 * =========================================================================
 * Cung cấp:
 * 1. Danh sách đối thủ uy tín đầu ngành sự kiện & thiết bị tại Việt Nam
 * 2. Lưu trữ / Quản lý đối thủ cá nhân vào LocalStorage của trình duyệt
 */

export type CompetitorCategory =
  | "all"
  | "tron-goi"
  | "teambuilding"
  | "thiet-bi"
  | "saved";

export interface CompetitorPreset {
  id: string;
  name: string;
  domain: string;
  category: "tron-goi" | "teambuilding" | "thiet-bi" | "saved";
  badge: string;
  description: string;
  suggestedPrompt?: string;
  isCustom?: boolean;
}

export const CATEGORY_TABS: { id: CompetitorCategory; label: string; icon: string }[] = [
  { id: "all", label: "Tất cả", icon: "🌐" },
  { id: "tron-goi", label: "Trọn gói & Khai trương", icon: "🎪" },
  { id: "teambuilding", label: "Teambuilding & Tour", icon: "🏃" },
  { id: "thiet-bi", label: "Kho Âm thanh & Thiết bị", icon: "🔊" },
  { id: "saved", label: "Đã lưu riêng", icon: "⭐" },
];

export const DEFAULT_COMPETITOR_PRESETS: CompetitorPreset[] = [
  {
    id: "hoabinh-events",
    name: "Hòa Bình Events",
    domain: "https://hoabinhevents.com",
    category: "tron-goi",
    badge: "Top 1 Hội nghị & Khách đoàn lớn",
    description: "Chuyên tổ chức hội nghị quốc tế, đại hội cổ đông, tiệc kỷ niệm & sự kiện cấp cao.",
    suggestedPrompt:
      "Nhấn mạnh uy tín từng tổ chức sự kiện chuyên nghiệp cho các tập đoàn lớn, trực tiếp sở hữu trang thiết bị trọn gói, hotline 0844 198 333.",
  },
  {
    id: "viet-power",
    name: "Viet Power Event",
    domain: "https://viet-power.vn",
    category: "teambuilding",
    badge: "Chuyên Teambuilding & Doanh nghiệp",
    description: "Đơn vị dẫn đầu kịch bản Teambuilding bãi biển, Family Day, du lịch kết hợp sự kiện.",
    suggestedPrompt:
      "Tập trung thế mạnh kịch bản teambuilding độc bản, hệ thống game tools phong phú, kết hợp đội xe du lịch Trường Hải đời mới.",
  },
  {
    id: "vietnam-events",
    name: "Vietnam Events",
    domain: "https://vietnamevents.com",
    category: "tron-goi",
    badge: "Festival & Year End Party",
    description: "Chuyên Year End Party, lễ hội âm nhạc, lễ ra mắt sản phẩm và kích hoạt thương hiệu.",
    suggestedPrompt:
      "Nhấn mạnh concept Year End Party sáng tạo, visual 3D mapping sống động và kịch bản vinh danh cảm xúc cao trào.",
  },
  {
    id: "sukien-achau",
    name: "Á Châu Event",
    domain: "https://sukienachau.com",
    category: "tron-goi",
    badge: "Lễ Khai trương & Nhân sự VIP",
    description: "Cung cấp MC, PG, ca sĩ, múa lân sư rồng và tổ chức trọn gói khai trương, khánh thành.",
    suggestedPrompt:
      "Làm nổi bật đội ngũ nhân sự biểu diễn bài bản, múa lân rồng khai trương mở mang hồng phát và quy trình đón tiếp VIP chuẩn mực.",
  },
  {
    id: "chothue-amthanhas",
    name: "Cho Thuê Âm Thanh AS",
    domain: "https://chothueamthanhas.com",
    category: "thiet-bi",
    badge: "Tổng kho Âm thanh & Màn LED",
    description: "Báo giá cho thuê âm thanh, ánh sáng biểu diễn, màn hình LED P2.5/P3.91, sân khấu nhôm truss.",
    suggestedPrompt:
      "Nhấn mạnh tổng kho thiết bị gốc tại Hà Nội không qua trung gian, loa Line Array nhập khẩu, kỹ thuật trực chiến 100%.",
  },
  {
    id: "vietlink-event",
    name: "Vietlink Event",
    domain: "https://vietlinkevent.vn",
    category: "tron-goi",
    badge: "Sự kiện Doanh nghiệp KCN",
    description: "Tổ chức khởi công, động thổ, khánh thành nhà máy cho doanh nghiệp FDI và tập đoàn lớn.",
    suggestedPrompt:
      "Tập trung vào quy trình khởi công, khánh thành nhà máy chuẩn quy chuẩn an toàn lao động và nghi lễ tâm linh truyền thống.",
  },
  {
    id: "sen-xanh-event",
    name: "Sen Xanh Event",
    domain: "https://senxanhevent.vn",
    category: "teambuilding",
    badge: "Team Building & Ngày hội thể thao",
    description: "Tổ chức Family Day, hội thao doanh nghiệp, gameshow ngoài trời gắn kết văn hóa nội bộ.",
    suggestedPrompt:
      "Nhấn mạnh kịch bản gắn kết tinh thần đồng đội, khơi dậy năng lượng tích cực cho toàn thể cán bộ nhân viên.",
  },
  {
    id: "tuan-viet-media",
    name: "Tuấn Việt Media",
    domain: "https://tuanvietmedia.com",
    category: "thiet-bi",
    badge: "Kho Bàn ghế & Nhà bạt không gian",
    description: "Cung cấp nhà bạt không gian, dù sự kiện cỡ lớn, bàn ghế banquet hội nghị cao cấp.",
    suggestedPrompt:
      "Nhấn mạnh kho nhà bạt không gian kiên cố, bàn ghế banquet phủ nơ sang trọng, thi công thần tốc 24/7.",
  },
  {
    id: "cyber-show",
    name: "Cyber Show",
    domain: "https://cybershow.vn",
    category: "tron-goi",
    badge: "Sự kiện Công nghệ & Ra mắt",
    description: "Chuyên tổ chức hội nghị khách hàng, lễ ra mắt sản phẩm mới và gala tri ân đối tác.",
    suggestedPrompt:
      "Làm nổi bật ứng dụng công nghệ hiệu ứng visual hiện đại, kịch bản ra mắt sản phẩm bùng nổ truyền thông.",
  },
];

const LOCAL_STORAGE_KEY = "truonghai_radar_custom_competitors_v1";

/**
 * Lấy danh sách đối thủ tự lưu từ LocalStorage (Client-side)
 */
export function getSavedCustomCompetitors(): CompetitorPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({ ...item, isCustom: true }));
    }
  } catch (e) {
    console.error("Lỗi khi đọc danh bạ đối thủ từ localStorage:", e);
  }
  return [];
}

/**
 * Lưu thêm đối thủ mới vào LocalStorage
 */
export function saveCustomCompetitor(data: {
  name: string;
  domain: string;
  category?: "tron-goi" | "teambuilding" | "thiet-bi";
  badge?: string;
  description?: string;
  suggestedPrompt?: string;
}): CompetitorPreset {
  let cleanDomain = data.domain.trim();
  if (!cleanDomain.startsWith("http://") && !cleanDomain.startsWith("https://")) {
    cleanDomain = `https://${cleanDomain}`;
  }

  // Tự sinh tên nếu chưa có
  let name = data.name.trim();
  if (!name) {
    try {
      const hostname = new URL(cleanDomain).hostname.replace(/^www\./, "");
      name = hostname.split(".")[0].toUpperCase() + " Event";
    } catch {
      name = "Đối thủ mới";
    }
  }

  const newPreset: CompetitorPreset = {
    id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    domain: cleanDomain,
    category: (data.category as any) || "tron-goi",
    badge: data.badge?.trim() || "Đối thủ riêng của bạn",
    description: data.description?.trim() || `Website theo dõi: ${cleanDomain}`,
    suggestedPrompt: data.suggestedPrompt?.trim() || "",
    isCustom: true,
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getSavedCustomCompetitors();
      // Lọc bỏ trùng lặp theo domain
      const filtered = existing.filter(
        (c) => c.domain.toLowerCase() !== newPreset.domain.toLowerCase()
      );
      const updated = [newPreset, ...filtered];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Lỗi khi ghi danh bạ đối thủ vào localStorage:", e);
    }
  }

  return newPreset;
}

/**
 * Xóa một đối thủ tùy chỉnh khỏi LocalStorage
 */
export function removeCustomCompetitor(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getSavedCustomCompetitors();
    const updated = existing.filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Lỗi khi xóa đối thủ khỏi localStorage:", e);
  }
}
