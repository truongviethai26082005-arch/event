/**
 * DỮ LIỆU HỒ SƠ NĂNG LỰC DOANH NGHIỆP (COMPANY CAPABILITY DOSSIER)
 * CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI (Trường Hải Event & Travel)
 * Mã số thuế: 0111601327 - Sở Kế hoạch và Đầu tư TP Hà Nội cấp
 */

import { COMPANY_INFO, PARTNER_GROUPS, PROJECTS_DATA } from "@/lib/company-data";
import { TRAN_THU_HA_AVATAR } from "@/lib/tran-thu-ha-avatar";

export interface ProfileChapter {
  id: string;
  order: string;
  title: string;
  subtitle: string;
  summary: string;
  badge: string;
  readTime: string;
}

export interface EquipmentSpec {
  id: string;
  name: string;
  category: "am-thanh" | "anh-sang" | "man-led" | "san-khau-truss" | "xe-du-lich";
  categoryLabel: string;
  brand: string;
  origin: string;
  quantity: string;
  powerOrSpec: string;
  highlights: string[];
  image: string;
  badge?: string;
  safetyCert?: string;
}

export interface OrganizationRole {
  title: string;
  department: string;
  headcount: string;
  description: string;
  keyResponsibilities: string[];
}

export interface LegalDocumentItem {
  id: string;
  name: string;
  code: string;
  issuedBy: string;
  status: "Đã xác thực" | "Có sẵn trong hồ sơ thầu" | "Hiệu lực vĩnh viễn";
  description: string;
}

// 5 Chương cốt lõi của Hồ sơ năng lực
export const PROFILE_CHAPTERS: ProfileChapter[] = [
  {
    id: "thu-ngo-phap-ly",
    order: "01",
    title: "Thư Ngỏ & Năng Lực Pháp Lý",
    subtitle: "Tư cách pháp nhân minh bạch, năng lực tài chính & thư ngỏ Ban Giám đốc",
    summary:
      "Lời chào trân trọng từ Ban Lãnh đạo, mã số thuế 0111601327, tư cách pháp nhân độc lập, chứng nhận xuất hóa đơn VAT đầy đủ và bảo hiểm trách nhiệm pháp lý.",
    badge: "Pháp Lý Vững Vàng",
    readTime: "2 phút",
  },
  {
    id: "nang-luc-thiet-bi",
    order: "02",
    title: "Kho Thiết Bị 1.000m² & Thông Số Kỹ Thuật",
    subtitle: "100% tự chủ âm thanh, ánh sáng, màn hình LED, nhà bạt và đội xe du lịch",
    summary:
      "Hệ thống kho bãi trực tiếp không qua trung gian giúp tối ưu 25-30% chi phí cho khách hàng, trang thiết bị nhập khẩu chính hãng tiêu chuẩn biểu diễn chuyên nghiệp.",
    badge: "100% Tự Chủ Kho",
    readTime: "4 phút",
  },
  {
    id: "nang-luc-nhan-su",
    order: "03",
    title: "Cơ Cấu Tổ Chức & Đội Ngũ Nhân Lực",
    subtitle: "Đội ngũ đạo diễn, kỹ thuật viên, quản lý tour dày dạn 10+ năm kinh nghiệm",
    summary:
      "Quy trình phân cấp rõ ràng: Ban Giám đốc - Khối Đạo diễn Sáng tạo - Khối Vận hành Kỹ thuật - Khối Tour & Khối An toàn hiện trường trực chiến 24/7.",
    badge: "Nhân Lực Tinh Nhuệ",
    readTime: "3 phút",
  },
  {
    id: "du-an-doi-tac",
    order: "04",
    title: "Dự Án Tiêu Biểu & Khách Hàng Trọng Điểm",
    subtitle: "Minh chứng năng lực qua 500+ đại lễ cấp Nhà nước, trường học và tập đoàn",
    summary:
      "Từ các sự kiện cấp Bộ GTVT (Cầu Thăng Long), Bộ Công An (PA05), Trung ương Đoàn đến các tập đoàn Vingroup, Vietcombank, CellphoneS, LocknLock.",
    badge: "500+ Sự Kiện",
    readTime: "4 phút",
  },
  {
    id: "quy-trinh-cam-ket",
    order: "05",
    title: "Quy Trình 6 Bước & Cam Kết Vận Hành",
    subtitle: "Tiêu chuẩn hóa dịch vụ, bảo hiểm trách nhiệm và phương án dự phòng 1-1",
    summary:
      "Cam kết 100% đúng tiến độ, thiết bị kiểm định an toàn định kỳ, kịch bản độc bản và hợp đồng pháp lý minh bạch kèm hóa đơn VAT điện tử.",
    badge: "Chuẩn SOP Quốc Tế",
    readTime: "2 phút",
  },
];

