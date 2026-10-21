# Cấu hình đăng nhập Admin

Phân hệ Radar SEO dùng Supabase Auth. Không có chức năng đăng ký công khai; tài khoản Supabase Auth được tạo/cấp cho nhân sự quản trị có thể đăng nhập vào Admin.

## 1. Cấu hình biến môi trường

Trong `.env.local` ở thư mục gốc, giữ hoặc thêm các biến sau bằng thông tin của dự án Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
```

Có thể dùng `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` thay cho `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Không đặt `service_role` key trong biến `NEXT_PUBLIC_*` hoặc trong mã nguồn. Khởi động lại máy chủ Next.js sau khi cập nhật biến môi trường.

## 2. Cập nhật schema CRM và Dashboard

Trước khi sử dụng CRM/Dashboard, áp dụng các migration chưa chạy trong `supabase/migrations` theo thứ tự tên tệp. Dùng Supabase CLI hoặc mở SQL Editor của đúng dự án Supabase và thực thi nội dung migration chưa chạy. Dashboard cần migration `20261021010000_admin_dashboard_features.sql` để lưu doanh thu thực tế, giờ tổ chức và trạng thái sự kiện.

## 3. Tạo tài khoản Admin

1. Mở **Supabase Dashboard → Authentication → Users**.
2. Tạo tài khoản cho từng quản trị viên trong **Authentication → Users** và đặt mật khẩu mạnh.
3. Tắt cho phép đăng ký công khai tại **Authentication → Providers → Email**. Không tạo luồng sign-up trên website.
4. Khởi động lại máy chủ Next.js sau khi sửa `.env.local`.
5. Mở `/login` hoặc nhấn **Đăng nhập** trên trang chủ để đăng nhập bằng email và mật khẩu của tài khoản đã tạo.

## 4. Bảo vệ dữ liệu bằng RLS

Kiểm tra các policy hiện có trên `public.posts` và `public.competitor_logs` tại **Database → Tables → Policies**. Supabase kết hợp các policy cùng loại theo phép OR, vì vậy cần xóa hoặc thu hẹp policy cũ cho phép `anon`/mọi người ghi dữ liệu.

Bật RLS trên các bảng. Tài khoản đã đăng nhập được phép quản lý dữ liệu; người chưa đăng nhập chỉ được đọc bài viết đã xuất bản. Không bật đăng ký tự do, vì mọi tài khoản authenticated đều có quyền quản trị theo cấu hình này. Kiểm tra và gỡ policy cũ cho phép `anon` ghi dữ liệu:

```sql
alter table public.posts enable row level security;
alter table public.competitor_logs enable row level security;

create policy "Public can read published posts"
on public.posts for select
using (status = 'published');

create policy "Admin can manage posts"
on public.posts for all to authenticated
using (true)
with check (true);

create policy "Admin can manage competitor logs"
on public.competitor_logs for all to authenticated
using (true)
with check (true);
```

Nếu tên bảng hoặc policy hiện tại khác, điều chỉnh câu lệnh cho khớp schema của dự án; không xóa policy đọc bài đã xuất bản nếu trang tin tức công khai đang sử dụng policy đó.
