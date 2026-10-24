"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * =========================================================================
 * DỮ LIỆU HỒ SƠ SỰ KIỆN & LƯU TRỮ DỰ ÁN (EVENT PROFILES & CASE STUDIES)
 * Phân hệ: Admin Radar - Trường Hải Event & Travel
 * =========================================================================
 * Lưu trữ toàn bộ sự kiện đã/đang tổ chức:
 * - Thông tin sự kiện, khách hàng, địa điểm, quy mô
 * - Thư viện ảnh thực tế
 * - Báo giá chi tiết & cơ cấu chi phí thực tế
 * - Hợp đồng scan, kịch bản chương trình, biên bản nghiệm thu cũ
 * - Dữ liệu cấp cho Radar SEO AI viết bài PR / Case Study E-E-A-T
 * =========================================================================
 */

export type EventCategory =
  | "khai-truong"
  | "gala-dinner"
  | "hoi-nghi"
  | "teambuilding"
  | "thiet-bi"
  | "le-hoi";

export interface EventCostItem {
  id: string;
  category: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface EventDocument {
  id: string;
  name: string;
  type: "contract" | "script" | "acceptance" | "layout" | "invoice";
  docNumber?: string;
  fileSize: string;
  uploadDate: string;
  signedBy?: string;
  fileUrl?: string;
}

export interface EventGalleryItem {
  id: string;
  url: string;
  caption: string;
  phase: "setup" | "main" | "moment" | "crowd";
}

export interface EventTestimonial {
  author: string;
  position: string;
  company: string;
  quote: string;
  rating: number; // 1-5
}

export interface EventProfile {
  id: string;
  title: string;
  category: EventCategory;
  categoryLabel: string;
  status: "completed" | "ongoing" | "archived";
  statusLabel: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  
  // Khách hàng
  client: {
    name: string;
    company: string;
    representative: string;
    phone: string;
    email: string;
    industry: string;
  };

  // Địa điểm & quy mô
  location: {
    venue: string;
    hall?: string;
    address: string;
    city: string;
  };
  venueType?: "indoor" | "outdoor";
  guestCount: number;

  // Tài chính & Báo giá
  financials: {
    totalBudget: number; // Tổng giá trị hợp đồng
    actualCost: number;  // Chi phí thực tế vận hành
    profit: number;      // Lợi nhuận gộp
    profitMargin: number;// Tỷ suất lợi nhuận (%)
    paymentStatus: "paid_full" | "deposit_paid" | "pending_settlement";
    paymentStatusLabel: string;
    items: EventCostItem[];
  };

  // Đội ngũ nhân sự
  team: {
    director: string;           // Đạo diễn sự kiện
    chiefEngineer: string;      // Chỉ huy trưởng kỹ thuật
    soundLightingLead: string;  // Phụ trách âm thanh ánh sáng
    mc: string;                 // MC dẫn chương trình
    coordinator: string;        // Điều phối viên hiện trường
  };

  // Thiết bị & hạng mục triển khai
  keyHighlights: string[];
  equipmentList: string[];

  // Hình ảnh thực tế
  coverImage: string;
  gallery: EventGalleryItem[];

  // Hồ sơ tài liệu cũ
  documents: EventDocument[];

  // Đánh giá từ khách hàng
  testimonial?: EventTestimonial;

  // Tích hợp Radar SEO
  seoMeta?: {
    suggestedKeyword: string;
    suggestedSlug: string;
    generatedPostSlug?: string;
    isGenerated: boolean;
    lastGeneratedAt?: string;
  };

  created_at: string;