// Danh mục thông số trang thiết bị (Equipment Specs Inspector)
export const EQUIPMENT_SPECS: EquipmentSpec[] = [
  {
    id: "eq-1",
    name: "Hệ thống Loa Line Array JBL VTX & Sub Bass công suất lớn",
    category: "am-thanh",
    categoryLabel: "Âm Thanh Chuyên Nghiệp",
    brand: "JBL Professional / Crown Audio (USA)",
    origin: "Chính hãng nhập khẩu Hoa Kỳ",
    quantity: "32 Module Array + 16 Thùng Sub kép 18 inch",
    powerOrSpec: "Công suất tổng hệ thống lên đến 50.000W RMS",
    highlights: [
      "Độ phủ âm thanh xa tới 100m, áp lực âm thanh trung thực không vỡ tiếng",
      "Phục vụ không gian sự kiện từ 200 đến 10.000 khán giả ngoài trời và sân khấu kín",
      "Amply công suất cao cấp Crown I-Tech HD tích hợp DSP kiểm soát âm dải rộng",
      "Chứng chỉ xuất xứ CO/CQ và tiêu chuẩn an toàn âm học",
    ],
    image: "/images/blog/stage-setup.jpg",
    badge: "Cốt Lõi Sân Khấu",
    safetyCert: "Kiểm định định kỳ đạt chuẩn SPL quốc tế",
  },
  {
    id: "eq-2",
    name: "Bàn Mixer Kỹ Thuật Số Yamaha CL5 & Behringer X32 Digital",
    category: "am-thanh",
    categoryLabel: "Âm Thanh Chuyên Nghiệp",
    brand: "Yamaha / Behringer (Japan - Germany)",
    origin: "Chính hãng",
    quantity: "06 Bàn điều khiển kỹ thuật số kèm Digital Snake Rio",
    powerOrSpec: "64 kênh vào / 32 kênh ra, truyền dẫn cáp quang Dante chống nhiễu",
    highlights: [
      "Xử lý tín hiệu số độ phân giải cao 24bit/96kHz, triệt tiêu tiếng hú rít tức thì",
      "Lưu trữ kịch bản âm thanh theo từng tiết mục biểu diễn chính xác đến từng mili-giây",
      "Kỹ sư âm thanh (Sound Engineer) 9+ năm kinh nghiệm trực tiếp điều chỉnh",
    ],
    image: "/images/blog/key-moment.jpg",
    badge: "Công Nghệ Xử Lý Số",
    safetyCert: "Bảo trì và cân chỉnh phần mềm liên tục",
  },
  {
    id: "eq-3",
    name: "Hệ thống Micro Không Dây Shure Axient Digital & UR24D",
    category: "am-thanh",
    categoryLabel: "Âm Thanh Chuyên Nghiệp",
    brand: "Shure Incorporated (USA)",
    origin: "Hoa Kỳ",
    quantity: "24 Bộ micro cầm tay, cài tai, cài ve áo cao cấp",
    powerOrSpec: "Băng tần UHF kép tự động quét kênh sạch, chống trùng sóng 100%",
    highlights: [
      "Đầu mic Beta 87A và SM58 bắt giọng hát và giọng phát biểu ấm áp, trong trẻo",
      "Phạm vi bắt sóng ổn định lên tới 150m xuyên vật cản",
      "Phục vụ đại biểu VIP, lãnh đạo cấp cao, ca sĩ chuyên nghiệp",
    ],
    image: "/images/hero/hero-event-pro.jpg",
    badge: "Chuẩn Lễ Hội VIP",
  },
  {
    id: "eq-4",
    name: "Hệ thống Đèn Moving Head Beam 480W & BWS Hybrid",
    category: "anh-sang",
    categoryLabel: "Ánh Sáng Sân Khấu",
    brand: "PR Lighting / Clay Paky Standard",
    origin: "Nhập khẩu chuyên dụng",
    quantity: "60 Cây Moving Beam 480W",
    powerOrSpec: "Bóng Osram 480W, lăng kính 8+16 mặt xoay đa chiều",
    highlights: [
      "Luồng sáng cực mạnh quét bầu trời và định hình không gian sân khấu bùng nổ",
      "Hiệu ứng gobo hoa văn động, đổi màu tức thời với tốc độ cao",
      "Điều khiển qua bàn GrandMA2 onPC đồng bộ theo nhịp nhạc kịch bản",
    ],
    image: "/images/hero/hero-team-pro.jpg",
    badge: "Hiệu Ứng Bùng Nổ",
    safetyCert: "Chứng nhận cách điện & chịu nhiệt TCVN",
  },
  {
    id: "eq-5",
    name: "Đèn Par LED 54x3W Full Color & Đèn COB Vàng Nắng",
    category: "anh-sang",
    categoryLabel: "Ánh Sáng Sân Khấu",
    brand: "Stage Pro Light",
    origin: "Chính hãng",
    quantity: "120 Đèn Par Led 54 bóng + 24 Đèn COB 4 mắt 400W",
    powerOrSpec: "Ánh sáng tỏa đều, chuẩn nhiệt độ màu 3200K - 5600K cho quay phim chụp ảnh",
    highlights: [
      "Tôn vinh gương mặt diễn giả, đại biểu trên sân khấu không bị bóng gắt",
      "Phục vụ hoàn hảo cho livestream Full HD và truyền hình trực tiếp",
      "Công nghệ LED tiết kiệm điện, tỏa nhiệt thấp, an toàn cháy nổ",
    ],
    image: "/images/blog/gala-dinner-ha-long.jpg",
    badge: "Chuẩn Truyền Hình",
  },
  {
    id: "eq-6",
    name: "Laser Công Suất Lớn 10W - 20W RGB & Máy Khói Lạnh / Pháo Điện",
    category: "anh-sang",
    categoryLabel: "Ánh Sáng Sân Khấu",
    brand: "Pangolin Laser System",
    origin: "Đạt chuẩn quốc tế",
    quantity: "04 Bộ Laser Full RGB + 04 Máy khói lạnh sân khấu + 10 Bộ pháo điện",
    powerOrSpec: "Vẽ chữ thương hiệu, logo 3D trên không gian và hiệu ứng Countdown",
    highlights: [
      "Khoảnh khắc Key Moment cắt băng khai trương, bấm nút khởi công bùng cháy",
      "Tạo biển mây bồng bềnh dưới chân cho các tiết mục múa nghệ thuật",
      "Sử dụng dung dịch khói y tế an toàn không mùi, không gây kích ứng",
    ],
    image: "/images/blog/khai-truong-showroom.jpg",
    badge: "Khoảnh Khắc Vàng",
  },
  {
    id: "eq-7",
    name: "Màn hình LED P2.5 Indoor Cabinet Nhôm Đúc Siêu Mỏng",
    category: "man-led",
    categoryLabel: "Màn Hình LED",
    brand: "Unilumin / Leyard Module A+",
    origin: "Nhập khẩu chính hãng",
    quantity: "200m² Cabinet nhôm đúc 640 x 480mm",
    powerOrSpec: "Khoảng cách điểm ảnh 2.5mm, tần số làm tươi 3840Hz (chống sọc camera)",
    highlights: [
      "Hiển thị siêu nét cho hội nghị, trình chiếu báo cáo tài chính và video 4K",
      "Cabinet nhôm đúc nguyên khối tản nhiệt tự nhiên, lắp ráp phẳng tuyệt đối",
      "Góc nhìn rộng 160 độ, độ sáng dịu mắt không gây chói cho người xem",
    ],
    image: "/images/blog/hoi-nghi-fpt.jpg",
    badge: "Độ Nét 4K",
    safetyCert: "Đầy đủ CO/CQ và thử nghiệm an toàn điện áp",
  },
  {
    id: "eq-8",
    name: "Màn hình LED P3.91 Outdoor Chống Nước Chuẩn IP65",
    category: "man-led",
    categoryLabel: "Màn Hình LED",
    brand: "NationStar Gold Wire",
    origin: "Nhập khẩu",
    quantity: "350m² Cabinet 500 x 1000mm ngoài trời",
    powerOrSpec: "Độ sáng cực cao >= 5.500 cd/m², hiển thị rõ nét ngay dưới nắng gắt",
    highlights: [
      "Chống chịu mưa bão, độ ẩm cao đạt chuẩn IP65 mặt trước và IP54 mặt sau",
      "Phục vụ đại nhạc hội ngoài trời, lễ khởi công, giải chạy marathon, festival",
      "Hệ thống giá treo và khóa nhanh gia cố an toàn tuyệt đối chịu gió bão",
    ],
    image: "/images/projects/cau-thang-long.jpg",
    badge: "Chống Chịu Thời Tiết",
    safetyCert: "Chứng nhận khả năng kháng nước IP65",
  },
  {
    id: "eq-9",
    name: "Bộ Xử Lý Hình Ảnh 4K NovaStar VX1000 & Fiber Optic",
    category: "man-led",
    categoryLabel: "Màn Hình LED",
    brand: "NovaStar Technology",
    origin: "Chính hãng",
    quantity: "08 Bộ xử lý chuyên dụng",
    powerOrSpec: "Tải lên đến 6.5 triệu điểm ảnh / bộ, truyền tín hiệu quang 10Gbps",
    highlights: [
      "Chia tách màn hình đa cửa sổ (Picture in Picture), chuyển cảnh mượt mà",
      "Độ trễ tín hiệu cực thấp < 1 khung hình, đồng bộ hoàn hảo với camera trường quay",
      "Tích hợp kết nối HDMI 2.0, DP 1.2, 3G-SDI chuyên dụng cho đài truyền hình",
    ],
    image: "/images/blog/stage-setup.jpg",
    badge: "Điều Phối Tín Hiệu",
  },
  {
    id: "eq-10",
    name: "Nhà Bạt Không Gian Hợp Kim Nhôm Truss 400x400 T6061-T6",
    category: "san-khau-truss",
    categoryLabel: "Sân Khấu & Nhà Bạt",
    brand: "Nhôm kết cấu T6061-T6 chịu lực chuẩn công nghiệp",
    origin: "Sản xuất tiêu chuẩn an toàn xây dựng",
    quantity: "Kho sẵn sàng lắp dựng 3.000m² nhà bạt không gian khẩu độ 12m, 15m, 18m, 20m",
    powerOrSpec: "Chịu sức gió cấp 7 - cấp 8, bạt cách nhiệt 3 lớp màu trắng sang trọng",
    highlights: [
      "Thiết kế giàn không gian kiên cố, không bị võng, tính thẩm mỹ đẳng cấp",
      "Bạt phủ PVC chống thấm 100%, chống tia cực tím và chống cháy lan",
      "Hệ thống Palang xích điện 2 tấn tự động nâng hạ dàn khung an toàn tối đa",
    ],
    image: "/images/projects/nha-may-eiffel.jpg",
    badge: "An Toàn Tuyệt Đối",
    safetyCert: "Kiểm định kết cấu chịu tải do Trung tâm Kiểm định đo lường cấp",
  },
  {
    id: "eq-11",
    name: "Sân Khấu Lắp Ghép Đa Năng Cao Độ 0.4m - 1.8m",
    category: "san-khau-truss",
    categoryLabel: "Sân Khấu & Nhà Bạt",
    brand: "Trường Hải Pro Stage",
    origin: "Khung hợp kim mạ kẽm chịu lực",
    quantity: "500m² mặt sàn sân khấu di động",
    powerOrSpec: "Tải trọng chịu lực lên tới 850 kg/m²",
    highlights: [
      "Mặt ván ép phủ phim chống nước, trải thảm đỏ / nỉ cao cấp hoặc decal bóng",
      "Bậc tam cấp chống trượt, lan can bảo vệ mỹ thuật vững chắc",
      "Thi công lắp ráp nhanh gọn, linh hoạt theo mọi hình dạng thiết kế độc bản",
    ],
    image: "/images/blog/le-ban-giao-vinfast.jpg",
    badge: "Tải Trọng 850kg/m²",
  },
  {
    id: "eq-12",
    name: "Dàn Xe Du Lịch 45 Chỗ Hyundai Universe Noble Đời 2022 - 2024",
    category: "xe-du-lich",
    categoryLabel: "Vận Tải & Xe Du Lịch",
    brand: "Hyundai Motor",
    origin: "Hàn Quốc / Lắp ráp 3 cục",
    quantity: "15 Xe Universe Noble 45 chỗ",
    powerOrSpec: "Động cơ D6CA 380PS mạnh mẽ, êm ái, phanh ABS & bầu hơi khí nén",
    highlights: [
      "Nội thất sang trọng, ghế bọc da ngả cao cấp, hệ thống điều hòa lạnh sâu",
      "Màn hình LCD 32 inch, micro karaoke giải trí, cổng sạc điện thoại từng ghế",
      "Bảo hiểm hành khách mức cao nhất và tài xế 10+ năm kinh nghiệm đường dài",
    ],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    badge: "Đội Xe Đời Mới",
    safetyCert: "Đăng kiểm định kỳ & phù hiệu xe du lịch hợp chuẩn Bộ GTVT",
  },
  {
    id: "eq-13",
    name: "Xe Du Lịch 16 - 29 - 35 Chỗ Thaco Town & Ford Transit",
    category: "xe-du-lich",
    categoryLabel: "Vận Tải & Xe Du Lịch",
    brand: "Thaco / Ford",
    origin: "Đời mới 2021 - 2024",
    quantity: "10 Xe phục vụ linh hoạt",
    powerOrSpec: "Nhanh nhẹn, cơ động trên mọi cung đường tour và đưa đón sự kiện",
    highlights: [
      "Phục vụ đưa đón đại biểu VIP, đoàn cán bộ công tác và tour gia đình",
      "Khoang hành lý rộng rãi, sạch sẽ thơm tho, không mùi xe",
      "Lịch trình chuẩn xác theo cam kết hợp đồng",
    ],
    image: "/images/blog/teambuilding-bai-chay.jpg",
    badge: "Linh Hoạt Đón Tiễn",
  },
];

