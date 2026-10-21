/**
 * THÔNG TIN THƯƠNG HIỆU & DOANH NGHIỆP DÙNG CHUNG
 * CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI (Trường Hải Event & Travel)
 * Các trang và component import trực tiếp dữ liệu từ file này để đảm bảo tính nhất quán.
 */

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: "su-kien" | "du-lich";
  description: string;
  features: string[];
  image_url: string;
  popular?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: "su-kien" | "du-lich" | "thien-nguyen";
  client_name: string;
  description: string;
  image_url: string;
  year?: string;
  location?: string;
}

export interface PartnerGroup {
  category: string;
  description: string;
  partners: {
    name: string;
    sub?: string;
    logo?: string;
  }[];
}

export const COMPANY_INFO = {
  name: "Công ty TNHH Sự kiện và Du lịch Trường Hải",
  brandName: "Trường Hải Event & Travel",
  englishName: "TRUONG HAI EVENT AND TRAVEL COMPANY LIMITED",
  slogan: "Sự kiện chuyên nghiệp – Du lịch trải nghiệm – Kết nối thành công",
  director: "Nguyễn Thị Thu Hằng",
  taxId: "0111601327",
  taxAuthority: "Sở Kế hoạch và Đầu tư TP Hà Nội",
  address: "LK 628, ngõ Lực, đường Sinh Viên, thôn Thanh Kỳ, xã Bình Minh, TP Hà Nội",
  hotline: "0844 198 333",
  hotlineDisplay: "0844.198.333",
  email: "truonghaieventtravel@gmail.com",
  website: "https://truonghaievent.com",
  workingHours: "08:00 - 18:00 (Thứ 2 - Thứ 7, Hỗ trợ sự kiện 24/7)",
  socials: {
    facebook: "https://facebook.com/truonghaievent",
    zalo: "https://zalo.me/0844198333",
    youtube: "https://youtube.com/@truonghaievent",
  },
  theme: {
    primary: "#0A1E5E", // Xanh Navy đậm
    primaryDark: "#06123B",
    accent: "#D4AF37", // Vàng Ánh Kim / Gold
    accentLight: "#F5E08B",
  },
  vision:
    "Trở thành đơn vị uy tín, sáng tạo và tiên phong trong lĩnh vực tổ chức sự kiện và du lịch; là sự lựa chọn tin cậy và ưu tiên hàng đầu của các doanh nghiệp, tổ chức cơ quan đoàn thể trên toàn quốc.",
  mission:
    "Mang đến trải nghiệm thực tế, chất lượng và giàu giá trị; không ngừng sáng tạo, đổi mới ý tưởng tạo nên những chương trình chuyên nghiệp, ý nghĩa và đáng nhớ, gắn kết bền vững các mối quan hệ.",
  coreValues: [
    { title: "Chuyên nghiệp", desc: "Chuẩn xác từng chi tiết, quản trị rủi ro tối đa trong từng sự kiện" },
    { title: "Sáng tạo", desc: "Ý tưởng đột phá, kịch bản độc bản cá nhân hóa theo từng khách hàng" },
    { title: "Tận tâm", desc: "Đồng hành 24/7, luôn đặt sự hài lòng và thành công của đối tác lên hàng đầu" },
    { title: "Lan tỏa", desc: "Gắn kết cộng đồng thông qua các hoạt động thiện nguyện và du lịch nhân văn" },
  ],
  stats: [
    { value: "500+", label: "Sự kiện thành công", desc: "Quy mô từ 50 đến 5.000 khách" },
    { value: "100+", label: "Đối tác & Doanh nghiệp", desc: "Đoàn thể, tập đoàn, trường học tin cậy" },
    { value: "10+", label: "Năm kinh nghiệm", desc: "Đội ngũ chuyên gia tổ chức sự kiện & tour" },
    { value: "99%", label: "Khách hàng hài lòng", desc: "Tỉ lệ phản hồi tích cực và tái ký hợp đồng" },
  ],
};