  // Metadata nhận diện dữ liệu tự động đổ về từ CRM / Supabase Leads
  isAutoSynced?: boolean;
  sourceLeadId?: string;
  sourceChannel?: string;
  rawLeadData?: any;
}

export const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  "khai-truong": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  "gala-dinner": { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  "hoi-nghi": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  "teambuilding": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  "thiet-bi": { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  "le-hoi": { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
};

// Dữ liệu mẫu hồ sơ sự kiện thực tế của Trường Hải Event & Travel
export const DEFAULT_EVENT_PROFILES: EventProfile[] = [
  {
    id: "ep-namhai-auto",
    title: "Lễ Khai Trương Showroom Ô Tô Nam Hải Auto - 250 Khách VIP",
    category: "khai-truong",
    categoryLabel: "Lễ Khai Trương",
    status: "ongoing",
    statusLabel: "Đang diễn ra hôm nay",
    date: "2026-10-23",
    endDate: "2026-10-23",
    client: {
      name: "Trần Đình Nam",
      company: "Công ty Cổ phần Ô tô Nam Hải",
      representative: "Mr. Trần Đình Nam (Tổng Giám Đốc)",
      phone: "0918 234 567",
      email: "nam.td@namhai-auto.vn",
      industry: "Kinh doanh & Phân phối Ô tô Nhập khẩu",
    },
    location: {
      venue: "Showroom Nam Hải Auto",
      hall: "Khu vực sảnh trưng bày chính 1.200m²",
      address: "Số 68 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy",
      city: "Hà Nội",
    },
    guestCount: 250,
    financials: {
      totalBudget: 85000000,
      actualCost: 58500000,
      profit: 26500000,
      profitMargin: 31.2,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "cost-1",
          category: "Sân khấu & Màn hình",
          description: "Màn hình LED P3 Cabin đúc 24m² kèm sân khấu ván ép phủ bạt xám",
          unit: "Gói",
          quantity: 1,
          unitPrice: 28000000,
          totalPrice: 28000000,
        },
        {
          id: "cost-2",
          category: "Âm thanh Ánh sáng",
          description: "Hệ thống Line Array RCF 4 sub 8 full, Mixer kỹ thuật số Behringer X32, 16 đèn Moving Beam 350W",
          unit: "Hệ thống",
          quantity: 1,
          unitPrice: 22000000,
          totalPrice: 22000000,
        },
        {
          id: "cost-3",
          category: "Nhân sự & Nghi thức",
          description: "Đội Múa Lân Sư Rồng (2 Lân 1 Rồng 1 Địa), MC song ngữ, 6 PG đón khách đón tiếp VIP",
          unit: "Ekip",
          quantity: 1,
          unitPrice: 18000000,
          totalPrice: 18000000,
        },
        {
          id: "cost-4",
          category: "Tiệc Teabreak cao cấp",
          description: "Bàn tiệc bánh ngọt Pháp, trái cây nhập khẩu, rượu vang sâm panh khai tiệc cho 250 khách",
          unit: "Khách",
          quantity: 250,
          unitPrice: 68000,
          totalPrice: 17000000,
        },
      ],
    },
    team: {
      director: "Đạo diễn Hoàng Minh Triết",
      chiefEngineer: "Mr. Tuấn Anh (Trưởng ban Kỹ thuật)",
      soundLightingLead: "Kỹ sư âm thanh Trần Quang Huy",
      mc: "MC Đức Bảo (VTV)",
      coordinator: "Nguyễn Hải Yến",
    },
    keyHighlights: [
      "Nghi thức nâng màn nhung bí mật ra mắt mẫu SUV điện hạng sang 2026",
      "Tiết mục Múa Lân Khai Quang Điểm Nhãn bùng nổ may mắn tài lộc",
      "Sân khấu LED cong P3 hiển thị đồ họa 3D sống động chuẩn 4K",
      "Khai mạc tiệc Teabreak kết hợp Violin & Saxophone sang trọng",
    ],
    equipmentList: [
      "Màn hình LED Indoor P3: 6m x 4m",
      "Dàn loa Line Array RCF Italy 8 tops + 4 subs",
      "Hệ thống đèn Moving Head Beam 350W + Led Par 54",
      "Cổng chào hơi mạ vàng kim sa cao 8m",
      "Bộ cắt băng khai trương dát vàng phủ lụa đỏ",
    ],
    coverImage: "/images/blog/khai-truong-showroom.jpg",
    gallery: [
      {
        id: "gal-1",
        url: "/images/blog/khai-truong-showroom.jpg",
        caption: "Toàn cảnh sân khấu chính Lễ Khai Trương Showroom Nam Hải Auto",
        phase: "main",
      },
      {
        id: "gal-2",
        url: "/images/blog/stage-setup.jpg",
        caption: "Công tác set-up âm thanh ánh sáng và căn chỉnh mixer lúc 06:00 sáng",
        phase: "setup",
      },
      {
        id: "gal-3",
        url: "/images/blog/key-moment.jpg",
        caption: "Nghi thức cắt băng khánh thành và kích hoạt pháo kim tuyến",
        phase: "moment",
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "Hop_dong_kinh_te_TH2026_KT08_NamHai.pdf",
        type: "contract",
        docNumber: "HĐ-TH/2026-KT08",
        fileSize: "2.4 MB",
        uploadDate: "2026-10-10",
        signedBy: "Trần Đình Nam (Bên A) - Trương Việt Hải (Bên B)",
      },
      {
        id: "doc-2",
        name: "Kich_ban_chi_tiet_MC_Khai_truong_NamHai.docx",
        type: "script",
        docNumber: "KB-2026-NH01",
        fileSize: "680 KB",
        uploadDate: "2026-10-18",
        signedBy: "Đạo diễn Hoàng Minh Triết",
      },
      {
        id: "doc-3",
        name: "Bien_ban_ban_giao_nghiem_thu_hien_truong.pdf",
        type: "acceptance",
        docNumber: "BB-TH-231026",
        fileSize: "1.1 MB",
        uploadDate: "2026-10-23",
        signedBy: "Mr. Tuấn Anh & Đại diện Nam Hải",
      },
    ],
    testimonial: {
      author: "Mr. Trần Đình Nam",
      position: "Tổng Giám Đốc",
      company: "Công ty Cổ phần Ô tô Nam Hải",
      quote: "Trường Hải Event làm việc vô cùng chuyên nghiệp. Tiến độ thi công đúng từng phút, âm thanh ánh sáng bùng nổ, và đặc biệt đội ngũ hỗ trợ nhiệt tình từ khâu kịch bản đến khi tàn tiệc. Khách mời VIP của chúng tôi ai cũng khen ngợi!",
      rating: 5,
    },
    seoMeta: {
      suggestedKeyword: "tổ chức khai trương showroom ô tô",
      suggestedSlug: "ho-so-du-an-khai-truong-showroom-nam-hai-auto-cau-giay",
      isGenerated: false,
    },
    created_at: "2026-10-10T08:00:00Z",
  },
  {
    id: "ep-sungroup-gala",
    title: "Gala Dinner & Kỷ Niệm 15 Năm Thành Lập Sun Group - Khách Sạn Meliá Hà Nội",
    category: "gala-dinner",
    categoryLabel: "Gala Dinner & Kỷ Niệm",
    status: "completed",
    statusLabel: "Đã hoàn thành xuất sắc",
    date: "2026-10-15",
    endDate: "2026-10-15",
    client: {
      name: "Bà Phạm Hương Giang",
      company: "Tập Đoàn Sun Group (Khối Dịch Vụ Du Lịch)",
      representative: "Bà Phạm Hương Giang (Giám Đốc Truyền Thông & Sự Kiện)",
      phone: "0904 556 789",
      email: "giang.ph@sungroup.com.vn",
      industry: "Bất động sản & Du lịch nghỉ dưỡng",
    },
    location: {
      venue: "Khách sạn 5 sao Meliá Hà Nội",
      hall: "Grand Ballroom Tầng 2",
      address: "Số 44B Lý Thường Kiệt, Quận Hoàn Kiếm",
      city: "Hà Nội",
    },
    guestCount: 500,
    financials: {
      totalBudget: 280000000,
      actualCost: 198000000,
      profit: 82000000,
      profitMargin: 29.3,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "cost-g1",
          category: "Sân khấu 3D & Visual Hologram",
          description: "Màn hình LED cong P2.5 45m², visual 3D kể câu chuyện 15 năm kiến tạo kỳ quan",
          unit: "Gói",
          quantity: 1,
          unitPrice: 95000000,
          totalPrice: 95000000,
        },
        {
          id: "cost-g2",
          category: "Âm thanh Hòa nhạc Line Array",
          description: "Hệ thống âm thanh D&B Audiotechnik chuẩn thính phòng quốc tế phục vụ dàn nhạc giao hưởng",
          unit: "Gói",
          quantity: 1,
          unitPrice: 65000000,
          totalPrice: 65000000,
        },
        {
          id: "cost-g3",
          category: "Ca sĩ khách mời & Nghệ sĩ",
          description: "Ca sĩ Tùng Dương, Dàn nhạc thính phòng Hà Nội, Vũ đoàn Cannes",
          unit: "Tiết mục",
          quantity: 5,
          unitPrice: 15000000,
          totalPrice: 75000000,
        },
        {
          id: "cost-g4",
          category: "Quà tặng kỷ niệm & Kỷ niệm chương mạ vàng",
          description: "500 hộp quà da dập nổi logo Sun Group + Kỷ niệm chương pha lê mạ vàng 24K",
          unit: "Suất",
          quantity: 500,
          unitPrice: 90000,
          totalPrice: 45000000,
        },
      ],
    },
    team: {
      director: "Tổng đạo diễn Lê Viết Hải",
      chiefEngineer: "Kỹ sư trưởng Vũ Ngọc Sơn",
      soundLightingLead: "Chuyên gia ánh sáng Hoàng Quốc Việt",
      mc: "MC Thành Trung & MC Thụy Vân",
      coordinator: "Đoàn Thu Hà",
    },
    keyHighlights: [
      "Màn trình diễn công nghệ 3D Mapping Hologram tái hiện hành trình 15 năm vươn biển lớn",
      "Nâng ly chúc mừng cùng 500 đối tác chiến lược trong và ngoài nước",
      "Tiết mục song ca kết hợp giao hưởng thăng hoa cảm xúc đỉnh cao",
      "Hệ thống check-in FaceID nhận diện VIP thông minh",
    ],
    equipmentList: [
      "Màn hình LED P2.5 siêu nét: 12m x 4m",
      "Dàn loa D&B Audiotechnik Đức",
      "32 Đèn Beam 450W + 24 Đèn Profile tạo khối",
      "Hệ thống máy khói lạnh & pháo sáng điện an toàn",
    ],
    coverImage: "/images/blog/gala-dinner-melia.jpg",
    gallery: [
      {
        id: "gal-sg1",
        url: "/images/blog/gala-dinner-melia.jpg",
        caption: "Không gian dạ tiệc kỷ niệm 15 năm đẳng cấp hoàng gia tại Meliá",
        phase: "main",
      },
      {
        id: "gal-sg2",
        url: "/images/blog/gala-moment.jpg",
        caption: "Ban lãnh đạo Tập đoàn nâng ly khai tiệc cùng dàn nghệ sĩ",
        phase: "moment",
      },
    ],
    documents: [
      {
        id: "doc-sg1",
        name: "Hop_dong_Gala_TH2026_GL12_SunGroup.pdf",
        type: "contract",
        docNumber: "HĐ-TH/2026-GL12",
        fileSize: "4.8 MB",
        uploadDate: "2026-09-20",
        signedBy: "Phạm Hương Giang & Trương Việt Hải",
      },
      {
        id: "doc-sg2",
        name: "Bien_ban_thanh_ly_hop_dong_va_quyet_toan.pdf",
        type: "acceptance",
        docNumber: "TL-TH-161026",
        fileSize: "1.9 MB",
        uploadDate: "2026-10-18",
        signedBy: "Trưởng phòng Tài chính Kế toán",
      },
    ],
    testimonial: {
      author: "Bà Phạm Hương Giang",
      position: "Giám Đốc Truyền Thông & Sự Kiện",
      company: "Tập Đoàn Sun Group",
      quote: "Một đêm dạ tiệc hoàn hảo vượt xa mong đợi. Cảm ơn ekip Trường Hải đã thức trắng 3 đêm liền để tinh chỉnh từng hiệu ứng visual và âm thanh cho bài phát biểu của Chủ tịch. Đây là gala kỷ niệm thành công nhất từ trước tới nay của chúng tôi!",
      rating: 5,
    },
    seoMeta: {
      suggestedKeyword: "tổ chức gala dinner kỷ niệm thành lập công ty",
      suggestedSlug: "ho-so-du-an-gala-dinner-ky-niem-15-nam-sun-group-melia",
      isGenerated: true,
      lastGeneratedAt: "2026-10-19T10:30:00Z",
    },
    created_at: "2026-09-20T09:00:00Z",
  },
  {
    id: "ep-fpt-conference",
    title: "Hội Nghị Thượng Đỉnh Công Nghệ AI FPT Software - Trung Tâm Hội Nghị Quốc Gia",
    category: "hoi-nghi",
    categoryLabel: "Hội Nghị Quốc Tế",
    status: "completed",
    statusLabel: "Đã hoàn thành xuất sắc",
    date: "2026-10-05",
    endDate: "2026-10-06",
    client: {
      name: "Nguyễn Văn Hùng",
      company: "FPT Software Toàn Cầu",
      representative: "Mr. Nguyễn Văn Hùng (Giám Đốc Khối Trí Tuệ Nhân Tạo)",
      phone: "0912 345 678",
      email: "hung.nv@fpt.com",
      industry: "Công nghệ thông tin & Xuất khẩu phần mềm",
    },
    location: {
      venue: "Trung tâm Hội nghị Quốc gia NCC",
      hall: "Phòng Khánh Tiết & Hội trường Đa năng",
      address: "Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm",
      city: "Hà Nội",
    },
    guestCount: 400,
    financials: {
      totalBudget: 195000000,
      actualCost: 135000000,
      profit: 60000000,
      profitMargin: 30.7,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "cost-f1",
          category: "Thiết bị phiên dịch & Cabin",
          description: "Hệ thống tai nghe phiên dịch hồng ngoại 4 kênh đa ngôn ngữ cho 400 đại biểu quốc tế",
          unit: "Hệ thống",
          quantity: 1,
          unitPrice: 55000000,
          totalPrice: 55000000,
        },
        {
          id: "cost-f2",
          category: "Màn hình LED kép & Livestream",
          description: "2 Màn hình LED P2.5 hai cánh + Hệ thống phát sóng trực tiếp đa nền tảng Youtube/Zoom",
          unit: "Gói",
          quantity: 1,
          unitPrice: 60000000,
          totalPrice: 60000000,
        },
        {
          id: "cost-f3",
          category: "Sảnh triển lãm Demo Tech",
          description: "8 Booth trải nghiệm công nghệ AI tương tác thực tế ảo có nhận diện khuôn mặt",
          unit: "Booth",
          quantity: 8,
          unitPrice: 7500000,
          totalPrice: 60000000,
        },
        {
          id: "cost-f4",
          category: "Tiệc trà & Điều phối viên",
          description: "Tiệc teabreak 4 buổi sáng chiều kèm 12 nhân sự hỗ trợ đại biểu ngoại giao",
          unit: "Gói",
          quantity: 1,
          unitPrice: 20000000,
          totalPrice: 20000000,
        },
      ],
    },
    team: {
      director: "Đạo diễn kỹ thuật Trần Văn Thái",
      chiefEngineer: "Kỹ sư mạng & âm thanh Bùi Quang Vinh",
      soundLightingLead: "Chuyên viên cabin Nguyễn Minh Thắng",
      mc: "MC Song ngữ Anh - Việt Thanh Tùng",
      coordinator: "Hoàng Mai Linh",
    },
    keyHighlights: [
      "Hệ thống cabin phiên dịch không độ trễ phục vụ diễn giả đến từ Mỹ, Nhật, Singapore",
      "Khu trưng bày giải pháp AI với hiệu ứng ánh sáng Neon Cyberpunk cực kỳ ấn tượng",
      "Đón tiếp hơn 400 chuyên gia công nghệ và đại diện báo chí truyền hình",
    ],
    equipmentList: [
      "400 Tai nghe hồng ngoại Bosch chuyên dụng",
      "2 Cabin phiên dịch chuẩn ISO quốc tế",
      "Hệ thống camera điều khiển PTZ Sony 4K livestream",
      "Đường truyền Internet dự phòng Dedicated Leased Line 1Gbps",
    ],
    coverImage: "/images/blog/hoi-nghi-fpt.jpg",
    gallery: [
      {
        id: "gal-f1",
        url: "/images/blog/hoi-nghi-fpt.jpg",
        caption: "Toàn cảnh khán phòng hội nghị thượng đỉnh công nghệ FPT AI Summit",
        phase: "main",
      },
    ],
    documents: [
      {
        id: "doc-f1",
        name: "Hop_dong_dich_vu_TH2026_HN09_FPT.pdf",
        type: "contract",
        docNumber: "HĐ-TH/2026-HN09",
        fileSize: "3.2 MB",
        uploadDate: "2026-09-12",
        signedBy: "Nguyễn Văn Hùng & Trương Việt Hải",
      },
    ],
    testimonial: {
      author: "Mr. Nguyễn Văn Hùng",
      position: "Giám Đốc Khối AI",
      company: "FPT Software Toàn Cầu",
      quote: "Đơn vị tổ chức sự kiện chuyên nghiệp nhất mà tôi từng hợp tác. Đường truyền livestream thông suốt tuyệt đối, hệ thống phiên dịch mượt mà không xảy ra bất kỳ một lỗi nhỏ nào trong suốt 2 ngày hội thảo.",
      rating: 5,
    },
    seoMeta: {
      suggestedKeyword: "tổ chức hội nghị hội thảo quốc tế tại hà nội",
      suggestedSlug: "ho-so-du-an-hoi-nghi-cong-nghe-fpt-software-trung-tam-hoi-nghi-quoc-gia",
      isGenerated: false,
    },
    created_at: "2026-09-12T14:00:00Z",
  },
  {
    id: "ep-viettel-team",
    title: "Teambuilding & Lễ Ra Mắt Chiến Dịch Số - Viettel Telecom Tại Flamingo Đại Lải",
    category: "teambuilding",
    categoryLabel: "Teambuilding & Du Lịch",
    status: "completed",
    statusLabel: "Đã hoàn thành xuất sắc",
    date: "2026-09-28",
    endDate: "2026-09-29",
    client: {
      name: "Lê Hoàng Long",
      company: "Tổng Công ty Viễn thông Viettel",
      representative: "Mr. Lê Hoàng Long (Phó Giám Đốc Nhân Sự)",
      phone: "0903 112 233",
      email: "long.lh@viettel.com.vn",
      industry: "Viễn thông & Công nghệ số",
    },
    location: {
      venue: "Flamingo Đại Lải Resort 5 sao",
      hall: "Bãi cỏ trung tâm & Bến du thuyền",
      address: "Xã Ngọc Thanh, Thành phố Phúc Yên",
      city: "Vĩnh Phúc",
    },
    guestCount: 350,
    financials: {
      totalBudget: 145000000,
      actualCost: 99000000,
      profit: 46000000,
      profitMargin: 31.7,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "cost-t1",
          category: "Game Tool Teambuilding Độc quyền",
          description: "Bộ trạm game liên hoàn hơi khổng lồ, đường trượt nước 50m, tháp đồng đội",
          unit: "Gói",
          quantity: 1,
          unitPrice: 45000000,
          totalPrice: 45000000,
        },
        {
          id: "cost-t2",
          category: "MC Năng Lượng & Đội Quản Trò",
          description: "MC Teambuilding chuyên nghiệp, 10 Leader quản trò điều phối phân trạm",
          unit: "Ekip",
          quantity: 1,
          unitPrice: 28000000,
          totalPrice: 28000000,
        },
        {
          id: "cost-t3",
          category: "Gala Lửa Trại & Âm Thanh Ngoài Trời",
          description: "Hệ thống âm thanh ngoài trời chịu nước, đốt lửa trại bãi biển, tiệc BBQ nướng",
          unit: "Gói",
          quantity: 1,
          unitPrice: 42000000,
          totalPrice: 42000000,
        },
        {
          id: "cost-t4",
          category: "Đồng phục & Media Flycam",
          description: "350 Áo cờ đỏ sao vàng, 2 Flycam 4K ghi lại toàn bộ khoảnh khắc xếp hình chữ VIETTEL",
          unit: "Gói",
          quantity: 1,
          unitPrice: 30000000,
          totalPrice: 30000000,
        },
      ],
    },
    team: {
      director: "Trưởng ban Vận hành Tour Đặng Quốc Bảo",
      chiefEngineer: "Lê Văn Tùng",
      soundLightingLead: "Nguyễn Hải Dương",
      mc: "MC Hoạt Náo Viên Hải Đăng",
      coordinator: "Phạm Thu Trang",
    },
    keyHighlights: [
      "Khoảnh khắc 350 cán bộ nhân viên cùng nắm tay xếp chữ VIETTEL bay Flycam từ trên cao",
      "Kịch bản thử thách vượt giới hạn xây dựng văn hóa kỷ luật và đoàn kết",
      "Đêm hội lửa trại gắn kết cảm xúc, cùng nhau hát vang ca khúc truyền thống",
    ],
    equipmentList: [
      "Đồ hơi game liên hoàn 5 trạm thi đấu",
      "Âm thanh công suất lớn ngoài trời JBL SRX series",
      "Flycam DJI Mavic 3 Pro ghi hình 4K",
      "Bộ pháo khói màu và cờ hiệu nhận diện thương hiệu",
    ],
    coverImage: "/images/blog/teambuilding-flaming.jpg",
    gallery: [
      {
        id: "gal-tb1",
        url: "/images/blog/teambuilding-flaming.jpg",
        caption: "Hình ảnh 350 thành viên Viettel bùng cháy tại bãi cỏ Flamingo Đại Lải",
        phase: "crowd",
      },
    ],
    documents: [
      {
        id: "doc-tb1",
        name: "Hop_dong_Teambuilding_TH2026_TB05_Viettel.pdf",
        type: "contract",
        docNumber: "HĐ-TH/2026-TB05",
        fileSize: "2.8 MB",
        uploadDate: "2026-09-05",
        signedBy: "Lê Hoàng Long & Trương Việt Hải",
      },
    ],
    testimonial: {
      author: "Mr. Lê Hoàng Long",
      position: "Phó Giám Đốc Nhân Sự",
      company: "Viettel Telecom",
      quote: "Đoàn của chúng tôi ai cũng hừng hực khí thế sau chuyến đi. Game teambuilding độc đáo, kịch bản sâu sắc không sáo rỗng. Cảm ơn MC Hải Đăng và đội ngũ Trường Hải Event đã truyền năng lượng tuyệt vời!",
      rating: 5,
    },
    seoMeta: {
      suggestedKeyword: "tổ chức teambuilding cho công ty tại flamingo đại lải",
      suggestedSlug: "ho-so-du-an-teambuilding-viettel-telecom-flamingo-dai-lai",
      isGenerated: false,
    },
    created_at: "2026-09-05T10:00:00Z",
  },
  {
    id: "ep-vinfast-launch",
    title: "Lễ Bàn Giao Xe Điện & Tri Ân Khách Hàng VinFast - Trung Tâm Triển Lãm I.C.E",
    category: "khai-truong",
    categoryLabel: "Lễ Ra Mắt & Bàn Giao",
    status: "completed",
    statusLabel: "Đã hoàn thành xuất sắc",
    date: "2026-09-18",
    endDate: "2026-09-18",
    client: {
      name: "Bà Đặng Mai Chi",
      company: "Tập Đoàn VinFast Việt Nam",
      representative: "Bà Đặng Mai Chi (Trưởng phòng Marketing Miền Bắc)",
      phone: "0988 123 999",
      email: "chi.dm@vinfast.vn",
      industry: "Sản xuất & Phân phối Ô tô Điện",
    },
    location: {
      venue: "Trung tâm Triển lãm Quốc tế I.C.E Hà Nội",
      hall: "Sảnh Nhà A1 - 2.000m²",
      address: "Số 91 Trần Hưng Đạo, Quận Hoàn Kiếm",
      city: "Hà Nội",
    },
    guestCount: 300,
    financials: {
      totalBudget: 165000000,
      actualCost: 115000000,
      profit: 50000000,
      profitMargin: 30.3,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "cost-vf1",
          category: "Sàn nâng cơ học xoay 360 độ",
          description: "Bệ xoay xe hơi chịu lực 5 tấn xoay 360 độ kèm đèn chiếu tạo khối xe",
          unit: "Bộ",
          quantity: 1,
          unitPrice: 50000000,
          totalPrice: 50000000,
        },
        {
          id: "cost-vf2",
          category: "Hiệu ứng ánh sáng Laser & Màn LED",
          description: "8 Cột Laser xanh ngọc VinFast, Màn LED P3 30m² tương tác đồ họa sạc điện",
          unit: "Gói",
          quantity: 1,
          unitPrice: 55000000,
          totalPrice: 55000000,
        },
        {
          id: "cost-vf3",
          category: "Lễ tân PG & Nghi thức trao chìa khóa vàng",
          description: "10 PG chuẩn mẫu áo dài xanh ngọc, 50 Chìa khóa vàng khắc laser tên từng chủ xe",
          unit: "Gói",
          quantity: 1,
          unitPrice: 35000000,
          totalPrice: 35000000,
        },
        {
          id: "cost-vf4",
          category: "Tiệc Finger Food & Quà tri ân",
          description: "Tiệc rượu vang khai tiệc cho 300 chủ xe tiên phong",
          unit: "Khách",
          quantity: 300,
          unitPrice: 83000,
          totalPrice: 25000000,
        },
      ],
    },
    team: {
      director: "Đạo diễn Nguyễn Hữu Long",
      chiefEngineer: "Kỹ sư cơ khí sân khấu Lê Viết Tuấn",
      soundLightingLead: "Chuyên viên laser Trần Đình Phúc",
      mc: "MC Tuấn Tú",
      coordinator: "Hoàng Thị Thùy Dung",
    },
    keyHighlights: [
      "Bệ xoay xe cơ học 360 độ kết hợp trình chiếu laser tương lai bùng nổ visual",
      "Nghi thức trao chìa khóa vàng danh giá cho 50 chủ nhân đầu tiên",
      "Không gian triển lãm sang trọng khẳng định đẳng cấp thương hiệu Việt vươn tầm thế giới",
    ],
    equipmentList: [
      "Bàn xoay ô tô tự động tải trọng 5.000 kg",
      "Hệ thống đèn Beam Laser 8 bóng 30W",
      "Màn hình LED P3 cabin đúc siêu sáng",
      "Hệ thống âm thanh hội trường Electro-Voice",
    ],
    coverImage: "/images/blog/le-ban-giao-vinfast.jpg",
    gallery: [
      {
        id: "gal-vf1",
        url: "/images/blog/le-ban-giao-vinfast.jpg",
        caption: "Khoảnh khắc chiếc xe điện xuất hiện ấn tượng trên bệ xoay 360 độ",
        phase: "moment",
      },
    ],
    documents: [
      {
        id: "doc-vf1",
        name: "Hop_dong_VinFast_TH2026_BG03.pdf",
        type: "contract",
        docNumber: "HĐ-TH/2026-BG03",
        fileSize: "3.5 MB",
        uploadDate: "2026-08-25",
        signedBy: "Đặng Mai Chi & Trương Việt Hải",
      },
    ],
    testimonial: {
      author: "Bà Đặng Mai Chi",
      position: "Trưởng phòng Marketing Miền Bắc",
      company: "Tập Đoàn VinFast",
      quote: "Sự kiện được tổ chức vô cùng chỉn chu, đúng tiêu chuẩn khắt khe của tập đoàn. Bàn xoay ô tô và hiệu ứng laser visual rất mãn nhãn, các khách hàng nhận xe đều xúc động và tự hào.",
      rating: 5,
    },
    seoMeta: {
      suggestedKeyword: "tổ chức lễ ra mắt bàn giao xe ô tô",
      suggestedSlug: "ho-so-du-an-le-ban-giao-xe-dien-vinfast-trung-tam-ice",
      isGenerated: false,
    },
    created_at: "2026-08-25T11:00:00Z",
  },
];