// Cơ cấu tổ chức nhân sự nòng cốt
export const ORGANIZATION_ROLES: OrganizationRole[] = [
  {
    title: "Ban Tổng Giám Đốc (Executive Board)",
    department: "Lãnh đạo & Hoạch định chiến lược",
    headcount: "02 nhân sự",
    description: "Chỉ đạo toàn diện, bảo lãnh pháp lý và trực tiếp phê duyệt phương án an toàn, bảo hiểm các đại lễ quy mô lớn.",
    keyResponsibilities: [
      "Bảo lãnh tư cách pháp nhân và nghĩa vụ hợp đồng đối tác",
      "Kiểm soát tài chính và phê duyệt ngân sách tối ưu cho khách hàng",
      "Duy trì quan hệ đối tác chiến lược cấp Nhà nước và tập đoàn",
    ],
  },
  {
    title: "Khối Đạo Diễn & Sáng Tạo Concept (Creative & Directing)",
    department: "Phòng Sáng tạo & Kịch bản",
    headcount: "06 nhân sự",
    description: "Do Đạo diễn Nghệ thuật Trần Thu Hà chủ trì, chuyên sâu nghiên cứu bản sắc thương hiệu để kiến tạo kịch bản độc bản.",
    keyResponsibilities: [
      "Viết kịch bản chi tiết MC, timeline phút-phút và lời dẫn trang trọng",
      "Thiết kế 3D sân khấu, visual LED motion graphic và hiệu ứng sân khấu",
      "Tổng đạo diễn chạy thử sân khấu (Rehearsal) trước giờ G",
    ],
  },
  {
    title: "Khối Kỹ Thuật Hiện Trường & Kho Bãi (Technical & Warehouse)",
    department: "Bộ phận Kỹ thuật & Thiết bị",
    headcount: "18 nhân sự kỹ thuật cứng + 30 nhân sự thi công",
    description: "Chịu trách nhiệm trực tiếp 1.000m² kho thiết bị, vận hành âm thanh ánh sáng và đảm bảo an toàn tuyệt đối.",
    keyResponsibilities: [
      "Khảo sát đo đạc mặt bằng thực tế và lập bản vẽ bố trí tải trọng",
      "Lắp đặt hoàn thiện trước giờ G tối thiểu 4 - 6 tiếng để test kỹ thuật",
      "Trực chiến 100% thời gian sự kiện, xử lý phương án dự phòng 1-1",
    ],
  },
  {
    title: "Khối Vận Hành Tour & Team Building (Tour Operations)",
    department: "Bộ phận Điều hành Tour & Hướng dẫn viên",
    headcount: "12 nhân sự nòng cốt + Đội ngũ MC hoạt náo",
    description: "Quản trị chuỗi cung ứng khách sạn, resort, nhà xe và các kịch bản team building gắn kết văn hóa doanh nghiệp.",
    keyResponsibilities: [
      "Khảo sát tuyến điểm du lịch an toàn, khách sạn 4 - 5 sao đạt chuẩn",
      "Tổ chức chuỗi trò chơi Team Building bùng nổ năng lượng",
      "Chăm sóc từng thành viên trong đoàn, bảo hiểm du lịch trọn gói",
    ],
  },
  {
    title: "Khối Quản Trị Rủi Ro & An Toàn Hiện Trường (Safety & Compliance)",
    department: "Ban An toàn & Nghi thức",
    headcount: "04 chuyên viên an toàn",
    description: "Giám sát an toàn điện, phòng cháy chữa cháy, kiểm định giàn truss và điều phối an ninh trật tự sự kiện.",
    keyResponsibilities: [
      "Kiểm tra tiếp địa chống giật và aptomat tự ngắt hệ thống điện",
      "Phối hợp lực lượng bảo vệ, công an địa phương bảo đảm an ninh trật tự",
      "Bảo đảm tuân thủ quy chuẩn phòng cháy chữa cháy TCVN",
    ],
  },
];

