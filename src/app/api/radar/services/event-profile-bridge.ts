import { EventProfileProof } from "./types";

/**
 * =========================================================================
 * BỘ TÍCH HỢP & GHÉP NỐI HỒ SƠ SỰ KIỆN THỰC TẾ VÀO RADAR SEO (SERVER-SAFE)
 * Phân hệ: src/app/api/radar/services/event-profile-bridge.ts
 * =========================================================================
 * Chức năng:
 * - Lưu trữ danh sách hồ sơ sự kiện tiêu biểu độc bản của Trường Hải Event
 * - Tự động nhận diện chủ đề từ khóa và ghép nối hồ sơ sự kiện phù hợp nhất
 * - Sinh khối Markdown minh chứng (ảnh thực tế, báo giá, testimonial, thiết bị)
 * - Đảm bảo hoạt động an toàn 100% trên cả Server Node.js và Client
 * =========================================================================
 */

export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

/**
 * 5 Hồ sơ sự kiện thực chiến tiêu biểu của Trường Hải Event & Travel
 */
export const SERVER_CURATED_PROFILES: EventProfileProof[] = [
  {
    id: "ep-namhai-auto",
    title: "Lễ Khai Trương Showroom Ô Tô Nam Hải Auto - 250 Khách VIP",
    category: "khai-truong",
    categoryLabel: "Lễ Khai Trương",
    date: "2026-10-23",
    client: {
      name: "Trần Đình Nam",
      company: "Công ty Cổ phần Ô tô Nam Hải",
      representative: "Mr. Trần Đình Nam (Tổng Giám Đốc)",
      phone: "0918 234 567",
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
          unit: "Gói",
          quantity: 1,
          unitPrice: 22000000,
          totalPrice: 22000000,
        },
        {
          id: "cost-3",
          category: "Nghi lễ Khai trương",
          description: "Đội Múa Lân Sư Rồng (2 lân 1 rồng 1 ông địa) + Bộ cắt băng khánh thành 7 dải lụa đỏ hoa sen vàng",
          unit: "Bộ",
          quantity: 1,
          unitPrice: 9500000,
          totalPrice: 9500000,
        },
        {
          id: "cost-4",
          category: "Nhân sự & Lễ tân",
          description: "MC chuyên nghiệp song ngữ + 6 PG đón khách áo dài nhung đỏ + 2 kỹ thuật viên trực âm thanh",
          unit: "Ekip",
          quantity: 1,
          unitPrice: 12500000,
          totalPrice: 12500000,
        },
        {
          id: "cost-5",
          category: "Tiệc Teabreak",
          description: "Tiệc trà bánh ngọt 5 sao, cà phê, trà hoa quả nhiệt đới phục vụ 250 khách",
          unit: "Suất",
          quantity: 250,
          unitPrice: 52000,
          totalPrice: 13000000,
        },
      ],
    },
    keyHighlights: [
      "Khoảnh khắc Keymoment xe ô tô điện lộ diện dưới màn khói lạnh và hiệu ứng pháo sáng điện an toàn",
      "Hệ thống âm thanh Line Array RCF nhập khẩu cho âm trường đồng đều toàn bộ sảnh 1.200m²",
      "Tiệc Teabreak cao cấp bài trí sang trọng theo nhận diện thương hiệu vàng - xanh",
    ],
    equipmentList: [
      "Màn hình LED P3 Outdoor cabin đúc 24m² (6m x 4m)",
      "08 Loa Line Array RCF HDL 20-A (Made in Italy) + 04 Loa Subwoofer RCF SUB 8006-AS",
      "01 Bàn trộn Mixer Digital Behringer X32 kèm Stage Box S16",
      "16 Đèn Moving Head Beam 350W 17R + 12 Đèn Par Led 54 bóng 3W",
      "02 Máy tạo khói lạnh 3000W + 08 Dàn pháo sáng điện tử an toàn trong nhà",
    ],
    coverImage: "/images/blog/khai-truong-showroom.jpg",
    gallery: [
      {
        id: "g-1",
        url: "/images/blog/stage-setup.jpg",
        caption: "Công tác set-up hệ thống âm thanh ánh sáng và căn chỉnh mixer hiện trường lúc 06:00 sáng",
        phase: "setup",
      },
      {
        id: "g-2",
        url: "/images/blog/key-moment.jpg",
        caption: "Nghi thức cắt băng khánh thành khai trương trang trọng với dàn PG chuyên nghiệp",
        phase: "moment",
      },
    ],
    testimonial: {
      author: "Trần Đình Nam",
      position: "Tổng Giám Đốc",
      company: "Công ty Cổ phần Ô tô Nam Hải",
      quote: "Trường Hải Event & Travel đã mang lại một lễ khai trương vô cùng ấn tượng. Màn hình LED sắc nét, âm thanh mượt mà không bị hú rít, và đặc biệt là sự minh bạch 100% trong báo giá, không hề phát sinh bất kỳ khoản phụ phí nào sau sự kiện.",
      rating: 5,
    },
  },
  {
    id: "ep-sungroup-gala",
    title: "Gala Dinner & Kỷ Niệm 15 Năm Thành Lập Sun Group - Khách Sạn Meliá Hà Nội",
    category: "gala-dinner",
    categoryLabel: "Gala Dinner & Kỷ Niệm",
    date: "2026-10-18",
    client: {
      name: "Phạm Thúy Hằng",
      company: "Tập Đoàn Sun Group",
      representative: "Bà Phạm Thúy Hằng (Phó Tổng Giám Đốc Truyền Thông)",
      phone: "0904 567 890",
      industry: "Bất Động Sản, Du Lịch Nghỉ Dưỡng & Vui Chơi Giải Trí",
    },
    location: {
      venue: "Khách sạn Meliá Hà Nội",
      hall: "Grand Ballroom tầng 2",
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
          id: "sg-1",
          category: "Sân khấu & Màn hình 3D",
          description: "Màn hình LED cong P2.5 diện tích 45m² kết hợp sàn sân khấu mica gương bóng",
          unit: "Gói",
          quantity: 1,
          unitPrice: 85000000,
          totalPrice: 85000000,
        },
        {
          id: "sg-2",
          category: "Hệ thống AV hòa nhạc",
          description: "Hệ thống âm thanh hòa nhạc D&B Audiotechnik (Đức), 24 đèn Moving Beam 380W, 16 đèn Profile",
          unit: "Gói",
          quantity: 1,
          unitPrice: 75000000,
          totalPrice: 75000000,
        },
        {
          id: "sg-3",
          category: "Nghệ thuật & Biểu diễn",
          description: "Visual 3D Motion Graphic độc bản + Ban nhạc hòa tấu thính phòng và ca sĩ nổi tiếng",
          unit: "Chương trình",
          quantity: 1,
          unitPrice: 65000000,
          totalPrice: 65000000,
        },
        {
          id: "sg-4",
          category: "Keymoment Tri Ân",
          description: "Mô hình tháp pha lê đúc logo 15 năm, sâm-panh Pháp cao cấp, hiệu ứng laser mapping",
          unit: "Gói",
          quantity: 1,
          unitPrice: 35000000,
          totalPrice: 35000000,
        },
        {
          id: "sg-5",
          category: "Đạo diễn & Vận hành",
          description: "Tổng đạo diễn chương trình, chỉ huy kỹ thuật AV, trợ lý hiện trường",
          unit: "Ekip",
          quantity: 1,
          unitPrice: 20000000,
          totalPrice: 20000000,
        },
      ],
    },
    keyHighlights: [
      "Visual 3D mapping tái hiện hành trình 15 năm kiến tạo kỳ quan của Sun Group",
      "Âm thanh chuẩn thính phòng quốc tế phục vụ 500 khách quý và đối tác nước ngoài",
      "Kịch bản đạo diễn tôn vinh trọn vẹn từng thế hệ cán bộ nhân viên kỳ cựu",
    ],
    equipmentList: [
      "Màn hình LED cong Indoor P2.5 diện tích 45m² Ultra HD",
      "Hệ thống loa D&B Audiotechnik V-Series (Made in Germany) chuẩn hòa nhạc",
      "01 Bàn điều khiển âm thanh DiGiCo SD9 Digital Console",
      "24 Đèn Moving Beam 380W + 16 Đèn Profile LED cắt viền rọi nhân vật",
      "04 Máy chiếu Laser Panasonic 20.000 ANSI Lumens",
    ],
    coverImage: "/images/blog/gala-dinner-melia.jpg",
    gallery: [
      {
        id: "sg-g1",
        url: "/images/blog/gala-dinner-melia.jpg",
        caption: "Không gian tiệc Gala sang trọng đẳng cấp 5 sao tại Grand Ballroom Meliá Hà Nội",
        phase: "setup",
      },
      {
        id: "sg-g2",
        url: "/images/blog/gala-moment.jpg",
        caption: "Khoảnh khắc ban lãnh đạo khui rượu sâm-panh chúc mừng kỷ niệm 15 năm",
        phase: "moment",
      },
      {
        id: "sg-g3",
        url: "/images/blog/gala-dinner-ha-long.jpg",
        caption: "Ban nhạc thính phòng biểu diễn cùng visual 3D trên màn hình LED cong",
        phase: "main",
      },
    ],
    testimonial: {
      author: "Phạm Thúy Hằng",
      position: "Phó Tổng Giám Đốc Truyền Thông",
      company: "Tập Đoàn Sun Group",
      quote: "Đêm Gala 15 năm đã chạm đến trái tim của toàn thể cán bộ nhân viên và đối tác quốc tế. Sự chỉn chu trong kịch bản và sự hoàn hảo về hệ thống âm thanh, ánh sáng của Trường Hải Event & Travel xứng đáng đạt điểm tuyệt đối 10/10.",
      rating: 5,
    },
  },
  {
    id: "ep-fpt-conference",
    title: "Hội Nghị Thượng Đỉnh Công Nghệ AI FPT Software - Trung Tâm Hội Nghị Quốc Gia",
    category: "hoi-nghi",
    categoryLabel: "Hội Nghị & Hội Thảo",
    date: "2026-10-10",
    client: {
      name: "Hoàng Việt Anh",
      company: "FPT Software Toàn Cầu",
      representative: "Mr. Hoàng Việt Anh (Chủ Tịch FPT Telecom / Cố vấn FPT Software)",
      phone: "0988 123 999",
      industry: "Công Nghệ Thông Tin & Phần Mềm Xuất Khẩu",
    },
    location: {
      venue: "Trung tâm Hội nghị Quốc gia NCC",
      hall: "Phòng Khánh Tiết số 1 (Tầng 1)",
      address: "Đại lộ Thăng Long, Mễ Trì, Quận Nam Từ Liêm",
      city: "Hà Nội",
    },
    guestCount: 400,
    financials: {
      totalBudget: 165000000,
      actualCost: 112000000,
      profit: 53000000,
      profitMargin: 32.1,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "fpt-1",
          category: "Tai nghe phiên dịch",
          description: "400 bộ tai nghe hồng ngoại đa kênh kèm 02 cabin dịch cách âm tiêu chuẩn ISO",
          unit: "Bộ",
          quantity: 400,
          unitPrice: 85000,
          totalPrice: 34000000,
        },
        {
          id: "fpt-2",
          category: "Màn hình LED & Livestream",
          description: "Màn hình LED P2.5 trung tâm 32m² + 2 màn phụ cánh gà 12m² + Hệ thống Livestream 4K 3 máy quay",
          unit: "Hệ thống",
          quantity: 1,
          unitPrice: 62000000,
          totalPrice: 62000000,
        },
        {
          id: "fpt-3",
          category: "Âm thanh hội thảo",
          description: "Hệ thống micro cổ ngỗng Bosch DCN 24 máy + Loa cột hội trường Meyer Sound",
          unit: "Gói",
          quantity: 1,
          unitPrice: 38000000,
          totalPrice: 38000000,
        },
        {
          id: "fpt-4",
          category: "Check-in & Backdrop",
          description: "Khu vực check-in QR Code tốc độ cao + Backdrop chụp hình công nghệ cao gắn đèn led neon",
          unit: "Gói",
          quantity: 1,
          unitPrice: 18000000,
          totalPrice: 18000000,
        },
        {
          id: "fpt-5",
          category: "Nhân sự kỹ thuật AV",
          description: "Kỹ sư âm thanh, kỹ sư hình ảnh livestream, điều phối viên hội thảo",
          unit: "Ekip",
          quantity: 1,
          unitPrice: 13000000,
          totalPrice: 13000000,
        },
      ],
    },
    keyHighlights: [
      "Hệ thống cabin dịch cách âm tiêu chuẩn ISO hỗ trợ 2 ngôn ngữ Anh - Việt không gián đoạn",
      "Livestream 4K đa điểm cầu tới các chi nhánh FPT tại Nhật Bản, Mỹ và Singapore",
      "Quy trình check-in quét mã QR tốc độ cao chỉ mất 3 giây/đại biểu",
    ],
    equipmentList: [
      "400 Tai nghe phiên dịch không dây hồng ngoại Bosch Integrus",
      "02 Cabin dịch cách âm tiêu chuẩn quốc tế ISO 4043",
      "Hệ thống Micro cổ ngỗng kỹ thuật số Bosch DCN thế hệ mới",
      "Màn hình LED P2.5 siêu nét tổng diện tích 56m²",
      "Bàn trộn hình Blackmagic Design ATEM Mini Extreme ISO 4K",
    ],
    coverImage: "/images/blog/hoi-nghi-fpt.jpg",
    gallery: [
      {
        id: "fpt-g1",
        url: "/images/blog/hoi-nghi-fpt.jpg",
        caption: "Toàn cảnh hội trường với 400 đại biểu sử dụng tai nghe phiên dịch Bosch",
        phase: "crowd",
      },
      {
        id: "fpt-g2",
        url: "/images/blog/hoi-nghi-khach-hang.jpg",
        caption: "Diễn giả quốc tế chia sẻ chuyên đề AI trên bục phát biểu chuyên nghiệp",
        phase: "main",
      },
      {
        id: "fpt-g3",
        url: "/images/blog/hoi-nghi-fpt.jpg",
        caption: "Khu vực check-in QR Code tự động đón tiếp đại biểu nhanh chóng, văn minh",
        phase: "setup",
      },
    ],
    testimonial: {
      author: "Hoàng Việt Anh",
      position: "Chủ Tịch FPT Telecom",
      company: "FPT Software Toàn Cầu",
      quote: "Sự kiện có sự tham gia của nhiều chuyên gia hàng đầu từ Mỹ và Nhật Bản, yêu cầu độ trễ âm thanh phiên dịch phải bằng 0. Đội ngũ Trường Hải Event đã vận hành hệ thống thiết bị hoàn hảo, khẳng định đẳng cấp chuyên nghiệp.",
      rating: 5,
    },
  },
  {
    id: "ep-viettel-team",
    title: "Teambuilding & Lễ Ra Mắt Chiến Dịch Số - Viettel Telecom Tại Flamingo Đại Lải",
    category: "teambuilding",
    categoryLabel: "Teambuilding & Du Lịch",
    date: "2026-09-26",
    client: {
      name: "Đỗ Minh Phương",
      company: "Tổng Công ty Viễn thông Viettel",
      representative: "Mr. Đỗ Minh Phương (Giám Đốc Khối Kinh Doanh)",
      phone: "0977 888 666",
      industry: "Viễn Thông & Công Nghệ Số",
    },
    location: {
      venue: "Flamingo Đại Lải Resort",
      hall: "Khu vực bãi cỏ trung tâm Opera Hall & Bãi biển nhân tạo",
      address: "Xã Ngọc Thanh, Thành phố Phúc Yên",
      city: "Vĩnh Phúc",
    },
    guestCount: 350,
    financials: {
      totalBudget: 145000000,
      actualCost: 98000000,
      profit: 47000000,
      profitMargin: 32.4,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "vt-1",
          category: "Game tool khổng lồ",
          description: "Bộ dụng cụ game phao hơi liên hoàn độc quyền: Bánh xe khổng lồ, Núi hơi chinh phục, Mê cung đồng đội",
          unit: "Gói",
          quantity: 1,
          unitPrice: 38000000,
          totalPrice: 38000000,
        },
        {
          id: "vt-2",
          category: "Âm thanh dã ngoại & Sân khấu",
          description: "Dàn âm thanh Line Array JBL công suất lớn ngoài trời + Sân khấu di động ngoài trời",
          unit: "Gói",
          quantity: 1,
          unitPrice: 32000000,
          totalPrice: 32000000,
        },
        {
          id: "vt-3",
          category: "MC Hoạt náo & Đội ngũ Facilitator",
          description: "01 MC hoạt náo năng lượng cao + 12 điều phối viên hướng dẫn trạm game",
          unit: "Ekip",
          quantity: 1,
          unitPrice: 28000000,
          totalPrice: 28000000,
        },
        {
          id: "vt-4",
          category: "Đồng phục & Nhận diện",
          description: "350 áo thun thể thao cao cấp in logo chiến dịch + Mũ lưỡi trai + Cờ đội",
          unit: "Bộ",
          quantity: 350,
          unitPrice: 75000,
          totalPrice: 26250000,
        },
        {
          id: "vt-5",
          category: "Quay phim & Flycam",
          description: "Ekip 3 thợ quay chụp chuyên nghiệp, 01 Flycam 4K bắt trọn khoảnh khắc xếp chữ flycam",
          unit: "Gói",
          quantity: 1,
          unitPrice: 20750000,
          totalPrice: 20750000,
        },
      ],
    },
    keyHighlights: [
      "Khoảnh khắc 350 chiến binh Viettel đồng lòng xếp thành biểu tượng logo chuyển đổi số bắt từ Flycam",
      "Kịch bản thử thách vượt chướng ngại vật kích hoạt tinh thần 'Đoàn kết là sức mạnh'",
      "Đêm Gala lửa trại ấm áp gắn kết ban lãnh đạo và các chuyên viên trẻ",
    ],
    equipmentList: [
      "Bộ Game Tool hơi cao cấp xuất xứ Châu Âu (chịu tải 500 người)",
      "Hệ thống Loa Line Array JBL VRX932LAP chống nước ngoài trời",
      "Micro không dây UHF Shure ULXD4D thu phát sóng 200m",
      "Flycam DJI Mavic 3 Cine 5.1K quay toàn cảnh bãi biển",
    ],
    coverImage: "/images/blog/teambuilding-flaming.jpg",
    gallery: [
      {
        id: "vt-g1",
        url: "/images/blog/teambuilding-flaming.jpg",
        caption: "Hoạt động khởi động bùng nổ năng lượng của các chiến binh Viettel Telecom",
        phase: "main",
      },
      {
        id: "vt-g2",
        url: "/images/blog/teambuilding-bai-chay.jpg",
        caption: "Thử thách liên hoàn phao hơi đòi hỏi tinh thần phối hợp đồng đội ăn ý",
        phase: "moment",
      },
      {
        id: "vt-g3",
        url: "/images/blog/key-moment.jpg",
        caption: "Đêm Gala lửa trại ấm áp gắn kết và truyền cảm hứng chiến dịch kinh doanh",
        phase: "crowd",
      },
    ],
    testimonial: {
      author: "Đỗ Minh Phương",
      position: "Giám Đốc Khối Kinh Doanh",
      company: "Tổng Công ty Viễn thông Viettel",
      quote: "Một chương trình teambuilding tràn đầy năng lượng và cảm xúc. Khâu tổ chức của Trường Hải từ di chuyển, đạo cụ game đến kịch bản lửa trại đều được chuẩn bị chu đáo đến từng chi tiết.",
      rating: 5,
    },
  },
  {
    id: "ep-vinfast-launch",
    title: "Lễ Bàn Giao Xe Điện & Tri Ân Khách Hàng VinFast - Trung Tâm Triển Lãm I.C.E",
    category: "khai-truong",
    categoryLabel: "Lễ Ra Mắt & Bàn Giao",
    date: "2026-09-15",
    client: {
      name: "Nguyễn Thị Vân Anh",
      company: "Công ty TNHH Kinh doanh Thương mại & Dịch vụ VinFast",
      representative: "Bà Nguyễn Thị Vân Anh (Giám Đốc Bán Hàng Khu Vực Miền Bắc)",
      phone: "0966 555 444",
      industry: "Sản Xuất & Phân Phối Xe Điện Thông Minh",
    },
    location: {
      venue: "Cung Triển lãm Kiến trúc Quy hoạch Xây dựng Quốc gia (I.C.E)",
      hall: "Khu sảnh chính A1 diện tích 2.000m²",
      address: "Số 01 Đường Đỗ Đức Dục, Quận Nam Từ Liêm",
      city: "Hà Nội",
    },
    guestCount: 600,
    financials: {
      totalBudget: 310000000,
      actualCost: 220000000,
      profit: 90000000,
      profitMargin: 29.0,
      paymentStatus: "paid_full",
      paymentStatusLabel: "Đã tất toán 100%",
      items: [
        {
          id: "vf-1",
          category: "Sân khấu trung tâm & Màn LED",
          description: "Màn hình LED P2.5 kích thước 12m x 4.5m + Sân khấu nâng thủy lực cho xe ô tô điện",
          unit: "Gói",
          quantity: 1,
          unitPrice: 115000000,
          totalPrice: 115000000,
        },
        {
          id: "vf-2",
          category: "Ánh sáng biểu diễn & Kỹ thuật",
          description: "32 đèn Moving Beam, 16 đèn Follow rọi xe, dàn khung Truss nhôm treo đèn khẩu độ 18m",
          unit: "Gói",
          quantity: 1,
          unitPrice: 85000000,
          totalPrice: 85000000,
        },
        {
          id: "vf-3",
          category: "Âm thanh hòa nhạc ngoài trời & sảnh",
          description: "Hệ thống Line Array RCF công suất lớn, âm thanh phân bổ 4 góc đảm bảo đồng đều",
          unit: "Gói",
          quantity: 1,
          unitPrice: 55000000,
          totalPrice: 55000000,
        },
        {
          id: "vf-4",
          category: "Nghi thức trao chìa khóa vàng",
          description: "Mô hình chìa khóa mạ vàng trao xe cho 50 chủ nhân đầu tiên + Pháo điện, khói lạnh",
          unit: "Bộ",
          quantity: 1,
          unitPrice: 32000000,
          totalPrice: 32000000,
        },
        {
          id: "vf-5",
          category: "Đội ngũ phục vụ & An ninh",
          description: "20 PG lễ tân cao cấp + 10 vệ sĩ bảo vệ an ninh phân luồng xe",
          unit: "Ekip",
          quantity: 1,
          unitPrice: 23000000,
          totalPrice: 23000000,
        },
      ],
    },
    keyHighlights: [
      "Bàn nâng thủy lực đưa mẫu xe điện mới xuất hiện ấn tượng từ lòng sân khấu",
      "Nghi thức trao chìa khóa tượng trưng mạ vàng cho 50 khách hàng tiên phong",
      "Khu vực lái thử xe điện ngoài trời với lộ trình chuyên nghiệp",
    ],
    equipmentList: [
      "Màn hình LED P2.5 diện tích 54m² độ sáng cao",
      "Sàn nâng thủy lực chuyên dụng chịu tải 3.5 tấn",
      "Hệ thống khung Truss nhôm hợp kim chịu lực khẩu độ 18m",
      "Hệ thống âm thanh Line Array RCF 12 Full 6 Sub công suất lớn",
    ],
    coverImage: "/images/blog/le-ban-giao-vinfast.jpg",
    gallery: [
      {
        id: "vf-g1",
        url: "/images/blog/le-ban-giao-vinfast.jpg",
        caption: "Không gian lễ bàn giao xe với hệ thống ánh sáng hiện đại chuẩn quốc tế",
        phase: "setup",
      },
      {
        id: "vf-g2",
        url: "/images/blog/stage-setup.jpg",
        caption: "Thời khắc bàn giao xe và chụp hình lưu niệm cùng các khách hàng VIP",
        phase: "moment",
      },
    ],
    testimonial: {
      author: "Nguyễn Thị Vân Anh",
      position: "Giám Đốc Bán Hàng Khu Vực Miền Bắc",
      company: "VinFast",
      quote: "Sự kiện bàn giao xe của VinFast đòi hỏi độ an toàn và tiêu chuẩn kỹ thuật cực kỳ khắt khe. Trường Hải Event & Travel đã hoàn thành xuất sắc nhiệm vụ với hệ thống sân khấu và dàn âm thanh ánh sáng vô cùng ấn tượng.",
      rating: 5,
    },
  },
];