export const PARTNER_GROUPS: PartnerGroup[] = [
  {
    category: "Đoàn thể & Cơ quan Nhà nước",
    description: "Đơn vị tin cậy của các tổ chức đoàn thể thanh niên và cơ quan an ninh trật tự",
    partners: [
      { name: "Trung ương Đoàn TNCS Hồ Chí Minh", sub: "Cơ quan Trung ương" },
      { name: "Thành Đoàn Hà Nội", sub: "Đoàn TNCS TP Hà Nội" },
      { name: "Công An TP Hà Nội - PA05", sub: "Phòng An ninh mạng & PCTP CNC" },
      { name: "Công An TP Hà Nội - Phòng CSGT", sub: "Phòng Cảnh sát giao thông" },
      { name: "Công An TP Hà Nội - Phòng CSHS", sub: "Phòng Cảnh sát hình sự" },
      { name: "Công an Phường Yên Hòa", sub: "Q. Cầu Giấy, Hà Nội" },
      { name: "Trung tâm Tình nguyện Quốc gia", sub: "VVC - TW Đoàn" },
      { name: "Tổng cục Đường bộ Việt Nam", sub: "Bộ Giao thông Vận tải" },
    ],
  },
  {
    category: "Trường Đại học & Bệnh viện",
    description: "Đối tác sự kiện giáo dục, hội thảo khoa học và chương trình sinh viên",
    partners: [
      { name: "ĐH Bách Khoa Hà Nội", sub: "Trường ĐH Bách Khoa" },
      { name: "ĐH Kinh tế Quốc dân (NEU)", sub: "Trường ĐH Kinh tế Quốc dân" },
      { name: "ĐH Công Đoàn", sub: "Tổng LĐLĐ Việt Nam" },
      { name: "ĐH Tài nguyên & Môi trường", sub: "Bộ TN&MT" },
      { name: "ĐH Nội Vụ", sub: "Học viện Hành chính Quốc gia" },
      { name: "ĐH Vinh & ĐH Y Khoa Vinh", sub: "Cơ sở GD Nghệ An" },
      { name: "Bệnh viện Nhi Trung ương", sub: "Bệnh viện tuyến đầu Quốc gia" },
    ],
  },
  {
    category: "Doanh nghiệp & Tập đoàn",
    description: "Đồng hành cùng các ngân hàng, tập đoàn bán lẻ, bất động sản hàng đầu",
    partners: [
      { name: "Vietcombank", sub: "Ngân hàng Ngoại thương Việt Nam" },
      { name: "VPBank", sub: "Ngân hàng TMCP Việt Nam Thịnh Vượng" },
      { name: "NCB", sub: "Ngân hàng TMCP Quốc Dân" },
      { name: "CellphoneS", sub: "Hệ thống bán lẻ công nghệ" },
      { name: "Hoàng Hà Mobile", sub: "Hệ thống chuỗi bán lẻ điện thoại" },
      { name: "Digiworld (DGW)", sub: "Tập đoàn phân phối công nghệ" },
      { name: "LocknLock", sub: "Thương hiệu gia dụng toàn cầu" },
      { name: "Phúc Long Tea & Coffee", sub: "Chuỗi F&B cao cấp" },
      { name: "Cen Invest & Tân Long Group", sub: "Tập đoàn Bất động sản" },
      { name: "Công ty Cổ phần LABCO", sub: "24 năm phát triển" },
      { name: "Địa ốc TL K11 & The K-Park", sub: "Dự án BĐS cao cấp" },
      { name: "Công ty CP DAMSAN", sub: "Tập đoàn công nghiệp dệt may" },
    ],
  },
];

