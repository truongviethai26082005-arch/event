# TRƯỜNG HẢI EVENT & TRAVEL + RADAR SEO AI

> **Dự án Website Chính Thức & Công Cụ Nội Bộ Radar SEO**  
> **CÔNG TY TNHH SỰ KIỆN VÀ DU LỊCH TRƯỜNG HẢI**  
> *"Sự kiện chuyên nghiệp – Du lịch trải nghiệm – Kết nối thành công"*

---

## 1. THÔNG TIN DOANH NGHIỆP DÙNG CHUNG (`src/lib/company-data.ts`)
- **Tên đầy đủ:** Công ty TNHH Sự kiện và Du lịch Trường Hải (Trường Hải Event & Travel)
- **Tên tiếng Anh:** TRUONG HAI EVENT AND TRAVEL COMPANY LIMITED
- **Mã số thuế:** 0111601327 (Sở KH&ĐT TP Hà Nội cấp)
- **Giám đốc điều hành:** Nguyễn Thị Thu Hằng
- **Địa chỉ:** LK 628, ngõ Lực, đường Sinh Viên, thôn Thanh Kỳ, xã Bình Minh, TP Hà Nội
- **Hotline 24/7:** 0844 198 333
- **Nhận diện màu sắc thương hiệu:**
  - **Màu chủ đạo (Primary):** Xanh Navy đậm (`#0A1E5E` / `bg-[#0A1E5E]`)
  - **Màu nhấn (Accent):** Vàng Ánh Kim / Gold (`#D4AF37` / `text-[#D4AF37]`)

---

## 2. PHÂN CHIA THƯ MỤC CÔNG VIỆC (CHỐNG XUNG ĐỘT GITHUB)

Nhóm áp dụng nguyên tắc **"Mỗi người một thư mục (Strict Isolation)"**:

| Thành viên | Phân hệ phụ trách | Thư mục được phép làm việc |
| :--- | :--- | :--- |
| **Thành viên 1 (Lead)** | Khung dự án, Header/Footer chung, Trang chủ Landing Page | `src/app/page.tsx`, `src/components/`, `src/lib/` |
| **Thành viên 2** | Mảng Dịch vụ & Form Báo giá trực tuyến | `src/app/dich-vu/` |
| **Thành viên 3** | Mảng Tin tức & Bài viết Blog SEO | `src/app/tin-tuc/` |
| **Thành viên 4** | Công nghệ lõi Radar SEO & API AI | `src/app/admin-radar/` và `src/app/api/radar/` |

---

## 3. CÂU LỆNH "THẦN CHÚ" DÀNH CHO CÁC THÀNH VIÊN KHI DÙNG AI (STITCH / ANTIGRAVITY)

Dán câu này vào đầu mọi phiên chat với AI:

* **Thành viên 2 (Mảng Dịch vụ):**
  > *"Tôi đang làm việc trong dự án nhóm của Trường Hải Event & Travel. Bạn CHỈ ĐƯỢC PHÉP tạo mới hoặc chỉnh sửa các file bên trong thư mục `src/app/dich-vu/`. TUYỆT ĐỐI KHÔNG chỉnh sửa `package.json`, `Header.tsx`, `Footer.tsx`, `page.tsx` hay bất kỳ file nào ngoài thư mục `src/app/dich-vu/`."*

* **Thành viên 3 (Mảng Tin tức & Blog SEO):**
  > *"Tôi đang làm việc trong dự án nhóm của Trường Hải Event & Travel. Bạn CHỈ ĐƯỢC PHÉP tạo mới hoặc chỉnh sửa các file bên trong thư mục `src/app/tin-tuc/`. TUYỆT ĐỐI KHÔNG chỉnh sửa `package.json` hay các file bên ngoài thư mục `src/app/tin-tuc/`."*

* **Thành viên 4 (Mảng Radar SEO Admin):**
  > *"Tôi đang làm việc trong dự án nhóm của Trường Hải Event & Travel. Bạn CHỈ ĐƯỢC PHÉP tạo mới hoặc chỉnh sửa các file bên trong `src/app/admin-radar/` và `src/app/api/radar/`. TUYỆT ĐỐI KHÔNG chỉnh sửa `package.json` hay các thư mục khác."*

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL

### Bước 1: Cài đặt thư viện
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
Tạo file `.env.local` từ file mẫu `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-google-gemini-api-key
```
*(Nếu chưa có tài khoản Supabase / Gemini, dự án vẫn chạy mượt mà ở chế độ Demo với dữ liệu mẫu fallback!)*

### Bước 3: Khởi tạo Database Supabase
1. Mở Supabase Dashboard -> **SQL Editor**.
2. Mở file `supabase_schema.sql` trong thư mục gốc dự án.
3. Copy toàn bộ nội dung và bấm **Run**. File này sẽ tự động tạo 5 bảng (`services`, `projects`, `posts`, `leads`, `competitor_logs`) và nạp sẵn toàn bộ dữ liệu thật của Trường Hải Event & Travel!

### Bước 4: Khởi chạy Server phát triển
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 5. DANH SÁCH ĐƯỜNG DẪN TRANG
- **Trang chủ:** `/`
- **Dịch vụ sự kiện & Du lịch:** `/dich-vu`
- **Tin tức & Cẩm nang SEO:** `/tin-tuc`
- **Chi tiết bài viết:** `/tin-tuc/[slug]`
- **Công cụ nội bộ Radar SEO:** `/admin-radar`
- **Backend API Radar:** `/api/radar` (POST)
