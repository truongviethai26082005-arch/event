ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS company_name TEXT,
  ADD COLUMN IF NOT EXISTS guest_count INTEGER,
  ADD COLUMN IF NOT EXISTS budget NUMERIC(14, 2),
  ADD COLUMN IF NOT EXISTS event_date DATE,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'NEW',
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'WEBSITE_FORM',
  ADD COLUMN IF NOT EXISTS assigned_to TEXT,
  ADD COLUMN IF NOT EXISTS equipment_status TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_status_check,
  ADD CONSTRAINT leads_status_check
    CHECK (status IN ('NEW', 'QUOTED', 'NEGOTIATING', 'WON', 'LOST')),
  DROP CONSTRAINT IF EXISTS leads_source_check,
  ADD CONSTRAINT leads_source_check
    CHECK (source IN ('WEBSITE_FORM', 'HOTLINE', 'ZALO_OA', 'REFERRAL', 'OTHER'));

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS price_range TEXT,
  ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS client_logo TEXT,
  ADD COLUMN IF NOT EXISTS event_date DATE,
  ADD COLUMN IF NOT EXISTS guest_count INTEGER,
  ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS testimonial TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_event_date_idx
  ON public.leads (status, event_date);
CREATE INDEX IF NOT EXISTS services_active_idx ON public.services (is_active);
CREATE INDEX IF NOT EXISTS projects_published_idx ON public.projects (is_published);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select leads" ON public.leads;
DROP POLICY IF EXISTS "Admin can manage leads" ON public.leads;
CREATE POLICY "Admin can manage leads"
  ON public.leads FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
CREATE POLICY "Admin can manage services"
  ON public.services FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
CREATE POLICY "Admin can manage projects"
  ON public.projects FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read active services"
  ON public.services FOR SELECT TO anon, authenticated
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read published projects"
  ON public.projects FOR SELECT TO anon, authenticated
  USING (is_published = TRUE);

CREATE OR REPLACE FUNCTION public.set_admin_content_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_set_updated_at ON public.leads;
CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_content_updated_at();

DROP TRIGGER IF EXISTS services_set_updated_at ON public.services;
CREATE TRIGGER services_set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_content_updated_at();

DROP TRIGGER IF EXISTS projects_set_updated_at ON public.projects;
CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_content_updated_at();