export const SERVICES_DATA: ServiceItem[] = [
  // Mảng Sự kiện
  {
    id: "sk-1",
    title: "Lễ kỷ niệm, khánh thành, khai trương, khởi công – động thổ",
    slug: "le-ky-niem-khanh-thanh-khai-truong",
    category: "su-kien",
    description:
      "Tổ chức trọn gói các nghi lễ trọng thể mang tính bước ngoặt của doanh nghiệp với quy trình chuẩn chỉ, thiết bị đẳng cấp và kịch bản trang trọng.",
    features: [
      "Kịch bản nghi thức bài bản, trang nghiêm và chuyên nghiệp",
      "Hệ thống nhà bạt không gian, cổng hơi, cắt băng khánh thành",
      "Cung cấp MC, PG, đội lân sư rồng khai trương rộn rã",
      "Tiệc trà Teabreak và quà tặng lưu niệm sang trọng",
    ],
    image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    popular: true,
  },
  {
    id: "sk-2",
    title: "Tiệc tất niên Year End Party (Y.E.P), Gala Dinner & Team Building",
    slug: "tiec-tat-nien-gala-dinner-team-building",
    category: "su-kien",
    description:
      "Chương trình gắn kết nội bộ thăng hoa cảm xúc, tôn vinh cống hiến của nhân sự và tri ân một năm nỗ lực với concept độc bản sáng tạo.",
    features: [
      "Ý tưởng concept Y.E.P theo câu chuyện thương hiệu từng công ty",
      "Game show Team Building bùng nổ, gắn kết tinh thần đồng đội",
      "Đạo diễn âm thanh, ánh sáng, visual màn hình LED đỉnh cao",
      "Band nhạc acoustic, vũ đoàn, ca sĩ khách mời nổi tiếng",
    ],
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    popular: true,
  },
  {
    id: "sk-3",
    title: "Sự kiện mở bán Bất động sản, Hội nghị & Hội thảo",
    slug: "su-kien-mo-ban-bds-hoi-nghi-hoi-thao",
    category: "su-kien",
    description:
      "Giải pháp tổ chức lễ mở bán kích cầu giao dịch, hội thảo chuyên đề khoa học và xúc tiến thương mại quy mô từ hàng trăm đến hàng ngàn khách.",
    features: [
      "Hệ thống âm thanh ánh sáng hội nghị hội thảo tiêu chuẩn quốc tế",
      "Sân khấu ra mắt dự án với hiệu ứng 3D Mapping & Màn hình LED P2.5",
      "Quy trình check-in mã QR tự động hóa, lễ tân tiếp đón chuyên nghiệp",
      "Điều phối phiên giao dịch trực tiếp nhanh chóng, chính xác",
    ],
    image_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sk-4",
    title: "Sự kiện Trung thu, Tết Thiếu nhi, Ngày hội gia đình & Họp lớp",
    slug: "trung-thu-tet-thieu-nhi-family-day",
    category: "su-kien",
    description:
      "Không gian vui tươi, ấm cúng và đầy màu sắc dành cho các gia đình, trường học, cơ quan và các khóa cựu học sinh, sinh viên tri ân.",
    features: [
      "Chú Cuội, Chị Hằng, Chú Hề vặn bóng nghệ thuật, xiếc ảo thuật",
      "Gian hàng trò chơi dân gian tương tác và quà tặng tuổi thơ",
      "Mâm cỗ trung thu nghệ thuật và phá cỗ trông trăng",
      "Chụp ảnh photobooth lưu giữ ký ức tuổi học trò",
    ],
    image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sk-5",
    title: "Cung cấp thiết bị Âm thanh, Ánh sáng, Sân khấu, Màn hình LED",
    slug: "cung-cap-thiet-bi-am-thanh-anh-sang-san-khau",
    category: "su-kien",
    description:
      "Kho thiết bị sự kiện hiện đại, nhập khẩu chính hãng với dàn Line Array công suất lớn, đèn Beam, Par Led, màn hình LED sắc nét phục vụ trong nhà và ngoài trời.",
    features: [
      "Hệ thống loa Line Array công suất khủng, micro không dây cao cấp",
      "Màn hình LED Indoor/Outdoor cabinet nhôm đúc P2.5 - P3.91 siêu nét",
      "Hệ thống ánh sáng Moving Head Beam, Laser, Par Led 54 bóng",
      "Đội ngũ kỹ thuật viên âm thanh ánh sáng trực chiến 100% thời gian",
    ],
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  },

  // Mảng Du lịch
  {
    id: "dl-1",
    title: "Tổ chức Tour Doanh nghiệp, Tập thể, Cá nhân",
    slug: "tour-doanh-nghiep-tap-the-ca-nhan",
    category: "du-lich",
    description:
      "Thiết kế tour du lịch nghỉ dưỡng kết hợp Team Building, Gala Dinner tại các thiên đường nghỉ dưỡng như Hạ Long, Đà Nẵng, Phú Quốc, Sapa, Quy Nhơn...",
    features: [
      "Hành trình được may đo theo đúng ngân sách và sở thích doanh nghiệp",
      "Hệ thống khách sạn / resort 4 - 5 sao liên kết giá ưu đãi nhất",
      "Hướng dẫn viên chuyên nghiệp, am hiểu văn hóa và tận tâm chăm sóc",
      "Bảo hiểm du lịch mức cao nhất và trọn gói dịch vụ chu đáo",
    ],
    image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    popular: true,
  },
  {
    id: "dl-2",
    title: "Dịch vụ Vận tải, Cho thuê Xe Du lịch đời mới",
    slug: "dich-vu-van-tai-xe-du-lich",
    category: "du-lich",
    description:
      "Đội xe du lịch đời mới từ 7, 16, 29, 35 đến 45 chỗ và xe Limousine VIP phục vụ đưa đón hội nghị, đưa đón chuyên gia, đưa đón sân bay và các tuyến tour.",
    features: [
      "Dàn xe Hyundai Universe, Thaco Town, Ford Transit, Dcar Limousine",
      "Nội thất sạch sẽ, máy lạnh mát sâu, wifi, bảo dưỡng định kỳ",
      "Lái xe lịch sự, chuẩn giờ, nhiều năm kinh nghiệm lái tour an toàn",
      "Hợp đồng pháp lý minh bạch, xuất hóa đơn VAT đầy đủ",
    ],
    image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dl-3",
    title: "Du lịch Tham quan, Học tập, Trải nghiệm & Thiện nguyện Cộng đồng",
    slug: "du-lich-trai-nghiem-thien-nguyen-cong-dong",
    category: "du-lich",
    description:
      "Các tour giáo dục thực tế kết hợp thiện nguyện vì cộng đồng tại các bản làng vùng cao Tây Bắc, Đông Bắc; vừa bồi đắp tri thức vừa lan tỏa yêu thương.",
    features: [
      "Tổ chức trao quà, xây điểm trường, khám sức khỏe tại vùng cao",
      "Giao lưu văn hóa bản địa chân thực cùng đồng bào thiểu số",
      "Chương trình rèn luyện kỹ năng sinh tồn và gắn kết tình đồng đội",
      "Có giấy chứng nhận tham gia hoạt động xã hội cho học sinh, sinh viên",
    ],
    image_url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Lễ thông xe Dự án sửa chữa Cầu Thăng Long",
    category: "su-kien",
    client_name: "Tổng cục Đường bộ Việt Nam & Bộ GTVT",
    description:
      "Sự kiện quy mô quốc gia chào mừng công trình giao thông trọng điểm huyết mạch của Thủ đô Hà Nội. Trường Hải Event đảm nhận toàn bộ sân khấu, thiết bị âm thanh ánh sáng và điều phối nghi thức cắt băng thông xe.",
    image_url: "/images/projects/cau-thang-long.jpg",
    year: "2021",
    location: "Hà Nội",
  },
  {
    id: "proj-2",
    title: "Lễ khánh thành Hệ thống Điện mặt trời Áp Mái tại Nhà máy EIFFEL",
    category: "su-kien",
    client_name: "Công ty Cổ phần DAMSAN",
    description:
      "Tổ chức lễ khánh thành nhà máy điện mặt trời công nghệ xanh với hơn 500 khách mời là lãnh đạo các sở ban ngành tỉnh Thái Bình và các đối tác tài chính quốc tế.",
    image_url: "/images/projects/nha-may-eiffel.jpg",
    year: "2022",
    location: "Thái Bình",
  },
  {
    id: "proj-3",
    title: "Lễ mở bán Dự án Vinpearl Resort & Golf Nam Hội An",
    category: "su-kien",
    client_name: "Vingroup / Đơn vị Phân phối BĐS",
    description:
      "Sự kiện mở bán siêu dự án nghỉ dưỡng thượng lưu thu hút hàng trăm nhà đầu tư VIP. Không gian sang trọng với công nghệ màn hình LED cong và sân khấu trình diễn nghệ thuật đẳng cấp.",
    image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    year: "2022",
    location: "Quảng Nam",
  },
  {
    id: "proj-4",
    title: "Chuỗi Lễ khai trương Điểm bán hàng: LocknLock, Toyoky, Showroom Nam Hải Ceramic",
    category: "su-kien",
    client_name: "LocknLock & Nam Hải Ceramic & Cafe Sài Gòn",
    description:
      "Chuỗi sự kiện Grand Opening bùng nổ tại các trung tâm thương mại lớn, kết hợp biểu diễn múa Lân Sư Rồng, minigame bốc thăm trúng thưởng và activation kích hoạt thương hiệu.",
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    year: "2023",
    location: "Hà Nội & TP.HCM",
  },
  {
    id: "proj-5",
    title: "Tiệc Tất niên Y.E.P & Hội chợ Xuân Tri ân",
    category: "su-kien",
    client_name: "Công An Phường Yên Hòa & Miss Hoa TOEIC & TL K11",
    description:
      "Chương trình Gala mừng xuân ấm cúng, tái hiện không gian Tết cổ truyền kết hợp sân khấu âm nhạc sôi động, mang lại nụ cười và sự gắn kết cho cán bộ chiến sĩ và toàn thể nhân viên.",
    image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    year: "2023",
    location: "Hà Nội",
  },
  {
    id: "proj-6",
    title: "Hội thao Kỷ niệm 24 năm LABCO & Company Trip 4N3Đ TL K11",
    category: "du-lich",
    client_name: "Công ty Cổ phần LABCO & Địa ốc TL K11",
    description:
      "Chuỗi ngày hội thao quy mô toàn công ty kết hợp tour nghỉ dưỡng 4 ngày 3 đêm tại biển miền Trung, mang lại năng lượng tái tạo đỉnh cao và gắn kết 300+ cán bộ nhân viên.",
    image_url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
    year: "2024",
    location: "Đà Nẵng - Hội An",
  },
  {
    id: "proj-7",
    title: "Chương trình Thiện nguyện 'Chắp cánh ước mơ' & 'Hướng về Sìn Hồ'",
    category: "thien-nguyen",
    client_name: "Trường Hải Event & Nhóm Tình nguyện Cộng đồng",
    description:
      "Hành trình trao hơn 1.000 phần quà, áo ấm và học bổng cho các em nhỏ điểm trường khó khăn tại tỉnh Yên Bái và huyện biên giới Sìn Hồ (Lai Châu), thể hiện trách nhiệm xã hội sâu sắc.",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    year: "2024",
    location: "Yên Bái & Lai Châu",
  },
];

