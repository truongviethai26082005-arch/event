-- =============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU SUPABASE CHO DỰ ÁN:
-- CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI (TRƯỜNG HẢI EVENT & TRAVEL)
-- Tích hợp Công Cụ Quản Trị Radar SEO AI
-- =============================================================================

-- Kích hoạt tiện ích tạo UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. BẢNG SERVICES: Lưu danh sách dịch vụ sự kiện & du lịch
-- =============================================================================
DROP TABLE IF EXISTS services CASCADE;
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('su-kien', 'du-lich')),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. BẢNG PROJECTS: Lưu các dự án và đại lễ tiêu biểu đã thực hiện
-- =============================================================================
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'su-kien',
    client_name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 3. BẢNG POSTS: Lưu bài viết Blog & Bài viết SEO tạo bởi Radar AI
-- =============================================================================
DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    meta_description TEXT,
    focus_keyword TEXT,
    competitor_source_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. BẢNG LEADS: Lưu thông tin khách hàng đăng ký nhận báo giá trực tuyến
-- =============================================================================
DROP TABLE IF EXISTS leads CASCADE;
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    event_type TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 5. BẢNG COMPETITOR_LOGS: Lưu lịch sử phân tích đối thủ qua Radar SEO AI
-- =============================================================================
DROP TABLE IF EXISTS competitor_logs CASCADE;
CREATE TABLE competitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_url TEXT NOT NULL,
    raw_content TEXT,
    ai_analysis JSONB,
    target_keyword TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CẤU HÌNH ROW LEVEL SECURITY (RLS) ĐẢM BẢO AN TOÀN TRUY CẬP
-- =============================================================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_logs ENABLE ROW LEVEL SECURITY;

-- Cho phép công chúng đọc dữ liệu dịch vụ và dự án
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);

-- Cho phép công chúng đọc các bài viết đã xuất bản
CREATE POLICY "Public read published posts" ON posts FOR SELECT USING (status = 'published');

-- Cho phép Radar SEO thêm và cập nhật bài viết
CREATE POLICY "Enable all for posts" ON posts FOR ALL USING (true) WITH CHECK (true);

-- Cho phép khách hàng gửi form báo giá vào bảng leads
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select leads" ON leads FOR SELECT USING (true);

-- Cho phép lưu log quét đối thủ
CREATE POLICY "Enable all for competitor_logs" ON competitor_logs FOR ALL USING (true) WITH CHECK (true);


-- =============================================================================
-- DỮ LIỆU MẪU THẬT CỦA CÔNG TY TRƯỜNG HẢI EVENT & TRAVEL (INSERT DỮ LIỆU)
-- =============================================================================