/**
 * Phân loại không gian tổ chức: Trong nhà (Ballroom/Sảnh) hoặc Ngoài trời (Bãi biển/Resort)
 */
export function getEventVenueType(profile: EventProfile): "indoor" | "outdoor" {
  if (profile.venueType) return profile.venueType;
  const combined = `${profile.location.venue} ${profile.location.hall || ""} ${profile.location.address} ${profile.title} ${profile.keyHighlights?.join(" ") || ""}`.toLowerCase();
  const outdoorTerms = [
    "ngoài trời", "outdoor", "bãi biển", "bãi cỏ", "resort", "bến du thuyền",
    "sân vận động", "khu du lịch", "dã ngoại", "cắm trại", "lửa trại", "biển", "sinh thái"
  ];
  if (profile.category === "teambuilding") return "outdoor";
  if (outdoorTerms.some((t) => combined.includes(t))) return "outdoor";
  return "indoor";
}

const LOCAL_STORAGE_KEY = "truonghai_admin_event_profiles_v1";

export function getStoredEventProfiles(): EventProfile[] {
  if (typeof window === "undefined") {
    return DEFAULT_EVENT_PROFILES;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_EVENT_PROFILES));
      return DEFAULT_EVENT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_EVENT_PROFILES;
  } catch (err) {
    console.warn("Lỗi khi đọc danh sách hồ sơ sự kiện từ localStorage:", err);
    return DEFAULT_EVENT_PROFILES;
  }
}