// Danh mục hồ sơ pháp lý và kiểm định (Legal & Compliance Dossier)
export const LEGAL_DOSSIER_ITEMS: LegalDocumentItem[] = [
  {
    id: "legal-1",
    name: "Giấy Chứng Nhận Đăng Ký Doanh Nghiệp (ĐKKD)",
    code: "Mã số thuế: 0111601327",
    issuedBy: "Sở Kế hoạch và Đầu tư Thành phố Hà Nội",
    status: "Hiệu lực vĩnh viễn",
    description: "Tư cách pháp nhân đầy đủ theo quy định của Luật Doanh nghiệp nước CHXHCN Việt Nam.",
  },
  {
    id: "legal-2",
    name: "Hóa Đơn Giá Trị Gia Tăng Điện Tử (VAT e-Invoice)",
    code: "Mẫu số chuẩn Tổng cục Thuế",
    issuedBy: "Tổng cục Thuế - Cơ quan thuế TP Hà Nội",
    status: "Đã xác thực",
    description: "Xuất hóa đơn GTGT 100% hợp lệ, rõ ràng từng hạng mục thiết bị, nhân sự, tour du lịch theo quy định.",
  },
  {
    id: "legal-3",
    name: "Hợp Đồng Bảo Hiểm Trách Nhiệm Công Cộng Sự Kiện (Public Liability)",
    code: "Hạn mức bồi thường hàng tỷ đồng",
    issuedBy: "Tổng Công ty Bảo hiểm uy tín Quốc gia",
    status: "Có sẵn trong hồ sơ thầu",
    description: "Bảo hiểm rủi ro tài sản và con người đối với các sự kiện tập trung đông người ngoài trời và trong nhà.",
  },
  {
    id: "legal-4",
    name: "Biên Bản Kiểm Định An Toàn Giàn Giáo, Khung Truss & Ba Lăng Điện",
    code: "Tiêu chuẩn kiểm định TCVN",
    issuedBy: "Trung tâm Kiểm định Kỹ thuật An toàn Lao động",
    status: "Đã xác thực",
    description: "Chứng chỉ kiểm định định kỳ hệ thống khung truss nhôm và tời điện nâng hạ trước mỗi mùa sự kiện.",
  },
  {
    id: "legal-5",
    name: "Chứng Chỉ Thao Tác An Toàn Điện Sân Khấu & PCCC",
    code: "Chứng chỉ an toàn lao động nhóm 3",
    issuedBy: "Cục An toàn Lao động - Bộ LĐ-TB&XH",
    status: "Đã xác thực",
    description: "100% kỹ thuật viên nòng cốt được tập huấn nghiệp vụ phòng cháy chữa cháy và an toàn điện lực.",
  },
  {
    id: "legal-6",
    name: "Giấy Phép Kinh Doanh Vận Tải Bằng Xe Ô Tô Hợp Đồng",
    code: "Phù hiệu xe du lịch hợp chuẩn",
    issuedBy: "Sở Giao thông Vận tải Hà Nội",
    status: "Hiệu lực vĩnh viễn",
    description: "Đội xe gắn thiết bị giám sát hành trình GPS, camera cabin và đầy đủ bảo hiểm bắt buộc dân sự.",
  },
];

