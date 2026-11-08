-- =============================================================================
-- CRM GIAI ĐOẠN A
--  1. Mốc thời gian từng giai đoạn + lý do / bước rơi khi "Không thành"
--  2. Lịch sử hoạt động của lead (tự ghi khi đổi trạng thái, gửi báo giá, khách điền form)
--  3. Lưu báo giá theo phiên bản
--  4. Token form: khách điền form (popup / link sale gửi) sẽ cập nhật đúng lead cũ
--  5. Gộp 2 lead trùng
-- Chạy SAU các migration 20261021* và 20261107000000_lead_source_facebook.sql
-- =============================================================================

-- 1. CỘT MỚI TRÊN LEADS --------------------------------------------------------
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS quoted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS negotiating_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS won_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lost_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lost_stage TEXT,
  ADD COLUMN IF NOT EXISTS lost_reason TEXT,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS form_token UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS form_submitted_at TIMESTAMPTZ;

UPDATE public.leads SET form_token = gen_random_uuid() WHERE form_token IS NULL;

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_lost_stage_check,
  ADD CONSTRAINT leads_lost_stage_check
    CHECK (lost_stage IS NULL OR lost_stage IN ('NEW', 'QUOTED', 'NEGOTIATING', 'WON'));

CREATE UNIQUE INDEX IF NOT EXISTS leads_form_token_idx ON public.leads (form_token);

-- 2. LỊCH SỬ HOẠT ĐỘNG ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'created', 'status_change', 'call', 'message', 'meeting', 'note',
    'quote_sent', 'form_submitted', 'merged'
  )),
  actor TEXT,
  from_status TEXT,
  to_status TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS lead_activities_lead_idx
  ON public.lead_activities (lead_id, created_at DESC);

ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can manage lead activities" ON public.lead_activities;
CREATE POLICY "Admin can manage lead activities"
  ON public.lead_activities FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- 3. BÁO GIÁ THEO PHIÊN BẢN -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  vat_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  total NUMERIC(14, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  sent_via TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS lead_quotes_lead_idx ON public.lead_quotes (lead_id, version DESC);

ALTER TABLE public.lead_quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin can manage lead quotes" ON public.lead_quotes;
CREATE POLICY "Admin can manage lead quotes"
  ON public.lead_quotes FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- Người đang thao tác (email admin) hoặc "Website" khi là khách vãng lai
CREATE OR REPLACE FUNCTION public.current_actor()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email',
    'Website'
  );
$$;

-- 4. TRIGGER: MỐC THỜI GIAN GIAI ĐOẠN --------------------------------------------
CREATE OR REPLACE FUNCTION public.lead_stage_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    -- Nhảy cóc bước nào thì các bước trước được đánh dấu cùng thời điểm
    IF NEW.status IN ('QUOTED', 'NEGOTIATING', 'WON') AND NEW.quoted_at IS NULL THEN
      NEW.quoted_at := NOW();
    END IF;
    IF NEW.status IN ('NEGOTIATING', 'WON') AND NEW.negotiating_at IS NULL THEN
      NEW.negotiating_at := NOW();
    END IF;
    IF NEW.status = 'WON' AND NEW.won_at IS NULL THEN
      NEW.won_at := NOW();
    END IF;

    IF NEW.status = 'LOST' THEN
      NEW.lost_at := NOW();
      IF TG_OP = 'UPDATE' AND OLD.status <> 'LOST' THEN
        NEW.lost_stage := OLD.status;
      END IF;
      NEW.lost_stage := COALESCE(NEW.lost_stage, 'NEW');
    ELSE
      NEW.lost_at := NULL;
      NEW.lost_stage := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_stage_timestamps ON public.leads;
CREATE TRIGGER leads_stage_timestamps
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.lead_stage_timestamps();

