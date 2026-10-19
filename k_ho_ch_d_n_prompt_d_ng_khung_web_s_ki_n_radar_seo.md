# TÀI LIỆU KẾ HOẠCH & CẤU TRÚC DỰ ÁN: WEB SỰ KIỆN & RADAR SEO

---

## PHẦN 1: TỔNG QUAN DỰ ÁN & CÔNG NGHỆ (TECH STACK)

### 1. Mục tiêu dự án
* **Mặt tiền (Frontend & CMS):** Website công ty tổ chức sự kiện chuyên nghiệp (tham khảo mô hình Hòa Bình Group) gồm Trang chủ, Danh mục Dịch vụ & Báo giá, và Chuyên mục Tin tức/Blog chuẩn SEO.
* **Vũ khí lõi (SEO Radar Engine):** Công cụ nội bộ tự động cào nội dung bài viết của đối thủ từ URL (dùng Jina Reader miễn phí), phân tích cấu trúc SEO (H1, H2, H3, từ khóa, lỗ hổng nội dung) bằng AI (Gemini/OpenAI API), và tự động viết bài mới chuẩn SEO lưu vào Database dưới dạng bản nháp (Draft) chờ người duyệt.

### 2. Tech Stack (Chuẩn hóa cho AI dễ code nhất)
* **Framework:** Next.js (App Router) + TypeScript
* **Giao diện (Styling):** Tailwind CSS + Lucide React (Icon)
* **Cơ sở dữ liệu (Database & Backend):** Supabase
* **Công nghệ Radar SEO (0 đồng):** 
  * Cào dữ liệu web: `https://r.jina.ai/[URL_ĐỐI_THỦ]`
  * Trí tuệ nhân tạo phân tích & viết bài: Google Gemini API (hoặc OpenAI API)

---

## PHẦN 2: CẤU TRÚC CƠ SỞ DỮ LIỆU (SUPABASE TABLES)

*Hãy viết câu lệnh SQL để chạy trong SQL Editor của Supabase:*

1. **Bảng `services` (Lưu các dịch vụ sự kiện)**
   * `id` (uuid, primary key)
   * `title` (text) - Tên dịch vụ (VD: Tổ chức hội nghị, Teambuilding...)
   * `slug` (text) - Đường dẫn thân thiện SEO
   * `description` (text) - Mô tả ngắn
   * `content` (text) - Nội dung chi tiết
   * `image_url` (text) - Link ảnh đại diện
   * `created_at` (timestamp)

2. **Bảng `posts` (Lưu bài viết Blog / SEO)**
   * `id` (uuid, primary key)
   * `title` (text) - Tiêu đề bài viết
   * `slug` (text) - Đường dẫn URL chuẩn SEO
   * `summary` (text) - Tóm tắt (Meta description)
   * `content` (text) - Nội dung bài viết (định dạng Markdown hoặc HTML)
   * `target_keyword` (text) - Từ khóa chính
   * `status` (text) - Trạng thái: `'draft'` (Bản nháp từ AI) hoặc `'published'` (Đã duyệt đăng)
   * `created_at` (timestamp)

3. **Bảng `competitor_analysis` (Lưu lịch sử Radar SEO quét đối thủ)**
   * `id` (uuid, primary key)
   * `competitor_url` (text) - Link bài viết đối thủ
   * `raw_content` (text) - Nội dung cào về từ Jina Reader
   * `ai_analysis` (jsonb hoặc text) - Đánh giá của AI (cấu trúc H1-H3 của đối thủ, điểm mạnh, điểm yếu)
   * `generated_post_id` (uuid) - Liên kết với bài viết mới được AI tạo ra ở bảng `posts`
   * `created_at` (timestamp)

4. **Bảng `leads` (Lưu thông tin khách hàng đăng ký báo giá)**
   * `id` (uuid, primary key)
   * `full_name` (text)
   * `phone` (text)
   * `email` (text)
   * `event_type` (text)
   * `notes` (text)
   * `created_at` (timestamp)

---

## PHẦN 3: PHÂN CHIA THƯ MỤC ĐỂ KHÔNG XUNG ĐỘT GITHUB

