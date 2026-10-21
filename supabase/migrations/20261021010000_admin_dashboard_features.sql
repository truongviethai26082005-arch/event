ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS actual_revenue NUMERIC(14, 2),
  ADD COLUMN IF NOT EXISTS event_time TIME,
  ADD COLUMN IF NOT EXISTS event_status TEXT NOT NULL DEFAULT 'PENDING';

ALTER TABLE public.leads
  DROP CONSTRAINT IF EXISTS leads_event_status_check,
  ADD CONSTRAINT leads_event_status_check
    CHECK (event_status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  DROP CONSTRAINT IF EXISTS leads_actual_revenue_nonnegative_check,
  ADD CONSTRAINT leads_actual_revenue_nonnegative_check
    CHECK (actual_revenue IS NULL OR actual_revenue >= 0);
