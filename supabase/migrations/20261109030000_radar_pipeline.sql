-- =============================================================================
-- RADAR SEO ĐỢT 2–5: SO SÁNH → ĐỀ XUẤT → VIẾT → THEO DÕI
-- Chạy SAU 20261109020000_radar_serp.sql
-- =============================================================================

-- BƯỚC 4: PHIẾU SO SÁNH (họ có gì mình chưa có) ---------------------------------
CREATE TABLE IF NOT EXISTS public.serp_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES public.seo_keywords(id) ON DELETE CASCADE,
  snapshot_id UUID REFERENCES public.serp_snapshots(id) ON DELETE SET NULL,
  our_post_id UUID,                         -- bài của mình đang nhắm từ khóa này (nếu có)
  pages_used INTEGER NOT NULL DEFAULT 0,    -- số bài đối thủ đã đọc được dùng để so sánh
  must_have JSONB NOT NULL DEFAULT '[]',    -- A: [{item, count, sources[], we_have}]
  top_keywords JSONB NOT NULL DEFAULT '[]', -- B: [{keyword, count, we_use}]
  gaps JSONB NOT NULL DEFAULT '[]',         -- C: [{gap, evidence, how_we_fill, has_material}]
  signals JSONB NOT NULL DEFAULT '{}',      -- số liệu code đo được: số chữ trung bình, bao nhiêu bài có giá / FAQ...
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS serp_comparisons_keyword_idx ON public.serp_comparisons (keyword_id, created_at DESC);

-- BƯỚC 5–6: ĐỀ XUẤT VIẾT MỚI / VIẾT LẠI ----------------------------------------
CREATE TABLE IF NOT EXISTS public.content_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES public.seo_keywords(id) ON DELETE CASCADE,
  comparison_id UUID REFERENCES public.serp_comparisons(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('new', 'rewrite')),
  reason TEXT,                              -- vì sao đề xuất (chưa có bài / thua top / tụt hạng)
  target_post_id UUID,                      -- bài cũ cần viết lại
  title TEXT NOT NULL,
  brief JSONB NOT NULL DEFAULT '{}',        -- {focus_keyword, secondary_keywords[], outline[], materials[], notes}
  score INTEGER NOT NULL DEFAULT 0,
  score_reasons JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'proposed'
    CHECK (status IN ('proposed', 'writing', 'drafted', 'published', 'dismissed')),
  post_id UUID,                             -- bài nháp tạo ra (viết mới)
  draft JSONB,                              -- bản viết lại chờ áp dụng: {title, meta_description, content}
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS content_proposals_status_idx ON public.content_proposals (status, score DESC);

DROP TRIGGER IF EXISTS content_proposals_set_updated_at ON public.content_proposals;
CREATE TRIGGER content_proposals_set_updated_at
  BEFORE UPDATE ON public.content_proposals
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_content_updated_at();

ALTER TABLE public.serp_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_proposals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can manage serp comparisons" ON public.serp_comparisons;
CREATE POLICY "Admin can manage serp comparisons"
  ON public.serp_comparisons FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
DROP POLICY IF EXISTS "Admin can manage content proposals" ON public.content_proposals;
CREATE POLICY "Admin can manage content proposals"
  ON public.content_proposals FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- radar_runs: thêm loại ca chạy so sánh / viết / lịch tự chạy
ALTER TABLE public.radar_runs DROP CONSTRAINT IF EXISTS radar_runs_kind_check;
ALTER TABLE public.radar_runs ADD CONSTRAINT radar_runs_kind_check
  CHECK (kind IN ('serp-dry', 'serp-live', 'scrape', 'compare', 'write', 'cron'));

-- BƯỚC 7: TRANG KHÁCH ĐẾN (biết bài nào mang về khách) ---------------------------
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS landing_path TEXT,   -- trang đầu tiên khách vào website
  ADD COLUMN IF NOT EXISTS referrer TEXT;       -- nguồn khách đến (google.com, facebook.com...)

-- Form khách gửi: lưu thêm landing_path / referrer (ghi đè hàm của migration 20261108000000)
CREATE OR REPLACE FUNCTION public.submit_lead_form(p_token UUID, p_lead JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_name TEXT := LEFT(TRIM(COALESCE(p_lead ->> 'full_name', '')), 200);
  v_phone TEXT := LEFT(TRIM(COALESCE(p_lead ->> 'phone', '')), 30);
  v_notes TEXT := NULLIF(LEFT(TRIM(COALESCE(p_lead ->> 'notes', '')), 4000), '');
  v_landing TEXT := NULLIF(LEFT(TRIM(COALESCE(p_lead ->> 'landing_path', '')), 500), '');
  v_referrer TEXT := NULLIF(LEFT(TRIM(COALESCE(p_lead ->> 'referrer', '')), 200), '');
BEGIN
  IF v_name = '' OR v_phone = '' THEN
    RAISE EXCEPTION 'Thiếu họ tên hoặc số điện thoại';
  END IF;

  IF p_token IS NOT NULL THEN
    UPDATE public.leads SET
      full_name = v_name,
      phone = v_phone,
      email = COALESCE(NULLIF(TRIM(p_lead ->> 'email'), ''), email),
      company_name = COALESCE(NULLIF(TRIM(p_lead ->> 'company_name'), ''), company_name),
      event_type = COALESCE(NULLIF(TRIM(p_lead ->> 'event_type'), ''), event_type),
      guest_count = COALESCE((p_lead ->> 'guest_count')::INTEGER, guest_count),
      budget = COALESCE((p_lead ->> 'budget')::NUMERIC, budget),
      event_date = COALESCE(NULLIF(p_lead ->> 'event_date', '')::DATE, event_date),
      location = COALESCE(NULLIF(TRIM(p_lead ->> 'location'), ''), location),
      notes = CONCAT_WS(E'\n', notes, v_notes),
      landing_path = COALESCE(landing_path, v_landing),
      referrer = COALESCE(referrer, v_referrer),
      form_submitted_at = NOW()
    WHERE form_token = p_token
    RETURNING id INTO v_id;

    IF v_id IS NOT NULL THEN
      INSERT INTO public.lead_activities (lead_id, type, actor, note)
      VALUES (v_id, 'form_submitted', 'Khách hàng', 'Khách điền form nhận kịch bản & báo giá');
      RETURN v_id;
    END IF;
  END IF;

  INSERT INTO public.leads (
    full_name, phone, email, company_name, event_type, guest_count, budget,
    event_date, location, notes, source, status, form_submitted_at, landing_path, referrer
  ) VALUES (
    v_name, v_phone,
    NULLIF(TRIM(p_lead ->> 'email'), ''),
    NULLIF(TRIM(p_lead ->> 'company_name'), ''),
    COALESCE(NULLIF(TRIM(p_lead ->> 'event_type'), ''), 'Tư vấn sự kiện & báo giá'),
    (p_lead ->> 'guest_count')::INTEGER,
    (p_lead ->> 'budget')::NUMERIC,
    NULLIF(p_lead ->> 'event_date', '')::DATE,
    NULLIF(TRIM(p_lead ->> 'location'), ''),
    v_notes,
    COALESCE(NULLIF(p_lead ->> 'source', ''), 'WEBSITE_FORM'),
    'NEW',
    NOW(),
    v_landing,
    v_referrer
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_lead_form(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_lead_form(UUID, JSONB) TO anon, authenticated;