Để các thành viên dùng AI code song song không bị lỗi Git Conflict, dự án áp dụng nguyên tắc **"Mỗi người một thư mục (Isolation)"**:

* **Thành viên 1 (Lead):** 
  * Phụ trách khởi tạo khung dự án, cấu hình Supabase, Header/Footer chung và làm **Trang chủ**.
  * Chỉ làm việc tại: `src/app/page.tsx` và `src/components/layout/`
* **Thành viên 2 (Mảng Dịch vụ & Form Báo giá):** 
  * Chỉ được phép bảo AI tạo và sửa file bên trong thư mục: `src/app/dich-vu/`
* **Thành viên 3 (Mảng Tin tức / Hiển thị Blog SEO):** 
  * Chỉ được phép bảo AI tạo và sửa file bên trong thư mục: `src/app/tin-tuc/`
* **Thành viên 4 (Mảng Công nghệ lõi - Radar SEO Admin):** 
  * Chỉ được phép bảo AI tạo và sửa file bên trong thư mục: `src/app/admin-radar/` và `src/app/api/radar/`

### Quy tắc Git cơ bản cho các thành viên:
1. **Không tự ý cài thêm thư viện ngoài** (không làm thay đổi file `package.json`). Cần gì báo Lead cài.
2. Trước khi làm việc: Mở Git Bash gõ `git pull`
3. Khi làm xong trong thư mục của mình:
   * `git add .`
   * `git commit -m "Ten_thanh_vien: cap nhat tinh nang"`
   * `git push`
*(Nếu bị lỗi Git đỏ lòm không push được: Nén thư mục của mình thành file `.zip` gửi qua Zalo cho Lead ghép vào!).*

---

## PHẦN 4: MASTER PROMPT (COPY ĐOẠN NÀY DÁN VÀO ANTIGRAVITY / CLAUDE CODE ĐỂ DỰNG KHUNG)

> **Hướng dẫn cho Lead:** Copy toàn bộ phần văn bản nằm trong khung bên dưới và gửi cho AI để nó tạo bộ khung xương (Base Project) trước khi chia cho anh em.

```text
Bạn là một Senior Fullstack Developer. Tôi đang dẫn dắt một nhóm làm dự án Website Công ty Tổ chức Sự kiện (lấy cảm hứng từ Hòa Bình Group) kết hợp với một công cụ nội bộ tên là "Radar SEO". 

Vì các thành viên trong nhóm sẽ code song song trên các nhánh/thư mục khác nhau bằng AI, tôi cần bạn khởi tạo BỘ KHUNG XƯƠNG DỰ ÁN (Base Project) thật rõ ràng, tách biệt hoàn toàn các khu vực để tránh xung đột (Git Conflict).

Hãy thực hiện các yêu cầu sau:

1. CÔNG NGHỆ SỬ DỤNG:
- Next.js (App Router), TypeScript, Tailwind CSS, Lucide React (icons).
- Kết nối sẵn với Supabase (tạo sẵn file cấu hình client tại `src/lib/supabase.ts` sử dụng biến môi trường `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

2. CẤU TRÚC THƯ MỤC BẮT BUỘC (Tạo sẵn các trang khung - Placeholder pages):
Hãy tạo sẵn cấu trúc thư mục sau với giao diện khung cơ bản để các thành viên khác chỉ việc vào đúng thư mục của họ và code tiếp:
- `src/components/layout/Header.tsx` và `Footer.tsx`: Thanh điều hướng và chân trang mang phong cách công ty sự kiện chuyên nghiệp (Tông màu: Xanh đậm Midnight Blue và Vàng Gold sang trọng), có gắn sẵn link trỏ tới `/`, `/dich-vu`, `/tin-tuc`, và `/admin-radar`.
- `src/app/page.tsx`: Trang chủ (Landing Page) gồm Hero Section ấn tượng về tổ chức sự kiện, số liệu thống kê uy tín, danh sách dịch vụ nổi bật, và nút kêu gọi hành động (CTA).
- `src/app/dich-vu/page.tsx`: Trang khung dành cho Thành viên 2 (Hiển thị danh sách dịch vụ sự kiện và Form nhận báo giá).
- `src/app/tin-tuc/page.tsx`: Trang khung dành cho Thành viên 3 (Hiển thị danh sách bài viết Blog/SEO).
- `src/app/admin-radar/page.tsx`: Trang quản trị "Radar SEO" dành cho Thành viên 4. 
- `src/app/api/radar/route.ts`: API Route xử lý ngầm cho tính năng Radar SEO.