/**
 * Thuật toán ghép nối thông minh: Tự động tìm Hồ sơ sự kiện phù hợp nhất với từ khóa / bài viết
 */
export function findBestMatchingProfile(
  keyword: string,
  explicitId?: string,
  clientProvidedProfile?: EventProfileProof
): EventProfileProof {
  // 1. Ưu tiên dữ liệu hồ sơ sự kiện cụ thể do Client gửi lên
  if (clientProvidedProfile && clientProvidedProfile.title) {
    return clientProvidedProfile;
  }

  // 2. Nếu có chỉ định ID cụ thể
  if (explicitId && explicitId !== "auto") {
    const found = SERVER_CURATED_PROFILES.find((p) => p.id === explicitId);
    if (found) return found;
  }

  // 3. Phân tích ngữ nghĩa từ khóa để tìm hồ sơ tương ứng
  const k = (keyword || "").toLowerCase();

  // Khai trương / Khánh thành / Ra mắt / Showroom
  if (
    k.includes("khai trương") ||
    k.includes("khai truong") ||
    k.includes("khánh thành") ||
    k.includes("khanh thanh") ||
    k.includes("showroom") ||
    k.includes("cửa hàng") ||
    k.includes("ra mắt")
  ) {
    if (k.includes("xe") || k.includes("ô tô") || k.includes("vinfast")) {
      return SERVER_CURATED_PROFILES[4]; // VinFast Launch
    }
    return SERVER_CURATED_PROFILES[0]; // Nam Hải Auto
  }

  // Gala Dinner / Kỷ niệm / Year End Party / Tiệc tất niên
  if (
    k.includes("gala") ||
    k.includes("kỷ niệm") ||
    k.includes("ky niem") ||
    k.includes("yep") ||
    k.includes("year end") ||
    k.includes("tất niên") ||
    k.includes("tat nien") ||
    k.includes("tri ân")
  ) {
    return SERVER_CURATED_PROFILES[1]; // Sun Group Gala
  }

  // Hội nghị / Hội thảo / Seminar / AI / Quốc tế / Diễn đàn
  if (
    k.includes("hội nghị") ||
    k.includes("hoi nghi") ||
    k.includes("hội thảo") ||
    k.includes("hoi thao") ||
    k.includes("seminar") ||
    k.includes("diễn đàn") ||
    k.includes("toạ đàm") ||
    k.includes("tai nghe phiên dịch") ||
    k.includes("phiên dịch") ||
    k.includes("ai")
  ) {
    return SERVER_CURATED_PROFILES[2]; // FPT Conference
  }

  // Teambuilding / Du lịch / Nghỉ dưỡng / Trải nghiệm
  if (
    k.includes("teambuilding") ||
    k.includes("team building") ||
    k.includes("du lịch") ||
    k.includes("du lich") ||
    k.includes("dã ngoại") ||
    k.includes("resort")
  ) {
    return SERVER_CURATED_PROFILES[3]; // Viettel Teambuilding
  }

  // Thuê thiết bị / Màn LED / Loa đài
  if (
    k.includes("thiết bị") ||
    k.includes("thiet bi") ||
    k.includes("màn led") ||
    k.includes("man led") ||
    k.includes("âm thanh") ||
    k.includes("am thanh") ||
    k.includes("ánh sáng")
  ) {
    return SERVER_CURATED_PROFILES[1]; // Sun Group Gala (Hệ thống AV cao cấp nhất)
  }

  // Mặc định trả về hồ sơ Nam Hải Auto
  return SERVER_CURATED_PROFILES[0];
}