export const MOCK_BLOG_POSTS = [
  {
    id: "post-1",
    title: "Quy trình Tổ chức Lễ Khai trương Trọn gói từ A-Z Độc đáo & Thu hút Khách hàng",
    slug: "quy-trinh-to-chuc-le-khai-truong-tron-goi-tu-a-z",
    meta_description:
      "Hướng dẫn chi tiết quy trình tổ chức lễ khai trương cửa hàng, showroom thành công rực rỡ, thu hút tài lộc từ chuyên gia tổ chức sự kiện Trường Hải Event & Travel.",
    focus_keyword: "tổ chức lễ khai trương",
    status: "published",
    created_at: "2026-10-10T08:00:00Z",
    content: `
# Quy trình Tổ chức Lễ Khai trương Trọn gói từ A-Z Độc đáo & Thu hút Khách hàng

Lễ khai trương (Grand Opening) không chỉ là sự kiện ra mắt đánh dấu bước khởi đầu hoạt động của doanh nghiệp, cửa hàng hay showroom, mà còn là **cơ hội vàng để định vị thương hiệu** và tạo ấn tượng mạnh mẽ với khách hàng tiềm năng.

Là đơn vị từng đồng hành tổ chức thành công chuỗi khai trương cho các thương hiệu lớn như **LocknLock, Showroom Nam Hải Ceramic, Cafe Sài Gòn**, **Trường Hải Event & Travel** xin chia sẻ trọn bộ cẩm nang tổ chức lễ khai trương chuẩn phong thủy và hút khách từ A-Z.

## 1. Xác định mục tiêu và ngân sách sự kiện
Trước khi bắt tay vào triển khai, bạn cần làm rõ:
- Đối tượng khách mời: Đối tác chiến lược, khách hàng thân thiết, KOLs/Influencers hay người dân địa phương.
- Thông điệp truyền thông: Khuyến mãi sốc mở bán, trải nghiệm sản phẩm hay cam kết dịch vụ cao cấp.
- Dự trù ngân sách: Chi phí thuê địa điểm, sân khấu màn hình LED, múa Lân Sư Rồng, tiệc trà Teabreak và quà tặng.

## 2. Kịch bản nghi lễ khai trương chuẩn phong thủy
Một buổi lễ khai trương chuyên nghiệp thường kéo dài 2-3 tiếng với các mốc chính:
1. **Đón tiếp khách (08:30 - 09:00):** PG lễ tân cài hoa, check-in chụp ảnh tại Photobooth thương hiệu.
2. **Nghi thức mở màn (09:00 - 09:20):** Biểu diễn Múa Lân Sư Rồng - Trống hội rộn rã rước tài lộc.
3. **Phát biểu & Tuyên bố lý do (09:20 - 09:40):** Đại diện doanh nghiệp phát biểu tầm nhìn và tri ân.
4. **Nghi thức Cắt băng khai trương & Khui sâm-panh (09:40 - 10:00):** Khoảnh khắc linh thiêng đánh dấu bước ngoặt.
5. **Tham quan showroom & Thưởng thức tiệc trà (10:00 - 11:30):** Trải nghiệm dịch vụ và bốc thăm trúng thưởng.

## 3. Tại sao chọn Trường Hải Event & Travel đồng hành?
- Đội ngũ am hiểu tâm lý khách hàng và phong thủy nghi lễ.
- Kho thiết bị âm thanh ánh sáng, sân khấu màn LED nhập khẩu trực tiếp không qua trung gian.
- Hotline tư vấn 24/7: **0844 198 333**.
    `,
  },
  {
    id: "post-2",
    title: "Top 7 Ý tưởng Tổ chức Year End Party (Y.E.P) Đột phá & Gắn kết Nhân sự 2026",
    slug: "top-7-y-tuong-to-chuc-year-end-party-dot-pha-2026",
    meta_description:
      "Khám phá 7 concept tiệc tất niên Year End Party (YEP) độc đáo, bùng nổ cảm xúc cho doanh nghiệp, giúp tôn vinh cống hiến và tái tạo năng lượng cho năm mới.",
    focus_keyword: "tổ chức year end party",
    status: "published",
    created_at: "2026-10-12T09:30:00Z",
    content: `
# Top 7 Ý tưởng Tổ chức Year End Party (Y.E.P) Đột phá & Gắn kết Nhân sự 2026

Tiệc tất niên Year End Party (Y.E.P) đã vượt ra khỏi khuôn khổ một bữa cơm liên hoan đơn thuần. Ngày nay, các doanh nghiệp coi Y.E.P là ngày hội văn hóa doanh nghiệp - nơi tôn vinh những cống hiến thầm lặng và truyền cảm hứng bứt phá cho chặng đường sắp tới.

## 1. Concept 'Chuyến bay Di sản & Tương lai' (Futuristic Journey)
Sử dụng công nghệ visual màn hình LED 3D tái hiện hành trình doanh nghiệp vượt qua thách thức để chạm tới những đỉnh cao mới.

## 2. Dạ tiệc Hoàng Gia (Gatsby / Red Carpet Gala)
Không gian thảm đỏ lung linh với dress code sang trọng (Vàng Gold - Đen / Xanh Navy). Đây là dịp để toàn thể cán bộ nhân viên tỏa sáng như những ngôi sao thực thụ.

## 3. Hội chợ Tết Cổ truyền kết hợp Lễ hội Âm nhạc
Trường Hải Event từng dàn dựng thành công cho Công an Phường Yên Hòa và các doanh nghiệp đối tác: những gian hàng trò chơi dân gian, nặn tò he, viết thư pháp kết hợp DJ EDM bùng nổ cuối chương trình.

## 4. Trường Hải Event & Travel - Chuyên gia thiết kế Y.E.P độc bản
Với hơn 10 năm kinh nghiệm và hệ thống thiết bị âm thanh ánh sáng hàng đầu miền Bắc, chúng tôi cam kết mang lại một đêm tiệc thăng hoa cảm xúc nhất cho doanh nghiệp của bạn!
Liên hệ tư vấn concept miễn phí: **0844 198 333**.
    `,
  },
  {
    id: "post-3",
    title: "Cẩm nang Tổ chức Tour Du lịch Kết hợp Team Building Cho Doanh nghiệp Lớn",
    slug: "cam-nang-to-chuc-tour-du-lich-team-building-doanh-nghiep",
    meta_description:
      "Bí quyết xây dựng lịch trình tour du lịch kết hợp Team Building chuyên nghiệp, an toàn, tiết kiệm chi phí tối ưu cho các tập thể từ 50 đến 1000 người.",
    focus_keyword: "tour du lịch team building doanh nghiệp",
    status: "published",
    created_at: "2026-10-15T14:15:00Z",
    content: `
# Cẩm nang Tổ chức Tour Du lịch Kết hợp Team Building Cho Doanh nghiệp Lớn

Kết hợp du lịch nghỉ dưỡng và hoạt động gắn kết Team Building là giải pháp tối ưu giúp nâng cao tinh thần đồng đội và xua tan áp lực công việc cho nhân sự.

## 1. Lựa chọn địa điểm phù hợp theo mùa
- **Mùa hè (Tháng 4 - 8):** Các thiên đường biển như Hạ Long, Cát Bà, Đà Nẵng, Quy Nhơn, Phú Quốc.
- **Mùa thu đông (Tháng 9 - 12):** Vùng núi cao Tây Bắc như Sapa, Mộc Châu, Mai Châu hoặc tour caravan trải nghiệm.

## 2. Kịch bản Team Building phải mang tính tương tác cao
Tránh những trò chơi vận động quá nặng hoặc gây phản cảm. Thay vào đó, kịch bản của Trường Hải Event luôn hướng đến:
- Thử thách trí tuệ đồng đội
- Khơi gợi khả năng lãnh đạo của các cấp quản lý
- Tinh thần 'Không ai bị bỏ lại phía sau'

## 3. Đội xe du lịch đời mới và hướng dẫn viên tâm huyết
Trường Hải Event & Travel sở hữu đội xe 16 - 45 chỗ đời mới, cam kết an toàn tuyệt đối trên từng cung đường.
Hotline đặt tour: **0844 198 333**.
    `,
  },
];
