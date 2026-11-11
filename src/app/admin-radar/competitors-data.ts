/**
 * =========================================================================
 * COMPETITORS & RADAR SEO ENGINE DATA MODELS & STORAGE
 * Quản lý danh sách đối thủ, lịch quét ngầm, phân tích khoảng trống và nhật ký
 * =========================================================================
 */

export interface TrackedCompetitor {
  id: string;
  name: string;
  domain: string;
  category: "tron-goi" | "teambuilding" | "thiet-bi" | "hoi-nghi" | "khac";
  isActive: boolean; // Trạng thái hoạt động: Đang theo dõi / Tạm dừng
  lastScannedAt: string | null;
  scannedPagesCount: number;
  priorityBadge: string;
  notes?: string;
  createdAt: string;
}

export interface RadarActivityLog {
  id: string;
  timestamp: string; // ISO date
  type: "cron" | "dry-run" | "live-run" | "reschedule";
  status: "success" | "warning" | "error" | "running";
  competitorName: string;
  pagesScanned: number;
  gapsFound: number;
  message: string;
  durationSec?: number;
  details?: Record<string, any>;
}

export interface ContentGapItem {
  id: string;
  topic: string;
  targetKeyword: string;
  competitorSource: string;
  competitorUrl: string;
  clusterCategory:
    | "Khai trương & Khánh thành"
    | "Teambuilding & Outing"
    | "Hội nghị & Gala"
    | "Âm thanh & Thiết bị"
    | "Cẩm nang & Kinh nghiệm"
    | "Sinh nhật & Tiệc cưới"
    | string;
  priority: "high" | "medium" | "low";
  searchIntent: "informational" | "commercial" | "transactional";
  ourSiteStatus: "missing" | "in_plan" | "drafted";
  suggestedTitle: string;
  gapReason: string;
  estimatedSearchVolume?: string;
  createdAt: string;
}

export interface CrawlScheduleConfig {
  scheduleTime: string; // "02:30"
  cronExpression: string; // "30 2 * * *"
  bufferMinutes: number; // Lịch đệm 15 phút
  isEnabled: boolean;
  nextRunAt: string;
  lastRunAt: string | null;
  lastRunSummary: string | null;
}

// Danh sách đối thủ mặc định ban đầu
export const DEFAULT_TRACKED_COMPETITORS: TrackedCompetitor[] = [
  {
    id: "comp-viet-power",
    name: "Viet Power Event",
    domain: "https://viet-power.vn",
    category: "teambuilding",
    isActive: true,
    lastScannedAt: "2026-11-03T02:36:31.000Z",
    scannedPagesCount: 42,
    priorityBadge: "Top 1 Teambuilding",
    notes: "Đối thủ mạnh về kịch bản trò chơi bãi biển và tour trọn gói",
    createdAt: "2026-10-15T08:00:00.000Z",
  },
  {
    id: "comp-hoabinh",
    name: "Hòa Bình Events",
    domain: "https://hoabinhevents.com",
    category: "hoi-nghi",
    isActive: true,
    lastScannedAt: "2026-11-02T02:35:10.000Z",
    scannedPagesCount: 68,
    priorityBadge: "Top 1 Hội nghị Quốc tế",
    notes: "Quy mô lớn, chuyên hội thảo y tế, đại hội cổ đông và sự kiện FDI",
    createdAt: "2026-10-15T08:00:00.000Z",
  },
  {
    id: "comp-sukien-achau",
    name: "Á Châu Event",
    domain: "https://sukienachau.com",
    category: "tron-goi",
    isActive: true,
    lastScannedAt: "2026-11-01T02:38:45.000Z",
    scannedPagesCount: 35,
    priorityBadge: "Chuyên Khai Trương VIP",
    notes: "Đội ngũ PG, MC, múa lân sư rồng khai trương chuyên nghiệp",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    id: "comp-chothue-as",
    name: "Cho Thuê Âm Thanh AS",
    domain: "https://chothueamthanhas.com",
    category: "thiet-bi",
    isActive: true,
    lastScannedAt: "2026-10-31T02:32:15.000Z",
    scannedPagesCount: 29,
    priorityBadge: "Tổng kho Thiết bị LED",
    notes: "Báo giá bóc tách âm thanh ánh sáng, sân khấu nhôm truss",
    createdAt: "2026-10-20T14:30:00.000Z",
  },
  {
    id: "comp-senxanh",
    name: "Sen Xanh Event",
    domain: "https://senxanhevent.vn",
    category: "tron-goi",
    isActive: false, // Tạm dừng
    lastScannedAt: "2026-10-25T02:30:00.000Z",
    scannedPagesCount: 18,
    priorityBadge: "Sự kiện ngoài trời",
    notes: "Tạm dừng quét định kỳ do bảo trì web đối thủ",
    createdAt: "2026-10-22T09:15:00.000Z",
  },
];

