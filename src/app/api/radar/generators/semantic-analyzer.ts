/**
 * BỘ PHÂN TÍCH NGỮ CẢNH & Ý ĐỊNH TÌM KIẾM ĐA DẠNG CHO BẤT KỲ TỪ KHÓA NÀO
 * Thuộc chuẩn: Content SEO System - Phân tích ngữ cảnh sâu (Deep Semantic Taxonomy)
 * Phạm vi: Nội bộ src/app/api/radar/generators/
 */

export type EventCategory =
  | "GRAND_OPENING_GROUNDBREAKING" // Khai trương, khánh thành, khởi công, động thổ, cất nóc, mở bán
  | "YEAR_END_ANNUAL_PARTY"        // Tất niên, Year End Party, Gala Dinner, tân niên, sinh nhật công ty, kỷ niệm thành lập
  | "TEAMBUILDING_TRAVEL_CAMP"     // Team building bãi biển, quân đội, du lịch công ty, dã ngoại, caravan
  | "CONFERENCE_SEMINAR_WORKSHOP"  // Hội nghị, hội thảo, tọa đàm, workshop, họp báo, ký kết, ra mắt sản phẩm
  | "FESTIVAL_SPORTS_COMMUNITY"    // Ngày hội gia đình, lễ hội âm nhạc, giải chạy marathon, hội thao, Trung thu
  | "EQUIPMENT_TECHNICAL_RENTAL"   // Thuê âm thanh, ánh sáng, LED, sân khấu, nhà bạt không gian, loa đài
  | "EXHIBITION_TRADE_BOOTH"       // Hội chợ, gian hàng triển lãm, activation, roadshow, sampling
  | "CUSTOM_TAILORED_EVENT";       // Các từ khóa sự kiện đặc thù hoặc tùy biến khác

export interface ScaleTier {
  scaleName: string;
  scope: string;
  items: string;
  prepTime: string;
  estimatedBudget: string;
}

export interface TradeOffRow {
  aspect: string;
  optionA: string;
  optionB: string;
  recommendation: string;
}

export interface SemanticAnalysisResult {
  category: EventCategory;
  categoryLabel: string;
  subject: string;
  targetPersona: string;
  coreCustomerNeed: string;
  technicalHighlights: string[];
  hiddenConditions: string[];
  practicalPitfalls: string[];
  scaleTiers: ScaleTier[];
  tradeOffs: TradeOffRow[];
  recommendedEquipment: string;
  primaryActionHook: string;
}

/**
 * Làm sạch chủ thể từ khóa để tạo tiêu đề và ngữ cảnh tự nhiên
 */
export function extractSubject(keyword: string): string {
  if (!keyword) return "sự kiện chuyên nghiệp";
  let s = keyword.trim().toLowerCase();
  s = s.replace(/^(báo giá\s+dịch vụ\s+tổ chức|báo giá\s+tổ chức|dịch vụ\s+tổ chức|kế hoạch\s+tổ chức|cẩm nang\s+tổ chức|kịch bản\s+tổ chức|kinh nghiệm\s+tổ chức|hướng dẫn\s+tổ chức|quy trình\s+tổ chức|ý tưởng\s+tổ chức|tổ chức|báo giá|dịch vụ|kịch bản|cẩm nang|thuê)\s+/iu, "");
  return s.trim() || keyword.trim();
}

/**
 * Phân tích bản chất từ khóa theo ma trận ngữ cảnh sâu
 */
