export interface ServiceDetail {
  id: string;
  title: string;
  category: "su-kien" | "du-lich";
  tag: string;
  badge?: string;
  priceNote: string;
  shortDesc: string;
  description: string;
  imageUrl: string;
  highlights: string[];
  equipmentList: {
    category: string;
    items: string[];
  }[];
  workflow: {
    step: number;
    title: string;
    desc: string;
  }[];
  targetAudience: string;
}

export interface PromotionCombo {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: "su-kien" | "du-lich" | "all";
  serviceGroup: string;
  originalPrice: string;
  comboPrice: string;
  discountBadge: string;
  savings: string;
  validUntil: string;
  giftItems: string[];
  conditions: string[];
  recommendedFor: string;
  isPopular?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  scale: string;
  priceDisplay: string;
  unit: string;
  description: string;
  isFeatured?: boolean;
  features: string[];
  unsupportedFeatures?: string[];
  ctaText: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// 9 DANH MỤC DỊCH VỤ CHI TIẾT ĐÓNG GÓI CHUẨN HOÁ
export const CORE_SERVICES: ServiceDetail[] = [
  {
    id: "le-khai-truong",
    title: "Lễ Khai Trương",
    category: "su-kien",
    tag: "Lễ khai trương",
    badge: "Dịch Vụ Mũi Nhọn",
    priceNote: "Liên hệ nhận báo giá ngay",
    shortDesc:
      "Giải pháp tổ chức Lễ Khai Trương (Grand Opening) chuẩn phong thủy, thu hút truyền thông và kích hoạt tài lộc cho showroom, cửa hàng, chi nhánh mới.",
    description:
      "Trường Hải Event & Travel mang đến quy trình tổ chức Lễ Khai Trương chỉn chu từ ý tưởng, kịch bản nghi lễ phong thủy đến dàn dựng sân khấu, thảm đỏ, cổng chào hơi, âm thanh ánh sáng và đội múa Lân Sư Rồng khai quang điểm nhãn, giúp thương hiệu tạo dấu ấn bùng nổ ngay ngày đầu ra mắt.",
    imageUrl:
      "/images/projects/khai-truong-cuong-phat.jpg",
    highlights: [
      "Kịch bản nghi lễ khai trương chuẩn phong thủy, cắt băng hồng phát",
      "Đội múa Lân Sư Rồng Tứ Quý Hưng Long, Trống hội khai trường rộn rã",
      "Bộ khay cắt băng khai trương bọc lụa đỏ hoa mẫu đơn & kéo vàng VIP",
      "Tiệc trà Teabreak bánh ngọt Pháp, trái cây nhiệt đới đón tiếp khách quý",
      "MC hoạt náo & dàn PG lễ tân ngoại hình chuẩn mực đón khách tận tâm",
    ],
    equipmentList: [
      {
        category: "Khu vực Đón khách & Check-in",
        items: [
          "Cổng chào hơi hoặc cổng bóng nghệ thuật theo màu nhận diện thương hiệu",
          "Thảm đỏ trải dọc lối đón khách vào khu vực lễ đài trung tâm",
          "Backdrop / Photobooth 3D nổi khối chụp hình lưu niệm",
          "Bàn lễ tân đón khách bọc khăn sang trọng kèm hoa tươi",
        ],
      },
      {
        category: "Sân khấu & Nghi thức Khai trương",
        items: [
          "Sân khấu lắp ghép bọc thảm đỏ mới 100%, bục phát biểu gắn logo",
          "Hệ thống âm thanh công suất lớn, micro không dây UHF bắt sóng xa",
          "Bộ dụng cụ cắt băng khai trương, pháo điện kim tuyến khoảnh khắc vàng",
          "Nhà dù tròn / Nhà bạt không gian che nắng mưa cho khách mời",
        ],
      },
      {
        category: "Nhân sự & Truyền thông",
        items: [
          "MC chuyên nghiệp dẫn dắt chương trình và minigame bốc thăm trúng thưởng",
          "Đội Lân Sư Rồng múa chúc phúc, xông đất rước tài lộc vào cửa hàng",
          "Ekip chụp ảnh, quay phim Highlight 4K phục vụ truyền thông thương hiệu",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Tiếp nhận & Khảo sát", desc: "Khảo sát mặt bằng mặt tiền cửa hàng/showroom, hướng đặt sân khấu và nguồn điện." },
      { step: 2, title: "Thiết kế 3D & Kịch bản", desc: "Lên thiết kế Backdrop 3D và kịch bản chi tiết từng khung giờ đẹp theo phong thủy." },
      { step: 3, title: "Dự toán minh bạch", desc: "Bóc tách rõ ràng từng hạng mục thiết bị, nhân sự, tiệc trà, cam kết không phát sinh." },
      { step: 4, title: "Thi công trước giờ G", desc: "Hoàn thiện lắp đặt sân khấu, âm thanh, backdrop trước 12-24h để kiểm tra kỹ thuật." },
      { step: 5, title: "Điều phối ngày lễ", desc: "Đạo diễn điều phối múa lân, lễ tân, nghi thức cắt băng và hoạt náo thu hút khách." },
      { step: 6, title: "Nghiệm thu & Bàn giao Media", desc: "Thu dọn mặt bằng gọn gàng và bàn giao bộ ảnh/video truyền thông sắc nét." },
    ],
    targetAudience: "Showroom ô tô, chi nhánh ngân hàng, thẩm mỹ viện, spa, chuỗi cửa hàng thời trang, F&B, văn phòng đại diện mới.",
  },
  {
    id: "le-khanh-thanh",
    title: "Lễ Khánh Thành",
    category: "su-kien",
    tag: "Lễ khánh thành",
    badge: "Quy Mô Trọng Thể",
    priceNote: "Liên hệ nhận báo giá ngay",
    shortDesc:
      "Tổ chức trọng thể Lễ Khánh Thành nhà máy, khu công nghiệp, công trình giao thông và dự án trọng điểm với quy chuẩn nghi lễ cấp cao.",
    description:
      "Lễ Khánh Thành là cột mốc khẳng định tầm vóc và năng lực đầu tư của doanh nghiệp. Trường Hải Event & Travel sở hữu kho nhà bạt không gian hợp kim nhôm hàng ngàn mét vuông, màn hình LED ngoài trời siêu sáng và đội ngũ đạo diễn dày dạn kinh nghiệm điều phối các đại lễ đón tiếp lãnh đạo Bộ, Ban, Ngành và đối tác quốc tế.",
    imageUrl:
      "/images/projects/khanh-thanh-eiffel-damsan.jpg",
    highlights: [
      "Hệ thống nhà bạt không gian hợp kim nhôm T6061 khẩu độ lớn 12m - 20m kiên cố",
      "Nghi thức nhấn nút / cắt băng khánh thành kết hợp hiệu ứng pháo điện, khói CO2",
      "Màn hình LED P3.91 Outdoor chống nước độ sáng cao & dàn loa Line Array",
      "Quy trình đón tiếp đại biểu VIP, bố trí sơ đồ chỗ ngồi chuẩn nghi thức ngoại giao",
      "Đảm bảo an toàn kết cấu, PCCC và phương án dự phòng thời tiết 100%",
    ],
    equipmentList: [
      {
        category: "Không gian Nhà bạt & Sảnh đón",
        items: [
          "Nhà bạt không gian hợp kim nhôm trần la phông trắng - vàng kem sang trọng",
          "Hệ thống làm mát công nghiệp / điều hòa cây công suất lớn",
          "Cổng chào 3D khung Truss kiên cố, thảm đỏ dẫn lối và hàng rào inox mạ vàng",
          "Bàn ghế Banquet bọc nơ đồng bộ theo màu nhận diện thương hiệu",
        ],
      },
      {
        category: "Sân khấu & Nghi lễ Khánh thành",
        items: [
          "Sân khấu chịu lực tải trọng cao, màn hình LED trung tâm và 2 cánh phụ",
          "Bục nhấn nút quả cầu LED khánh thành + Bộ cắt băng khánh thành VIP",
          "Hệ thống pháo điện, máy bắn kim tuyến và trống hội chào mừng",
        ],
      },
      {
        category: "Hậu cần & Tiệc chiêu đãi",
        items: [
          "Tiệc trà Teabreak hoặc tiệc mặn Set Menu / Buffet tại khuôn viên nhà máy",
          "Xe điện / xe đưa đón đại biểu tham quan dây chuyền nhà máy",
          "Quay phim Flycam toàn cảnh công trình và truyền hình trực tiếp lên màn LED",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Khảo sát thực địa công trình", desc: "Đo đạc diện tích mặt bằng nhà máy/dự án, kiểm tra sức gió, nền đất và nguồn điện 3 pha." },
      { step: 2, title: "Bản vẽ Layout 2D & Phối cảnh 3D", desc: "Lên sơ đồ phân khu đón khách, nhà bạt, sân khấu, lối thoát hiểm và lộ trình tham quan." },
      { step: 3, title: "Lập phương án an toàn & Dự toán", desc: "Báo giá chi tiết từng hạng mục kèm hồ sơ kiểm định an toàn thiết bị, nhà bạt." },
      { step: 4, title: "Thi công dàn dựng trước 2-3 ngày", desc: "Vận chuyển và lắp dựng nhà bạt, sân khấu, âm thanh ánh sáng hoàn tất sớm để tổng duyệt." },
      { step: 5, title: "Tổng duyệt & Vận hành đại lễ", desc: "Phối hợp chặt chẽ cùng ban tổ chức điều phối nghi lễ trang nghiêm, chuẩn xác từng giây." },
      { step: 6, title: "Tháo dỡ an toàn & Quyết toán", desc: "Hoàn trả mặt bằng sạch sẽ, bàn giao phim tư liệu khánh thành và hoàn tất chứng từ VAT." },
    ],
    targetAudience: "Nhà máy sản xuất, khu công nghiệp, công trình giao thông, cầu đường, tòa nhà văn phòng, bệnh viện, trường học, dự án năng lượng.",
  },
  {
    id: "hoi-nghi-hoi-thao",
    title: "Hội Nghị, Hội Thảo",
    category: "su-kien",
    tag: "Hội nghị, Hội thảo",
    badge: "Chuẩn Quốc Tế",
    priceNote: "Dự toán linh hoạt theo quy mô",
    shortDesc:
      "Giải pháp tổ chức Hội nghị khách hàng, Hội thảo khoa học, Đại hội đồng cổ đông và Lễ ra mắt sản phẩm chuẩn mực, trang trọng và hiệu quả.",
    description:
      "Tổ chức Hội nghị, Hội thảo đòi hỏi sự chuẩn xác tuyệt đối về âm thanh đàm thoại, chất lượng hiển thị tài liệu thuyết trình và quy trình đón tiếp đại biểu. Trường Hải Event & Travel cung cấp hạ tầng trình chiếu LED 4K, hệ thống micro hội thảo chống hú rè 100%, cổng check-in QR Code tự động và đội ngũ điều phối chuyên nghiệp.",
    imageUrl:
      "/images/projects/hoi-nghi-the-k-park.jpg",
    highlights: [
      "Hệ thống check-in quét mã QR tốc độ cao, in thẻ tên đại biểu ngay tại sảnh",
      "Âm thanh hội nghị tiêu chuẩn quốc tế, micro cổ ngỗng chủ tọa & đại biểu",
      "Màn hình LED P2.5 Indoor siêu nét, Stage Monitor nhắc bài & bút trình chiếu",
      "Không gian trưng bày sản phẩm, photobooth đón khách và tiệc trà Teabreak",
      "MC song ngữ Anh - Việt, cabin dịch thuật và livestream đa nền tảng",
    ],
    equipmentList: [
      {
        category: "Hạ tầng Trình chiếu & Hội thảo",
        items: [
          "Màn hình LED P2.5 độ phân giải 4K hiển thị sắc nét biểu đồ và văn bản nhỏ",
          "Hệ thống micro cổ ngỗng bàn chủ tọa, micro không dây truyền tay phần Q&A",
          "Màn hình nhắc bài (Confidence Monitor) đặt trước bàn đại biểu và diễn giả",
          "Bộ xử lý hình ảnh NovaStar chuyển đổi mượt mà giữa slide, video và camera",
        ],
      },
      {
        category: "Khu vực Sảnh đón & Check-in",
        items: [
          "Quầy lễ tân check-in QR Code tự động phân luồng ghế ngồi VIP",
          "Backdrop chụp hình giao lưu, standee điện tử chỉ dẫn lối đi",
          "Đội ngũ PG lễ tân trang phục áo dài / vest lịch sự, giao tiếp ngoại ngữ tốt",
        ],
      },
      {
        category: "Tài liệu, Quà tặng & Tiệc trà",
        items: [
          "Thiết kế và in ấn bộ tài liệu hội thảo, thẻ đeo đại biểu, túi quà tặng",
          "Tiệc trà Teabreak giữa giờ với bánh ngọt, trái cây tươi, trà & cafe cao cấp",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Xác định mục tiêu & Quy mô", desc: "Thống nhất số lượng đại biểu, tính chất hội nghị và yêu cầu kỹ thuật đặc thù." },
      { step: 2, title: "Khảo sát hội trường / Khách sạn", desc: "Tư vấn phòng hội nghị 4-5 sao phù hợp và lên sơ đồ bố trí bàn ghế (Theater, Classroom, U-Shape)." },
      { step: 3, title: "Thiết kế ấn phẩm đồng bộ", desc: "Thiết kế Key Visual, thư mời, thẻ đại biểu, backdrop và khung trình chiếu slide." },
      { step: 4, title: "Lắp đặt & Test tín hiệu", desc: "Setup thiết bị hoàn tất trước sự kiện, chạy thử toàn bộ slide và âm thanh cùng diễn giả." },
      { step: 5, title: "Đón tiếp & Điều phối phiên họp", desc: "Lễ tân đón khách, kỹ thuật viên trực điều khiển slide, ánh sáng và ghi hình xuyên suốt." },
      { step: 6, title: "Tổng kết & Bàn giao dữ liệu", desc: "Bàn giao danh sách khách check-in, video ghi hình toàn văn hội thảo và album ảnh." },
    ],
    targetAudience: "Tập đoàn, ngân hàng, công ty cổ phần tổ chức ĐHĐCĐ, hiệp hội ngành nghề, viện nghiên cứu, trường đại học, công ty dược phẩm & BĐS.",
  },
  {
    id: "tiec-tat-nien-yep-gala-dinner",
    title: "Tiệc Tất Niên - Y.E.P, Gala Dinner",
    category: "su-kien",
    tag: "Tiệc tất niên - Y.E.P, Gala Dinner",
    badge: "Được Đặt Nhiều Nhất",
    priceNote: "Liên hệ nhận báo giá trọn gói",
    shortDesc:
      "Đêm tiệc Year End Party & Gala Dinner thăng hoa cảm xúc, tôn vinh những cống hiến xuất sắc và bùng nổ nhiệt huyết với concept độc bản.",
    description:
      "Tiệc Tất Niên (Y.E.P) và Gala Dinner là sự kiện văn hóa quan trọng nhất khép lại một năm nỗ lực của doanh nghiệp. Trường Hải Event & Travel kiến tạo không gian đại tiệc lộng lẫy với kịch bản vinh danh chạm cảm xúc, hiệu ứng Visual LED 3D sống động cùng bữa tiệc âm nhạc - ánh sáng bùng nổ gắn kết mọi thành viên.",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Concept độc bản cá nhân hóa theo thông điệp thương hiệu từng doanh nghiệp",
      "Đạo diễn sân khấu, âm thanh Line Array & ánh sáng Beam/Laser hoành tráng",
      "Kịch bản lễ vinh danh nhân sự xuất sắc trang trọng, xúc động và tự hào",
      "Game show sân khấu vui nhộn & phần mềm quay số Lucky Draw trên màn LED",
      "Cung cấp MC Gala, ca sĩ, nhóm nhảy, ban nhạc Acoustic và DJ chuyên nghiệp",
    ],
    equipmentList: [
      {
        category: "Sân khấu, Âm thanh & Ánh sáng biểu diễn",
        items: [
          "Dàn loa Line Array công suất lớn phục vụ từ 100 đến 3.000 khách dự tiệc",
          "Hệ thống đèn Moving Head Beam, Par LED, Blinder, đèn Follow rọi vinh danh",
          "Máy tạo khói lạnh CO2, pháo điện kim tuyến cho khoảnh khắc khai tiệc",
        ],
      },
      {
        category: "Màn hình LED & Visual Nghệ thuật",
        items: [
          "Màn hình LED P2.5 siêu nét (màn chính + cánh phụ) tạo chiều sâu sân khấu",
          "Thiết kế trọn bộ Visual Motion Graphic, Intro vinh danh và nhạc hiệu trao giải",
        ],
      },
      {
        category: "Khu vực Check-in & Quà tặng vinh danh",
        items: [
          "Photobooth 3D chụp hình thảm đỏ, đèn hắt sáng và phụ kiện hashtag cầm tay",
          "Cúp pha lê vinh danh khắc tên, bằng khen và hoa tươi trao thưởng",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Thấu hiểu văn hóa doanh nghiệp", desc: "Lắng nghe câu chuyện thành tựu trong năm và thông điệp Ban lãnh đạo muốn gửi gắm." },
      { step: 2, title: "Đề xuất Concept & Key Visual", desc: "Trình bày ý tưởng chủ đạo, thiết kế 3D khu vực check-in và sân khấu Gala." },
      { step: 3, title: "Xây dựng kịch bản & Tiết mục", desc: "Lên timeline chi tiết từng phút, hỗ trợ biên đạo tiết mục cây nhà lá vườn cho nhân sự." },
      { step: 4, title: "Dàn dựng & Chạy thử chương trình", desc: "Lắp đặt hoàn thiện hệ thống nghe nhìn và tổng duyệt Rehearsal kỹ lưỡng." },
      { step: 5, title: "Bùng nổ đêm tiệc Gala", desc: "Đạo diễn điều phối nhịp nhàng phần lễ trang trọng và phần hội sôi động hết mình." },
      { step: 6, title: "Hậu kỳ Video Highlight 4K", desc: "Gửi tặng video tổng kết đầy cảm xúc và bộ ảnh kỷ niệm sắc nét của toàn công ty." },
    ],
    targetAudience: "Doanh nghiệp, tập đoàn, ngân hàng, nhà máy, hệ thống bán lẻ tổ chức tiệc tổng kết cuối năm, Gala kỷ niệm hoặc tiệc tri ân khách hàng.",
  },
  {
    id: "team-building",
    title: "Team Building",
    category: "du-lich",
    tag: "Team Building",
    badge: "Gắn Kết Đội Ngũ",
    priceNote: "Liên hệ nhận báo giá theo đoàn",
    shortDesc:
      "Chương trình Team Building bãi biển, resort, dã ngoại kết hợp Tour du lịch MICE bứt phá giới hạn, tiếp lửa đam mê và thắt chặt tình đồng đội.",
    description:
      "Trường Hải Event & Travel sở hữu kho đạo cụ Game hơi khổng lồ cùng đội ngũ MC Team Building giàu năng lượng. Chúng tôi thiết kế các kịch bản thử thách sáng tạo (Amazing Race, Chinh Phục Đỉnh Cao, Vươn Ra Biển Lớn, Quân Đội...) kết hợp trọn gói dịch vụ lữ hành, lưu trú resort 4-5 sao và xe du lịch đời mới.",
    imageUrl:
      "/images/projects/team-building-dia-oc-tl.jpg",
    highlights: [
      "Kho đạo cụ phao hơi khổng lồ đa dạng, an toàn và liên tục cập nhật trò mới",
      "Kịch bản Game thiết kế riêng giúp giải quyết bài toán gắn kết các phòng ban",
      "MC Team Building nhiệt huyết, hài hước và truyền tải sâu sắc thông điệp lãnh đạo",
      "Trọn gói Tour nghỉ dưỡng, khách sạn 4-5 sao, Gala Dinner và xe đưa đón 7-45 chỗ",
      "Ekip quay phim Flycam xếp hình thương hiệu trên bãi biển cực kỳ ấn tượng",
    ],
    equipmentList: [
      {
        category: "Đạo cụ Trò chơi & Sân bãi",
        items: [
          "Cổng hơi xuất phát - về đích, bộ phao hơi liên hoàn, bóng Yoga khổng lồ",
          "Áo lưới chia đội đa sắc màu, cờ đội, băng rôn cổ vũ và đạo cụ trí tuệ",
          "Backdrop sân khấu bãi biển / sân cỏ và hệ thống âm thanh ngoài trời công suất lớn",
        ],
      },
      {
        category: "Dịch vụ Lữ hành & Lưu trú đi kèm",
        items: [
          "Đội xe du lịch 16, 29, 35, 45 chỗ Hyundai Universe đời mới đưa đón tận nơi",
          "Đặt phòng Resort / Khách sạn 3-5 sao và thực đơn nhà hàng chất lượng",
          "Nước uống, mũ du lịch, thuốc y tế và bảo hiểm du lịch mức cao nhất",
        ],
      },
      {
        category: "Media & Lưu giữ khoảnh khắc",
        items: [
          "Flycam bay chụp đội hình xếp chữ logo công ty từ trên cao",
          "Nhiếp ảnh gia bám sát từng đội chơi bắt trọn nụ cười và tinh thần đồng đội",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Phân tích đặc thù nhân sự", desc: "Tìm hiểu số lượng, độ tuổi, ngành nghề và mục tiêu gắn kết của doanh nghiệp." },
      { step: 2, title: "Tư vấn địa điểm & Lịch trình", desc: "Đề xuất bãi biển, khu sinh thái hoặc resort phù hợp ngân sách (Hạ Long, Sapa, Đà Nẵng, Ninh Bình...)." },
      { step: 3, title: "Thiết kế ma trận Game", desc: "Xây dựng 4-5 trạm thử thách từ khởi động, tăng tốc, phối hợp đến bứt phá về đích." },
      { step: 4, title: "Chuẩn bị đạo cụ & Hậu cần", desc: "Kiểm tra an toàn toàn bộ phao hơi, âm thanh, phương tiện di chuyển và phòng nghỉ." },
      { step: 5, title: "Triển khai bùng nổ năng lượng", desc: "MC và đội ngũ hoạt náo viên điều phối cuộc chơi công bằng, an toàn và cuồng nhiệt." },
      { step: 6, title: "Trao giải & Bàn giao Media", desc: "Tổng kết trao cúp vô địch và bàn giao video/hình ảnh truyền thông nội bộ." },
    ],
    targetAudience: "Các công ty, tập đoàn, ngân hàng, trường học, tổ chức đoàn thể muốn tổ chức ngày hội gắn kết nhân sự hoặc kỳ nghỉ hè thường niên.",
  },
  {
    id: "trung-thu",
    title: "Trung Thu",
    category: "su-kien",
    tag: "Trung Thu",
    badge: "Đêm Hội Trăng Rằm",
    priceNote: "Liên hệ nhận báo giá trọn gói",
    shortDesc:
      "Tổ chức Đêm Hội Trăng Rằm lung linh sắc màu truyền thống kết hợp hiện đại dành cho doanh nghiệp, khu đô thị, chung cư và trường học.",
    description:
      "Tết Trung Thu là dịp để doanh nghiệp và ban quản lý khu đô thị thể hiện sự quan tâm sâu sắc tới thế hệ mầm non và gia đình cư dân. Trường Hải Event & Travel mang đến không gian cổ tích rực rỡ với đèn ông sao, mâm cỗ trông trăng, hoạt cảnh Chú Cuội – Chị Hằng, múa Lân Sư Rồng và hàng loạt gian hàng dân gian hấp dẫn.",
    imageUrl:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "MC hóa thân Chú Cuội – Chị Hằng duyên dáng, hoạt náo vui nhộn cùng các bé",
      "Múa Lân Sư Rồng, trống hội rước đèn ông sao và nghi thức phá cỗ trông trăng",
      "Gian hàng dân gian: Nghệ nhân nặn tò he, làm đèn lồng, vẽ mặt nạ, tô tượng",
      "Tiết mục biểu diễn xiếc thú, ảo thuật biến hóa, chú hề vặn bóng nghệ thuật",
      "Trang trí backdrop tiểu cảnh cung trăng, đèn lồng rực rỡ và mâm ngũ quả nghệ thuật",
    ],
    equipmentList: [
      {
        category: "Trang trí Không gian & Sân khấu",
        items: [
          "Backdrop tiểu cảnh Đêm Hội Trăng Rằm, cổng bóng nghệ thuật, đèn lồng Hội An",
          "Sân khấu trải thảm, âm thanh ánh sáng rực rỡ sắc màu lễ hội",
          "Mâm ngũ quả nghệ thuật cắt tỉa tinh xảo và bàn bày quà phá cỗ",
        ],
      },
      {
        category: "Gian hàng Trải nghiệm Dân gian",
        items: [
          "Gian hàng tre trúc truyền thống: Nặn tò he, viết thư pháp, làm bánh dẻo",
          "Khu vực trò chơi dân gian: Ô ăn quan, bịt mắt đánh trống, ném vòng cổ chai",
        ],
      },
      {
        category: "Nhân sự Biểu diễn & Hoạt náo",
        items: [
          "Cặp đôi MC Chú Cuội - Chị Hằng, đội múa Lân Sư Rồng - Ông Địa",
          "Ảo thuật gia, nghệ sĩ xiếc, vũ đoàn thiếu nhi và mascot Thỏ Ngọc đón khách",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Khảo sát không gian tổ chức", desc: "Đánh giá diện tích sảnh tòa nhà, sân trường, khu đô thị hoặc hội trường công ty." },
      { step: 2, title: "Lên Concept & Kịch bản", desc: "Thiết kế chủ đề Trung Thu ấm áp, phân bổ thời lượng hợp lý giữa trò chơi và biểu diễn." },
      { step: 3, title: "Chuẩn bị gian hàng & Quà tặng", desc: "Sắp xếp nguyên vật liệu gian hàng thủ công, bánh kẹo phá cỗ và phần quà cho bé." },
      { step: 4, title: "Thi công trang trí tiểu cảnh", desc: "Lắp đặt sân khấu, đèn lồng, cổng bóng hoàn thiện sớm để các gia đình chụp ảnh check-in." },
      { step: 5, title: "Tổ chức Đêm hội & Phá cỗ", desc: "Chú Cuội - Chị Hằng dẫn dắt trò chơi, múa lân rước đèn và phát quà an toàn, trật tự." },
      { step: 6, title: "Dọn dẹp & Bàn giao hình ảnh", desc: "Thu dọn vệ sinh sạch sẽ và gửi toàn bộ hình ảnh kỷ niệm lung linh của các bé." },
    ],
    targetAudience: "Công đoàn các doanh nghiệp, tập đoàn, Ban quản lý chung cư, khu đô thị, trường mầm non, tiểu học và trung tâm thương mại.",
  },
  {
    id: "tet-thieu-nhi",
    title: "Tết Thiếu Nhi",
    category: "su-kien",
    tag: "Tết thiếu nhi",
    badge: "Thế Giới Tuổi Thơ",
    priceNote: "Liên hệ nhận báo giá trọn gói",
    shortDesc:
      "Tổ chức ngày hội Quốc tế Thiếu nhi 1/6 và Family Day ngập tràn niềm vui, kích thích sự sáng tạo và gắn kết gia đình cán bộ nhân viên.",
    description:
      "Chương trình Tết Thiếu Nhi 1/6 do Trường Hải Event & Travel tổ chức biến không gian doanh nghiệp hoặc khu nghỉ dưỡng thành công viên giải trí thu nhỏ. Với chuỗi trò chơi vận động, góc sáng tạo khoa học – nghệ thuật và các màn trình diễn kỳ thú, các bé sẽ có một mùa hè đáng nhớ bên bố mẹ.",
    imageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Concept trang trí rực rỡ: Vương Quốc Kẹo Ngọt, Siêu Anh Hùng, Khám Phá Đại Dương...",
      "Biểu diễn bong bóng xà phòng khổng lồ, ảo thuật tương tác và xiếc tung hứng",
      "Khu vui chơi liên hoàn: Nhà phao, hồ câu cá, góc tô màu, làm slime, vẽ mặt",
      "MC hoạt náo tổ chức các trò chơi gia đình bố mẹ và bé cùng tranh tài",
      "Quầy tiệc ngọt Teabreak Kids (bông Gòn, bỏng ngô, xúc xích, trái cây, kem tươi)",
    ],
    equipmentList: [
      {
        category: "Khu vực Sân khấu & Trang trí",
        items: [
          "Backdrop check-in chủ đề hoạt hình kèm trang trí bóng bay nghệ thuật Free-style",
          "Hệ thống âm thanh, ánh sáng sân khấu và màn hình chiếu hoạt hình vui nhộn",
          "Mascot gấu bông khổng lồ chào đón và giao lưu chụp ảnh cùng các bé",
        ],
      },
      {
        category: "Khu Trò chơi & Trải nghiệm",
        items: [
          "Nhà hơi lâu đài, cổng hơi, đạo cụ trò chơi vận động gia đình",
          "Bàn ghế thiếu nhi cho khu vực Workshop thủ công (tô tượng, tranh cát, hạt vòng)",
        ],
      },
      {
        category: "Ẩm thực & Quà tặng thiếu nhi",
        items: [
          "Quầy kẹo bông gòn, bỏng ngô, nước ép trái cây và bánh ngọt",
          "Gói quà tặng 1/6 theo độ tuổi và huy chương vinh danh bé tài năng",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Phân loại độ tuổi các bé", desc: "Thống kê số lượng bé theo từng nhóm tuổi (mầm non, tiểu học, THCS) để chọn trò chơi phù hợp." },
      { step: 2, title: "Thiết kế Concept & Phân khu", desc: "Lên phương án trang trí không gian và phân chia khu sân khấu, khu workshop, khu ẩm thực." },
      { step: 3, title: "Chuẩn bị đạo cụ & Quà tặng", desc: "Kiểm tra an toàn chất liệu đồ chơi, thực phẩm tiệc ngọt và đóng gói quà tặng chu đáo." },
      { step: 4, title: "Setup không gian rực rỡ", desc: "Hoàn thiện trang trí bóng nghệ thuật, sân khấu và âm thanh trước giờ đón các bé." },
      { step: 5, title: "Hoạt náo & Trao thưởng", desc: "Tổ chức chuỗi hoạt động sôi nổi, trao học bổng tuyên dương con em đạt thành tích học tập tốt." },
      { step: 6, title: "Tổng kết & Bàn giao ảnh", desc: "Gửi tặng bộ ảnh khoảnh khắc gia đình hạnh phúc và thu dọn mặt bằng sạch sẽ." },
    ],
    targetAudience: "Doanh nghiệp tổ chức ngày hội 1/6 và lễ tuyên dương học sinh giỏi cho con CBNV, khu đô thị, trường học, trung tâm tiếng Anh.",
  },
  {
    id: "thiet-bi-su-kien",
    title: "Hình Ảnh & Thiết Bị Sự Kiện",
    category: "su-kien",
    tag: "Hình ảnh Thiết bị sự kiện",
    badge: "Kho Thiết Bị Chủ Động",
    priceNote: "Báo giá nhanh trong 15 phút",
    shortDesc:
      "Cung cấp, sản xuất và cho thuê trọn gói hệ thống Âm thanh Line Array, Ánh sáng Beam/Laser, Màn hình LED P2.5 - P3.91, Nhà bạt không gian, Sân khấu, Bàn ghế.",
    description:
      "Sở hữu kho thiết bị sự kiện quy mô lớn nhập khẩu chính hãng, Trường Hải Event & Travel trực tiếp vận chuyển, lắp đặt và vận hành kỹ thuật cho mọi quy mô sự kiện trong nhà và ngoài trời. Việc chủ động 100% thiết bị giúp khách hàng tiết kiệm 20% - 30% ngân sách trung gian và đảm bảo tiến độ tuyệt đối.",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Dàn âm thanh Line Array công suất lớn, bàn Mixer Digital, micro UHF chống hú",
      "Màn hình LED P2.5 Indoor & P3.91 Outdoor cabinet nhôm đúc siêu nét 4K",
      "Hệ thống ánh sáng Moving Head Beam, Par LED 54 bóng, Laser, Follow, Blinder",
      "Nhà bạt không gian hợp kim nhôm, dù sự kiện, sân khấu lắp ghép, bàn ghế Banquet",
      "Đội ngũ kỹ thuật viên âm thanh, ánh sáng, màn LED trực chiến 100% thời lượng",
    ],
    equipmentList: [
      {
        category: "Hệ thống Âm thanh & Màn hình LED",
        items: [
          "Loa Line Array đồng bộ, loa Sub kép, loa Monitor kiểm âm sân khấu",
          "Màn hình LED P2.5 / P3.91 phẳng và cong, bộ xử lý hình ảnh NovaStar 4K",
          "Micro không dây Shure/Sennheiser, micro cổ ngỗng hội nghị, micro cài tai",
        ],
      },
      {
        category: "Hệ thống Ánh sáng & Hiệu ứng sân khấu",
        items: [
          "Đèn Moving Head Beam 380W/450W, đèn Par LED, đèn COB vàng nắng chiếu mặt",
          "Bàn điều khiển ánh sáng Tiger Touch / GrandMA lập trình theo kịch bản",
          "Máy khói lạnh CO2, máy phun lửa, pháo điện, máy bắn kim tuyến",
        ],
      },
      {
        category: "Nhà bạt, Sân khấu & Nội thất sự kiện",
        items: [
          "Nhà bạt không gian nhôm đúc khẩu độ 10m - 20m, nhà dù tròn, gian hàng tiêu chuẩn",
          "Sân khấu lắp ghép đa chiều cao trải thảm mới, khung Truss nhôm treo đèn",
          "Bàn chữ nhật IBM, bàn tròn tiệc, ghế Banquet bọc áo nơ, ghế Tiffany, cột chắn inox",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Tư vấn cấu hình tối ưu", desc: "Tính toán công suất âm thanh, kích thước LED và sân khấu chuẩn theo diện tích mặt bằng." },
      { step: 2, title: "Báo giá bóc tách trong 15 phút", desc: "Gửi bảng kê chi tiết số lượng, chủng loại thiết bị kèm hình ảnh thực tế tại kho." },
      { step: 3, title: "Kiểm tra thiết bị xuất kho", desc: "Test kỹ thuật 100% thiết bị trước khi lên xe tải chuyên dụng vận chuyển tới điểm hẹn." },
      { step: 4, title: "Lắp đặt an toàn, thẩm mỹ", desc: "Đi dây tín hiệu gọn gàng, bọc thảm mới và gia cố khung giàn Truss đúng tiêu chuẩn an toàn." },
      { step: 5, title: "Vận hành kỹ thuật suốt sự kiện", desc: "Kỹ thuật viên âm thanh, ánh sáng, LED trực điều chỉnh theo đúng kịch bản chương trình." },
      { step: 6, title: "Tháo dỡ nhanh gọn", desc: "Tháo dỡ ngay sau khi sự kiện kết thúc, trả lại mặt bằng nguyên trạng và nghiệm thu." },
    ],
    targetAudience: "Doanh nghiệp, cơ quan nhà nước, trường học, nhà hàng - khách sạn và các đơn vị truyền thông cần thuê thiết bị sự kiện chuyên nghiệp.",
  },
  {
    id: "hoat-dong-khac",
    title: "Hoạt Động Khác",
    category: "du-lich",
    tag: "Hoạt động khác",
    badge: "Đa Dạng Giải Pháp",
    priceNote: "Thiết kế linh hoạt theo yêu cầu",
    shortDesc:
      "Tổ chức Lễ khởi công – động thổ, Kỷ niệm thành lập, Hội thao doanh nghiệp, Họp lớp, Tour du lịch trải nghiệm – thiện nguyện và Cho thuê xe du lịch 7–45 chỗ.",
    description:
      "Bên cạnh các dòng sự kiện trọng điểm, Trường Hải Event & Travel đáp ứng trọn vẹn mọi nhu cầu tổ chức sự kiện đặc thù, các giải đấu thể thao nội bộ (Sport Day), chương trình thiện nguyện cộng đồng vùng cao và dịch vụ vận tải hành khách bằng đội xe du lịch đời mới từ 7 đến 45 chỗ.",
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Tổ chức Lễ khởi công – động thổ, Lễ kỷ niệm thành lập, Lễ mở bán & bàn giao BĐS",
      "Tổ chức Hội thao doanh nghiệp (Giải bóng đá, giải chạy Marathon, Sport Day)",
      "Chương trình Họp lớp – Hội khóa tri ân thầy cô, Prom học sinh – sinh viên",
      "Tour du lịch tham quan, trải nghiệm học tập & hành trình thiện nguyện vùng cao",
      "Cho thuê xe du lịch đời mới 7, 16, 29, 35, 45 chỗ và Limousine đưa đón VIP",
    ],
    equipmentList: [
      {
        category: "Sự kiện Đặc thù & Nghi lễ",
        items: [
          "Bộ dụng cụ xúc cát khởi công – động thổ (hộp cát, xẻng mạ vàng, mũ bảo hộ)",
          "Cổng hơi giải chạy, bục trao huy chương, cúp thể thao và âm thanh sân vận động",
          "Photobooth kỷ niệm họp lớp, kỷ yếu và sân khấu giao lưu âm nhạc",
        ],
      },
      {
        category: "Đội xe Vận tải & Du lịch",
        items: [
          "Dàn xe 45 chỗ Hyundai Universe, 29-35 chỗ Thaco Town, 16 chỗ Ford Transit, Limousine",
          "Hệ thống điều hòa mát sâu, ghế ngả êm ái, micro karaoke và wifi trên xe",
        ],
      },
      {
        category: "Hậu cần Tour & Thiện nguyện",
        items: [
          "Hướng dẫn viên suốt tuyến, banner đoàn, quà tặng thiện nguyện vùng cao",
          "Bảo hiểm du lịch trọn gói và hỗ trợ thủ tục giấy phép tổ chức tại địa phương",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Tiếp nhận yêu cầu riêng biệt", desc: "Lắng nghe ý tưởng và mục tiêu cụ thể của từng chương trình sự kiện hoặc hành trình tour." },
      { step: 2, title: "Xây dựng phương án may đo", desc: "Thiết kế lịch trình, kịch bản và danh mục hạng mục sát nhất với ngân sách khách hàng." },
      { step: 3, title: "Ký hợp đồng & Chuẩn bị", desc: "Chốt phương án, điều động phương tiện, thiết bị và nhân sự chuyên trách." },
      { step: 4, title: "Triển khai thực tế tận tâm", desc: "Đội ngũ điều hành theo sát từng chi tiết, đảm bảo chương trình diễn ra suôn sẻ, an toàn." },
      { step: 5, title: "Chăm sóc & Hậu mãi", desc: "Bàn giao tư liệu hình ảnh, xuất hóa đơn VAT đầy đủ và đồng hành trong các sự kiện tiếp theo." },
    ],
    targetAudience: "Mọi doanh nghiệp, cơ quan, trường học, hội cựu học sinh, câu lạc bộ và tập thể có nhu cầu tổ chức sự kiện hoặc di chuyển du lịch.",
  },
];

// 4 GÓI COMBO ƯU ĐÃI / KHUYẾN MÃI CHIẾN LƯỢC (THEO CHUẨN HÒA BÌNH GROUP)
export const PROMOTION_COMBOS: PromotionCombo[] = [
  {
    id: "combo-khai-truong",
    code: "COMBO-KHAITRUONG",
    title: "Combo Khai Trương Hồng Phát - Đắc Tài Đắc Lộc",
    subtitle: "Dành cho Lễ Khai trương, Khánh thành, Khởi công xây dựng",
    category: "su-kien",
    serviceGroup: "Tổ chức Sự kiện Khai trương",
    originalPrice: "Giá gốc",
    comboPrice: "Giá combo",
    discountBadge: "Tiết kiệm đặc biệt",
    savings: "Tiết kiệm ngay",
    validUntil: "Áp dụng đến hết tháng này",
    isPopular: true,
    giftItems: [
      "TẶNG NGAY 01 Đoàn Múa Lân Sư Rồng 4 Trống Hội (Trị giá 5.500.000đ)",
      "TẶNG 04 Tháp Pháo Điện sân khấu chào mừng khoảnh khắc cắt băng",
      "TẶNG 01 Bộ Kéo Vàng & Khay Cắt Băng Khai Trương Hoa Lụa VIP",
      "Giảm thêm 10% khi thuê bổ sung Nhà bạt không gian hoặc Tiệc Teabreak",
    ],
    conditions: [
      "Áp dụng cho hợp đồng ký trước ngày tổ chức tối thiểu 5 ngày",
      "Áp dụng tại khu vực TP Hà Nội và các tỉnh lân cận trong bán kính 60km",
    ],
    recommendedFor: "Showroom ô tô, chi nhánh ngân hàng, cửa hàng thời trang, spa, nhà máy khánh thành.",
  },
  {
    id: "combo-yep",
    code: "COMBO-YEP2026",
    title: "Combo Tiệc Tất Niên Tri Ân - Bứt Phá Đêm Gala",
    subtitle: "Dành cho Year End Party, Gala Dinner, Tiệc Kỷ Niệm Thành Lập",
    category: "su-kien",
    serviceGroup: "Tiệc Tất Niên & Gala Dinner",
    originalPrice: "Giá gốc",
    comboPrice: "Giá combo",
    discountBadge: "Ưu Đãi Vàng",
    savings: "Tiết kiệm ngay",
    validUntil: "Ưu tiên 10 doanh nghiệp đăng ký sớm",
    giftItems: [
      "TẶNG Gói Quay Phim Highlight Sự Kiện 4K + Chụp Ảnh Toàn Đoàn (Trị giá 8.000.000đ)",
      "TẶNG Toàn bộ Thiết kế Key Visual, Backdrop 3D và Thư Mời Điện Tử Online",
      "TẶNG Phần mềm Quay số May Mắn Lucky Draw tương tác trên màn LED",
      "Giảm 50% chi phí MC Chuyên Nghiệp điều phối chương trình gala",
    ],
    conditions: [
      "Áp dụng cho tiệc từ 100 khách trở lên đặt trọn gói âm thanh ánh sáng LED",
      "Không áp dụng đồng thời với các chương trình chiết khấu tiền mặt khác",
    ],
    recommendedFor: "Doanh nghiệp tổ chức tiệc tất niên cuối năm muốn vinh danh nhân viên và tạo clip truyền thông lan tỏa.",
  },
  {
    id: "combo-hoi-nghi-bds",
    code: "COMBO-HOINGHI",
    title: "Combo Hội Nghị Thượng Đỉnh & Lễ Mở Bán BĐS",
    subtitle: "Dành cho Hội thảo chuyên đề, ĐHĐCĐ, Ra mắt & Mở bán BĐS",
    category: "su-kien",
    serviceGroup: "Hội nghị, Hội thảo & Mở bán BĐS",
    originalPrice: "Giá gốc",
    comboPrice: "Giá combo",
    discountBadge: "Tiết kiệm đặc biệt",
    savings: "Tiết kiệm ngay",
    validUntil: "Có hạn theo slot thiết bị",
    giftItems: [
      "NÂNG CẤP MIỄN PHÍ Màn Hình LED P2.5 Siêu Nét (Độ phân giải hiển thị văn bản cực nét)",
      "TẶNG Hệ Thống Quét Mã QR Check-in Tự Động đón khách tại sảnh",
      "TẶNG 02 Nhân sự Lễ Tân Chuyên Nghiệp hỗ trợ đón khách trong 3 giờ đầu",
      "TẶNG 01 Màn hình phụ kiểm âm và nhắc slide (Stage Monitor) cho diễn giả",
    ],
    conditions: [
      "Áp dụng cho các hội nghị diễn ra tại khách sạn, trung tâm hội nghị hoặc trụ sở doanh nghiệp",
      "Thời gian lắp đặt và test thiết bị hoàn tất trước sự kiện 4 tiếng",
    ],
    recommendedFor: "Sàn giao dịch BĐS mở bán dự án, công ty dược phẩm, viện đào tạo, đại hội đồng cổ đông niêm yết.",
  },
  {
    id: "combo-team-mice",
    code: "COMBO-TEAMMICE",
    title: "Combo Du Lịch Doanh Nghiệp & Team Building Bứt Phá",
    subtitle: "Dành cho Tour Du Lịch, Team Building Bãi Biển, Du Lịch Thiện Nguyện",
    category: "du-lich",
    serviceGroup: "Du lịch Doanh nghiệp & MICE",
    originalPrice: "Giá gốc",
    comboPrice: "Giá combo",
    discountBadge: "Hot Nhất Mùa Hè",
    savings: "Tiết kiệm ngay",
    validUntil: "Áp dụng cho đoàn từ 40 khách",
    isPopular: true,
    giftItems: [
      "MIỄN PHÍ TOÀN BỘ Đạo Cụ Team Building Bạt Hơi Khổng Lồ trị giá 6.000.000đ",
      "TẶNG Gói Flycam Trên Không bắt trọn khoảnh khắc xếp chữ tên thương hiệu",
      "TẶNG 01 Backdrop Check-in Bãi Biển + Áo cờ đỏ sao vàng hoặc nón du lịch cho từng người",
      "BẢO HIỂM DU LỊCH nâng cấp mức tối đa 120.000.000 VNĐ/người",
    ],
    conditions: [
      "Áp dụng cho đoàn khởi hành từ Hà Nội đi Hạ Long, Cát Bà, Sapa, Đà Nẵng, Quy Nhơn",
      "Đoàn từ 80 khách trở lên được miễn phí thêm dịch vụ Karaoke Gala ngoài trời",
    ],
    recommendedFor: "Các công ty tổ chức kỳ nghỉ hè, team building tái tạo năng lượng cho toàn thể nhân viên.",
  },
];

// BẢNG SO SÁNH CÁC GÓI DỊCH VỤ SỰ KIỆN (PRICE ANCHORING)
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "economy",
    name: "Gói Khởi Điểm (Basic)",
    scale: "Quy mô 30 - 80 khách",
    priceDisplay: "Liên hệ báo giá",
    unit: "theo quy mô sự kiện",
    description: "Phù hợp cho sự kiện quy mô vừa và nhỏ, khai trương cửa hàng, tiệc nội bộ ấm cúng.",
    features: [
      "Dàn âm thanh tiêu chuẩn 4 loa Full + 2 Micro không dây",
      "04 Đèn Par LED chiếu sáng sân khấu cơ bản",
      "Sân khấu lắp ghép 12m² trải thảm đỏ mới",
      "Backdrop bạt Hiflex khung sắt căng phẳng kích thước 3m x 4m",
      "Kịch bản chương trình tiêu chuẩn và 01 kỹ thuật viên điều chỉnh âm thanh",
    ],
    unsupportedFeatures: [
      "Màn hình LED hiển thị visual",
      "Hệ thống đèn Moving Beam hiệu ứng",
      "Đội ngũ Lễ tân & Lân Sư Rồng",
      "Quay phim 4K Flycam",
    ],
    ctaText: "Chọn Gói Khởi Điểm",
  },
  {
    id: "standard",
    name: "Gói Tiêu Chuẩn (Chuyên Nghiệp)",
    scale: "Quy mô 100 - 300 khách",
    priceDisplay: "Liên hệ báo giá",
    unit: "theo quy mô sự kiện",
    description: "Lựa chọn được hơn 70% doanh nghiệp tin dùng, đáp ứng hoàn hảo yêu cầu nghe nhìn cao cấp.",
    isFeatured: true,
    features: [
      "Hệ thống loa Line Array công suất chuẩn quốc tế + Loa Subwoofer uy lực",
      "Màn hình LED P3.91 kích thước 15m² - 20m² sắc nét kèm visual chuyển động",
      "Hệ thống ánh sáng 08 Beam 380W + 12 Par LED + Máy khói lạnh sân khấu",
      "Sân khấu chịu lực 24m² trải thảm đỏ / xám ghi VIP + Bục phát biểu hoa tươi",
      "Photobooth chụp ảnh 3D nổi khối kích thước 3m x 5m",
      "Kịch bản đạo diễn chi tiết từng phút + 03 kỹ thuật viên trực chiến",
      "Tặng gói quay phim Highlight sự kiện và bộ cắt băng khai trương",
    ],
    unsupportedFeatures: [
      "Hệ thống dịch thuật song ngữ đa ngôn ngữ",
      "Sân khấu 3D Mapping độc bản",
    ],
    ctaText: "Chọn Gói Tiêu Chuẩn (Ưu Tiên)",
  },
  {
    id: "diamond",
    name: "Gói Kim Cương (VIP Luxury)",
    scale: "Quy mô 300 - 2.000+ khách",
    priceDisplay: "Liên Hệ",
    unit: "May đo theo yêu cầu",
    description: "Giải pháp đại lễ cao cấp, đại hội cổ đông, ra mắt sản phẩm quốc gia với đạo diễn sân khấu hàng đầu.",
    features: [
      "Dàn Line Array khủng công suất 10.000W + Mixer Digital đa kênh",
      "Hệ thống Màn hình LED P2.5 trong nhà hoặc chống nước ngoài trời 40m²+",
      "Trọn gói ánh sáng nghệ thuật: Beam, Laser, Follow, Blinder, Pháo hoa nghệ thuật",
      "Thi công Concept sân khấu độc bản 3D uốn lượn theo nhận diện thương hiệu",
      "Ekip đạo diễn sự kiện, MC song ngữ VIP, ca sĩ/vũ đoàn nổi tiếng",
      "Ekip Media 3 máy quay 4K + Flycam truyền hình trực tiếp lên màn LED (Livestream)",
      "Bảo hiểm sự kiện trọn gói và cam kết an toàn tuyệt đối 100%",
    ],
    ctaText: "Nhận Tư Vấn Gói VIP",
  },
];

// CÂU HỎI THƯỜNG GẶP FAQ
export const SERVICE_FAQS: FaqItem[] = [
  {
    question: "Trường Hải Event có hỗ trợ khảo sát địa điểm trước khi báo giá không?",
    answer:
      "HOÀN TOÀN MIỄN PHÍ. Sau khi tiếp nhận yêu cầu, chuyên viên kỹ thuật của Trường Hải sẽ đến tận hiện trường (Hà Nội và các tỉnh lân cận) để đo đạc kích thước sân khấu, kiểm tra hệ thống nguồn điện 3 pha và tư vấn phương án dựng tối ưu nhất.",
  },
  {
    question: "Thời gian nhận báo giá chi tiết là bao lâu?",
    answer:
      "Với các yêu cầu thuê thiết bị đơn lẻ, chúng tôi gửi bảng giá sau 15 phút. Đối với sự kiện trọn gói hoặc tour du lịch kết hợp Team Building, bảng dự toán bóc tách chi tiết kèm kịch bản sơ bộ sẽ được gửi trong vòng 30 phút - 2 giờ.",
  },
  {
    question: "Trường Hải Event có xuất hóa đơn đỏ VAT và ký hợp đồng pháp lý không?",
    answer:
      "Có đầy đủ 100%. Công ty TNHH Sự kiện và Du lịch Trường Hải có mã số thuế 0111601327 do Sở KH&ĐT TP Hà Nội cấp. Toàn bộ dịch vụ đều có hợp đồng kinh tế minh bạch, nghiệm thu thanh lý và xuất hóa đơn GTGT điện tử hợp lệ.",
  },
  {
    question: "Các gói Combo khuyến mãi có bị cắt giảm chất lượng thiết bị không?",
    answer:
      "TUYỆT ĐỐI KHÔNG. Trường Hải làm việc trực tiếp với các đối tác cung ứng uy tín và đội ngũ nhân sự cơ hữu chuyên nghiệp nên chúng tôi chủ động tối ưu chi phí để mang lại lợi ích tốt nhất cho khách hàng. Thiết bị sử dụng trong combo đều là thiết bị chính hãng đạt chuẩn quốc tế.",
  },
  {
    question: "Nếu thời tiết xấu (mưa gió) ngoài trời thì công ty xử lý ra sao?",
    answer:
      "Chúng tôi luôn có phương án dự phòng rủi ro (Risk Contingency Plan). Toàn bộ hệ thống nhà bạt không gian của Trường Hải sử dụng kết cấu nhôm đúc chịu gió cấp 6-7, mái bạt 2 da chống thấm tuyệt đối và luôn có sẵn bạt che phụ trợ để đảm bảo chương trình không bị gián đoạn.",
  },
];
