-- =============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU SUPABASE CHO DỰ ÁN:
-- CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI (TRƯỜNG HẢI EVENT & TRAVEL)
-- Tích hợp Công Cụ Quản Trị Radar SEO AI & Hệ Thống Quét Ngầm Đối Thủ
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
-- 6. BẢNG COMPETITORS: Quản lý danh sách đối thủ cạnh tranh đang theo dõi
-- =============================================================================
DROP TABLE IF EXISTS competitors CASCADE;
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'tron-goi',
    is_active BOOLEAN NOT NULL DEFAULT true,
    priority_badge TEXT,
    notes TEXT,
    last_scanned_at TIMESTAMPTZ,
    scanned_pages_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 7. BẢNG COMPETITOR_SCANNED_PAGES: Kho lưu trữ chữ/nội dung trang của đối thủ
-- =============================================================================
DROP TABLE IF EXISTS competitor_scanned_pages CASCADE;
CREATE TABLE competitor_scanned_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
    url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    headings JSONB, -- Mảng cấu trúc H1, H2, H3
    meta_description TEXT,
    clean_text TEXT,
    word_count INTEGER DEFAULT 0,
    published_date TIMESTAMPTZ,
    scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 8. BẢNG CONTENT_GAP_IDEAS: Khoảng trống nội dung & Ý tưởng kế hoạch bài viết
-- =============================================================================
DROP TABLE IF EXISTS content_gap_ideas CASCADE;
CREATE TABLE content_gap_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    target_keyword TEXT NOT NULL,
    competitor_source TEXT,
    competitor_url TEXT,
    cluster_category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    search_intent TEXT NOT NULL DEFAULT 'informational' CHECK (search_intent IN ('informational', 'commercial', 'transactional')),
    our_site_status TEXT NOT NULL DEFAULT 'missing' CHECK (our_site_status IN ('missing', 'in_plan', 'drafted')),
    suggested_title TEXT,
    gap_reason TEXT,
    estimated_search_volume TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 9. BẢNG RADAR_ACTIVITY_LOGS: Nhật ký vận hành hệ thống Radar SEO
-- =============================================================================
DROP TABLE IF EXISTS radar_activity_logs CASCADE;
CREATE TABLE radar_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_type TEXT NOT NULL CHECK (execution_type IN ('cron', 'dry-run', 'live-run', 'reschedule')),
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'warning', 'error')),
    competitor_name TEXT,
    pages_scanned INTEGER DEFAULT 0,
    gaps_found INTEGER DEFAULT 0,
    message TEXT NOT NULL,
    duration_sec INTEGER,
    details JSONB,
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
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_scanned_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_gap_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE radar_activity_logs ENABLE ROW LEVEL SECURITY;

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

-- Cho phép toàn quyền quản trị cho các module Radar SEO
CREATE POLICY "Enable all for competitor_logs" ON competitor_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for competitors" ON competitors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for competitor_scanned_pages" ON competitor_scanned_pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for content_gap_ideas" ON content_gap_ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for radar_activity_logs" ON radar_activity_logs FOR ALL USING (true) WITH CHECK (true);


-- =============================================================================
-- DỮ LIỆU MẪU THẬT CỦA CÔNG TY TRƯỜNG HẢI EVENT & TRAVEL (INSERT DỮ LIỆU)
-- =============================================================================

-- 1. INSERT DỊCH VỤ THẬT
INSERT INTO services (title, slug, category, description, image_url) VALUES
('Lễ Khai Trương', 'le-khai-truong', 'su-kien', 
 'Tổ chức Lễ Khai Trương trọn gói chuẩn phong thủy, thu hút truyền thông và kích hoạt tài lộc cho cửa hàng, showroom, chi nhánh, văn phòng mới.', 
 '/images/projects/khai-truong-cuong-phat.jpg'),

('Lễ Khánh Thành', 'le-khanh-thanh', 'su-kien', 
 'Tổ chức trọng thể Lễ Khánh Thành nhà máy, công trình, dự án trọng điểm với quy trình nghi lễ chuẩn mực, trang nghiêm và an toàn tuyệt đối.', 
 '/images/projects/khanh-thanh-eiffel-damsan.jpg'),

('Hội Nghị, Hội Thảo', 'hoi-nghi-hoi-thao', 'su-kien', 
 'Giải pháp tổ chức Hội nghị khách hàng, Đại hội cổ đông, Hội thảo khoa học và Lễ ra mắt sản phẩm đạt tiêu chuẩn quốc tế từ 100 đến 2.000+ đại biểu.', 
 '/images/projects/hoi-nghi-the-k-park.jpg'),