3. XÂY DỰNG LUỒNG CƠ BẢN CHO TÍNH NĂNG "RADAR SEO" (Tại `/admin-radar` và `/api/radar`):
Hãy code sẵn giao diện và luồng hoạt động cơ bản cho `/admin-radar` gồm:
- Một ô Input để nhập URL bài viết của đối thủ cạnh tranh và ô nhập Từ khóa mục tiêu.
- Khi bấm nút "Quét & Phân tích", gọi xuống `/api/radar`:
  + Bước 1: Dùng `fetch` gọi tới `https://r.jina.ai/[URL_ĐỐI_THỦ]` để lấy toàn bộ nội dung bài viết của đối thủ dưới dạng Markdown sạch.
  + Bước 2: Gửi nội dung đó qua Google Gemini API (sử dụng biến môi trường `GEMINI_API_KEY`) với prompt yêu cầu: Phân tích cấu trúc H1, H2, H3, từ khóa của đối thủ, chỉ ra điểm yếu/thiếu sót và tự động viết lại một bài viết mới dài, sâu sắc, chuẩn SEO hơn cho công ty sự kiện của chúng tôi.
  + Bước 3: Hiển thị kết quả phân tích và bài viết mới lên màn hình để người dùng có thể chỉnh sửa và bấm nút "Lưu bản nháp vào Supabase" (bảng `posts`).

4. FILE SQL SUPABASE:
Hãy tạo thêm một file tên là `supabase_schema.sql` ở thư mục gốc, chứa toàn bộ câu lệnh SQL để tạo 4 bảng: `services`, `posts`, `competitor_analysis`, và `leads` để tôi chỉ cần copy vào SQL Editor của Supabase chạy một lần là xong.

Hãy bắt đầu khởi tạo cấu trúc dự án, cài đặt các thư viện cần thiết và viết code cho bộ khung này.
```

---

## PHẦN 5: CÂU LỆNH "THẦN CHÚ" DÀNH CHO CÁC THÀNH VIÊN KHI CODE

Khi các thành viên số 2, 3, 4 bắt đầu làm phần việc của mình bằng AI, bắt buộc phải dán câu này vào đầu cuộc trò chuyện với AI:

* **Dành cho Thành viên 2 (Làm Dịch vụ):**
  > *"Tôi đang làm việc trong một dự án nhóm. Bạn CHỈ ĐƯỢC PHÉP tạo mới hoặc chỉnh sửa các file nằm bên trong thư mục `src/app/dich-vu/`. TUYỆT ĐỐI KHÔNG chỉnh sửa file `package.json`, `Header.tsx`, `page.tsx` ở ngoài hay bất kỳ file nào ngoài thư mục `src/app/dich-vu/` để tránh gây xung đột Git với các thành viên khác."*

* **Dành cho Thành viên 3 (Làm Tin tức/Blog):**
  > *"Tôi đang làm việc trong một dự án nhóm. Bạn CHỈ ĐƯỢC PHÉP tạo mới hoặc chỉnh sửa các file nằm bên trong thư mục `src/app/tin-tuc/`. TUYỆT ĐỐI KHÔNG chỉnh sửa file `package.json`, `Header.tsx`, `page.tsx` ở ngoài hay bất kỳ file nào ngoài thư mục `src/app/tin-tuc/` để tránh gây xung đột Git với các thành viên khác."*

* **Dành cho Thành viên 4 (Làm Radar SEO):**
  > *"Tôi đang làm việc trong một dự án nhóm. Bạn CHỈ ĐƯỢC PHÉP tạo mới hoặc chỉnh sửa các file nằm bên trong thư mục `src/app/admin-radar/` và `src/app/api/radar/`. TUYỆT ĐỐI KHÔNG chỉnh sửa file `package.json` hay bất kỳ file nào ngoài 2 thư mục trên để tránh gây xung đột Git."*