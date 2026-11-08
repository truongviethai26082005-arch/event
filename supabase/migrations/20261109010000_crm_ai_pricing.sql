-- =============================================================================
-- SỐ HÓA QUY TRÌNH SALE
--  1. Kết quả AI phân tích lead (chấm điểm, tóm tắt nhu cầu, gợi ý gói, tin nhắn soạn sẵn)
--  2. Bảng đơn giá: nguồn giá DUY NHẤT để AI lập báo giá nháp
-- Chạy SAU 20261108000000_lead_crm_phase_a.sql
-- =============================================================================

-- 1. KẾT QUẢ AI TRÊN LEADS ------------------------------------------------------
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS ai_score TEXT,
  ADD COLUMN IF NOT EXISTS ai_score_reason TEXT,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_needs JSONB,
  ADD COLUMN IF NOT EXISTS ai_suggested_package TEXT,
  ADD COLUMN IF NOT EXISTS ai_next_action TEXT,
  ADD COLUMN IF NOT EXISTS ai_message TEXT,
  ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMPTZ;

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_ai_score_check,
  ADD CONSTRAINT leads_ai_score_check
    CHECK (ai_score IS NULL OR ai_score IN ('HOT', 'WARM', 'COLD'));

-- 2. BẢNG ĐƠN GIÁ ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.price_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL DEFAULT 'Khác',
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'Gói',
  unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS price_items_active_idx ON public.price_items (is_active, category, sort_order);

ALTER TABLE public.price_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can manage price items" ON public.price_items;
CREATE POLICY "Admin can manage price items"
  ON public.price_items FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

DROP TRIGGER IF EXISTS price_items_set_updated_at ON public.price_items;
CREATE TRIGGER price_items_set_updated_at
  BEFORE UPDATE ON public.price_items
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_content_updated_at();

-- 3. LỊCH SỬ: thêm loại hoạt động "ai_analysis" -----------------------------------
ALTER TABLE public.lead_activities
  DROP CONSTRAINT IF EXISTS lead_activities_type_check,
  ADD CONSTRAINT lead_activities_type_check CHECK (type IN (
    'created', 'status_change', 'call', 'message', 'meeting', 'note',
    'quote_sent', 'form_submitted', 'merged', 'ai_analysis'
  ));