export function analyzeKeywordSemantics(keyword: string): SemanticAnalysisResult {
  const k = keyword.toLowerCase().trim();
  const subject = extractSubject(keyword);

  // 1. NHÓM DU LỊCH, TEAM BUILDING & NGHỈ DƯỠNG
  if (
    k.includes("team building") ||
    k.includes("teambuilding") ||
    k.includes("du lịch") ||
    k.includes("du lich") ||
    k.includes("tour") ||
    k.includes("nghỉ dưỡng") ||
    k.includes("dã ngoại") ||
    k.includes("gắn kết") ||
    k.includes("quân đội")
  ) {
    return {
      category: "TEAMBUILDING_TRAVEL_CAMP",
      categoryLabel: "Du lịch & Team Building gắn kết doanh nghiệp",
      subject,
      targetPersona: "Trưởng phòng nhân sự (HR), Chủ tịch công đoàn, Ban giám đốc doanh nghiệp",
      coreCustomerNeed: "Nâng cao tinh thần đồng đội, giải tỏa căng thẳng công việc, không phát sinh chi phí phát sinh dọc tour",
      technicalHighlights: [
        "Đội xe du lịch 16 - 45 chỗ đời mới thuộc sở hữu trực tiếp của Trường Hải, tài xế chuyên trách tour an toàn",
        "Bộ đạo cụ game phao hơi kích thước lớn, đồ chơi team building nhập khẩu an toàn tuyệt đối",
        "Hệ thống loa kéo công suất lớn và dàn Line Array di động chống chịu gió biển và thời tiết bãi cát",
        "Flycam 4K và đội ngũ media bắt trọn khoảnh khắc bùng nổ, bàn giao video recap trong 48h",
      ],
      hiddenConditions: [
        "Phí bến bãi và phí vệ sinh môi trường tại các bãi biển công cộng hoặc resort",
        "Phương án thời tiết dự phòng (mưa giông bất chợt trên biển cần nhà bạt hoặc chuyển đổi kịch bản indoor)",
        "Bảo hiểm du lịch và chứng chỉ sơ cấp cứu tại hiện trường đối với các game vận động mạnh",
      ],
      practicalPitfalls: [
        "Agency bán tour trung gian thu tiền trọn gói nhưng cắt xén đồ ăn và dùng xe hợp đồng cũ kỹ, tài xế cáu gắt",
        "Trò chơi team building sao chép, phạt trò phản cảm gây khó chịu cho nhân sự nữ và lãnh đạo lớn tuổi",
        "Thiếu xe cứu thương hoặc túi cứu thương chuyên dụng khi xảy ra trầy xước lúc chạy đua bãi cát",
      ],
      scaleTiers: [
        {
          scaleName: "Quy mô 30 - 70 thành viên",
          scope: "Xe 29-45 chỗ, 4 game khởi động + 3 trạm thử thách bãi biển, backdrop check-in, media chụp ảnh HD",
          items: "Bao gồm MC hoạt náo, trọn bộ đạo cụ phao hơi, nước uống và bảo hiểm du lịch",
          prepTime: "2 - 3 ngày",
          estimatedBudget: "350.000đ - 650.000đ/thành viên (chưa gồm lưu trú)",
        },
        {
          scaleName: "Quy mô 80 - 250 thành viên",
          scope: "Đoàn xe 45 chỗ riêng, kịch bản Amazing Race bãi biển hoặc quân đội, âm thanh Line Array bãi biển, Flycam 4K",
          items: "MC chuyên nghiệp, 10 nhân sự hỗ trợ trạm, đồng phục áo team, tiệc Gala Dinner âm thanh ánh sáng LED",
          prepTime: "5 - 7 ngày",
          estimatedBudget: "850.000đ - 1.650.000đ/thành viên trọn gói",
        },
        {
          scaleName: "Đại đoàn 300 - 1.000+ thành viên",
          scope: "Đoàn xe du lịch đời mới dẫn đoàn, concept độc quyền riêng biệt, sân khấu nhạc hội bãi biển, pháo hoa tầm thấp",
          items: "Đạo diễn hiện trường, ekip y tế thường trực, bảo hiểm cao cấp, tiệc gala ẩm thực 5 sao",
          prepTime: "10 - 20 ngày",
          estimatedBudget: "Dự toán bóc tách chi tiết theo yêu cầu điểm đến",
        },
      ],
      tradeOffs: [
        {
          aspect: "Đơn vị vận hành",
          optionA: "Thuê riêng cty du lịch + thuê riêng cty sự kiện",
          optionB: "Mô hình Hybrid Event & Travel Trường Hải (1 đầu mối)",
          recommendation: "Chọn mô hình Hybrid để tránh cảnh 2 bên đùn đẩy trách nhiệm giờ giấc và tối ưu 20% chi phí",
        },
        {
          aspect: "Thiết bị âm thanh ngoài trời",
          optionA: "Loa kéo di động công suất nhỏ",
          optionB: "Hệ thống Line Array ngoài trời có trạm phát điện",
          recommendation: "Chọn Line Array để tiếng hô vang bãi biển trên 100m không bị gió biển nuốt âm",
        },
      ],
      recommendedEquipment: "Dàn Line Array ngoài trời, đạo cụ phao hơi, Flycam 4K, xe 45 chỗ đời mới",
      primaryActionHook: "Tư vấn lộ trình di chuyển và kịch bản team building gắn kết độc bản trong 30 phút",
    };
  }

  // 2. NHÓM CHO THUÊ THIẾT BỊ ÂM THANH, ÁNH SÁNG, LED & SÂN KHẤU
  if (
    k.includes("thuê") ||
    k.includes("thue") ||
    k.includes("cho thuê") ||
    k.includes("âm thanh") ||
    k.includes("ánh sáng") ||
    k.includes("màn hình led") ||
    k.includes("màn led") ||
    k.includes("nhà bạt") ||
    k.includes("sân khấu") ||
    k.includes("loa đài") ||
    k.includes("bàn ghế")
  ) {
    return {
      category: "EQUIPMENT_TECHNICAL_RENTAL",
      categoryLabel: "Cho thuê thiết bị sự kiện từ tổng kho trực tiếp",
      subject,
      targetPersona: "Ban tổ chức sự kiện, Producer, Quản lý tòa nhà, Agency quảng cáo, Doanh nghiệp tự tổ chức",
      coreCustomerNeed: "Thiết bị đời mới, đồng bộ, kỹ thuật viên trực chiến kinh nghiệm, giá kho không qua môi giới",
      technicalHighlights: [
        "Hệ thống loa Line Array nhập khẩu chính hãng, củ loa chuẩn châu Âu, góc phủ âm rộng và chống hú rít 100%",
        "Màn hình LED Indoor P2.5 siêu mịn không sọc camera, LED Outdoor P3.91 độ sáng cao chống chói nắng",
        "Đèn Moving Beam 260/380, đèn Par LED 54x3W đổi màu, Follow rọi ca sĩ và bàn mixer kỹ thuật số Yamaha/Behringer",
        "Khung giàn Truss nhôm hợp kim định hình tiêu chuẩn quốc tế và nhà bạt nhôm không gian khẩu độ 10m - 20m",
      ],
      hiddenConditions: [
        "Nguồn điện 3 pha công nghiệp tại mặt bằng tổ chức (mỗi cabin LED tiêu thụ 300W - 600W/m²)",
        "Chiều cao trần và tải trọng chịu lực của sàn đối với các trung tâm tiệc cưới hoặc sảnh khách sạn",
        "Giờ giấc vận chuyển ban đêm và quy định thang máy hàng của các tòa nhà văn phòng hạng A",
      ],
      practicalPitfalls: [
        "Agency môi giới nhận cọc rồi sang tay cho bên thứ 3, đến ngày sự kiện đưa thiết bị cũ nát, rách màng loa",
        "Phụ phí bất ngờ: Tính tiền dây cáp tín hiệu, phụ phí kỹ thuật trực quá 22h, phụ phí vận chuyển đêm",
        "Kỹ thuật viên thiếu kinh nghiệm để xảy ra tiếng rít micro đinh tai đúng lúc lãnh đạo cấp cao phát biểu",
      ],
      scaleTiers: [
        {
          scaleName: "Gói âm thanh ánh sáng hội thảo (dưới 100 khách)",
          scope: "2 - 4 loa Full chuyên nghiệp, 2 - 4 micro không dây UHF chống nhiễu, mixer kỹ thuật số, 4 đèn Par LED",
          items: "Bao gồm 01 kỹ thuật viên âm thanh trực chiến xuyên suốt sự kiện, miễn phí vận chuyển nội thành",
          prepTime: "Lắp đặt trong 2 giờ",
          estimatedBudget: "3.500.000đ - 6.500.000đ/buổi",
        },
        {
          scaleName: "Gói biểu diễn ca nhạc & tiệc quy mô (100 - 300 khách)",
          scope: "Hệ thống 4 - 6 loa Line Array + 2 loa Sub siêu trầm, 8 - 12 đèn Par LED + 4 Moving Beam, màn LED P2.5 (15m²)",
          items: "Bao gồm 02 kỹ thuật viên âm thanh ánh sáng + 01 kỹ thuật viên visual LED trực chiến",
          prepTime: "Lắp đặt trước giờ G 4 - 6 tiếng",
          estimatedBudget: "12.000.000đ - 26.000.000đ trọn gói kho trực tiếp",
        },
        {
          scaleName: "Gói đại nhạc hội & festival (300 - 1.000+ khách)",
          scope: "Giàn Line Array treo khung Truss chuyên nghiệp, màn LED P2.5 (30m² - 60m²), đèn Beam 380, máy khói, laser",
          items: "Đội ngũ kỹ thuật viên 5 người, bàn giao tổng duyệt âm thanh cùng ban nhạc và ca sĩ nổi tiếng",
          prepTime: "Lắp đặt và test 12 - 24 giờ trước giờ G",
          estimatedBudget: "Báo giá bóc tách theo mét vuông màn LED và số lượng cabin",
        },
      ],
      tradeOffs: [
        {
          aspect: "Đơn vị cung cấp",
          optionA: "Thuê qua công ty trung gian / môi giới",
          optionB: "Thuê trực tiếp từ tổng kho Trường Hải Event",
          recommendation: "Thuê từ kho tiết kiệm 20% - 30% ngân sách và chủ động tuyệt đối về mặt kỹ thuật",
        },
        {
          aspect: "Công nghệ màn LED",
          optionA: "Màn hình LED P3.91 (phổ thông)",
          optionB: "Màn hình LED P2.5 (siêu mịn)",
          recommendation: "Chọn P2.5 nếu khoảng cách người ngồi gần dưới 4m để ảnh chụp và video không bị vỡ hạt sọc",
        },
      ],
      recommendedEquipment: "Loa Line Array nhập khẩu, màn LED P2.5/P3.91, đèn Moving Beam, khung Truss nhôm",
      primaryActionHook: "Nhận bảng thông số kỹ thuật chi tiết và báo giá bóc tách thiết bị tại kho trong 15 phút",
    };
  }

  // 3. NHÓM KHAI TRƯƠNG, KHÁNH THÀNH, KHỞI CÔNG & RA MẮT
  if (
    k.includes("khai trương") ||
    k.includes("khai truong") ||
    k.includes("khánh thành") ||
    k.includes("khanh thanh") ||
    k.includes("khởi công") ||
    k.includes("khoi cong") ||
    k.includes("động thổ") ||
    k.includes("cất nóc") ||
    k.includes("mở bán") ||
    k.includes("chi nhánh")
  ) {
    return {
      category: "GRAND_OPENING_GROUNDBREAKING",
      categoryLabel: "Lễ khai trương, khánh thành & khởi công dự án",
      subject,
      targetPersona: "Chủ doanh nghiệp, Giám đốc điều hành, Trưởng đại diện thương hiệu, Trưởng ban quản lý dự án",
      coreCustomerNeed: "Nghi lễ phong thủy tài lộc chuẩn chỉ, thu hút khách hàng ngày đầu, kiểm soát pháp lý và an toàn",
      technicalHighlights: [
        "Đội múa Lân Sư Rồng chuyên nghiệp, bài múa Độc Chiếm Ngao Đầu rước tài lộc và dàn trống hội khai môn",
        "Bộ nghi thức cắt băng khai trương dát viền nhung đỏ, kéo vàng chuôi rồng và pháo điện tạo cao trào",
        "Sân khấu kiên cố, thảm đỏ dẫn lối từ cổng chào hơi/khung Truss nhận diện thương hiệu từ khoảng cách xa",
        "Hồ sơ xin phép treo băng rôn cờ phướn và giấy phép hoạt động sự kiện ngoài trời chuẩn chỉ theo Sở VHTT",
      ],
      hiddenConditions: [
        "Khung giờ hoàng đạo cắt băng kích hoạt tài vận bắt buộc không được xê dịch quá 5 phút",
        "Giấy phép sử dụng vỉa hè, lòng đường hoặc đăng ký với ban quản lý tòa nhà thương mại",
        "Thời tiết ngoài trời nắng gắt hoặc mưa bất chợt cần có nhà bạt nhôm không gian hoặc ô dù lệch tâm",
      ],
      practicalPitfalls: [
        "MC lúng túng giới thiệu sai chức danh quan khách VIP và lãnh đạo chính quyền địa phương",
        "Âm thanh micro bị rè hú ngay thời điểm đọc tuyên bố khai mạc, phá hỏng không khí trang nghiêm",
        "Đơn vị tổ chức nghiệp dư không chuẩn bị nghi lễ phong thủy (mâm cúng, hoa tươi) khiến gia chủ bất an",
      ],
      scaleTiers: [
        {
          scaleName: "Quy mô cửa hàng, showroom, spa (dưới 80 khách)",
          scope: "Cổng hơi/khung check-in, thảm đỏ, âm thanh 2 loa Full + 2 mic, bộ cắt băng 5 người, tiệc trà teabreak",
          items: "Bao gồm 01 MC chuyên nghiệp, đội múa lân 2 con rước lộc, 2 PG lễ tân đón khách",
          prepTime: "1 - 2 ngày chuẩn bị",
          estimatedBudget: "15.000.000đ - 28.000.000đ",
        },
        {
          scaleName: "Quy mô chi nhánh, trụ sở công ty (100 - 300 khách)",
          scope: "Sân khấu lắp ghép, màn LED P3.91 ngoài trời, dàn Line Array 4 loa, bàn ghế đại biểu VIP bọc nơ",
          items: "Đội múa lân sư rồng 4 lân + trống hội, bộ cắt băng 7 - 9 người, 4 PG lễ tân, media quay chụp ảnh HD",
          prepTime: "3 - 5 ngày chuẩn bị",
          estimatedBudget: "35.000.000đ - 65.000.000đ",
        },
        {
          scaleName: "Đại lễ khánh thành nhà máy, khởi công KCN (300 - 1.000+ khách)",
          scope: "Nhà bạt nhôm không gian khẩu độ 15-20m chống bão, sàn gỗ trải thảm, sân khấu VIP, LED P2.5",
          items: "Nghi thức xúc cát khởi công chuyên dụng, tiệc mặn buffet/set menu 5 sao, đón tiếp lãnh đạo Bộ/Tỉnh",
          prepTime: "7 - 15 ngày chuẩn bị",
          estimatedBudget: "Báo giá bóc tách theo hồ sơ kỹ thuật hiện trường",
        },
      ],
      tradeOffs: [
        {
          aspect: "Nghi thức cắt băng",
          optionA: "Cắt băng truyền thống thủ công",
          optionB: "Nghi thức ấn nút bấm LED Mapping hiện đại",
          recommendation: "Chọn ấn nút LED nếu là công ty công nghệ, ô tô; chọn cắt băng đỏ truyền thống nếu kinh doanh bán lẻ",
        },
        {
          aspect: "Che chắn thời tiết",
          optionA: "Dùng ô dù bạt tròn thông thường",
          optionB: "Dựng nhà bạt nhôm không gian khẩu độ lớn",
          recommendation: "Bắt buộc chọn nhà bạt nhôm không gian nếu làm mặt bằng trống để chống gió lốc lật đổ",
        },
      ],
      recommendedEquipment: "Đội múa Lân Sư Rồng, bộ cắt băng dát vàng, màn LED ngoài trời, nhà bạt nhôm không gian",
      primaryActionHook: "Tư vấn chọn ngày hoàng đạo và kịch bản lễ khai trương hồng phát trọn gói trong 30 phút",
    };
  }

  // 4. NHÓM TIỆC TẤT NIÊN, YEAR END PARTY & KỶ NIỆM THÀNH LẬP
  if (
    k.includes("tất niên") ||
    k.includes("tat nien") ||
    k.includes("year end party") ||
    k.includes("yep") ||
    k.includes("gala dinner") ||
    k.includes("tiệc cuối năm") ||
    k.includes("sinh nhật công ty") ||
    k.includes("kỷ niệm thành lập") ||
    k.includes("tổng kết")
  ) {
    return {
      category: "YEAR_END_ANNUAL_PARTY",
      categoryLabel: "Tiệc tất niên, Year End Party & Gala Dinner",
      subject,
      targetPersona: "Giám đốc nhân sự, Ban tổ chức nội bộ, CEO, Giám đốc Marketing",
      coreCustomerNeed: "Ý tưởng concept độc lạ không nhàm chán, kịch bản vinh danh xúc động, tiệc bùng nổ năng lượng",
      technicalHighlights: [
        "Kho ý tưởng concept độc bản: The Great Gatsby quý tộc, Đêm hội Oscar, Cyberpunk tương lai, Tết sum vầy",
        "Kịch bản đường dây cảm xúc 3 nhịp: Lắng đọng tri ân ➔ Trang trọng vinh danh ➔ Bùng nổ quẩy hết mình cùng DJ",
        "Hệ thống visual LED 3D Mapping cá nhân hóa theo từng cá nhân và phòng ban xuất sắc nhất năm",
        "Dàn âm thanh Line Array công suất chuẩn và đèn Moving Beam lập trình theo nhịp beat âm nhạc",
      ],
      hiddenConditions: [
        "Quy định về thời gian âm thanh của khách sạn hoặc trung tâm hội nghị (thường giới hạn âm lượng sau 22h)",
        "Thời gian tổng duyệt ráp sân khấu và test visual với MC cần ít nhất 3 - 4 tiếng trước giờ đón khách",
        "Hệ thống máy khói và pháo sáng cần đạt tiêu chuẩn an toàn PCCC của tòa nhà không kích hoạt còi báo cháy",
      ],
      practicalPitfalls: [
        "MC đọc nhầm tên nhân viên xuất sắc hoặc công bố sai danh hiệu phòng ban gây mất hào khí",
        "Sự kiện rơi vào lối mòn phát biểu lê thê của ban lãnh đạo khiến nhân viên chán nản ngồi bấm điện thoại",
        "Âm thanh hú rít khi ca sĩ hoặc nhân viên lên hát văn nghệ, phá hỏng không khí tiệc",
      ],
      scaleTiers: [
        {
          scaleName: "Tiệc ấm cúng quy mô 50 - 100 thành viên",
          scope: "Backdrop chụp ảnh concept, sân khấu mini, âm thanh 2 - 4 loa công suất chuẩn, 8 đèn Par LED",
          items: "Bao gồm MC hoạt náo tiệc, gói minigame bốc thăm may mắn, kịch bản vinh danh nội bộ",
          prepTime: "2 - 3 ngày",
          estimatedBudget: "18.000.000đ - 35.000.000đ (chưa gồm tiệc ăn)",
        },
        {
          scaleName: "Gala bùng nổ quy mô 150 - 350 thành viên",
          scope: "Photobooth 3D tương tác, màn hình LED P2.5 (20m²), dàn Line Array 4 loa, hệ thống Moving Beam",
          items: "MC chuyên nghiệp, vũ đoàn khai mạc bài nhảy độc quyền, DJ bùng nổ cuối tiệc, media recap 4K",
          prepTime: "5 - 7 ngày",
          estimatedBudget: "45.000.000đ - 85.000.000đ",
        },
        {
          scaleName: "Đại tiệc tập đoàn 400 - 1.000+ thành viên",
          scope: "Sân khấu vô cực, màn LED 3D toàn cảnh, giàn khung Truss treo, đạo diễn sân khấu và hiệu ứng pháo sáng lạnh",
          items: "Ca sĩ nổi tiếng, ban nhạc sống, quy trình an ninh chuyên nghiệp, livestream đa điểm cầu",
          prepTime: "10 - 20 ngày",
          estimatedBudget: "Dự toán chi tiết bóc tách từng phân đoạn",
        },
      ],
      tradeOffs: [
        {
          aspect: "Hình thức tiệc",
          optionA: "Tự thuê nhà hàng và tự tổ chức",
          optionB: "Giao chìa khóa trao tay cho Trường Hải Event",
          recommendation: "Chọn giao Trường Hải để giải phóng ban tổ chức nội bộ được thảnh thơi tận hưởng tiệc cùng đồng nghiệp",
        },
        {
          aspect: "Hiệu ứng sân khấu",
          optionA: "Dùng màn chiếu phông bạt tĩnh",
          optionB: "Dùng màn hình LED P2.5 trình chiếu visual chuyển động",
          recommendation: "Bắt buộc dùng màn LED P2.5 để các video clip tổng kết năm và khoảnh khắc vinh danh được tỏa sáng rực rỡ nhất",
        },
      ],
      recommendedEquipment: "Màn LED P2.5 mịn, dàn Line Array bùng nổ, đèn Moving Beam hiệu ứng, visual LED 3D",
      primaryActionHook: "Nhận ngay 3 ý tưởng concept Year End Party độc bản và dự toán tối ưu trong 30 phút",
    };
  }

  // 5. NHÓM HỘI NGHỊ, HỘI THẢO, TỌA ĐÀM & WORKSHOP
  if (
    k.includes("hội nghị") ||
    k.includes("hoi nghi") ||
    k.includes("hội thảo") ||
    k.includes("hoi thao") ||
    k.includes("tọa đàm") ||
    k.includes("workshop") ||
    k.includes("họp báo") ||
    k.includes("đại hội") ||
    k.includes("ký kết")
  ) {
    return {
      category: "CONFERENCE_SEMINAR_WORKSHOP",
      categoryLabel: "Hội nghị, hội thảo & tọa đàm chuyên nghiệp",
      subject,
      targetPersona: "Giám đốc đối ngoại, Thư ký ban giám đốc, Trưởng phòng truyền thông, Ban điều hành hiệp hội",
      coreCustomerNeed: "Tính trang nghiêm, chuẩn chỉ về âm thanh phát biểu, màn hình chiếu slide sắc nét, quy trình check-in hiện đại",
      technicalHighlights: [
        "Hệ thống mic cổ ngỗng đại biểu UHF đa kênh, tự động triệt tiêu tiếng vọng và tuyệt đối không trùng tần số",
        "Màn hình LED P2.5 siêu nét, đảm bảo các bảng biểu font chữ nhỏ trong slide trình chiếu hiển thị rõ ràng",
        "Hệ thống check-in quét mã QR thông minh tại bàn lễ tân giúp đón tiếp hàng trăm đại biểu trong vài phút",
        "Cabin dịch thuật đa ngôn ngữ và tai nghe không dây phục vụ các diễn giả quốc tế",
      ],
      hiddenConditions: [
        "Đường truyền Internet cáp quang chuyên dụng phục vụ việc livestream hội nghị hoặc kết nối Zoom đa quốc gia",
        "Ánh sáng trắng chuyên dụng cho bục phát biểu để phục vụ các cơ quan báo chí, truyền hình tác nghiệp ghi hình",
        "Quy chuẩn nghi thức ngoại giao về vị trí gắn biển tên và chỗ ngồi của các quan chức bộ ngành và đại sứ",
      ],
      practicalPitfalls: [
        "Micro hội nghị chập chờn, pin yếu giữa chừng lúc diễn giả quốc tế đang trình bày chuyên đề",
        "Máy chiếu hoặc màn LED bị lóa khiến người ngồi từ hàng ghế thứ 5 trở đi không đọc được số liệu báo cáo",
        "Tiệc trà teabreak chuẩn bị nghèo nàn, bánh nguội ngắt và thiếu nhân sự rót trà phục vụ khách VIP",
      ],
      scaleTiers: [
        {
          scaleName: "Tọa đàm, workshop chuyên đề (dưới 70 đại biểu)",
          scope: "Phông backdrop căng phẳng, 4 mic đại biểu không dây, âm thanh phòng kín, màn chiếu laser hoặc màn LED",
          items: "Bao gồm tiệc trà teabreak cơ bản (trà, cà phê, 3 loại bánh ngọt, hoa quả theo mùa), hoa tươi bục phát biểu",
          prepTime: "1 - 2 ngày",
          estimatedBudget: "12.000.000đ - 22.000.000đ",
        },
        {
          scaleName: "Hội nghị khách hàng & Đại hội cổ đông (100 - 300 đại biểu)",
          scope: "Màn LED P2.5 (15m²), giàn mic cổ ngỗng 8 - 12 chiếc, âm thanh Line Array hội trường, hệ thống QR check-in",
          items: "Đội ngũ 4 PG đón khách áo dài truyền thống, tiệc teabreak 5 món bánh cao cấp, chụp ảnh sự kiện chuyên nghiệp",
          prepTime: "3 - 5 ngày",
          estimatedBudget: "28.000.000đ - 55.000.000đ",
        },
        {
          scaleName: "Hội nghị quốc tế & Ký kết đa phương (300 - 800+ đại biểu)",
          scope: "Hệ thống cabin dịch thuật 2 - 3 ngôn ngữ, tai nghe hồng ngoại, màn LED cong 3D, bục ký kết trang trọng",
          items: "Kịch bản chuẩn nghi lễ ngoại giao, lễ tân ngoại ngữ, tiệc trưa set menu ẩm thực quốc tế",
          prepTime: "7 - 15 ngày",
          estimatedBudget: "Dự toán chi tiết bóc tách từng hạng mục công nghệ",
        },
      ],
      tradeOffs: [
        {
          aspect: "Hệ thống hiển thị",
          optionA: "Dùng máy chiếu công suất lớn",
          optionB: "Dùng màn hình LED P2.5 trong nhà",
          recommendation: "Bắt buộc chọn LED P2.5 vì máy chiếu trong phòng sáng bật đèn sẽ bị mờ và nhạt màu",
        },
        {
          aspect: "Đón tiếp đại biểu",
          optionA: "Điểm danh ghi danh sách sổ tay",
          optionB: "Hệ thống quét mã QR check-in tự động",
          recommendation: "Chọn QR check-in để thể hiện đẳng cấp chuyên nghiệp và loại bỏ hoàn toàn cảnh ùn tắc sảnh đón",
        },
      ],
      recommendedEquipment: "Hệ thống mic cổ ngỗng UHF, màn LED P2.5 siêu nét, bàn check-in QR, tiệc trà teabreak",
      primaryActionHook: "Tư vấn quy trình tổ chức hội nghị và giải pháp công nghệ check-in không ùn tắc trong 30 phút",
    };
  }

  // 6. NHÓM NGÀY HỘI GIA ĐÌNH, LỄ HỘI ÂM NHẠC & GIẢI THỂ THAO
  if (
    k.includes("ngày hội gia đình") ||
    k.includes("family day") ||
    k.includes("lễ hội") ||
    k.includes("marathon") ||
    k.includes("giải chạy") ||
    k.includes("hội thao") ||
    k.includes("trung thu") ||
    k.includes("thiếu nhi") ||
    k.includes("8/3") ||
    k.includes("20/10")
  ) {
    return {
      category: "FESTIVAL_SPORTS_COMMUNITY",
      categoryLabel: "Ngày hội văn hóa, thể thao & lễ hội cộng đồng",
      subject,
      targetPersona: "Công đoàn cơ sở, Ban nhân sự văn hóa doanh nghiệp, Ban tổ chức giải thể thao",
      coreCustomerNeed: "Hoạt động sôi nổi cho nhiều lứa tuổi, an toàn tuyệt đối cho trẻ em, logistics vận hành bài bản",
      technicalHighlights: [
        "Hệ thống lều trại dã ngoại, khu vui chơi liên hoàn, nhà bóng, cầu trượt phao khổng lồ cho trẻ nhỏ",
        "Sân khấu lễ hội ngoài trời, âm thanh Line Array bao quát toàn bộ khuôn viên công viên hoặc sân vận động",
        "Bộ nhận diện đồng bộ: Cổng chào khinh khí cầu, cờ phướn rực rỡ, bộ Race kit và huy chương kim loại đúc khuôn",
        "Đội ngũ y tế lưu động, bảo vệ an ninh trật tự và phân luồng xe chuyên nghiệp",
      ],
      hiddenConditions: [
        "Giấy phép tổ chức sự kiện tập trung đông người của UBND quận/huyện và phương án PCCC hiện trường",
        "Nguồn nước sạch dự phòng và khu vệ sinh di động cho hàng ngàn người tham gia ngoài trời",
        "Kế hoạch phân luồng giao thông và trông giữ xe đối với các sự kiện có quy mô lớn",
      ],
      practicalPitfalls: [
        "Thiếu khu vực bóng mát nghỉ ngơi khiến người già và trẻ nhỏ bị say nắng khi trời trưa nắng gắt",
        "Trạm tiếp nước và đồ ăn nhẹ không đủ đáp ứng, gây cảnh chen lấn lộn xộn",
        "Khu trò chơi trẻ em không có nhân viên giám sát an toàn dẫn đến va chạm trầy xước",
      ],
      scaleTiers: [
        {
          scaleName: "Ngày hội nội bộ quy mô 100 - 250 người",
          scope: "Khu vực sân khấu trung tâm, 3 gian hàng trò chơi dân gian/hiện đại, chú hề vặn bóng, âm thanh ngoài trời",
          items: "Bao gồm MC gia đình, bộ quà tặng trẻ em, nhà bạt che mát, nước uống và hoa quả giải nhiệt",
          prepTime: "3 - 5 ngày",
          estimatedBudget: "25.000.000đ - 45.000.000đ",
        },
        {
          scaleName: "Lễ hội quy mô 300 - 800 người",
          scope: "Sân khấu nhạc hội, hệ thống gian hàng hội chợ ẩm thực, giàn phao hơi liên hoàn, âm thanh Line Array",
          items: "Ca sĩ khách mời thiếu nhi/nghệ sĩ nổi tiếng, đội ngũ 10 bảo vệ an ninh, ekip y tế thường trực",
          prepTime: "7 - 10 ngày",
          estimatedBudget: "60.000.000đ - 120.000.000đ",
        },
        {
          scaleName: "Đại hội thể thao / Giải chạy 1.000 - 3.000+ người",
          scope: "Cổng vòm hơi Start/Finish, hệ thống chip timing chấm giờ, sân khấu trao giải, tiếp nước dọc cung đường",
          items: "Huy chương đúc nổi, áo Finisher, xe cứu thương bám sát lộ trình, hợp đồng tài trợ và giấy phép cơ quan",
          prepTime: "15 - 30 ngày",
          estimatedBudget: "Dự toán tổng thể theo quy mô VĐV",
        },
      ],
      tradeOffs: [
        {
          aspect: "Hoạt động cho trẻ em",
          optionA: "Chỉ thuê xiếc ảo thuật biểu diễn trên sân khấu",
          optionB: "Bố trí khu vui chơi trải nghiệm tương tác trực tiếp",
          recommendation: "Nên kết hợp cả hai để phụ huynh có thời gian thảnh thơi trò chuyện trong khi con trẻ được thỏa sức vận động",
        },
        {
          aspect: "Âm thanh sự kiện",
          optionA: "Loa hộp gắn tường thông thường",
          optionB: "Hệ thống Line Array ngoài trời góc phủ rộng",
          recommendation: "Bắt buộc chọn Line Array vì không gian mở cần độ phóng âm thanh cao và rõ tiếng thông báo",
        },
      ],
      recommendedEquipment: "Nhà bạt che mát, khu trò chơi phao liên hoàn, âm thanh Line Array ngoài trời, cổng hơi",
      primaryActionHook: "Tư vấn thiết kế ngày hội văn hóa trọn gói và phương án an toàn trong 30 phút",
    };
  }

  // 7. DEFAULT / CUSTOM TAILORED EVENT (Xử lý linh hoạt cho mọi từ khóa khác)
  return {
    category: "CUSTOM_TAILORED_EVENT",
    categoryLabel: "Tổ chức sự kiện độc bản theo yêu cầu riêng",
    subject,
    targetPersona: "Đại diện ban tổ chức, Giám đốc, Trưởng phòng truyền thông, Chủ trì dự án",
    coreCustomerNeed: "Đảm bảo sự kiện thành công trọn vẹn, không xảy ra rủi ro kỹ thuật, báo giá minh bạch không phát sinh",
    technicalHighlights: [
      "Kho thiết bị trực tiếp: Loa Line Array, màn hình LED P2.5/P3.91, ánh sáng Moving Beam, không qua trung gian",
      "Kịch bản thiết kế riêng biệt theo mục tiêu cụ thể của thương hiệu, không sao chép văn mẫu",
      "Quy trình khảo sát hiện trường miễn phí trong 24 giờ và lên bản vẽ phối cảnh 2D/3D chi tiết",
      "Đội ngũ kỹ thuật viên lành nghề trực chiến trước giờ G 6 - 12 tiếng, sẵn sàng phương án dự phòng 100%",
    ],
    hiddenConditions: [
      "Điều kiện hạ tầng hiện trường: Tải trọng nguồn điện, chiều cao trần nhà và kích thước cửa vận chuyển",
      "Quy định pháp lý và thủ tục xin phép cơ quan chức năng hoặc ban quản lý địa điểm",
      "Kế hoạch dự phòng các yếu tố thời tiết cực đoan đối với các sự kiện ngoài trời",
    ],
    practicalPitfalls: [
      "Thuê phải đơn vị môi giới trung gian, chi phí bị kê chênh lệch từ 20% đến 35% so với giá trị thực",
      "Báo giá ban đầu rất rẻ nhưng đến ngày diễn ra lại tính thêm các khoản phụ phí phát sinh vô lý",
      "Nhân sự vận hành thiếu kinh nghiệm thực chiến xử lý sự cố khi xảy ra mất điện hoặc thời tiết xấu",
    ],
    scaleTiers: [
      {
        scaleName: "Quy mô sự kiện tiêu chuẩn (dưới 100 người)",
        scope: "Sân khấu lắp ghép, backdrop chụp ảnh, âm thanh 2 - 4 loa, micro không dây, tiệc trà teabreak",
        items: "Bao gồm 01 MC dẫn chương trình, kỹ thuật viên trực chiến toàn thời gian, hỗ trợ kịch bản chi tiết",
        prepTime: "1 - 3 ngày",
        estimatedBudget: "15.000.000đ - 28.000.000đ",
      },
      {
        scaleName: "Quy mô nâng cao (100 - 300 người)",
        scope: "Dàn âm thanh Line Array 4 loa, màn hình LED P3.91 (15m²), đèn sân khấu Par LED + Beam, PG đón khách",
        items: "Thiết kế visual độc quyền, kịch bản sáng tạo, quay phim chụp ảnh phóng sự HD",
        prepTime: "3 - 7 ngày",
        estimatedBudget: "35.000.000đ - 65.000.000đ",
      },
      {
        scaleName: "Quy mô lớn & VIP (300 - 1.000+ người)",
        scope: "Hệ thống Line Array công suất lớn, màn LED P2.5 siêu nét (30m²), giàn Truss nhôm, visual 3D mapping",
        items: "Tổng đạo diễn điều phối hiện trường, đón tiếp khách mời VIP, cam kết hợp đồng pháp lý bảo hiểm",
        prepTime: "7 - 15 ngày",
        estimatedBudget: "Báo giá bóc tách theo hồ sơ kỹ thuật chi tiết",
      },
    ],
    tradeOffs: [
      {
        aspect: "Lựa chọn đơn vị tổ chức",
        optionA: "Làm việc với công ty môi giới trung gian",
        optionB: "Hợp tác với đơn vị sở hữu tổng kho như Trường Hải",
        recommendation: "Chọn đơn vị có kho trực tiếp để tiết kiệm 15% - 25% ngân sách và kiểm soát tuyệt đối chất lượng",
      },
      {
        aspect: "Cam kết chi phí",
        optionA: "Hợp đồng mở có điều khoản phụ phí",
        optionB: "Cam kết trọn gói 'không phát sinh thêm một đồng'",
        recommendation: "Bắt buộc ký hợp đồng trọn gói để bảo vệ ngân sách công ty trước các chi phí bốc dỡ, kỹ thuật đêm",
      },
    ],
    recommendedEquipment: "Loa Line Array nhập khẩu, màn LED P2.5/P3.91, ánh sáng Moving Beam, đội xe riêng",
    primaryActionHook: "Tư vấn kịch bản độc bản và nhận bảng dự toán bóc tách chi tiết trong 30 phút",
  };
}