// Danh sách khoảng trống nội dung mẫu (Content Gaps) được AI phát hiện
export const DEFAULT_CONTENT_GAPS: ContentGapItem[] = [
  {
    id: "gap-1",
    topic: "Kịch bản lễ ra mắt dòng xe ô tô điện mới tại Showroom",
    targetKeyword: "kịch bản ra mắt xe ô tô điện showroom",
    competitorSource: "Viet Power Event",
    competitorUrl: "https://viet-power.vn/kich-ban-ra-mat-xe-o-to",
    clusterCategory: "Khai trương & Khánh thành",
    priority: "high",
    searchIntent: "commercial",
    ourSiteStatus: "missing",
    suggestedTitle: "Kịch Bản Lễ Ra Mắt Xe Ô Tô Điện Showroom Hoành Tráng & Sang Trọng 2026",
    gapReason: "Đối thủ đã lên top Google với bài viết 2,500 từ; website của bạn chưa có bài viết nhắm từ khóa ngách này dù công ty từng làm sự kiện VinFast.",
    estimatedSearchVolume: "1,200 tìm kiếm/tháng",
    createdAt: "2026-11-03T02:36:31.000Z",
  },
  {
    id: "gap-2",
    topic: "Báo giá thuê âm thanh ánh sáng tiệc Tất niên công ty quy mô 300 - 500 khách",
    targetKeyword: "báo giá âm thanh ánh sáng tất niên 300 khách",
    competitorSource: "Cho Thuê Âm Thanh AS",
    competitorUrl: "https://chothueamthanhas.com/bao-gia-am-thanh-anh-sang-tat-nien",
    clusterCategory: "Âm thanh & Thiết bị",
    priority: "high",
    searchIntent: "transactional",
    ourSiteStatus: "in_plan",
    suggestedTitle: "Báo Giá Cho Thuê Âm Thanh Ánh Sáng Tiệc Tất Niên 300 - 500 Khách Trọn Gói",
    gapReason: "Mùa Q4 cao điểm đặt tiệc Year End Party; đối thủ có cấu hình bóc tách chi tiết loa Array, đèn Beam, Moving Head.",
    estimatedSearchVolume: "2,400 tìm kiếm/tháng",
    createdAt: "2026-11-03T02:36:31.000Z",
  },
  {
    id: "gap-3",
    topic: "Top 15 trò chơi Teambuilding bãi biển không cần đạo cụ cồng kềnh",
    targetKeyword: "trò chơi teambuilding bãi biển không đạo cụ",
    competitorSource: "Viet Power Event",
    competitorUrl: "https://viet-power.vn/tro-choi-teambuilding-bai-bien",
    clusterCategory: "Teambuilding & Outing",
    priority: "medium",
    searchIntent: "informational",
    ourSiteStatus: "missing",
    suggestedTitle: "15+ Trò Chơi Teambuilding Bãi Biển Cực Vui Nhộn & Dễ Tổ Chức Không Cần Đạo Cụ",
    gapReason: "Lượng truy cập hữu cơ cao từ các công ty tìm ý tưởng tự tổ chức teambuilding nhanh.",
    estimatedSearchVolume: "3,600 tìm kiếm/tháng",
    createdAt: "2026-11-02T02:35:10.000Z",
  },
  {
    id: "gap-4",
    topic: "Quy trình tổ chức Hội thảo Chuyển đổi số ứng dụng AI trong Doanh nghiệp",
    targetKeyword: "quy trình tổ chức hội thảo chuyển đổi số ai",
    competitorSource: "Hòa Bình Events",
    competitorUrl: "https://hoabinhevents.com/hoi-thao-chuyen-doi-so",
    clusterCategory: "Hội nghị & Gala",
    priority: "high",
    searchIntent: "commercial",
    ourSiteStatus: "drafted",
    suggestedTitle: "Quy Trình Tổ Chức Hội Thảo Chuyển Đổi Số & AI Doanh Nghiệp Chuẩn Quốc Tế",
    gapReason: "Chủ đề xu hướng công nghệ được các hiệp hội doanh nghiệp tìm kiếm giải pháp tổ chức trọn gói.",
    estimatedSearchVolume: "950 tìm kiếm/tháng",
    createdAt: "2026-11-01T02:38:45.000Z",
  },
  {
    id: "gap-5",
    topic: "Mẫu dự toán chi phí tổ chức lễ khai trương nhà máy chuẩn cho doanh nghiệp FDI",
    targetKeyword: "dự toán chi phí khai trương nhà máy fdi",
    competitorSource: "Á Châu Event",
    competitorUrl: "https://sukienachau.com/chi-phi-khai-truong-nha-may",
    clusterCategory: "Khai trương & Khánh thành",
    priority: "medium",
    searchIntent: "transactional",
    ourSiteStatus: "missing",
    suggestedTitle: "Mẫu Dự Toán Chi Phí Tổ Chức Lễ Khai Trương Nhà Máy Chuẩn Chỉ Cho Doanh Nghiệp FDI",
    gapReason: "Tập khách hàng doanh nghiệp khu công nghiệp có ngân sách lớn (100 - 500 triệu).",
    estimatedSearchVolume: "800 tìm kiếm/tháng",
    createdAt: "2026-10-31T02:32:15.000Z",
  },
  {
    id: "gap-6",
    topic: "Kịch bản tổ chức tiệc sinh nhật công ty 5 năm ý nghĩa và ấm cúng",
    targetKeyword: "kịch bản tổ chức sinh nhật công ty 5 năm",
    competitorSource: "Sen Xanh Event",
    competitorUrl: "https://senxanhevent.vn/kich-ban-sinh-nhat-cong-ty",
    clusterCategory: "Sinh nhật & Tiệc cưới",
    priority: "high",
    searchIntent: "commercial",
    ourSiteStatus: "missing",
    suggestedTitle: "Kịch Bản Tổ Chức Tiệc Sinh Nhật Công Ty 5 Năm & 10 Năm Ý Nghĩa, Tiết Kiệm Chi Phí",
    gapReason: "Nhiều doanh nghiệp tìm kiếm kịch bản mẫu cho ngày kỷ niệm thành lập công ty; web Trường Hải Event hiện chưa có bài viết chi tiết.",
    estimatedSearchVolume: "1,500 tìm kiếm/tháng",
    createdAt: "2026-11-04T02:30:00.000Z",
  },
  {
    id: "gap-7",
    topic: "Báo giá gói trang trí và tổ chức tiệc cưới ngoài trời lãng mạn trọn gói",
    targetKeyword: "báo giá tiệc cưới ngoài trời trọn gói",
    competitorSource: "Á Châu Event",
    competitorUrl: "https://sukienachau.com/bao-gia-tiec-cuoi-ngoai-troi",
    clusterCategory: "Sinh nhật & Tiệc cưới",
    priority: "medium",
    searchIntent: "transactional",
    ourSiteStatus: "in_plan",
    suggestedTitle: "Báo Giá Tổ Chức Tiệc Cưới Ngoài Trời Trọn Gói 2026: Sân Vườn, Bãi Biển, Resort",
    gapReason: "Xu hướng đám cưới ngoài trời tăng mạnh trong giới trẻ; đối thủ đã lên Top với bảng báo giá chi tiết từng hạng mục.",
    estimatedSearchVolume: "2,100 tìm kiếm/tháng",
    createdAt: "2026-11-04T02:30:00.000Z",
  },
];