-- 1. INSERT DỊCH VỤ THẬT
INSERT INTO services (title, slug, category, description, image_url) VALUES
-- Mảng Sự kiện
('Lễ kỷ niệm, khánh thành, khai trương, khởi công – động thổ', 'le-ky-niem-khanh-thanh-khai-truong', 'su-kien', 
 'Tổ chức trọn gói các nghi lễ trọng thể mang tính bước ngoặt của doanh nghiệp với quy trình chuẩn chỉ, thiết bị đẳng cấp và kịch bản trang trọng.', 
 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'),

('Tiệc tất niên Year End Party (Y.E.P), Gala Dinner & Team Building', 'tiec-tat-nien-gala-dinner-team-building', 'su-kien', 
 'Chương trình gắn kết nội bộ thăng hoa cảm xúc, tôn vinh cống hiến của nhân sự và tri ân một năm nỗ lực với concept độc bản sáng tạo.', 
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'),

('Sự kiện mở bán Bất động sản, Hội nghị & Hội thảo', 'su-kien-mo-ban-bds-hoi-nghi-hoi-thao', 'su-kien', 
 'Giải pháp tổ chức lễ mở bán kích cầu giao dịch, hội thảo chuyên đề khoa học và xúc tiến thương mại quy mô từ hàng trăm đến hàng ngàn khách.', 
 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'),

('Sự kiện Trung thu, Tết Thiếu nhi, Ngày hội gia đình & Họp lớp', 'trung-thu-tet-thieu-nhi-family-day', 'su-kien', 
 'Không gian vui tươi, ấm cúng và đầy màu sắc dành cho các gia đình, trường học, cơ quan và các khóa cựu học sinh, sinh viên tri ân.', 
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80'),

('Cung cấp thiết bị Âm thanh, Ánh sáng, Sân khấu, Màn hình LED', 'cung-cap-thiet-bi-am-thanh-anh-sang-san-khau', 'su-kien', 
 'Kho thiết bị sự kiện hiện đại, nhập khẩu chính hãng với dàn Line Array công suất lớn, đèn Beam, Par Led, màn hình LED sắc nét phục vụ trong nhà và ngoài trời.', 
 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80'),

-- Mảng Du lịch
('Tổ chức Tour Doanh nghiệp, Tập thể, Cá nhân', 'tour-doanh-nghiep-tap-the-ca-nhan', 'du-lich', 
 'Thiết kế tour du lịch nghỉ dưỡng kết hợp Team Building, Gala Dinner tại các thiên đường nghỉ dưỡng như Hạ Long, Đà Nẵng, Phú Quốc, Sapa, Quy Nhơn...', 
 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'),

('Dịch vụ Vận tải, Cho thuê Xe Du lịch đời mới', 'dich-vu-van-tai-xe-du-lich', 'du-lich', 
 'Đội xe du lịch đời mới từ 7, 16, 29, 35 đến 45 chỗ và xe Limousine VIP phục vụ đưa đón hội nghị, đưa đón chuyên gia, đưa đón sân bay và các tuyến tour.', 
 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'),

('Du lịch Tham quan, Học tập, Trải nghiệm & Thiện nguyện Cộng đồng', 'du-lich-trai-nghiem-thien-nguyen-cong-dong', 'du-lich', 
 'Các tour giáo dục thực tế kết hợp thiện nguyện vì cộng đồng tại các bản làng vùng cao Tây Bắc, Đông Bắc; vừa bồi đắp tri thức vừa lan tỏa yêu thương.', 
 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80');


-- 2. INSERT CÁC DỰ ÁN TIÊU BIỂU THẬT ĐÃ THỰC HIỆN
INSERT INTO projects (title, category, client_name, description, image_url) VALUES
('Lễ thông xe Dự án sửa chữa Cầu Thăng Long', 'su-kien', 'Tổng cục Đường bộ Việt Nam',
 'Sự kiện quy mô quốc gia chào mừng công trình giao thông trọng điểm huyết mạch của Thủ đô Hà Nội. Trường Hải Event đảm nhận toàn bộ sân khấu, thiết bị âm thanh ánh sáng và điều phối nghi thức cắt băng thông xe.',
 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'),

('Lễ khánh thành Hệ thống Điện mặt trời Áp Mái tại Nhà máy EIFFEL', 'su-kien', 'Công ty Cổ phần DAMSAN',
 'Tổ chức lễ khánh thành nhà máy điện mặt trời công nghệ xanh với hơn 500 khách mời là lãnh đạo các sở ban ngành tỉnh Thái Bình và các đối tác tài chính quốc tế.',
 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'),

('Lễ mở bán Dự án Vinpearl Resort & Golf Nam Hội An', 'su-kien', 'Vingroup / Đơn vị Phân phối BĐS',
 'Sự kiện mở bán siêu dự án nghỉ dưỡng thượng lưu thu hút hàng trăm nhà đầu tư VIP. Không gian sang trọng với công nghệ màn hình LED cong và sân khấu trình diễn nghệ thuật đẳng cấp.',
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'),

('Chuỗi Lễ khai trương Điểm bán hàng: LocknLock, Toyoky, Nam Hải Ceramic', 'su-kien', 'LocknLock & Nam Hải Ceramic & Cafe Sài Gòn',
 'Chuỗi sự kiện Grand Opening bùng nổ tại các trung tâm thương mại lớn, kết hợp biểu diễn múa Lân Sư Rồng, minigame bốc thăm trúng thưởng và activation kích hoạt thương hiệu.',
 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'),

('Tiệc Tất niên Y.E.P & Hội chợ Xuân Tri ân', 'su-kien', 'Công An Phường Yên Hòa & Miss Hoa TOEIC & TL K11',
 'Chương trình Gala mừng xuân ấm cúng, tái hiện không gian Tết cổ truyền kết hợp sân khấu âm nhạc sôi động, mang lại nụ cười và sự gắn kết cho cán bộ chiến sĩ và toàn thể nhân viên.',
 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'),

('Company Trip 4N3Đ TL K11 & Hội thao 24 năm LABCO', 'du-lich', 'Địa Ốc TL K11 & Công ty CP LABCO',
 'Chuỗi ngày hội thao quy mô toàn công ty kết hợp tour nghỉ dưỡng 4 ngày 3 đêm tại biển miền Trung, mang lại năng lượng tái tạo đỉnh cao và gắn kết 300+ cán bộ nhân viên.',
 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80'),

('Chương trình Thiện nguyện: Chắp cánh ước mơ (Yên Bái) & Hướng về Sìn Hồ (Lai Châu)', 'thien-nguyen', 'Trường Hải Event & Nhóm Tình nguyện Cộng đồng',
 'Hành trình trao hơn 1.000 phần quà, áo ấm và học bổng cho các em nhỏ điểm trường khó khăn tại tỉnh Yên Bái và huyện biên giới Sìn Hồ (Lai Châu), thể hiện trách nhiệm xã hội sâu sắc.',
 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80');


-- 3. INSERT BÀI VIẾT BLOG SEO MẪU ĐƯỢC DUYỆT ĐĂNG (status: 'published')
INSERT INTO posts (title, slug, content, meta_description, focus_keyword, status) VALUES
('Quy trình Tổ chức Lễ Khai trương Trọn gói từ A-Z Độc đáo & Thu hút Khách hàng', 
 'quy-trinh-to-chuc-le-khai-truong-tron-goi-tu-a-z',
 'Lễ khai trương (Grand Opening) không chỉ là sự kiện ra mắt đánh dấu bước khởi đầu hoạt động của doanh nghiệp mà còn là cơ hội vàng để định vị thương hiệu. Trường Hải Event & Travel cung cấp dịch vụ tổ chức khai trương trọn gói với hệ thống âm thanh ánh sáng trực tiếp và múa lân sư rồng rộn rã. Hotline 0844 198 333.',
 'Hướng dẫn chi tiết quy trình tổ chức lễ khai trương cửa hàng, showroom thành công rực rỡ, thu hút tài lộc từ chuyên gia tổ chức sự kiện Trường Hải Event & Travel.',
 'tổ chức lễ khai trương',
 'published'),

('Top 7 Ý tưởng Tổ chức Year End Party (Y.E.P) Đột phá & Gắn kết Nhân sự 2026', 
 'top-7-y-tuong-to-chuc-year-end-party-dot-pha-2026',
 'Tiệc tất niên Year End Party (Y.E.P) là ngày hội văn hóa doanh nghiệp tôn vinh những cống hiến và truyền cảm hứng bứt phá. Cùng Trường Hải Event khám phá 7 concept dạ tiệc thảm đỏ, hội chợ xuân dân gian và chuyến bay công nghệ bùng nổ cảm xúc. Hotline 0844 198 333.',
 'Khám phá 7 concept tiệc tất niên Year End Party (YEP) độc đáo, bùng nổ cảm xúc cho doanh nghiệp, giúp tôn vinh cống hiến và tái tạo năng lượng cho năm mới.',
 'tổ chức year end party',
 'published');