('Tiệc Tất Niên - Y.E.P, Gala Dinner', 'tiec-tat-nien-yep-gala-dinner', 'su-kien', 
 'Đêm tiệc vinh danh thăng hoa cảm xúc, gắn kết nội bộ và tri ân chặng đường cống hiến với concept độc bản mang đậm dấu ấn văn hóa doanh nghiệp.', 
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'),

('Team Building', 'team-building', 'du-lich', 
 'Chương trình Team Building bãi biển, resort và dã ngoại bứt phá giới hạn, truyền lửa nhiệt huyết và gắn kết tinh thần đồng đội vững mạnh.', 
 '/images/projects/team-building-dia-oc-tl.jpg'),

('Trung Thu', 'trung-thu', 'su-kien', 
 'Tổ chức Đêm Hội Trăng Rằm lung linh sắc màu cổ tích dành cho con em cán bộ nhân viên doanh nghiệp, khu đô thị, chung cư và trường học.', 
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80'),

('Tết Thiếu Nhi', 'tet-thieu-nhi', 'su-kien', 
 'Ngày hội Quốc tế Thiếu nhi 1/6 và Family Day sôi động, ngập tràn tiếng cười, gắn kết gia đình nhỏ trong đại gia đình doanh nghiệp.', 
 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'),

('Hình Ảnh & Thiết Bị Sự Kiện', 'thiet-bi-su-kien', 'su-kien', 
 'Sản xuất, thi công và cho thuê trọn gói hệ thống Âm thanh, Ánh sáng, Màn hình LED, Sân khấu, Nhà bạt không gian chính hãng với chi phí tối ưu.', 
 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80'),

('Hoạt Động Khác', 'hoat-dong-khac', 'du-lich', 
 'Đa dạng giải pháp tổ chức Lễ khởi công – động thổ, Kỷ niệm thành lập, Hội thao, Họp lớp, Tour du lịch trải nghiệm – thiện nguyện và Cho thuê xe 7–45 chỗ.', 
 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80');


-- 2. INSERT CÁC DỰ ÁN TIÊU BIỂU THẬT ĐÃ THỰC HIỆN
INSERT INTO projects (title, category, client_name, description, image_url) VALUES
('Lễ thông xe Dự án sửa chữa Cầu Thăng Long', 'su-kien', 'Tổng cục Đường bộ Việt Nam',
 'Sự kiện quy mô quốc gia chào mừng công trình giao thông trọng điểm huyết mạch của Thủ đô Hà Nội. Trường Hải Event đảm nhận toàn bộ sân khấu, thiết bị âm thanh ánh sáng và điều phối nghi thức cắt băng thông xe.',
 '/images/projects/cau-thang-long.jpg'),

('Lễ khánh thành Hệ thống Điện mặt trời Áp Mái tại Nhà máy EIFFEL', 'su-kien', 'Công ty Cổ phần DAMSAN',
 'Tổ chức lễ khánh thành nhà máy điện mặt trời công nghệ xanh với hơn 500 khách mời là lãnh đạo các sở ban ngành tỉnh Thái Bình và các đối tác tài chính quốc tế.',
 '/images/projects/khanh-thanh-eiffel-damsan.jpg'),

('Hội nghị nhà chung cư bất thường - Chung cư The K Park', 'su-kien', 'Ban Quản trị & Cư dân The K Park',
 'Tổ chức Hội nghị nhà chung cư bất thường quy mô lớn tại Phường Phú La với hệ thống nhà bạt, âm thanh hội nghị, sân khấu và bàn ghế đại biểu chuyên nghiệp.',
 '/images/projects/hoi-nghi-the-k-park.jpg'),

('Lễ Khai Trương Công ty TNHH SX KD & TM Cường Phát', 'su-kien', 'Công ty Cường Phát & Tân Phương',
 'Sự kiện Grand Opening trụ sở và cơ sở kinh doanh với nghi lễ cắt băng khai trương, múa Lân Sư Rồng, tiệc trà đón tiếp đại biểu và đối tác.',
 '/images/projects/khai-truong-cuong-phat.jpg'),

('Chương trình Team Building Gắn Kết - Địa Ốc TL', 'du-lich', 'Công ty TNHH Địa Ốc TL',
 'Sự kiện Team Building và Gala Dinner gắn kết toàn thể cán bộ nhân viên Địa Ốc TL với chủ đề hành trình khám phá và bứt phá thành công.',
 '/images/projects/team-building-dia-oc-tl.jpg');


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

-- 4. INSERT ĐỐI THỦ MẪU BAN ĐẦU
INSERT INTO competitors (name, domain, category, is_active, priority_badge, notes, scanned_pages_count) VALUES
('Viet Power Event', 'https://viet-power.vn', 'teambuilding', true, 'Top 1 Teambuilding', 'Mạnh về kịch bản trò chơi bãi biển và tour trọn gói', 42),
('Hòa Bình Events', 'https://hoabinhevents.com', 'hoi-nghi', true, 'Top 1 Hội nghị Quốc tế', 'Quy mô lớn, chuyên hội thảo y tế, đại hội cổ đông', 68),
('Á Châu Event', 'https://sukienachau.com', 'tron-goi', true, 'Chuyên Khai Trương VIP', 'Đội ngũ PG, MC, múa lân sư rồng khai trương chuyên nghiệp', 35),
('Cho Thuê Âm Thanh AS', 'https://chothueamthanhas.com', 'thiet-bi', true, 'Tổng kho Thiết bị LED', 'Báo giá bóc tách âm thanh ánh sáng, sân khấu nhôm truss', 29)
ON CONFLICT (domain) DO NOTHING;
