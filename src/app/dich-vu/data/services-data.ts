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

// 5 DỊCH VỤ CHI TIẾT ĐÓNG GÓI CHUẨN HOÁ
export const CORE_SERVICES: ServiceDetail[] = [
  {
    id: "khai-truong-khanh-thanh",
    title: "Tổ Chức Lễ Khai Trương, Khánh Thành & Khởi Công",
    category: "su-kien",
    tag: "Khai trương & Khánh thành",
    badge: "Dịch Vụ Mũi Nhọn",
    priceNote: "Liên hệ nhận báo giá ngay",
    shortDesc:
      "Giải pháp khởi đầu hanh thông, thu hút truyền thông và định vị thương hiệu với nghi thức cắt băng, múa lân sư rồng khai quang điểm nhãn trang trọng.",
    description:
      "Trường Hải Event & Travel mang đến quy trình tổ chức Lễ Khởi Công, Động Thổ, Khai Trương & Khánh Thành chỉn chu chuẩn phong thủy. Chúng tôi trực tiếp sản xuất thi công sân khấu, nhà bạt không gian hợp kim nhôm, cổng chào hơi, hệ thống âm thanh ánh sáng ngoài trời và cung cấp nhân sự biểu diễn chuyên nghiệp, đảm bảo sự kiện diễn ra trang nghiêm, hoành tráng và tạo tiếng vang lớn.",
    imageUrl:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Kịch bản nghi lễ phong thủy khởi sắc, trang trọng, chuẩn chỉ từng mốc thời gian",
      "Đội múa Lân Sư Rồng Tứ Quý Hưng Long, Trống hội chào mừng khai tiệc",
      "Bộ khay cắt băng khai trương bọc lụa đỏ hoa sen kim tuyến mạ vàng",
      "Tiệc trà Teabreak cao cấp bánh ngọt Pháp, trái cây tươi nhiệt đới và nước ép",
      "Hệ thống nhà bạt không gian kiên cố chống mưa bão, sàn gỗ trải thảm đỏ VIP",
    ],
    equipmentList: [
      {
        category: "Khu vực đón khách & Lễ tân",
        items: [
          "Cổng chào hơi 10m - 15m in decal logo sắc nét",
          "Thảm đỏ dẫn lối từ cổng vào trung tâm sân khấu",
          "Bàn lễ tân đón khách bọc váy quây sang trọng kèm khay hoa tươi",
          "Photobooth chụp ảnh check-in 3D nổi khối kích thước 3m x 5m",
        ],
      },
      {
        category: "Khu vực Sân khấu & Lễ chính",
        items: [
          "Sân khấu khung sắt chịu lực trải thảm đỏ / thảm xám ghi mới 100%",
          "Màn hình LED P3.91 ngoài trời độ sáng cao hiển thị visual động",
          "Hệ thống loa Line Array công suất chuẩn quốc tế, micro không dây UHF",
          "Bộ cắt băng khai trương cao cấp (kéo vàng, hoa lụa, găng tay trắng)",
          "Bục phát biểu mica sang trọng có gắn logo thương hiệu",
        ],
      },
      {
        category: "Không gian che chắn & Tiện ích",
        items: [
          "Nhà bạt không gian kết cấu nhôm đúc khẩu độ 10m - 18m kiên cố",
          "Quạt công nghiệp công suất lớn / Quạt hơi nước điều hòa",
          "Bàn tiệc tròn/dài bọc khăn nhung + Ghế banquet gắn nơ theo tone màu",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Tiếp nhận & Khảo sát", desc: "Đội ngũ kỹ thuật đo đạc mặt bằng thực tế trong vòng 12h, kiểm tra nguồn điện và giấy phép." },
      { step: 2, title: "Lên Kịch bản & 3D Demo", desc: "Xây dựng kịch bản chương trình chi tiết từng phút và bản vẽ 3D phối cảnh sân khấu độc bản." },
      { step: 3, title: "Báo giá bóc tách minh bạch", desc: "Lập bảng dự toán chi tiết từng hạng mục thiết bị, nhân sự, quà tặng, cam kết không phát sinh." },
      { step: 4, title: "Sản xuất & Lắp đặt trước 24h", desc: "Vận chuyển thiết bị, dàn dựng hoàn tất trước giờ G tối thiểu 12-24 giờ để chạy tổng duyệt." },
      { step: 5, title: "Tổng duyệt & Vận hành", desc: "Đạo diễn sự kiện điều phối toàn bộ âm thanh ánh sáng, MC, lễ tân và xử lý phát sinh tại chỗ." },
      { step: 6, title: "Nghiệm thu & Bàn giao Media", desc: "Dọn dẹp mặt bằng sạch sẽ, gửi toàn bộ video/ảnh chụp sự kiện chất lượng cao và quyết toán." },
    ],
    targetAudience: "Doanh nghiệp khai trương trụ sở mới, chi nhánh ngân hàng, showroom ôtô, cửa hàng bán lẻ, nhà máy xí nghiệp khởi công xây dựng.",
  },
  {
    id: "tiec-tat-nien-yep",
    title: "Tiệc Tất Niên (Year End Party) & Gala Dinner Doanh Nghiệp",
    category: "su-kien",
    tag: "Year End Party & Gala",
    badge: "Mùa Cao Điểm",
    priceNote: "Liên hệ nhận báo giá trọn gói",
    shortDesc:
      "Chương trình vinh danh thăng hoa cảm xúc, bùng nổ nhiệt huyết với concept độc bản kể câu chuyện văn hóa doanh nghiệp sau một năm cống hiến.",
    description:
      "Year End Party là dịp đặc biệt nhất trong năm để gắn kết toàn thể cán bộ nhân viên và tri ân các đối tác chiến lược. Trường Hải Event & Travel cung cấp gói giải pháp Y.E.P từ xây dựng ý tưởng chủ đạo (Concept Storytelling), sản xuất video nhìn lại hành trình 1 năm, dàn dựng tiết mục nghệ thuật nội bộ đến hệ thống sân khấu visual màn hình LED 3D đỉnh cao.",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Ý tưởng concept độc quyền (Cyberpunk, Retro, Gatsby, Vươn Ra Biển Lớn, Tinh Hoa Hội Tụ...)",
      "Đạo diễn âm nhạc & ánh sáng biến hội trường tiệc thành sân khấu nghệ thuật hoành tráng",
      "Kịch bản trao thưởng và vinh danh nhân viên xuất sắc trang trọng, lay động lòng người",
      "Trò chơi tương tác Lucky Draw quay số may mắn kỹ thuật số trên màn hình LED",
      "MC hoạt náo chuyên nghiệp điều tiết không khí từ lắng đọng tri ân đến bùng nổ vũ điệu",
    ],
    equipmentList: [
      {
        category: "Âm thanh & Ánh sáng biểu diễn",
        items: [
          "Dàn âm thanh Line Array cao cấp đáp ứng từ 100 đến 2.000 khách",
          "Hệ thống đèn Moving Head Beam 380W, Par LED 54 bóng tạo hiệu ứng màu",
          "Đèn Follow rọi lối đi danh dự của các cá nhân được tôn vinh",
          "Máy tạo khói lạnh CO2, pháo sáng kim tuyến cho khoảnh khắc đếm ngược",
        ],
      },
      {
        category: "Visual & Màn hình hiển thị",
        items: [
          "Màn hình LED P2.5 siêu nét độ tương phản cao trong nhà",
          "Bộ điều khiển xử lý hình ảnh 4K đa màn hình (Main LED + 2 cánh LED phụ)",
          "Thiết kế visual motion graphic đồng bộ theo màu sắc nhận diện thương hiệu",
        ],
      },
      {
        category: "Trang trí & Photo Corner",
        items: [
          "Photobooth chụp ảnh 3D nổi bật, có đèn hắt nghệ thuật và thảm nhung",
          "Hashtag cầm tay chụp hình thiết kế riêng theo slogan công ty",
          "Bục vinh danh và cúp khen thưởng pha lê khắc laser tinh xảo",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Lắng nghe câu chuyện", desc: "Tìm hiểu thông điệp cốt lõi của Ban Lãnh Đạo muốn truyền tải trong năm tài chính." },
      { step: 2, title: "Lên Concept Độc Bản", desc: "Xây dựng 02 phương án concept kèm Key Visual 3D và moodboard phong cách." },
      { step: 3, title: "Biên đạo & Hướng dẫn tập", desc: "Hỗ trợ nhân viên công ty tập luyện các tiết mục văn nghệ mở màn với biên đạo múa chuyên nghiệp." },
      { step: 4, title: "Setup kỹ thuật trước 1 ngày", desc: "Lắp đặt xong toàn bộ màn hình LED, âm thanh, ánh sáng và chạy test video vinh danh." },
      { step: 5, title: "Vận hành đêm Gala", desc: "Đạo diễn sân khấu điều phối toàn bộ timeline, âm thanh khớp từng giây với hình ảnh." },
      { step: 6, title: "Sản xuất video kỷ niệm", desc: "Bàn giao clip Highlight 4K đăng mạng xã hội và toàn bộ album ảnh đã chỉnh sửa màu." },
    ],
    targetAudience: "Tập đoàn kinh tế, doanh nghiệp FDI, công ty công nghệ, tổng công ty nhà nước, các khối trường học và ngân hàng tổ chức liên hoan cuối năm.",
  },
  {
    id: "hoi-nghi-hoi-thao-bds",
    title: "Tổ Chức Hội Nghị, Hội Thảo & Sự Kiện Mở Bán BĐS",
    category: "su-kien",
    tag: "Hội nghị & Mở bán BĐS",
    badge: "Chuẩn Quốc Tế",
    priceNote: "Dự toán linh hoạt theo quy mô",
    shortDesc:
      "Giải pháp hội thảo khoa học, đại hội cổ đông trang trọng và lễ mở bán dự án bất động sản kích hoạt cảm xúc chốt deal tức thì của nhà đầu tư.",
    description:
      "Tổ chức hội nghị cấp cao và lễ mở bán dự án đòi hỏi sự chính xác tuyệt đối về tín hiệu âm thanh micro, hình ảnh thuyết trình sắc nét và quy trình đón tiếp đại biểu chuẩn mực. Trường Hải Event & Travel cung cấp hạ tầng kỹ thuật trình chiếu 4K, hệ thống cabin dịch thuật song ngữ, cổng check-in QR Code tự động hóa và đội ngũ lễ tân được đào tạo bài bản.",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Hệ thống check-in quét mã QR tốc độ cao, in thẻ tên đại biểu tại chỗ",
      "Âm thanh hội thảo tiêu chuẩn chống hú rè 100%, micro cổ ngỗng đại biểu",
      "Màn hình phụ nhắc bài (Stage Monitor), Cue trình chiếu thuyết trình mượt mà",
      "Khu trưng bày sa bàn dự án BĐS với hệ thống đèn rọi hội tụ chuyên dụng",
      "MC song ngữ Anh - Việt chuyên nghiệp dẫn dắt phiên thảo luận và đấu giá",
    ],
    equipmentList: [
      {
        category: "Hạ tầng Trình chiếu & Họp kỹ thuật",
        items: [
          "Màn hình LED P2.5 trong nhà độ phân giải cao hỗ trợ video render 4K",
          "Hệ thống micro cổ ngỗng Bosch / Shure cho bàn chủ tọa và đại biểu",
          "Cabin dịch thuật cách âm tiêu chuẩn + Tai nghe phiên dịch hồng ngoại",
          "Laptop điều khiển cấu hình cao, bộ switch chuyển slide không trễ",
        ],
      },
      {
        category: "Khu vực sảnh đón & Lễ tân",
        items: [
          "Cổng từ đón khách / Bàn check-in công nghệ có máy quét QR",
          "Hệ thống standee chỉ dẫn điện tử và backdrop chụp ảnh VIP",
          "Đội ngũ lễ tân ngoại hình đồng đều từ 1m65 trở lên, giao tiếp tiếng Anh tốt",
        ],
      },
      {
        category: "Tài liệu & Quà tặng",
        items: [
          "In ấn tài liệu hội thảo bìa cứng đóng quyển chỉn chu",
          "Túi quà đại biểu thiết kế riêng theo nhận diện sự kiện",
          "Tiệc trà Teabreak giữa giờ phong phú với trà hoa cúc, cafe Arabica",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Xác định mục tiêu & Khách mời", desc: "Thống nhất thành phần đại biểu, quy chuẩn ngoại giao hoặc mục tiêu doanh số mở bán." },
      { step: 2, title: "Lựa chọn địa điểm tối ưu", desc: "Khảo sát và tư vấn các trung tâm hội nghị 5 sao (NCC, Lotte, Melia, InterContinental...)." },
      { step: 3, title: "Chuẩn bị hạ tầng kỹ thuật", desc: "Kiểm tra kỹ lưỡng đường truyền Internet cáp quang riêng và hệ thống điện dự phòng UPS." },
      { step: 4, title: "Chạy thử bài thuyết trình", desc: "Cùng diễn giả kiểm tra toàn bộ slide, clip và tín hiệu mic trước giờ đón khách 2 tiếng." },
      { step: 5, title: "Điều phối chuyên nghiệp", desc: "Lễ tân tiếp đón chu đáo, thư ký hội nghị tổng hợp câu hỏi Q&A nhanh chóng." },
      { step: 6, title: "Hậu mãi & Kỷ yếu", desc: "Tổng hợp biên bản hội thảo, dữ liệu khách hàng check-in và gửi thư cảm ơn tự động." },
    ],
    targetAudience: "Chủ đầu tư bất động sản, công ty dược phẩm, viện nghiên cứu, trường đại học, hiệp hội doanh nghiệp và các công ty cổ phần tổ chức ĐHĐCĐ.",
  },
  {
    id: "team-building-tour-mice",
    title: "Team Building, Tour Doanh Nghiệp & Du Lịch Nghỉ Dưỡng MICE",
    category: "du-lich",
    tag: "Team Building & MICE",
    badge: "Gắn Kết Đội Ngũ",
    priceNote: "Liên hệ nhận báo giá theo đầu người",
    shortDesc:
      "Hành trình du lịch kết hợp thử thách bứt phá giới hạn, thắt chặt tình đồng đội tại các thiên đường du lịch Hạ Long, Sapa, Đà Nẵng, Quy Nhơn, Phú Quốc.",
    description:
      "Trường Hải Event & Travel là sự kết hợp hoàn hảo giữa năng lực tổ chức sự kiện chuyên nghiệp và giấy phép kinh doanh lữ hành nội địa - quốc tế uy tín. Chúng tôi thiết kế các concept Team Building bãi biển và quân đội độc bản, sở hữu kho đạo cụ khổng lồ cùng mạng lưới liên kết khách sạn/resort 4-5 sao với mức giá ưu đãi tốt nhất thị trường.",
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Kho đạo cụ Team Building bằng bạt hơi khổng lồ, trò chơi logic đa dạng",
      "MC Team Building năng lượng cao, truyền cảm hứng và thổi bùng nhiệt huyết",
      "Hệ thống khách sạn / Resort 4 - 5 sao liên kết trực tiếp với giá sỉ tốt nhất",
      "Dàn xe vận tải du lịch 16 - 29 - 45 chỗ đời mới 2022 - 2025 máy lạnh mát sâu",
      "Bảo hiểm du lịch nội địa mức đền bù tối đa 120.000.000 VNĐ/người/vụ",
    ],
    equipmentList: [
      {
        category: "Đạo cụ Game bãi biển / Ngoài trời",
        items: [
          "Bộ phao hơi khổng lồ (Ngựa hơi, bánh xe lăn, ống phao vượt chướng ngại)",
          "Bóng Yoga khổng lồ 2m, gậy hơi, áo lưới chia đội nhiều màu",
          "Cờ lệnh, cờ tiêu, loa kéo công suất khủng phục vụ ngoài bãi biển",
          "Áo mưa, nón du lịch Trường Hải, nước suối đóng chai phục vụ suốt tuyến",
        ],
      },
      {
        category: "Sân khấu Gala Dinner bãi biển / Resort",
        items: [
          "Sân khấu di động ngoài trời, âm thanh chống gió biển chuyên dụng",
          "Lửa trại truyền thống, đuốc sáng và pháo hoa nghệ thuật",
          "Ban nhạc Acoustic hoặc DJ khuấy động đêm tiệc sau trò chơi",
        ],
      },
      {
        category: "Dịch vụ Media & Lưu niệm",
        items: [
          "Ekip quay phim Flycam trên không bắt trọn khung hình chữ tên công ty",
          "Thợ chụp ảnh ghi lại từng khoảnh khắc vui vẻ, xúc động của từng thành viên",
          "Banner xe, Backdrop check-in bãi biển thiết kế cá nhân hóa",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Lắng nghe văn hóa nội bộ", desc: "Tìm hiểu đặc thù độ tuổi, giới tính và mục tiêu gắn kết của ban lãnh đạo." },
      { step: 2, title: "Khảo sát tuyến điểm & Menu", desc: "Tư vấn lộ trình nghỉ dưỡng phù hợp, kiểm tra chất lượng phòng và thực đơn tiệc." },
      { step: 3, title: "Lập kịch bản Game & Gala", desc: "Thiết kế chuỗi trạm thử thách liên hoàn mang tính biểu tượng cho giá trị cốt lõi doanh nghiệp." },
      { step: 4, title: "Chuẩn bị xe & Đạo cụ", desc: "Kiểm định kỹ thuật xe ô tô, vệ sinh khử khuẩn xe và đóng gói đạo cụ mới 100%." },
      { step: 5, title: "Thực hiện hành trình", desc: "Hướng dẫn viên và MC chăm sóc chu đáo từng bữa ăn, giấc ngủ và điều hành trò chơi an toàn." },
      { step: 6, title: "Bàn giao kho ảnh kỷ niệm", desc: "Chỉnh sửa toàn bộ ảnh/video để doanh nghiệp làm tư liệu truyền thông nội bộ tuyển dụng." },
    ],
    targetAudience: "Doanh nghiệp tổ chức du lịch hè, chuyến du lịch khen thưởng nhân viên xuất sắc, kick-off đầu quý hoặc kỳ nghỉ kết hợp thiện nguyện vì cộng đồng.",
  },
  {
    id: "cho-thue-trang-thiet-bi",
    title: "Sản Xuất, Thi Công & Cho Thuê Trang Thiết Bị Sự Kiện Trọn Gói",
    category: "su-kien",
    tag: "Trang thiết bị sự kiện",
    badge: "Kho Thiết Bị Trực Tiếp",
    priceNote: "Giá gốc tận kho - Không qua trung gian",
    shortDesc:
      "Cung cấp hệ thống Âm thanh Line Array, Ánh sáng Moving/Beam, Màn hình LED P2.5 - P3.91, Nhà bạt nhôm không gian, Bàn ghế Banquet với chi phí tối ưu nhất.",
    description:
      "Trường Hải Event & Travel sở hữu kho thiết bị sự kiện rộng hơn 1.000m² tại Hà Nội, trực tiếp nhập khẩu và bảo dưỡng định kỳ các dòng thiết bị âm thanh, ánh sáng, màn hình LED hiện đại nhất. Chúng tôi là đối tác cung cấp thiết bị tin cậy cho hàng trăm agency và doanh nghiệp trên toàn miền Bắc với cam kết giá gốc tận kho, kỹ thuật viên trực 24/7 và lắp đặt trước giờ G.",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",
    highlights: [
      "Kho thiết bị tự sở hữu 100% - Tiết kiệm ngay 25% - 30% chi phí trung gian",
      "Màn hình LED Cabinet nhôm đúc P2.5 trong nhà & P3.91 ngoài trời siêu nét",
      "Dàn loa Line Array công suất khủng, micro không dây UHF bắt sóng xa 100m",
      "Nhà bạt không gian hợp kim nhôm khẩu độ từ 10m đến 24m kiên cố an toàn",
      "Kỹ thuật viên âm thanh, ánh sáng, LED dày dặn kinh nghiệm trực chiến 100%",
    ],
    equipmentList: [
      {
        category: "Hệ thống Âm thanh biểu diễn",
        items: [
          "Loa Line Array Active/Passive công suất lớn cho sân khấu 200 - 5.000 khách",
          "Loa Sub đôi đánh lực uy lực, loa Monitor kiểm âm sân khấu",
          "Bàn Mixer kỹ thuật số kỹ thuật cao (Yamaha, Allen & Heath, Behringer)",
          "Micro không dây chuyên nghiệp Shure, Sennheiser bắt sóng cực ổn định",
        ],
      },
      {
        category: "Hệ thống Ánh sáng nghệ thuật",
        items: [
          "Đèn Moving Head Beam 380W / 450W hiệu ứng tia sắc nét",
          "Đèn Par LED 54 bóng 3W nhuộm màu sân khấu rực rỡ",
          "Đèn Blinder chớp sáng tạo cao trào, đèn rọi COB vàng nắng cho mặt diễn viên",
          "Bàn điều khiển ánh sáng GrandMA / Tiger Touch lập trình visual theo nhạc",
        ],
      },
      {
        category: "Nhà bạt, Sân khấu & Bàn ghế",
        items: [
          "Nhà bạt không gian kết cấu nhôm đúc bạt 2 da Hàn Quốc cách nhiệt",
          "Sân khấu lắp ghép modul chịu lực cao, tăng giảm chiều cao từ 0.4m đến 1.5m",
          "Bàn ghế Banquet bọc nơ sang trọng, bàn tròn ăn tiệc có kính xoay",
          "Dù tròn sự kiện đường kính 18m - 26m vải dù dệt bền màu",
        ],
      },
    ],
    workflow: [
      { step: 1, title: "Tư vấn cấu hình chuẩn", desc: "Tính toán đúng công suất âm thanh ánh sáng theo diện tích không gian và số lượng người." },
      { step: 2, title: "Báo giá nhanh trong 15 phút", desc: "Gửi bảng báo giá chi tiết quy cách thiết bị kèm hình ảnh thực tế." },
      { step: 3, title: "Ký hợp đồng pháp lý", desc: "Hợp đồng minh bạch, cam kết rõ ràng về thời gian giao hàng và xuất hóa đơn VAT đầy đủ." },
      { step: 4, title: "Vận chuyển & Setup", desc: "Xe tải chuyên dụng vận chuyển thiết bị đến tận địa điểm và lắp đặt hoàn thiện sớm." },
      { step: 5, title: "Kỹ thuật trực chiến", desc: "Đội ngũ chuyên gia kỹ thuật căn chỉnh âm thanh, điều khiển ánh sáng suốt sự kiện." },
      { step: 6, title: "Tháo dỡ an toàn", desc: "Tháo dỡ nhanh gọn, an toàn sau khi chương trình kết thúc và nghiệm thu sạch sẽ." },
    ],
    targetAudience: "Các công ty tổ chức sự kiện, ban tổ chức lễ hội trường học, doanh nghiệp tự tổ chức chương trình, nhà hàng khách sạn cần thuê thêm thiết bị bổ sung.",
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
      "TUYỆT ĐỐI KHÔNG. Trường Hải tự sở hữu kho thiết bị hơn 1.000m² và đội ngũ nhân sự cơ hữu nên chúng tôi chủ động tối ưu chi phí trung gian để tặng lại lợi ích cho khách hàng. Thiết bị sử dụng trong combo đều là thiết bị chính hãng mới 95-100%.",
  },
  {
    question: "Nếu thời tiết xấu (mưa gió) ngoài trời thì công ty xử lý ra sao?",
    answer:
      "Chúng tôi luôn có phương án dự phòng rủi ro (Risk Contingency Plan). Toàn bộ hệ thống nhà bạt không gian của Trường Hải sử dụng kết cấu nhôm đúc chịu gió cấp 6-7, mái bạt 2 da chống thấm tuyệt đối và luôn có sẵn bạt che phụ trợ để đảm bảo chương trình không bị gián đoạn.",
  },
];
