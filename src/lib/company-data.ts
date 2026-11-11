/**
 * THÔNG TIN THƯƠNG HIỆU & DOANH NGHIỆP DÙNG CHUNG
 * CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI (Trường Hải Event & Travel)
 * Các trang và component import trực tiếp dữ liệu từ file này để đảm bảo tính nhất quán.
 */

export interface ServiceProjectImage {
  url: string;
  caption: string;
}

export interface ServiceProject {
  id: string;
  name: string;
  client?: string;
  date?: string;
  location?: string;
  description?: string;
  images: ServiceProjectImage[];
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: "su-kien" | "du-lich";
  description: string;
  features: string[];
  image_url: string;
  popular?: boolean;
  projects?: ServiceProject[];
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
  scale?: string;
  highlights?: string[];
  gallery?: {
    url: string;
    caption: string;
  }[];
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
    facebook: "https://www.facebook.com/truonghaisukienvadulich",
    messenger: "https://m.me/truonghaisukienvadulich",
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
    "Thỏa mãn nhu cầu trải nghiệm và mang đến những giá trị thiết thực cho khách hàng thông qua các sản phẩm, dịch vụ sự kiện và du lịch chuyên nghiệp. Trường Hải Event & Travel phấn đấu trở thành đơn vị uy tín, sáng tạo và tiên phong trong lĩnh vực tổ chức sự kiện và du lịch; xây dựng thương hiệu Trường Hải Event & Travel trở thành sự lựa chọn tin cậy và ưu tiên của khách hàng.",
  mission:
    "Cam kết mang đến cho khách hàng những trải nghiệm thực tế, chất lượng và giàu giá trị thông qua các sản phẩm, dịch vụ sự kiện và du lịch. Không ngừng sáng tạo, đổi mới và phát triển ý tưởng nhằm đáp ứng tốt nhất nhu cầu của khách hàng, đồng thời tạo nên những chương trình chuyên nghiệp, ý nghĩa và đáng nhớ.",
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
  {
    id: "le-khai-truong",
    title: "Lễ Khai Trương",
    slug: "le-khai-truong",
    category: "su-kien",
    description:
      "Tổ chức Lễ Khai Trương trọn gói chuẩn phong thủy, thu hút truyền thông và kích hoạt tài lộc cho cửa hàng, showroom, chi nhánh, văn phòng mới.",
    features: [
      "Kịch bản nghi thức cắt băng khai trương, khai quang điểm nhãn trang trọng",
      "Đội múa Lân Sư Rồng Tứ Quý, trống hội chào mừng, MC & PG đón khách",
      "Thi công sân khấu, thảm đỏ, cổng hơi, backdrop check-in 3D nổi bật",
      "Tiệc trà Teabreak cao cấp và minigame hoạt náo thu hút khách hàng",
    ],
    image_url: "/images/projects/khai-truong-cuong-phat.jpg",
    popular: true,
    projects: [
      {
        id: "kt-tan-phuong-cuong-phat",
        name: "Công ty Tân Phương & Cường Phát",
        client: "Công ty TNHH SX KD & TM Cường Phát",
        location: "Hà Nội",
        description: "Tổ chức lễ khai trương trụ sở & điểm kinh doanh với nghi thức cắt băng hồng phát, múa lân sư rồng và tiệc trà đón khách đối tác.",
        images: [
          { url: "/images/projects/khai-truong-cuong-phat.jpg", caption: "Nghi thức cắt băng Lễ khai trương Công ty TNHH SX KD & TM Cường Phát" },
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Toàn cảnh sân khấu & thảm đỏ Lễ khai trương" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khai trương hồng phát cùng Ban lãnh đạo" },
          { url: "/images/blog/stage-setup.jpg", caption: "Hệ thống âm thanh, ánh sáng và backdrop sự kiện hoàn thiện chỉn chu" },
        ],
      },
      {
        id: "kt-dien-mat-troi-thai-binh",
        name: "Hệ thống điện mặt trời Thái Bình",
        client: "Nhà máy EIFFEL - Tập đoàn DAMSAN",
        location: "Thái Bình",
        description: "Sự kiện ra mắt & đưa vào vận hành hệ thống điện mặt trời áp mái công nghệ xanh quy mô lớn tại tỉnh Thái Bình.",
        images: [
          { url: "/images/projects/nha-may-eiffel.jpg", caption: "Lễ ra mắt & vận hành Hệ thống điện mặt trời Thái Bình" },
          { url: "/images/blog/key-moment.jpg", caption: "Khoảnh khắc bấm nút & cắt băng chính thức vận hành dự án" },
          { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Đón tiếp hơn 500 khách mời lãnh đạo sở ban ngành và đối tác" },
          { url: "/images/blog/stage-setup.jpg", caption: "Không gian nhà bạt không gian hợp kim nhôm và sân khấu chính" },
        ],
      },
      {
        id: "kt-ghe-dien-massage",
        name: "Hệ thống ghế điện massage",
        client: "Showroom Ghế Điện Massage Chăm Sóc Sức Khỏe",
        location: "Hà Nội",
        description: "Tổ chức Grand Opening showroom hệ thống ghế điện massage cao cấp với đoàn lân sư rồng, PG đón khách và trải nghiệm sản phẩm thực tế.",
        images: [
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Không gian khai trương Showroom Hệ thống ghế điện massage" },
          { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80", caption: "Khu vực trưng bày sản phẩm và đón khách trải nghiệm ngày khai trương" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khai trương kích hoạt tài lộc" },
          { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80", caption: "Tiệc trà Teabreak phục vụ khách hàng tham quan mua sắm" },
        ],
      },
      {
        id: "kt-locknlock-long-bien",
        name: "LocknLock Long Biên",
        client: "LocknLock Việt Nam",
        location: "Long Biên, Hà Nội",
        description: "Sự kiện khai trương cửa hàng LocknLock Long Biên thu hút hàng trăm khách hàng tham quan, check-in nhận quà và mua sắm ưu đãi.",
        images: [
          { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80", caption: "Lễ khai trương Showroom LocknLock Long Biên rực rỡ sắc màu" },
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Hoạt náo đón khách, múa lân sư rồng và cắt băng khai trương cửa hàng" },
          { url: "/images/blog/key-moment.jpg", caption: "Ban Giám đốc LocknLock thực hiện nghi thức cắt băng Grand Opening" },
          { url: "/images/blog/le-ban-giao-vinfast.jpg", caption: "Đông đảo khách hàng tham gia minigame bốc thăm trúng thưởng" },
        ],
      },
      {
        id: "kt-quan-bia-be-ot",
        name: "Quán bia Bé Ớt - 30.07.2022",
        client: "Nhà hàng / Quán bia Bé Ớt",
        date: "30/07/2022",
        location: "Hà Nội",
        description: "Đêm tiệc khai trương tưng bừng Quán bia Bé Ớt ngày 30.07.2022 với sân khấu âm nhạc sôi động, múa lân khai trương và chương trình giao lưu bốc thăm may mắn.",
        images: [
          { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80", caption: "Không khí đêm khai trương sôi động tại Quán bia Bé Ớt - 30.07.2022" },
          { url: "/images/blog/gala-moment.jpg", caption: "Giao lưu sân khấu, nâng ly chúc mừng khai trương hồng phát" },
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Backdrop check-in và cổng bóng nghệ thuật chào đón thực khách" },
          { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80", caption: "Đội ngũ MC và vũ đoàn khuấy động đêm tiệc khai trương" },
        ],
      },
      {
        id: "kt-quay-thuoc-vi-trang",
        name: "Quầy thuốc Vĩ Trang",
        client: "Hệ thống Quầy thuốc Vĩ Trang",
        location: "Hà Nội",
        description: "Tổ chức lễ khai trương Quầy thuốc Vĩ Trang trang trọng, ấm cúng với cổng bóng nghệ thuật, thảm đỏ, loa đài hoạt náo và quà tặng sức khỏe cho người dân.",
        images: [
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Trang trí cổng bóng & thảm đỏ Lễ khai trương Quầy thuốc Vĩ Trang" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khai trương Quầy thuốc Vĩ Trang" },
          { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80", caption: "Đón tiếp khách hàng tư vấn sức khỏe và trao quà mừng khai trương" },
        ],
      },
      {
        id: "kt-van-phong-ngoc-son",
        name: "Văn phòng Ngọc Sơn",
        client: "Văn phòng Giao dịch Ngọc Sơn",
        location: "Hà Nội",
        description: "Tổ chức trọn gói Lễ khai trương Văn phòng Ngọc Sơn chỉn chu, chuyên nghiệp từ thiết kế backdrop, âm thanh ánh sáng đến tiệc Teabreak đón khách quý.",
        images: [
          { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Không gian Lễ khai trương Văn phòng Ngọc Sơn trang trọng" },
          { url: "/images/blog/key-moment.jpg", caption: "Lãnh đạo và đối tác cắt băng chúc mừng khai trương Văn phòng Ngọc Sơn" },
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Khu vực Photobooth chụp hình kỷ niệm cùng khách mời" },
          { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80", caption: "Tiệc trà Teabreak thân mật chúc mừng văn phòng mới đi vào hoạt động" },
        ],
      },
    ],
  },
  {
    id: "le-khanh-thanh",
    title: "Lễ Khánh Thành",
    slug: "le-khanh-thanh",
    category: "su-kien",
    description:
      "Tổ chức trọng thể Lễ Khánh Thành nhà máy, công trình, dự án trọng điểm với quy trình nghi lễ chuẩn mực, trang nghiêm và an toàn tuyệt đối.",
    features: [
      "Nhà bạt không gian hợp kim nhôm khẩu độ lớn, chống chịu mưa nắng",
      "Nghi thức bấm nút / cắt băng khánh thành kết hợp hiệu ứng pháo điện, CO2",
      "Hệ thống âm thanh Line Array, màn hình LED ngoài trời độ sáng cao",
      "Đón tiếp đại biểu cấp cao, tiệc chiêu đãi và điều phối an ninh toàn diện",
    ],
    image_url: "/images/projects/khanh-thanh-eiffel-damsan.jpg",
    popular: true,
    projects: [
      {
        id: "lkt-tan-phuong-cuong-phat",
        name: "Công ty Tân Phương & Cường Phát",
        client: "Công ty Tân Phương & Cường Phát",
        location: "Hà Nội",
        description: "Lễ khánh thành & đưa vào hoạt động cơ sở mới của Công ty Tân Phương & Cường Phát với sự tham dự của đông đảo đối tác chiến lược.",
        images: [
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Sân khấu chính Lễ khánh thành Công ty Tân Phương & Cường Phát" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khánh thành trang trọng" },
          { url: "/images/blog/stage-setup.jpg", caption: "Hệ thống nhà bạt, âm thanh và màn hình LED sự kiện" },
        ],
      },
      {
        id: "lkt-dien-mat-troi-thai-binh",
        name: "Hệ thống điện mặt trời Thái Bình",
        client: "Nhà máy EIFFEL - Công ty CP DAMSAN",
        location: "Thái Bình",
        description: "Tổ chức lễ khánh thành hệ thống điện mặt trời áp mái tại Nhà máy EIFFEL với hơn 500 đại biểu lãnh đạo tỉnh Thái Bình và các đối tác.",
        images: [
          { url: "/images/projects/khanh-thanh-eiffel-damsan.jpg", caption: "Lễ khánh thành hệ thống điện mặt trời áp mái tại Nhà máy Eiffel - Công ty CP Damsan" },
          { url: "/images/projects/nha-may-eiffel.jpg", caption: "Toàn cảnh Lễ khánh thành Hệ thống điện mặt trời Thái Bình" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khánh thành dự án năng lượng sạch" },
          { url: "/images/projects/cau-thang-long.jpg", caption: "Hạ tầng nhà bạt không gian và sân khấu ngoài trời tiêu chuẩn cao" },
          { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Đón tiếp đại biểu và khách mời cấp cao tham dự buổi lễ" },
        ],
      },
      {
        id: "lkt-ghe-dien-massage",
        name: "Hệ thống ghế điện massage",
        client: "Trung tâm Phân phối Ghế Điện Massage",
        location: "Hà Nội",
        description: "Lễ khánh thành trung tâm trưng bày và phân phối hệ thống ghế điện massage chăm sóc sức khỏe công nghệ mới.",
        images: [
          { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80", caption: "Không gian lễ khánh thành Hệ thống ghế điện massage" },
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Khu vực sân khấu lễ đài và thảm đỏ đón khách" },
          { url: "/images/blog/key-moment.jpg", caption: "Khoảnh khắc cắt băng khánh thành trung tâm" },
        ],
      },
      {
        id: "lkt-locknlock-long-bien",
        name: "LocknLock Long Biên",
        client: "LocknLock Việt Nam",
        location: "Long Biên, Hà Nội",
        description: "Lễ khánh thành và ra mắt không gian mua sắm hiện đại LocknLock tại quận Long Biên, Hà Nội.",
        images: [
          { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80", caption: "Mặt tiền sự kiện LocknLock Long Biên" },
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Đội ngũ lễ tân và múa lân chào mừng ngày khánh thành" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khánh thành LocknLock Long Biên" },
        ],
      },
      {
        id: "lkt-quan-bia-be-ot",
        name: "Quán bia Bé Ớt - 30.07.2022",
        client: "Cơ sở Ẩm thực Quán bia Bé Ớt",
        date: "30/07/2022",
        location: "Hà Nội",
        description: "Lễ khánh thành không gian ẩm thực Quán bia Bé Ớt ngày 30/07/2022 với sân khấu giao lưu âm nhạc và đại tiệc tri ân.",
        images: [
          { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80", caption: "Sân khấu âm nhạc ánh sáng tại Quán bia Bé Ớt - 30.07.2022" },
          { url: "/images/blog/gala-moment.jpg", caption: "Khách mời nâng ly chúc mừng đêm khánh thành" },
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Trang trí không gian đón tiếp thực khách" },
        ],
      },
      {
        id: "lkt-quay-thuoc-vi-trang",
        name: "Quầy thuốc Vĩ Trang",
        client: "Quầy thuốc Vĩ Trang",
        location: "Hà Nội",
        description: "Hoàn thiện thi công và tổ chức lễ ra mắt cơ sở mới Quầy thuốc Vĩ Trang đạt chuẩn GPP.",
        images: [
          { url: "/images/blog/khai-truong-showroom.jpg", caption: "Lễ ra mắt cơ sở Quầy thuốc Vĩ Trang" },
          { url: "/images/blog/key-moment.jpg", caption: "Cắt băng khánh thành đi vào hoạt động" },
        ],
      },
      {
        id: "lkt-van-phong-ngoc-son",
        name: "Văn phòng Ngọc Sơn",
        client: "Văn phòng Ngọc Sơn",
        location: "Hà Nội",
        description: "Lễ khánh thành trụ sở làm việc Văn phòng Ngọc Sơn với sự hiện diện của ban lãnh đạo và các đối tác thân thiết.",
        images: [
          { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Không gian trang trọng tại Lễ khánh thành Văn phòng Ngọc Sơn" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khánh thành Văn phòng Ngọc Sơn" },
        ],
      },
      {
        id: "lkt-cau-thang-long",
        name: "Lễ thông xe Dự án sửa chữa Cầu Thăng Long",
        client: "Tổng cục Đường bộ Việt Nam & Bộ GTVT",
        date: "2021",
        location: "Hà Nội",
        description: "Sự kiện quy mô quốc gia chào mừng công trình giao thông huyết mạch của Thủ đô Hà Nội.",
        images: [
          { url: "/images/projects/cau-thang-long.jpg", caption: "Toàn cảnh Lễ thông xe Dự án sửa chữa mặt cầu Thăng Long" },
          { url: "/images/blog/stage-setup.jpg", caption: "Thi công hệ thống nhà bạt, sân khấu và âm thanh ngoài trời" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng thông xe công trình trọng điểm" },
        ],
      },
    ],
  },
  {
    id: "hoi-nghi-hoi-thao",
    title: "Hội Nghị, Hội Thảo",
    slug: "hoi-nghi-hoi-thao",
    category: "su-kien",
    description:
      "Giải pháp tổ chức Hội nghị khách hàng, Đại hội cổ đông, Hội thảo khoa học và Lễ ra mắt sản phẩm đạt tiêu chuẩn quốc tế từ 100 đến 2.000+ đại biểu.",
    features: [
      "Hệ thống âm thanh hội nghị chuẩn quốc tế, micro cổ ngỗng chống hú 100%",
      "Màn hình LED P2.5 siêu nét trình chiếu báo cáo 4K & Stage Monitor nhắc bài",
      "Quy trình check-in mã QR tự động hóa, lễ tân song ngữ tiếp đón chuẩn mực",
      "Thiết kế không gian sảnh đón, khu trưng bày sản phẩm & tiệc trà Teabreak",
    ],
    image_url: "/images/projects/hoi-nghi-the-k-park.jpg",
    popular: true,
    projects: [
      {
        id: "hn-the-k-park-phu-la",
        name: "Hội nghị nhà chung cư The K Park - Phú La",
        client: "Ban Quản trị & Cư dân Tòa nhà Chung cư The K Park",
        location: "Phường Phú La, Hà Đông, Hà Nội",
        description: "Tổ chức Hội nghị nhà chung cư bất thường quy mô lớn với hệ thống nhà bạt, âm thanh hội nghị, sân khấu và bàn ghế đại biểu chuyên nghiệp.",
        images: [
          { url: "/images/projects/hoi-nghi-the-k-park.jpg", caption: "Toàn cảnh Hội nghị nhà chung cư bất thường - Tòa nhà The K Park, Phú La" },
          { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Không gian tiếp đón và kiểm tra tư cách đại biểu, cư dân tham dự" },
          { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Bàn chủ tọa và hệ thống âm thanh điều hành hội nghị" },
        ],
      },
      {
        id: "hn-vinpearl-nam-hoi-an",
        name: "Hội nghị & Mở bán Vinpearl Resort & Golf Nam Hội An",
        client: "Vingroup / Đơn vị phân phối BĐS",
        location: "Quảng Nam & Hà Nội",
        description: "Sự kiện hội nghị giới thiệu cơ hội đầu tư và mở bán siêu dự án nghỉ dưỡng với màn hình LED cong vô cực và hơn 500 nhà đầu tư VIP.",
        images: [
          { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80", caption: "Không gian hội trường sang trọng tại sự kiện Vinpearl Nam Hội An" },
          { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Sân khấu màn hình LED P2.5 siêu nét trình chiếu sa bàn 3D" },
          { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Toàn cảnh đại biểu và nhà đầu tư tham dự phiên thuyết trình" },
        ],
      },
      {
        id: "hn-khoa-hoc-dai-hoc",
        name: "Hội thảo Khoa học Quốc gia – Khối Đại học Bách Khoa & NEU",
        client: "ĐH Bách Khoa Hà Nội & ĐH Kinh tế Quốc dân",
        location: "Hà Nội",
        description: "Tổ chức trọn gói hạ tầng âm thanh hội thảo, màn hình LED, khu vực poster khoa học và tiệc trà Teabreak cho các hội thảo học thuật cấp quốc gia.",
        images: [
          { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Phiên toàn thể Hội thảo khoa học với màn hình LED trình chiếu 4K" },
          { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Bàn chủ tọa trang bị hệ thống micro cổ ngỗng tiêu chuẩn quốc tế" },
          { url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80", caption: "Diễn giả trình bày tham luận chuyên đề tại hội trường lớn" },
        ],
      },
      {
        id: "hn-khach-hang-ngan-hang",
        name: "Hội nghị Tri ân Khách hàng VIP – Khối Ngân hàng Vietcombank, VPBank, NCB",
        client: "Vietcombank, VPBank, NCB",
        location: "Hà Nội",
        description: "Chuỗi hội nghị tổng kết hoạt động kinh doanh và tri ân khách hàng ưu tiên tại các khách sạn 5 sao.",
        images: [
          { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Hội trường đón tiếp khách hàng ưu tiên khối Ngân hàng" },
          { url: "/images/blog/gala-dinner-melia.jpg", caption: "Không gian phòng Ballroom khách sạn 5 sao được bài trí đẳng cấp" },
          { url: "/images/blog/key-moment.jpg", caption: "Nghi thức vinh danh và trao kỷ niệm chương tri ân đối tác" },
        ],
      },
    ],
  },
  {
    id: "tiec-tat-nien-yep-gala-dinner",
    title: "Tiệc Tất Niên - Y.E.P, Gala Dinner",
    slug: "tiec-tat-nien-yep-gala-dinner",
    category: "su-kien",
    description:
      "Đêm tiệc vinh danh thăng hoa cảm xúc, gắn kết nội bộ và tri ân chặng đường cống hiến với concept độc bản mang đậm dấu ấn văn hóa doanh nghiệp.",
    features: [
      "Xây dựng ý tưởng Concept & Key Visual 3D theo câu chuyện thương hiệu",
      "Đạo diễn sân khấu, âm thanh ánh sáng Beam/Laser và visual LED mãn nhãn",
      "Kịch bản vinh danh cá nhân xuất sắc, Lucky Draw quay số trúng thưởng",
      "Cung cấp MC hoạt náo, ca sĩ, ban nhạc Acoustic, DJ và vũ đoàn sôi động",
    ],
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    popular: true,
    projects: [
      {
        id: "yep-cong-an-yen-hoa",
        name: "Tiệc Tất Niên & Hội chợ Xuân – Công an Phường Yên Hòa",
        client: "Công an Phường Yên Hòa (Cầu Giấy, Hà Nội)",
        location: "Hà Nội",
        description: "Chương trình gặp mặt tổng kết cuối năm ấm cúng kết hợp không gian Tết cổ truyền và giao lưu văn nghệ chào xuân.",
        images: [
          { url: "/images/blog/gala-dinner-melia.jpg", caption: "Sân khấu chính đêm tiệc tổng kết cuối năm" },
          { url: "/images/blog/gala-moment.jpg", caption: "Khoảnh khắc giao lưu văn nghệ và chúc mừng năm mới" },
          { url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80", caption: "Không gian bàn tiệc ấm cúng và trang trọng" },
        ],
      },
      {
        id: "yep-miss-hoa-toeic",
        name: "Gala Year End Party – Hệ thống Anh ngữ Miss Hoa TOEIC",
        client: "Miss Hoa TOEIC",
        location: "Hà Nội",
        description: "Đêm tiệc Year End Party bùng nổ năng lượng tuổi trẻ, vinh danh đội ngũ giảng viên xuất sắc và các tiết mục nhạc hội sôi động.",
        images: [
          { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80", caption: "Bữa tiệc âm thanh ánh sáng bùng nổ tại đêm Gala Y.E.P" },
          { url: "/images/blog/gala-dinner-ha-long.jpg", caption: "Lễ vinh danh các cá nhân và tập thể xuất sắc của năm" },
          { url: "/images/blog/gala-moment.jpg", caption: "Các tiết mục biểu diễn nghệ thuật nội bộ đầy màu sắc" },
        ],
      },
      {
        id: "yep-dia-oc-tl-k11",
        name: "Đêm Gala Tri Ân & Y.E.P – Địa ốc TL K11 & The K-Park",
        client: "Địa ốc TL K11",
        location: "Hà Nội & Hạ Long",
        description: "Đại tiệc Gala Dinner sang trọng kết hợp quay số trúng thưởng Lucky Draw và trình diễn Visual LED 3D hiện đại.",
        images: [
          { url: "/images/projects/team-building-dia-oc-tl.jpg", caption: "Tập thể cán bộ nhân viên Công ty TNHH Địa ốc TL tại đêm tiệc Gala" },
          { url: "/images/blog/gala-dinner-ha-long.jpg", caption: "Toàn cảnh đêm tiệc Gala Dinner Địa ốc TL K11" },
          { url: "/images/blog/gala-dinner-melia.jpg", caption: "Ban lãnh đạo khai rượu sâm panh mở màn đêm tiệc" },
          { url: "/images/blog/gala-moment.jpg", caption: "Sân khấu rực rỡ hiệu ứng pháo sáng và ánh sáng Moving Beam" },
        ],
      },
    ],
  },
  {
    id: "team-building",
    title: "Team Building",
    slug: "team-building",
    category: "du-lich",
    description:
      "Chương trình Team Building bãi biển, resort và dã ngoại bứt phá giới hạn, truyền lửa nhiệt huyết và gắn kết tinh thần đồng đội vững mạnh.",
    features: [
      "Kho đạo cụ Game hơi khổng lồ, kịch bản thử thách trí tuệ & thể lực độc đáo",
      "MC Team Building năng lượng cao dẫn dắt cảm xúc và truyền lửa đồng đội",
      "Kết hợp trọn gói Tour du lịch nghỉ dưỡng MICE, khách sạn 4-5 sao & xe đưa đón",
      "Ekip Media quay chụp Flycam trên không bắt trọn khoảnh khắc xếp chữ thương hiệu",
    ],
    image_url: "/images/projects/team-building-dia-oc-tl.jpg",
    popular: true,
    projects: [
      {
        id: "tb-company-trip-tl-k11",
        name: "Company Trip & Team Building – Công ty TNHH Địa ốc TL",
        client: "Công ty TNHH Địa ốc TL",
        location: "Quảng Trị & Miền Trung",
        description: "Hành trình du lịch khám phá kết hợp Team Building bãi biển và đêm Gala Dinner gắn kết toàn thể cán bộ nhân viên Địa ốc TL.",
        images: [
          { url: "/images/projects/team-building-dia-oc-tl.jpg", caption: "Tập thể Công ty TNHH Địa ốc TL chụp ảnh lưu niệm tại đêm Gala & Team Building" },
          { url: "/images/blog/teambuilding-flaming.jpg", caption: "Team Building gắn kết tại khu nghỉ dưỡng sinh thái & bãi biển" },
          { url: "/images/blog/teambuilding-bai-chay.jpg", caption: "Khoảnh khắc Flycam chụp toàn đoàn xếp chữ thương hiệu" },
        ],
      },
      {
        id: "tb-labco-24-nam",
        name: "Team Building & Hội thao Kỷ niệm 24 năm – Công ty CP LABCO",
        client: "Công ty Cổ phần LABCO",
        location: "Bãi Cháy, Hạ Long",
        description: "Ngày hội Team Building bãi biển quy mô hơn 300 cán bộ nhân viên với chuỗi thử thách liên hoàn bằng phao hơi khổng lồ.",
        images: [
          { url: "/images/blog/teambuilding-bai-chay.jpg", caption: "Toàn đoàn hào hứng tham gia thử thách Team Building bãi biển" },
          { url: "/images/blog/teambuilding-flaming.jpg", caption: "Các đội chơi phối hợp nhịp nhàng vượt chướng ngại vật" },
          { url: "/images/projects/team-building-dia-oc-tl.jpg", caption: "Đêm Gala tổng kết trao giải sau chương trình Team Building" },
        ],
      },
      {
        id: "tb-amazing-race-doanh-nghiep",
        name: "Amazing Race & Team Building Resort – Khối Ngân hàng & Công nghệ",
        client: "Digiworld, CellphoneS & Khối Ngân hàng",
        location: "Flamingo Đại Lải & Sapa",
        description: "Chương trình Team Building địa hình kết hợp giải mật thư Amazing Race rèn luyện tư duy chiến lược và sức bền đội nhóm.",
        images: [
          { url: "/images/blog/teambuilding-flaming.jpg", caption: "Hoạt động Team Building trên thảm cỏ xanh tại Flamingo Resort" },
          { url: "/images/blog/teambuilding-bai-chay.jpg", caption: "Đạo cụ phao hơi khổng lồ do Trường Hải trực tiếp cung cấp" },
        ],
      },
    ],
  },
  {
    id: "trung-thu",
    title: "Trung Thu",
    slug: "trung-thu",
    category: "su-kien",
    description:
      "Tổ chức Đêm Hội Trăng Rằm lung linh sắc màu cổ tích dành cho con em cán bộ nhân viên doanh nghiệp, khu đô thị, chung cư và trường học.",
    features: [
      "Hoạt cảnh Chú Cuội – Chị Hằng, múa Lân Sư Rồng rước đèn phá cỗ",
      "Gian hàng hội chợ dân gian: nặn tò he, tô tượng, làm đèn lồng, viết thư pháp",
      "Tiết mục xiếc nghệ thuật, ảo thuật tương tác và chú hề vặn bóng vui nhộn",
      "Trang trí tiểu cảnh trăng rằm, bày mâm ngũ quả nghệ thuật & trao quà thiếu nhi",
    ],
    image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80",
    projects: [
      {
        id: "tt-k-park-van-phu",
        name: "Đêm Hội Trăng Rằm – Chung cư The K-Park Văn Phú",
        client: "Ban Quản trị & Cư dân The K-Park",
        location: "Hà Đông, Hà Nội",
        description: "Đêm hội Trung Thu quy mô hơn 1.000 cư dân và các em nhỏ với màn múa Lân Sư Rồng, rước đèn ông sao và phá cỗ trông trăng.",
        images: [
          { url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80", caption: "Sân khấu Đêm Hội Trăng Rằm rực rỡ ánh đèn lồng" },
          { url: "/images/blog/gala-moment.jpg", caption: "Tiết mục văn nghệ thiếu nhi và giao lưu cùng Chú Cuội - Chị Hằng" },
          { url: "/images/blog/stage-setup.jpg", caption: "Khu vực sân khấu và tiểu cảnh check-in Trung Thu cổ truyền" },
        ],
      },
      {
        id: "tt-doanh-nghiep-ngan-hang",
        name: "Vui Hội Trăng Rằm cho con em CBNV – Khối Ngân hàng & Tập đoàn",
        client: "Công đoàn Ngân hàng & Doanh nghiệp đối tác",
        location: "Hà Nội",
        description: "Tổ chức không gian gian hàng dân gian (nặn tò he, làm bánh trung thu, đèn ông sao) và biểu diễn xiếc ảo thuật cho các bé.",
        images: [
          { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80", caption: "Các em nhỏ hào hứng tham gia trò chơi đố vui cùng Chị Hằng" },
          { url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80", caption: "Không gian lễ hội ấm áp gắn kết các gia đình nhân sự" },
        ],
      },
    ],
  },
  {
    id: "tet-thieu-nhi",
    title: "Tết Thiếu Nhi",
    slug: "tet-thieu-nhi",
    category: "su-kien",
    description:
      "Ngày hội Quốc tế Thiếu nhi 1/6 và Family Day sôi động, ngập tràn tiếng cười, gắn kết gia đình nhỏ trong đại gia đình doanh nghiệp.",
    features: [
      "Không gian thế giới tuổi thơ đầy sắc màu với cổng bóng nghệ thuật & Mascot",
      "Chuỗi trò chơi vận động liên hoàn, góc sáng tạo DIY và đố vui có thưởng",
      "Biểu diễn ảo thuật kỳ thú, bong bóng xà phòng khổng lồ và văn nghệ thiếu nhi",
      "Tiệc ngọt Buffet Kids hấp dẫn cùng những phần quà ý nghĩa cho các bé",
    ],
    image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    projects: [
      {
        id: "ttn-benh-vien-nhi-tw",
        name: "Ngày hội Quốc tế Thiếu nhi 1/6 – Bệnh viện Nhi Trung ương",
        client: "Bệnh viện Nhi Trung ương",
        location: "Hà Nội",
        description: "Chương trình nghệ thuật, ảo thuật, chú hề vặn bóng và trao quà 1/6 mang lại tiếng cười ấm áp cho các em thiếu nhi.",
        images: [
          { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80", caption: "Sân khấu Ngày hội Quốc tế Thiếu nhi 1/6 ngập tràn sắc màu" },
          { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80", caption: "Trao tặng những phần quà ý nghĩa và giao lưu cùng các bé" },
        ],
      },
      {
        id: "ttn-family-day-doanh-nghiep",
        name: "Family Day & Tết Thiếu Nhi 1/6 – Tập đoàn DAMSAN & Tân Long Group",
        client: "Tập đoàn DAMSAN & Tân Long Group",
        location: "Hà Nội & Thái Bình",
        description: "Ngày hội gia đình kết hợp lễ tuyên dương con em CBNV đạt thành tích học tập xuất sắc cùng khu trò chơi nhà phao, workshop DIY.",
        images: [
          { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80", caption: "Khu vui chơi vận động và sân khấu vinh danh các bé học giỏi" },
          { url: "/images/blog/teambuilding-flaming.jpg", caption: "Các gia đình nhỏ hào hứng tham gia trò chơi gắn kết" },
        ],
      },
    ],
  },
  {
    id: "thiet-bi-su-kien",
    title: "Hình Ảnh & Thiết Bị Sự Kiện",
    slug: "thiet-bi-su-kien",
    category: "su-kien",
    description:
      "Sản xuất, thi công và cho thuê trọn gói hệ thống Âm thanh, Ánh sáng, Màn hình LED, Sân khấu, Nhà bạt không gian chính hãng với chi phí tối ưu.",
    features: [
      "Hệ thống loa Line Array công suất lớn, bàn Mixer kỹ thuật số & micro UHF",
      "Màn hình LED P2.5 Indoor & P3.91 Outdoor cabinet nhôm đúc chống nước",
      "Đèn Moving Head Beam, Par LED, Laser, Follow, máy khói lạnh & pháo điện",
      "Nhà bạt không gian khẩu độ lớn, sân khấu lắp ghép, bàn ghế Banquet VIP",
    ],
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    projects: [
      {
        id: "tb-am-thanh-anh-sang-led",
        name: "Hệ thống Âm thanh Line Array, Ánh sáng Beam & Màn hình LED",
        client: "Kho thiết bị Trường Hải Event",
        location: "Hà Nội & Toàn miền Bắc",
        description: "Hình ảnh thực tế hệ thống loa Line Array, bàn điều khiển Mixer Digital, dàn đèn Moving Head Beam và màn hình LED P2.5 - P3.91.",
        images: [
          { url: "/images/blog/stage-setup.jpg", caption: "Thi công lắp đặt hệ thống khung Truss, đèn Beam và màn hình LED" },
          { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80", caption: "Hệ thống âm thanh Line Array & ánh sáng sân khấu đại nhạc hội" },
          { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Màn hình LED P2.5 Indoor siêu nét phục vụ hội nghị cấp cao" },
        ],
      },
      {
        id: "tb-nha-bat-san-khau-ban-ghe",
        name: "Nhà bạt Không gian Hợp kim nhôm, Sân khấu & Bàn ghế Banquet",
        client: "Thi công sự kiện ngoài trời",
        location: "Miền Bắc",
        description: "Hệ thống nhà bạt không gian khẩu độ lớn chịu gió bão, sân khấu lắp ghép trải thảm đỏ mới và bàn ghế tiệc Banquet sang trọng.",
        images: [
          { url: "/images/projects/cau-thang-long.jpg", caption: "Nhà bạt không gian hợp kim nhôm quy mô lớn ngoài trời" },
          { url: "/images/projects/nha-may-eiffel.jpg", caption: "Trang trí trần nhà bạt la phông và bàn ghế đại biểu VIP" },
          { url: "/images/blog/le-ban-giao-vinfast.jpg", caption: "Sân khấu lắp ghép kiên cố phục vụ lễ ra mắt và bàn giao xe" },
        ],
      },
    ],
  },
  {
    id: "hoat-dong-khac",
    title: "Hoạt Động Khác",
    slug: "hoat-dong-khac",
    category: "du-lich",
    description:
      "Đa dạng giải pháp tổ chức Lễ khởi công – động thổ, Kỷ niệm thành lập, Hội thao, Họp lớp, Tour du lịch trải nghiệm – thiện nguyện và Cho thuê xe 7–45 chỗ.",
    features: [
      "Lễ khởi công – động thổ, lễ kỷ niệm thành lập, lễ bàn giao & mở bán BĐS",
      "Ngày hội thể thao (Sport Day), chương trình kỷ yếu, họp lớp – hội khóa",
      "Tour du lịch doanh nghiệp trong & ngoài nước, hành trình thiện nguyện vùng cao",
      "Dịch vụ vận tải, cho thuê xe du lịch đời mới từ 7, 16, 29, 35 đến 45 chỗ",
    ],
    image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    projects: [
      {
        id: "hdk-thien-nguyen-vung-cao",
        name: "Chương trình Thiện nguyện \"Chắp cánh ước mơ\" & \"Hướng về Sìn Hồ\"",
        client: "Trường Hải Event & Nhóm Tình nguyện Cộng đồng",
        location: "Yên Bái & Lai Châu",
        description: "Hành trình trao hơn 1.000 phần quà, áo ấm và học bổng cho các em nhỏ tại điểm trường vùng cao Yên Bái và huyện Sìn Hồ (Lai Châu).",
        images: [
          { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80", caption: "Trao quà và học bổng cho các em học sinh vùng cao" },
          { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80", caption: "Đoàn xe vận chuyển quà thiện nguyện vượt đèo Tây Bắc" },
        ],
      },
      {
        id: "hdk-le-ban-giao-ra-mat",
        name: "Sự kiện Ra mắt Sản phẩm, Bàn giao Xe & Hội thao Doanh nghiệp",
        client: "Các đối tác Doanh nghiệp & Trường Đại học",
        location: "Hà Nội",
        description: "Tổ chức lễ bàn giao xe, ngày hội thể thao doanh nghiệp (Sport Day), chương trình họp lớp – hội khóa và tour du lịch vận tải.",
        images: [
          { url: "/images/blog/le-ban-giao-vinfast.jpg", caption: "Sự kiện lễ bàn giao xe và kích hoạt thương hiệu ngoài trời" },
          { url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80", caption: "Đội xe du lịch 7 - 45 chỗ đời mới phục vụ đưa đón đoàn" },
        ],
      },
    ],
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
    scale: "Quy mô Quốc gia",
    highlights: [
      "Hệ thống nhà bạt không gian hợp kim nhôm khẩu độ lớn kiên cố trên cầu",
      "Nghi thức cắt băng thông xe đón tiếp Lãnh đạo Chính phủ & Bộ GTVT",
      "Âm thanh Line Array ngoài trời công suất lớn, chống chịu gió bão",
    ],
    gallery: [
      { url: "/images/projects/cau-thang-long.jpg", caption: "Toàn cảnh Lễ thông xe Dự án sửa chữa mặt cầu Thăng Long" },
      { url: "/images/blog/stage-setup.jpg", caption: "Thi công hệ thống nhà bạt, sân khấu và âm thanh ngoài trời" },
      { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng thông xe công trình trọng điểm" },
    ],
  },
  {
    id: "proj-2",
    title: "Lễ khánh thành Hệ thống Điện mặt trời Áp Mái tại Nhà máy EIFFEL",
    category: "su-kien",
    client_name: "Công ty Cổ phần DAMSAN",
    description:
      "Tổ chức lễ khánh thành nhà máy điện mặt trời công nghệ xanh với hơn 500 khách mời là lãnh đạo các sở ban ngành tỉnh Thái Bình và các đối tác tài chính quốc tế.",
    image_url: "/images/projects/khanh-thanh-eiffel-damsan.jpg",
    year: "2022",
    location: "Thái Bình",
    scale: "500+ Khách mời VIP",
    highlights: [
      "Nhà bạt không gian hợp kim nhôm 1.500m2 tiêu chuẩn công nghiệp",
      "Nghi thức bấm nút khánh thành kết hợp pháo điện và visual LED",
      "Hệ thống màn hình LED Outdoor P3.91 siêu sáng chống lóa ngoài trời",
    ],
    gallery: [
      { url: "/images/projects/khanh-thanh-eiffel-damsan.jpg", caption: "Lễ khánh thành hệ thống điện mặt trời áp mái tại Nhà máy Eiffel - Công ty CP Damsan" },
      { url: "/images/projects/nha-may-eiffel.jpg", caption: "Toàn cảnh dự án Điện mặt trời áp mái tại Nhà máy EIFFEL Thái Bình" },
      { url: "/images/blog/key-moment.jpg", caption: "Nghi thức cắt băng khánh thành dự án năng lượng sạch" },
      { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Đón tiếp hơn 500 khách mời và đại biểu cấp cao" },
    ],
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
    scale: "600+ Nhà đầu tư VIP",
    highlights: [
      "Màn hình LED cong vô cực và sa bàn 3D trình diễn dự án",
      "Kịch bản nghệ thuật thượng lưu, vũ đoàn múa tương tác ánh sáng",
      "Hệ thống check-in tự động phân luồng nhà đầu tư ưu tiên",
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80", caption: "Không gian hội trường sang trọng tại sự kiện Vinpearl Nam Hội An" },
      { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Sân khấu màn hình LED P2.5 siêu nét trình chiếu sa bàn 3D" },
      { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Toàn cảnh đại biểu và nhà đầu tư tham dự phiên thuyết trình" },
    ],
  },
  {
    id: "proj-4",
    title: "Lễ Khai Trương Công ty TNHH SX KD & TM Cường Phát",
    category: "su-kien",
    client_name: "Công ty TNHH SX KD & TM Cường Phát",
    description:
      "Tổ chức đại lễ khai trương trụ sở & nhà xưởng với nghi lễ cắt băng khai trương trang trọng, múa lân sư rồng rộn rã và tiệc trà Teabreak cao cấp đón tiếp đối tác.",
    image_url: "/images/projects/khai-truong-cuong-phat.jpg",
    year: "2023",
    location: "Hà Nội",
    scale: "300+ Đại biểu & Đối tác",
    highlights: [
      "Nghi thức cắt băng hồng phát phong thủy cùng Ban Lãnh đạo",
      "Đội múa Lân Sư Rồng khai quang điểm nhãn, trống hội chào mừng rộn rã",
      "Thi công sân khấu, thảm đỏ, cổng hơi và tiệc trà Teabreak cao cấp",
    ],
    gallery: [
      { url: "/images/projects/khai-truong-cuong-phat.jpg", caption: "Nghi thức cắt băng Lễ khai trương Công ty TNHH SX KD & TM Cường Phát" },
      { url: "/images/blog/khai-truong-showroom.jpg", caption: "Không gian cổng bóng, thảm đỏ và khu vực đón khách đại biểu" },
      { url: "/images/blog/stage-setup.jpg", caption: "Hệ thống âm thanh ánh sáng và backdrop check-in nổi khối" },
    ],
  },
  {
    id: "proj-5",
    title: "Hội nghị nhà chung cư bất thường - Chung cư The K Park",
    category: "su-kien",
    client_name: "Ban Quản trị & Cư dân The K Park",
    description:
      "Tổ chức Hội nghị nhà chung cư bất thường quy mô hơn 1.000 cư dân tại Phường Phú La với hệ thống nhà bạt không gian, âm thanh hội nghị chuyên dụng, bàn chủ tọa và phân luồng tiếp đón cư dân chuẩn mực.",
    image_url: "/images/projects/hoi-nghi-the-k-park.jpg",
    year: "2023",
    location: "Hà Nội",
    scale: "1.000+ Cư dân tham dự",
    highlights: [
      "Hệ thống nhà bạt che phủ toàn bộ sân ngoài trời của tòa nhà",
      "Dàn âm thanh hội thảo micro cổ ngỗng chống hú, loa công suất đồng đều",
      "Bàn ghế hội trường đại biểu trang nghiêm, kiểm tra tư cách cử tri chỉn chu",
    ],
    gallery: [
      { url: "/images/projects/hoi-nghi-the-k-park.jpg", caption: "Toàn cảnh Hội nghị nhà chung cư bất thường - Tòa nhà The K Park, Phú La" },
      { url: "/images/blog/hoi-nghi-khach-hang.jpg", caption: "Không gian tiếp đón và kiểm tra tư cách đại biểu cư dân tham dự" },
      { url: "/images/blog/hoi-nghi-fpt.jpg", caption: "Bàn chủ tọa và hệ thống âm thanh điều hành hội nghị" },
    ],
  },
  {
    id: "proj-6",
    title: "Company Trip & Team Building – Công ty TNHH Địa ốc TL",
    category: "du-lich",
    client_name: "Công ty TNHH Địa ốc TL",
    description:
      "Hành trình du lịch bãi biển kết hợp chương trình Team Building bùng nổ năng lượng và đêm tiệc Gala Dinner gắn kết toàn thể cán bộ nhân viên Địa ốc TL.",
    image_url: "/images/projects/team-building-dia-oc-tl.jpg",
    year: "2024",
    location: "Quảng Trị & Miền Trung",
    scale: "300+ Cán bộ nhân viên",
    highlights: [
      "Chuỗi game Team Building bãi biển với đạo cụ hơi khổng lồ",
      "Đêm Gala Dinner vinh danh thăng hoa cảm xúc tại trung tâm tiệc cưới 5 sao",
      "Media chuyên nghiệp Flycam 4K bắt trọn từng khoảnh khắc đoàn viên",
    ],
    gallery: [
      { url: "/images/projects/team-building-dia-oc-tl.jpg", caption: "Tập thể cán bộ nhân viên Địa Ốc TL chụp ảnh lưu niệm tại đêm Gala Dinner" },
      { url: "/images/blog/teambuilding-flaming.jpg", caption: "Hoạt động Team Building bãi biển gắn kết tinh thần đồng đội" },
      { url: "/images/blog/teambuilding-bai-chay.jpg", caption: "Khoảnh khắc Flycam ghi lại đội hình xếp chữ thương hiệu" },
    ],
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
    scale: "1.000+ Suất quà & học bổng",
    highlights: [
      "Trao tặng áo ấm, đồ dùng học tập và học bổng cho học sinh nghèo vượt khó",
      "Đoàn xe 4x4 vận chuyển nhu yếu phẩm vượt đèo hiểm trở Tây Bắc",
      "Giao lưu văn nghệ gắn kết giữa đoàn tình nguyện và thầy cô, bà con địa phương",
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80", caption: "Trao quà và học bổng cho các em học sinh nghèo vùng cao Yên Bái" },
      { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80", caption: "Đoàn xe vận chuyển áo ấm, nhu yếu phẩm vượt đèo Sìn Hồ (Lai Châu)" },
    ],
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