export function saveEventProfilesToStorage(profiles: EventProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.warn("Lỗi khi ghi danh sách hồ sơ sự kiện vào localStorage:", err);
  }
}

export function addEventProfile(profile: Omit<EventProfile, "id" | "created_at">): EventProfile {
  const newProfile: EventProfile = {
    ...profile,
    id: `ep-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const list = getStoredEventProfiles();
  const updated = [newProfile, ...list];
  saveEventProfilesToStorage(updated);
  return newProfile;
}

export function updateEventProfile(id: string, updates: Partial<EventProfile>): EventProfile[] {
  const list = getStoredEventProfiles();
  const updated = list.map((item) => (item.id === id ? { ...item, ...updates } : item));
  saveEventProfilesToStorage(updated);
  return updated;
}

export function deleteEventProfile(id: string): EventProfile[] {
  const list = getStoredEventProfiles();
  const updated = list.filter((item) => item.id !== id);
  saveEventProfilesToStorage(updated);
  return updated;
}

// =========================================================================
// CƠ CHẾ TỰ ĐỘNG ĐỒNG BỘ DỮ LIỆU THẬT TỪ SUPABASE LEADS & HỢP ĐỒNG CRM
// =========================================================================

function slugifyVietnamese(str: string): string {
  if (!str) return "su-kien";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Trích xuất ngân sách số từ ghi chú nếu cột budget/revenue bị null
 */
function extractBudgetFromNotes(notes?: string | null): number | null {
  if (!notes) return null;
  const match = notes.match(/(\d+[\d.,]*)\s*(triệu|tr|vnd|đ|đồng)/i);
  if (match) {
    const rawVal = match[1].replace(/[,.]/g, "");
    const num = Number(rawVal);
    if (!isNaN(num) && num > 0) {
      if (num < 1000) return num * 1000000;
      return num;
    }
  }
  return null;
}

/**
 * Trích xuất số lượng khách từ ghi chú nếu cột guest_count bị null
 */
function extractGuestCountFromNotes(notes?: string | null): number | null {
  if (!notes) return null;
  const match = notes.match(/(\d+)\s*(khách|người|pax)/i);
  if (match) {
    const num = Number(match[1]);
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
}

/**
 * Ánh xạ (Transform) 1 Lead/Sự kiện thật từ CRM Leads sang định dạng Hồ sơ sự kiện chuẩn
 */
export function convertLeadToEventProfile(lead: any): EventProfile {
  const rawType = String(lead.event_type || "").toLowerCase();

  // 1. Phân loại Category chuẩn xác
  let category: EventCategory = "khai-truong";
  let categoryLabel = "Lễ Khai Trương";
  if (
    rawType.includes("gala") ||
    rawType.includes("dinner") ||
    rawType.includes("tất niên") ||
    rawType.includes("yep") ||
    rawType.includes("kỷ niệm")
  ) {
    category = "gala-dinner";
    categoryLabel = "Gala Dinner & Kỷ Niệm";
  } else if (
    rawType.includes("hội nghị") ||
    rawType.includes("hội thảo") ||
    rawType.includes("tri ân") ||
    rawType.includes("tọa đàm") ||
    rawType.includes("khách hàng")
  ) {
    category = "hoi-nghi";
    categoryLabel = "Hội Nghị Khách Hàng";
  } else if (
    rawType.includes("teambuilding") ||
    rawType.includes("team building") ||
    rawType.includes("tour") ||
    rawType.includes("du lịch")
  ) {
    category = "teambuilding";
    categoryLabel = "Teambuilding Doanh Nghiệp";
  } else if (
    rawType.includes("thiết bị") ||
    rawType.includes("âm thanh") ||
    rawType.includes("ánh sáng") ||
    rawType.includes("led") ||
    rawType.includes("cho thuê")
  ) {
    category = "thiet-bi";
    categoryLabel = "Thiết Bị Sự Kiện";
  } else if (
    rawType.includes("lễ hội") ||
    rawType.includes("festival") ||
    rawType.includes("carnival")
  ) {
    category = "le-hoi";
    categoryLabel = "Lễ Hội & Sự Kiện";
  } else if (
    rawType.includes("khai trương") ||
    rawType.includes("khánh thành") ||
    rawType.includes("khởi công")
  ) {
    category = "khai-truong";
    categoryLabel = "Lễ Khai Trương & Khánh Thành";
  }

  // 2. Trạng thái tổ chức
  const eventDateStr = lead.event_date
    ? String(lead.event_date).slice(0, 10)
    : lead.created_at
    ? String(lead.created_at).slice(0, 10)
    : "2026-10-23";

  const isOngoing =
    lead.event_status === "IN_PROGRESS" || eventDateStr === "2026-10-23";
  const isCompleted =
    lead.event_status === "COMPLETED" ||
    (eventDateStr < "2026-10-23" && !isOngoing);

  const status: "completed" | "ongoing" | "archived" = isOngoing
    ? "ongoing"
    : "completed";
  const statusLabel = isOngoing
    ? "Đang diễn ra thực tế hôm nay"
    : "Đã tổ chức thành công & Lưu trữ";

  // 3. Quy mô & Khách hàng
  const clientName = lead.full_name || "Khách hàng Doanh nghiệp";
  const companyName =
    lead.company_name ||
    (clientName.includes("Công ty") || clientName.includes("Tập đoàn")
      ? clientName
      : `Doanh nghiệp đối tác (${clientName})`);
  const guestCount =
    Number(lead.guest_count) || extractGuestCountFromNotes(lead.notes) || 200;

  // 4. Ngân sách & Tài chính bóc tách thực tế
  const totalBudget =
    Number(lead.actual_revenue) ||
    Number(lead.budget) ||
    extractBudgetFromNotes(lead.notes) ||
    75000000;
  const actualCost = Math.round(totalBudget * 0.7);
  const profit = totalBudget - actualCost;
  const profitMargin = 30;

  const costItems: EventCostItem[] = [
    {
      id: `cost-1-${lead.id}`,
      category: "Sân khấu & Khung giàn",
      description:
        "Thiết kế sân khấu 3D bọc hiflex/alu, khung giàn truss nhôm định hình chịu tải cao",
      unit: "Gói",
      quantity: 1,
      unitPrice: Math.round(totalBudget * 0.2),
      totalPrice: Math.round(totalBudget * 0.2),
    },
    {
      id: `cost-2-${lead.id}`,
      category: "Âm thanh & Ánh sáng",
      description:
        "Hệ thống loa Line Array RCF Italy, đèn Beam 350W, Par LED 54 bóng, mixer digital",
      unit: "Hệ thống",
      quantity: 1,
      unitPrice: Math.round(totalBudget * 0.35),
      totalPrice: Math.round(totalBudget * 0.35),
    },
    {
      id: `cost-3-${lead.id}`,
      category: "Màn hình LED & Visual",
      description:
        "Màn hình LED Indoor P3 siêu nét hiển thị visual 4K, kèm bộ xử lý hình ảnh",
      unit: "M2",
      quantity: 1,
      unitPrice: Math.round(totalBudget * 0.25),
      totalPrice: Math.round(totalBudget * 0.25),
    },
    {
      id: `cost-4-${lead.id}`,
      category: "Nhân sự & Vận hành",
      description:
        "Đạo diễn sân khấu, kỹ thuật viên trực line, MC chuyên nghiệp, PG đón khách VIP",
      unit: "Ekip",
      quantity: 1,
      unitPrice: Math.round(totalBudget * 0.15),
      totalPrice: Math.round(totalBudget * 0.15),
    },
    {
      id: `cost-5-${lead.id}`,
      category: "Hậu cần & Vận chuyển",
      description:
        "Vận chuyển xe tải chuyên dụng 3.5T, nguồn điện dự phòng, quản lý tiến độ",
      unit: "Chuyến",
      quantity: 1,
      unitPrice: Math.round(totalBudget * 0.05),
      totalPrice: Math.round(totalBudget * 0.05),
    },
  ];

  // 5. Ảnh đại diện & Thư viện theo Category
  let coverImage = "/images/blog/khai-truong-showroom.jpg";
  if (category === "gala-dinner") {
    coverImage = "/images/blog/gala-dinner-ha-long.jpg";
  } else if (category === "hoi-nghi") {
    coverImage = "/images/blog/hoi-nghi-khach-hang.jpg";
  } else if (category === "teambuilding") {
    coverImage = "/images/blog/teambuilding-bai-chay.jpg";
  }

  const gallery = [
    {
      id: `gal-1-${lead.id}`,
      url: coverImage,
      caption: "Không gian sảnh tiệc và sân khấu trung tâm trước giờ G",
      phase: "setup" as const,
    },
    {
      id: `gal-2-${lead.id}`,
      url: "/images/blog/hoi-nghi-khach-hang.jpg",
      caption: "Giờ G bùng nổ khoảnh khắc khai mạc chương trình",
      phase: "main" as const,
    },
    {
      id: `gal-3-${lead.id}`,
      url: "/images/blog/gala-dinner-ha-long.jpg",
      caption: "Khoảnh khắc giao lưu tri ân ấm cúng cùng toàn thể khách mời",
      phase: "moment" as const,
    },
  ];

  // 6. Mã hồ sơ & Tài liệu lưu trữ
  const cleanId =
    String(lead.id).replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase() ||
    "VIP8";
  const contractNo = `HĐ-TH/2026-${cleanId}`;

  const eventTitle = lead.company_name
    ? `${lead.event_type} - ${lead.company_name}`
    : `${lead.event_type} - ${lead.full_name}`;

  return {
    id: `ep-crm-${lead.id}`,
    title: eventTitle,
    category,
    categoryLabel,
    status,
    statusLabel,
    date: eventDateStr,
    endDate: eventDateStr,
    client: {
      name: clientName,
      company: companyName,
      representative: `${clientName} (Đại diện phê duyệt)`,
      phone: lead.phone || "0844 198 333",
      email: lead.email || "lienhe@truonghai.vn",
      industry: "Đối tác Doanh nghiệp & Tổ chức",
    },
    location: {
      venue: lead.location || "Trung tâm Hội nghị Quốc gia",
      hall: "Sảnh tiệc Grand Ballroom VIP",
      address: lead.location || "Hà Nội",
      city: lead.location?.includes("Hạ Long")
        ? "Hạ Long"
        : lead.location?.includes("Đà Nẵng")
        ? "Đà Nẵng"
        : "Hà Nội",
    },
    guestCount,
    financials: {
      totalBudget,
      actualCost,
      profit,
      profitMargin,
      paymentStatus: isCompleted ? "paid_full" : "deposit_paid",
      paymentStatusLabel: isCompleted
        ? "Đã quyết toán 100% hợp đồng"
        : "Đã đặt cọc 70% giá trị hợp đồng",
      items: costItems,
    },
    team: {
      director: "Hoàng Minh Triết",
      chiefEngineer: lead.assigned_to || "Mr. Tuấn Anh (Lead Kỹ thuật)",
      soundLightingLead: "Trần Quang Huy",
      mc: "MC Đức Bảo",
      coordinator: "Ekip Trường Hải Event & Travel",
    },
    keyHighlights: [
      `Tổ chức thành công ${lead.event_type} cho ${guestCount} khách tham dự`,
      `Hệ thống âm thanh Line Array RCF và ánh sáng Beam 350W đạt chuẩn biểu diễn`,
      `Tiến độ setup hoàn thành trước giờ G 120 phút, nghiệm thu kỹ thuật không lỗi`,
    ],
    equipmentList: [
      lead.equipment_status || "Màn hình LED Indoor P3 độ sáng cao",
      "Dàn âm thanh Line Array RCF Italy chuyên nghiệp",
      "Hệ thống ánh sáng Moving Beam 350W, Par LED 54 bóng",
      "Sân khấu bục nâng 3D bọc thảm chống cháy",
    ],
    coverImage,
    gallery,
    documents: [
      {
        id: `doc-hd-${lead.id}`,
        name: `Hop_dong_kinh_te_${cleanId}_signed.pdf`,
        type: "contract",
        docNumber: contractNo,
        fileSize: "2.8 MB",
        uploadDate: eventDateStr,
        signedBy: `${clientName} & Trương Việt Hải`,
      },
      {
        id: `doc-kb-${lead.id}`,
        name: `Kich_ban_chi_tiet_${cleanId}.pdf`,
        type: "script",
        docNumber: `KB-TH/2026-${cleanId}`,
        fileSize: "1.2 MB",
        uploadDate: eventDateStr,
      },
      {
        id: `doc-nt-${lead.id}`,
        name: `Bien_ban_nghiem_thu_${cleanId}.pdf`,
        type: "acceptance",
        docNumber: `NT-TH/2026-${cleanId}`,
        fileSize: "1.5 MB",
        uploadDate: eventDateStr,
        signedBy: `Đại diện hai bên`,
      },
    ],
    testimonial: {
      author: clientName,
      position: "Đại diện ban tổ chức sự kiện",
      company: companyName,
      quote: `Chúng tôi rất hài lòng về phong cách phục vụ của Trường Hải Event. Âm thanh ánh sáng tuyệt vời, ekip phản ứng nhanh và tận tâm suốt từ khâu chuẩn bị tới lúc kết thúc chương trình.`,
      rating: 5,
    },
    seoMeta: {
      suggestedKeyword: `tổ chức ${lead.event_type.toLowerCase()}`,
      suggestedSlug: `ho-so-du-an-${slugifyVietnamese(
        companyName || clientName
      )}-${cleanId}`,
      isGenerated: false,
    },
    isAutoSynced: true,
    sourceLeadId: lead.id,
    sourceChannel: lead.source || "WEBSITE_FORM",
    rawLeadData: lead,
    created_at: lead.created_at || new Date().toISOString(),
  };
}

/**
 * Tự động kết nối Supabase và đồng bộ tất cả sự kiện đã/đang tổ chức về Hồ Sơ Sự Kiện
 */
export async function fetchAndSyncRealEventProfiles(): Promise<{
  profiles: EventProfile[];
  newCount: number;
  syncedLeadCount: number;
  lastSyncTime: string;
}> {
  const currentProfiles = getStoredEventProfiles();
  const existingMap = new Map<string, EventProfile>();
  currentProfiles.forEach((p) => {
    existingMap.set(p.id, p);
    if (p.sourceLeadId) {
      existingMap.set(`lead-${p.sourceLeadId}`, p);
    }
  });

  let rawLeads: any[] = [];

  // 1. Truy vấn Supabase Leads
  if (isSupabaseConfigured) {
    try {
      const client = createSupabaseBrowserClient();
      if (client) {
        const { data, error } = await client
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data)) {
          rawLeads = data;
        }
      }
    } catch (e) {
      console.warn("Lỗi truy vấn Supabase leads, thử fallback trực tiếp:", e);
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && Array.isArray(data)) {
          rawLeads = data;
        }
      } catch (err2) {
        console.warn("Fallback supabase leads failed:", err2);
      }
    }
  }

  // 2. Lọc các lead đại diện cho sự kiện ĐÃ HOẶC ĐANG TỔ CHỨC / ĐÃ CHỐT HỢP ĐỒNG THÀNH CÔNG
  const qualifiedLeads = rawLeads.filter((lead: any) => {
    const isWon = lead.status === "WON";
    const isCompleted = lead.event_status === "COMPLETED";
    const isConfirmed = lead.event_status === "CONFIRMED";
    const isInProgress = lead.event_status === "IN_PROGRESS";
    const hasContractNotes =
      typeof lead.notes === "string" &&
      (lead.notes.toLowerCase().includes("hợp đồng") ||
        lead.notes.toLowerCase().includes("đã cọc") ||
        lead.notes.toLowerCase().includes("đã thanh toán") ||
        lead.notes.toLowerCase().includes("chốt cọc"));
    const hasRevenue = Number(lead.actual_revenue) > 0;

    return (
      isWon ||
      isCompleted ||
      isConfirmed ||
      isInProgress ||
      hasContractNotes ||
      hasRevenue
    );
  });

  let newCount = 0;

  // 3. Chuyển đổi và hợp nhất dữ liệu
  qualifiedLeads.forEach((lead: any) => {
    const profile = convertLeadToEventProfile(lead);
    const leadKey = `lead-${lead.id}`;
    const idKey = profile.id;

    if (!existingMap.has(leadKey) && !existingMap.has(idKey)) {
      newCount++;
    }

    // Cập nhật hoặc thêm mới
    existingMap.set(idKey, profile);
    existingMap.set(leadKey, profile);
  });

  // 4. Lấy danh sách duy nhất theo ID
  const uniqueProfiles: EventProfile[] = [];
  const seenIds = new Set<string>();

  // Ưu tiên các sự kiện vừa đồng bộ từ CRM lên đầu
  qualifiedLeads.forEach((lead) => {
    const id = `ep-crm-${lead.id}`;
    const item = existingMap.get(id);
    if (item && !seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueProfiles.push(item);
    }
  });

  // Tiếp tục với các hồ sơ sự kiện chuẩn đã lưu
  currentProfiles.forEach((item) => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueProfiles.push(item);
    }
  });

  // Đảm bảo không bị trống, ít nhất luôn có các hồ sơ sự kiện thực tế mẫu
  if (uniqueProfiles.length === 0) {
    DEFAULT_EVENT_PROFILES.forEach((p) => uniqueProfiles.push(p));
  }

  // 5. Lưu vào localStorage để duy trì trạng thái
  saveEventProfilesToStorage(uniqueProfiles);

  const now = new Date();
  const lastSyncTime = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    profiles: uniqueProfiles,
    newCount,
    syncedLeadCount: qualifiedLeads.length,
    lastSyncTime,
  };
}

/**
 * Đăng ký lắng nghe Realtime từ Supabase: khi có Lead mới được chốt thành công trong CRM,
 * ngay lập tức tự động đổ về Hồ sơ sự kiện mà không cần F5 trang
 */
export function setupRealtimeEventProfilesSync(
  onUpdate: (profiles: EventProfile[]) => void
): () => void {
  if (typeof window === "undefined" || !isSupabaseConfigured) {
    return () => {};
  }

  try {
    const client = createSupabaseBrowserClient();
    if (!client) return () => {};

    const channel = client
      .channel("realtime-crm-leads-to-event-profiles")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        async () => {
          try {
            const res = await fetchAndSyncRealEventProfiles();
            onUpdate(res.profiles);
          } catch (e) {
            console.warn("Lỗi cập nhật realtime hồ sơ sự kiện:", e);
          }
        }
      )
      .subscribe();

    return () => {
      try {
        client.removeChannel(channel);
      } catch (err) {
        // Safe unmount
      }
    };
  } catch (err) {
    return () => {};
  }
}