// Lịch sử nhật ký hoạt động mẫu
export const DEFAULT_RADAR_LOGS: RadarActivityLog[] = [
  {
    id: "log-1",
    timestamp: "2026-11-03T02:36:31.000Z",
    type: "cron",
    status: "success",
    competitorName: "Viet Power Event & Hòa Bình Events",
    pagesScanned: 24,
    gapsFound: 3,
    message: "Ca radar ngầm định kỳ 02:30 hoàn tất xuất sắc lúc 02:36:31. Đã bóc tách 24 bài viết mới, đối chiếu và phát hiện 3 khoảng trống nội dung.",
    durationSec: 391,
  },
  {
    id: "log-2",
    timestamp: "2026-11-02T02:35:10.000Z",
    type: "cron",
    status: "success",
    competitorName: "Cho Thuê Âm Thanh AS",
    pagesScanned: 15,
    gapsFound: 2,
    message: "Ca radar ngầm hoàn tất lúc 02:35:10. Phát hiện 2 bài báo giá thiết bị mới chưa có trên Trường Hải Event.",
    durationSec: 310,
  },
  {
    id: "log-3",
    timestamp: "2026-11-01T15:20:00.000Z",
    type: "dry-run",
    status: "success",
    competitorName: "Á Châu Event (Quét thử)",
    pagesScanned: 5,
    gapsFound: 1,
    message: "Chạy thử (Dry-run) kiểm tra sitemap thành công lúc 15:20:00. Kết nối bình thường, không tốn credit AI.",
    durationSec: 12,
  },
  {
    id: "log-4",
    timestamp: "2026-10-31T02:38:00.000Z",
    type: "cron",
    status: "warning",
    competitorName: "Sen Xanh Event",
    pagesScanned: 0,
    gapsFound: 0,
    message: "Cảnh báo ca radar lúc 02:38:00: Website senxanhevent.vn phản hồi mã HTTP 503 Service Unavailable. Đã tạm dừng theo dõi.",
    durationSec: 45,
  },
];