/**
 * Sinh khối Markdown minh chứng dự án thực tế để nhúng vào bài viết chuẩn SEO E-E-A-T
 */
export function renderEventProofMarkdown(
  profile: EventProfileProof,
  options: {
    includeImages?: boolean;
    includePricing?: boolean;
    includeTestimonial?: boolean;
  } = {}
): string {
  const { includeImages = true, includePricing = true, includeTestimonial = true } = options;
  const budgetStr = formatVND(profile.financials.totalBudget);

  // Lọc các ảnh trong gallery khác hoàn toàn với ảnh bìa chính (coverImage) để tránh lặp ảnh
  const distinctGallery = (profile.gallery || []).filter(
    (item) => item.url && item.url.trim() !== (profile.coverImage || "").trim()
  );

  let imagesBlock = "";
  if (includeImages && distinctGallery.length > 0) {
    const proofImg1 = distinctGallery[0];
    imagesBlock += `\n![${proofImg1.caption}](${proofImg1.url})\n*Hình ảnh thực tế hiện trường: ${proofImg1.caption}*\n`;
    if (distinctGallery.length > 1 && distinctGallery[1].url !== proofImg1.url) {
      const proofImg2 = distinctGallery[1];
      imagesBlock += `\n![${proofImg2.caption}](${proofImg2.url})\n*Hình ảnh: ${proofImg2.caption}*\n`;
    }
  }

  const pricingBlock =
    includePricing && profile.financials?.items && profile.financials.items.length > 0
      ? `
### Bảng bóc tách chi phí thực tế dự án

Một trong những thế mạnh cốt lõi khẳng định sự tin cậy của **Trường Hải Event & Travel** là chính sách **báo giá minh bạch, bóc tách cụ thể từng hạng mục kỹ thuật và cam kết bằng văn bản không phát sinh bất kỳ khoản phụ phí nào**. Dưới đây là bảng bóc tách chi phí thực tế của dự án:

| STT | Hạng mục triển khai | Chi tiết kỹ thuật | Số lượng | Thành tiền |
| :---: | :--- | :--- | :---: | :---: |
${profile.financials.items
  .slice(0, 5)
  .map(
    (item, idx) =>
      `| ${idx + 1} | **${item.category}** | ${item.description} | ${item.quantity} ${item.unit} | ${formatVND(item.totalPrice)} |`
  )
  .join("\n")}
| | **TỔNG CỘNG HỢP ĐỒNG** | *(Cam kết minh bạch 100% không phát sinh)* | | **${budgetStr}** |
`
      : "";

  const testimonialBlock =
    includeTestimonial && profile.testimonial
      ? `
### Đánh giá từ khách hàng đối tác

> *" ${profile.testimonial.quote} "*
>
> **— ${profile.testimonial.author}**, ${profile.testimonial.position} tại ${profile.testimonial.company}
`
      : "";

  return `
---

### Dự án thực tế tiêu biểu: ${profile.title}
${imagesBlock}
Kinh nghiệm tổ chức thành công hàng trăm sự kiện lớn nhỏ cho các tập đoàn và cơ quan nhà nước chính là bảo chứng vững chắc nhất cho năng lực thực chiến của **Trường Hải Event & Travel**. Điển hình là dự án **${profile.title}** được triển khai trọn gói thành công rực rỡ:

- **Khách hàng đối tác:** **${profile.client.company}** (Đại diện: ${profile.client.representative || profile.client.name || "Ban Lãnh Đạo"})
- **Địa điểm tổ chức:** ${profile.location.venue} (${profile.location.address}, ${profile.location.city})
- **Quy mô khách mời:** **${profile.guestCount} khách VIP**
- **Trang thiết bị sở hữu trực tiếp:** ${profile.equipmentList.slice(0, 4).join(", ")}
- **Tổng ngân sách dự án:** **${budgetStr}** (Báo giá trọn gói bóc tách, cam kết không phát sinh phụ phí sau sự kiện)
${pricingBlock}
${testimonialBlock}
`.trim();
}