// Các gói tài liệu E-Profile sẵn sàng xuất bản
export const DOWNLOADABLE_DOSSIERS = [
  {
    id: "pkg-full",
    title: "Hồ Sơ Năng Lực Tổng Hợp Toàn Diện (Bản B2B)",
    format: "PDF Màu 300DPI",
    size: "18.5 MB",
    pages: "48 Trang Song Ngữ",
    suitableFor: "Đấu thầu sự kiện tập đoàn, tổng công ty, trường đại học, gói dịch vụ trọn năm",
    features: [
      "Đầy đủ thư ngỏ, pháp lý, báo cáo tài chính tóm tắt",
      "Catalogue 100+ thiết bị âm thanh ánh sáng kèm hình ảnh thực tế kho",
      "Hồ sơ 20+ dự án tiêu biểu kèm hình ảnh hiện trường và thư cảm ơn",
    ],
  },
  {
    id: "pkg-tech",
    title: "Catalogue Thiết Bị & Bảng Thông Số Kỹ Thuật (Rider Tech)",
    format: "PDF Kỹ Thuật",
    size: "9.2 MB",
    pages: "24 Trang Chi Tiết",
    suitableFor: "Đạo diễn kỹ thuật, tổng công trình sư, bộ phận mua hàng (Procurement)",
    features: [
      "Sơ đồ bố trí âm thanh Line Array & ánh sáng Beam/LED",
      "Thông số chịu tải nhà giàn hợp kim nhôm Truss 400x400",
      "Đặc tả kỹ thuật Cabinet LED P2.5/P3.91 và bộ xử lý NovaStar",
    ],
  },
  {
    id: "pkg-travel",
    title: "Hồ Sơ Năng Lực Mảng Du Lịch & Vận Tải Doanh Nghiệp",
    format: "PDF Màu",
    size: "12.0 MB",
    pages: "32 Trang",
    suitableFor: "Công đoàn, Phòng Nhân sự (HR), Quản trị hành chính tổ chức Tour & Team Building",
    features: [
      "Danh mục 15+ tuyến tour độc quyền Hạ Long, Sapa, Đà Nẵng, Phú Quốc",
      "Hồ sơ dàn xe 16 - 45 chỗ Universe Noble đời mới",
      "Ngân hàng 50+ concept Team Building gắn kết văn hóa doanh nghiệp",
    ],
  },
];