export const DEFAULT_SCHEDULE_CONFIG: CrawlScheduleConfig = {
  scheduleTime: "02:30",
  cronExpression: "30 2 * * *",
  bufferMinutes: 15,
  isEnabled: true,
  nextRunAt: "2026-11-04T02:30:00.000Z",
  lastRunAt: "2026-11-03T02:36:31.000Z",
  lastRunSummary: "Ca radar gần nhất xong lúc 02:36:31 ngày 03/11/2026: Quét 24 bài, phát hiện 3 khoảng trống",
};

// =============================================================================
// LOCAL STORAGE PERSISTENCE HELPERS
// =============================================================================
const STORAGE_KEYS = {
  COMPETITORS: "radar_tracked_competitors_v1",
  LOGS: "radar_activity_logs_v1",
  GAPS: "radar_content_gaps_v1",
  SCHEDULE: "radar_schedule_config_v1",
};

export function getStoredCompetitors(): TrackedCompetitor[] {
  if (typeof window === "undefined") return DEFAULT_TRACKED_COMPETITORS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPETITORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(DEFAULT_TRACKED_COMPETITORS));
      return DEFAULT_TRACKED_COMPETITORS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_TRACKED_COMPETITORS;
  }
}

export function saveStoredCompetitors(items: TrackedCompetitor[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.COMPETITORS, JSON.stringify(items));
  } catch (e) {
    console.error("Lỗi lưu đối thủ vào localStorage:", e);
  }
}

export function getStoredRadarLogs(): RadarActivityLog[] {
  if (typeof window === "undefined") return DEFAULT_RADAR_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_RADAR_LOGS));
      return DEFAULT_RADAR_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_RADAR_LOGS;
  }
}

export function saveStoredRadarLogs(logs: RadarActivityLog[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error("Lỗi lưu log radar vào localStorage:", e);
  }
}

export function deduplicateContentGaps(gaps: ContentGapItem[]): ContentGapItem[] {
  const result: ContentGapItem[] = [];
  const seenNormals = new Set<string>();

  for (const item of gaps) {
    if (!item) continue;
    const normalized = (item.targetKeyword || item.topic || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    let isDupe = false;
    for (const seen of seenNormals) {
      if (seen === normalized) {
        isDupe = true;
        break;
      }
      if (
        (normalized.includes(seen) || seen.includes(normalized)) &&
        Math.min(normalized.length, seen.length) >= 12
      ) {
        isDupe = true;
        break;
      }
    }

    if (!isDupe && normalized.length > 2) {
      seenNormals.add(normalized);
      result.push(item);
    }
  }

  return result;
}

export function getStoredContentGaps(): ContentGapItem[] {
  if (typeof window === "undefined") return DEFAULT_CONTENT_GAPS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GAPS, JSON.stringify(DEFAULT_CONTENT_GAPS));
      return DEFAULT_CONTENT_GAPS;
    }
    const parsed = JSON.parse(raw);
    return deduplicateContentGaps(parsed);
  } catch (e) {
    return DEFAULT_CONTENT_GAPS;
  }
}

export function saveStoredContentGaps(gaps: ContentGapItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.GAPS, JSON.stringify(gaps));
  } catch (e) {
    console.error("Lỗi lưu content gaps vào localStorage:", e);
  }
}

export function getStoredScheduleConfig(): CrawlScheduleConfig {
  if (typeof window === "undefined") return DEFAULT_SCHEDULE_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(DEFAULT_SCHEDULE_CONFIG));
      return DEFAULT_SCHEDULE_CONFIG;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SCHEDULE_CONFIG;
  }
}

export function saveStoredScheduleConfig(config: CrawlScheduleConfig) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(config));
  } catch (e) {
    console.error("Lỗi lưu lịch cron vào localStorage:", e);
  }
}

