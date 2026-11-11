-- Thêm nguồn FACEBOOK riêng cho lead (trước đây Facebook bị lưu chung vào REFERRAL)
ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_source_check,
  ADD CONSTRAINT leads_source_check
    CHECK (source IN ('WEBSITE_FORM', 'HOTLINE', 'ZALO_OA', 'FACEBOOK', 'REFERRAL', 'OTHER'));

-- Chuyển dữ liệu cũ: lead REFERRAL do nút Facebook tạo ra -> FACEBOOK
UPDATE public.leads
SET source = 'FACEBOOK'
WHERE source = 'REFERRAL'
  AND (notes ILIKE '%facebook%' OR full_name ILIKE '%facebook%');
