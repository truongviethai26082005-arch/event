-- Supabase mặc định cấp quyền EXECUTE hàm trong schema public cho anon.
-- merge_leads chỉ dành cho admin đăng nhập -> thu hồi quyền của anon.
REVOKE EXECUTE ON FUNCTION public.merge_leads(UUID, UUID) FROM anon;
