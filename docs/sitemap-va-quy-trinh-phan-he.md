# Sitemap và quy trình phân hệ

## Sitemap website

```text
Website công khai
├── /                         Trang chủ
├── /ve-chung-toi             Giới thiệu doanh nghiệp
├── /dich-vu                  Dịch vụ, ưu đãi và form nhận báo giá
│   └── /dich-vu/cam-on       Xác nhận sau khi gửi form (không đưa vào sitemap)
└── /tin-tuc                  Danh sách bài viết đã xuất bản
    └── /tin-tuc/[slug]       Chi tiết bài viết

Khu vực quản trị (cần đăng nhập, không lập chỉ mục)
├── /login                    Đăng nhập quản trị
├── /admin/dashboard          Tổng quan khách hàng, doanh thu và lịch sự kiện
├── /admin/leads              Tiếp nhận và xử lý khách hàng tiềm năng
├── /admin/services           Quản lý dịch vụ
├── /admin-radar              Phân tích đối thủ và tạo bài viết SEO
└── /admin                    Chuyển hướng về /admin/dashboard

API (không lập chỉ mục)
└── /api/radar                Phân tích nội dung đối thủ và tạo bài viết
```

`/sitemap.xml` được tạo bởi `src/app/sitemap.ts`. Sitemap gồm các trang công khai,
các bài viết mẫu đang được website hiển thị và bài viết có trạng thái `published`
trong Supabase. `/robots.txt` được tạo bởi `src/app/robots.ts`; khu vực quản trị,
đăng nhập và API được khai báo không cho crawler lập chỉ mục.

> Menu hiện có liên kết `/admin/portfolio`, nhưng chưa có trang tương ứng trong
> `src/app`; cần triển khai phân hệ hồ sơ sự kiện trước khi đưa route này vào sitemap.

## Quy trình dữ liệu giữa các phân hệ

```mermaid
flowchart TD
  V[Khách truy cập website] --> S[Trang dịch vụ /dich-vu]
  S --> F[Điền form nhận báo giá]
  F -->|INSERT| L[(Supabase: leads)]
  F --> T[/dich-vu/cam-on]
  L --> D[Admin dashboard]
  L --> M[Admin khách hàng tiềm năng]
  M -->|Cập nhật trạng thái, lịch, ngân sách, người phụ trách| L
  D -->|Tổng hợp KPI và lịch sự kiện| L

  A[Quản trị viên đăng nhập /login] --> P[Proxy xác thực]
  P -->|Phiên hợp lệ| AD[Admin dashboard]
  AD --> R[Radar SEO /admin-radar]
  R -->|POST| API[/api/radar]
  API -->|Phân tích đối thủ + tạo nội dung| R
  R -->|Lưu nháp / xuất bản| POSTS[(Supabase: posts)]
  POSTS -->|Chỉ bài published| BLOG[/tin-tuc]
  BLOG --> ARTICLE[/tin-tuc/[slug]]
  POSTS --> XML[/sitemap.xml]
```

### Luồng xử lý lead

1. Khách chọn dịch vụ/ưu đãi và gửi form trên `/dich-vu`.
2. Form ghi thông tin vào `public.leads` bằng Supabase. Khi thành công, khách được
   chuyển tới trang cảm ơn.
3. Dashboard và trang `/admin/leads` đọc cùng bảng `leads`; dashboard tổng hợp KPI,
   trạng thái lead, doanh thu và lịch sự kiện.
4. Nhân viên cập nhật trạng thái, lịch tổ chức, ngân sách và thông tin phụ trách
   trong trang khách hàng. Các thay đổi là nguồn dữ liệu cho dashboard.

### Luồng nội dung SEO

1. Quản trị viên đăng nhập và mở `/admin-radar`.
2. Radar gửi URL đối thủ, từ khóa và yêu cầu phân tích tới `/api/radar`.
3. Quản trị viên xem phân tích, chỉnh sửa nội dung rồi lưu nháp hoặc xuất bản vào
   `public.posts`.
4. Trang `/tin-tuc` chỉ hiển thị bài đã xuất bản; route chi tiết dùng slug bài viết.
5. `/sitemap.xml` lấy các slug đã xuất bản để crawler tìm thấy nội dung mới.

### Quyền truy cập

- `src/proxy.ts` yêu cầu phiên Supabase Auth cho `/admin/*` và `/admin-radar/*`.
- Dashboard và phân hệ quản trị đọc/ghi dữ liệu qua Supabase, chịu sự kiểm soát của
  Row Level Security (RLS).
- Khách công khai chỉ gửi lead từ form; không được cấp quyền đọc danh sách khách hàng.