-- 5. TRIGGER: GHI LỊCH SỬ KHI TẠO LEAD / ĐỔI TRẠNG THÁI --------------------------
CREATE OR REPLACE FUNCTION public.lead_log_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.lead_activities (lead_id, type, actor, to_status, note)
    VALUES (NEW.id, 'created', public.current_actor(), NEW.status, 'Tiếp nhận từ nguồn ' || NEW.source);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.lead_activities (lead_id, type, actor, from_status, to_status, note)
    VALUES (
      NEW.id, 'status_change', public.current_actor(), OLD.status, NEW.status,
      CASE WHEN NEW.status = 'LOST' THEN NEW.lost_reason END
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_log_activity ON public.leads;
CREATE TRIGGER leads_log_activity
  AFTER INSERT OR UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.lead_log_activity();

-- 6. TRIGGER: LIÊN HỆ KHÁCH -> CẬP NHẬT last_contacted_at ------------------------
CREATE OR REPLACE FUNCTION public.lead_activity_touch()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.type IN ('call', 'message', 'meeting', 'quote_sent') THEN
    UPDATE public.leads SET last_contacted_at = NEW.created_at WHERE id = NEW.lead_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lead_activities_touch ON public.lead_activities;
CREATE TRIGGER lead_activities_touch
  AFTER INSERT ON public.lead_activities
  FOR EACH ROW EXECUTE FUNCTION public.lead_activity_touch();

-- 7. TRIGGER: LƯU BÁO GIÁ -> đánh số phiên bản, ghi lịch sử, chuyển "Đã báo giá" ---
CREATE OR REPLACE FUNCTION public.lead_quote_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  SELECT COALESCE(MAX(version), 0) + 1 INTO NEW.version
  FROM public.lead_quotes WHERE lead_id = NEW.lead_id;
  NEW.created_by := COALESCE(NEW.created_by, public.current_actor());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lead_quotes_before_insert ON public.lead_quotes;
CREATE TRIGGER lead_quotes_before_insert
  BEFORE INSERT ON public.lead_quotes
  FOR EACH ROW EXECUTE FUNCTION public.lead_quote_before_insert();

CREATE OR REPLACE FUNCTION public.lead_quote_after_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.lead_activities (lead_id, type, actor, note)
  VALUES (
    NEW.lead_id, 'quote_sent', NEW.created_by,
    'Báo giá v' || NEW.version || ': ' || to_char(NEW.total, 'FM999G999G999G999') || ' đ'
      || COALESCE(' (gửi qua ' || NEW.sent_via || ')', '')
  );
  UPDATE public.leads SET status = 'QUOTED' WHERE id = NEW.lead_id AND status = 'NEW';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS lead_quotes_after_insert ON public.lead_quotes;
CREATE TRIGGER lead_quotes_after_insert
  AFTER INSERT ON public.lead_quotes
  FOR EACH ROW EXECUTE FUNCTION public.lead_quote_after_insert();

-- 8. RPC: KHÁCH GỬI FORM ---------------------------------------------------------
-- Có token khớp -> cập nhật đúng lead đó (lead tạo khi khách bấm nút / sale gửi link).
-- Không có token -> tạo lead mới.
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
    event_date, location, notes, source, status, form_submitted_at
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
    NOW()
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_lead_form(UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_lead_form(UUID, JSONB) TO anon, authenticated;

-- 9. RPC: GỘP 2 LEAD TRÙNG (chỉ admin) --------------------------------------------
CREATE OR REPLACE FUNCTION public.merge_leads(p_keep UUID, p_remove UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF p_keep = p_remove THEN
    RAISE EXCEPTION 'Không thể gộp một lead với chính nó';
  END IF;

  UPDATE public.leads k SET
    full_name = CASE WHEN k.full_name LIKE 'Khách bấm nút%' THEN r.full_name ELSE k.full_name END,
    phone = CASE WHEN k.phone ~ '[0-9]' THEN k.phone ELSE r.phone END,
    email = COALESCE(k.email, r.email),
    company_name = COALESCE(k.company_name, r.company_name),
    guest_count = COALESCE(k.guest_count, r.guest_count),
    budget = COALESCE(k.budget, r.budget),
    event_date = COALESCE(k.event_date, r.event_date),
    location = COALESCE(k.location, r.location),
    assigned_to = COALESCE(k.assigned_to, r.assigned_to),
    notes = CONCAT_WS(E'\n---\n', k.notes, r.notes),
    created_at = LEAST(k.created_at, r.created_at)
  FROM public.leads r
  WHERE k.id = p_keep AND r.id = p_remove;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Không tìm thấy lead cần gộp';
  END IF;

  UPDATE public.lead_activities SET lead_id = p_keep WHERE lead_id = p_remove;
  UPDATE public.lead_quotes SET lead_id = p_keep WHERE lead_id = p_remove;
  INSERT INTO public.lead_activities (lead_id, type, actor, note)
  VALUES (p_keep, 'merged', public.current_actor(), 'Gộp lead trùng số điện thoại');
  DELETE FROM public.leads WHERE id = p_remove;
END;
$$;

REVOKE ALL ON FUNCTION public.merge_leads(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_leads(UUID, UUID) TO authenticated;

-- 10. DỮ LIỆU CŨ: suy ra mốc thời gian cho lead đã ở giai đoạn sau ----------------
UPDATE public.leads SET quoted_at = COALESCE(quoted_at, updated_at)
  WHERE status IN ('QUOTED', 'NEGOTIATING', 'WON') AND quoted_at IS NULL;
UPDATE public.leads SET negotiating_at = COALESCE(negotiating_at, updated_at)
  WHERE status IN ('NEGOTIATING', 'WON') AND negotiating_at IS NULL;
UPDATE public.leads SET won_at = COALESCE(won_at, updated_at)
  WHERE status = 'WON' AND won_at IS NULL;
